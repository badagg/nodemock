import React from 'react';
import OS from '../managerEvent'
import ACT from '../action'
import _t from '../tools';

export default class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	pv:false,
    	av:false,
    	x:-300,
    	tipsp:'',
    	tipsa:''
    }

    this.apiData = null;
    this.pid = null;
    this.format = 'json';

    this.pboo = false;
    this.aboo = false;

    this.init();
  }

  init(){
  	var the = this;
  	OS.addEvent(function(e){
  		if(e.action == ACT.CREATE_PROJECT){
  			the.setState({
  				pv:true,
  				av:false,
  				x:0
  			})
  		}
  		if(e.action == ACT.CREATE_API){
  			the.setState({
  				pv:false,
  				av:true,
  				x:0
  			})
  			the.pid = e.data;
        the.refs.mySelect.value = the.format;
  		}
  		if(e.action == ACT.LOAD_API_SUCCESS){
  			the.apiData = e.data;
  		}
  	})
  }

  componentDidUpdate() {
      // if(this.state.pv){
      //   this.refs.pInput.focus();
      // }
      // if(this.state.av){
      //   this.refs.aInput.focus();
      // }
  }
 
  pFocus(){
  	this.pboo = true;
  }
  pBlur(){
  	this.pboo = false;
  	this.setState({
		x:-300,
		tipsp:''
	})
	this.refs.pInput.value = '';
  }

  aFocus(){
  	this.aboo = true;
  }
  aBlur(){
  	this.aboo = false;
  	this.setState({
		x:-300,
		tipsa:''
	})
	this.refs.aInput.value = '';
  }

  getSelect(e){
  	this.format = e.target.value;
  }

  createProject(e){
  	if(e.keyCode === 13 && this.pboo && this.state.x === 0){
  		let pval = this.refs.pInput.value
  		if(pval && _t.filterString(pval)){
  			if(this.isRepeatPorjectName(pval)){
  				this.setState({tipsp:''});
  				//让ApiList模块更新列表
  				OS.dispatchEvent({
					action:ACT.UPDATA_PROJECT_LIST,
					data:pval
				})
				//重置
				this.pBlur();
  			}else{
  				this.setState({
  					tipsp:'该项目名已经存在'
  				})
  			}
  		}else{
  			this.setState({
				tipsp:'项目名不能为空或有特殊字符'
			})
			this.refs.pInput.value = '';
  		}
  	}
  }

  createApi(e){
  	var the = this;
  	if(e.keyCode === 13 && this.aboo && this.state.x === 0){
  		let aval = this.refs.aInput.value
  		if(aval && _t.filterString(aval)){
  			if(this.isRepeatApiName(aval)){
  				this.setState({tipsa:''})
  				//让ApiList模块更新列表
  				OS.dispatchEvent({
					action:ACT.UPDATA_API_LIST,
					data:{
						name:aval,
						id:the.pid,
						format:the.format
					}
				})
				//重置
				this.aBlur();
  			}else{
  				this.setState({
  					tipsa:'该API名已经存在'
  				})
  			}
  		}else{
  			this.setState({
				tipsa:'API名不能为空或有特殊字符'
			})
			this.refs.aInput.value = '';
  		}
  	}
  }

  //判断是否有重复项目名称
  isRepeatPorjectName(name){
  	for(let k in this.apiData){
  		if(this.apiData[k].name === name){
  			return false;
  		}
  	}
  	return true;
  }

  //判断同一个项目里是否有重复API名称
  isRepeatApiName(name){
  	for(let k in this.apiData){
  		if(this.apiData[k].id === this.pid){
  			for(let j in this.apiData[k].apis){
  				if(this.apiData[k].apis[j].name === name){
  					return false;
  				}
  			}
  		}
  	}
  	return true;
  }


  render() {
    return (
      <div className='alert'style={{
      		transform:'translate3d('+(this.state.x)+'px,0,0)'
      	}}>
      	<div className='project' style={{
      		display:this.state.pv ? 'block' : 'none'
      	}}>
      		<input type='text' ref='pInput' onFocus={this.pFocus.bind(this)} onBlur={this.pBlur.bind(this)} onKeyDown={this.createProject.bind(this)} placeholder='输入新项目名称并按回车'/>
      	</div>
      	<div className='apilist' style={{
      		display:this.state.av ? 'block' : 'none'
      	}}>
      		<input type='text' ref='aInput' onFocus={this.aFocus.bind(this)} onBlur={this.aBlur.bind(this)} onKeyDown={this.createApi.bind(this)} placeholder='输入API名称并按回车'/>
      		<select ref='mySelect' onChange={this.getSelect.bind(this)}>
      			<option value='jsonp'>JSONP</option>
      			<option value='json'>JSON</option>
      		</select>
      	</div>
      	<div className='tips'>{this.state.tipsp}{this.state.tipsa}</div>
      </div>
    );
  }
}
