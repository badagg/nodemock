import React from 'react';
import $ from 'jquery';
import OS from '../managerEvent'
import ACT from '../action'

export default class ApiList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    	list:[],
    	cur:{a:-1,b:-1},
      tips:''
    }
    
    this.pid = null;
    this.isCreate = false;
    this.curData = null;
    this.init();
    this.ajax();
  }

  init(){
  	var the = this;
  	OS.addEvent(function(e){
  		if(e.action == ACT.UPDATA_PROJECT_LIST){
  			//创建项目 写入数据库
  			$.ajax({
				url:'http://localhost:3002/createproject',
				type:'POST',
				dataType:'json',
				data:{
					uid:the.props.uid,
					name:e.data
				}
			})
			.done(function(data){
				if(data.state === 'success'){
					the.ajax();
				}
			})
  		}
  		if(e.action === ACT.UPDATA_API_LIST){
  			//创建API 写入数据库
  			$.ajax({
  				url:'http://localhost:3002/createapi',
  				type:'POST',
  				dataType:'json',
  				data:{
  					pid:e.data.id,
  					name:e.data.name,
  					format:e.data.format
  				}
  			})
  			.done(function(data){
  				if(data.state === 'success'){
            the.isCreate = true;
  					the.ajax();
  				}
  			})
  		}
  		if(e.action === ACT.SAVE_API){
  			//保存修改后的API 写入数据库
  			$.ajax({
  				url:'http://localhost:3002/saveapi',
  				type:'POST',
  				dataType:'json',
  				data:{
  					id:e.data.id,
  					format:e.data.format,
  					code:e.data.code
  				}
  			})
  			.done(function(data){
  				if(data.state === 'success'){
  					alert('保存成功');
  					the.ajax();
  				}
  			})
  		}
  	})
  }

  ajax(){
  	let the = this;
    $.ajax({
  		url:'http://localhost:3002/apilist?uid='+the.props.uid,
  		type:'GET',
  		dataType:'json'
  	})
  	.done(function(data){
      if(data.state === 0){
        the.setState({
          tips:'点击右上角按钮来创建你的分类'
        })
        return;
      }
      
      if(the.isCreate){
        let apis = the.findNewID(the.pid,data);
        the.curData = apis;
        the.curData.fid = the.pid;
        the.setState({
          list:data,
          tips:'',
          cur:{a:the.pid,b:apis.id}
        })
      }else{
        the.setState({
          list:data,
          tips:''
        })
      }
      

      OS.dispatchEvent({
        action:ACT.LOAD_API_SUCCESS,
        data:data
      })

  	})
  }

  componentDidUpdate() {
    if(this.isCreate){
      this.isCreate = false;
      this.cut(this.curData);
    }
  }

  //判断当前分类里是否包含API
  isHasApi(id){
  	for(let k in this.state.list){
  		if(this.state.list[k].id === id && this.state.list[k].apis.length > 0){
  			return true;
  		}
  	}
  	return false;
  }

  //查找创建后的当前新ID
  findNewID(pid,data){
    for(let k in data){
      if(data[k].id === pid){
        return data[k].apis[0];
      }
    }
  }

  //创建API
  createApi(id){
    this.pid = id;
  	OS.dispatchEvent({
  		action:ACT.CREATE_API,
  		data:id
  	})
  }
  //删除分类
  delCate(id){
  	let the = this;
  	if(this.isHasApi(id)){
  		alert('该分类下存在API列表，无法删除');
  	}else{
  		let cf = window.confirm("确定删除分类？");
  		if(cf){
  			$.ajax({
				url:'http://localhost:3002/delcate',
				type:'POST',
				dataType:'json',
				data:{id:id}
			})
			.done(function(data){
				if(data.state === 'success'){
					the.ajax();

					the.setState({
						cur:{a:-1,b:-1}
					})

					OS.dispatchEvent({
						action:ACT.DEL_API_SUCCESS
					})
				}
			})
  		}
  	}
  }
  
  //删除API
  delApi(id,e){
  	let the = this;
  	let cf = window.confirm("确定删除？");
  	if(cf){
  		$.ajax({
			url:'http://localhost:3002/delapi',
			type:'POST',
			dataType:'json',
			data:{id:id}
		})
		.done(function(data){
			if(data.state === 'success'){
				the.ajax();

				the.setState({
					cur:{a:-1,b:-1}
				})

				OS.dispatchEvent({
					action:ACT.DEL_API_SUCCESS
				})
			}
		})
  	}

  	e.stopPropagation();
  }

  //预览API地址
  preview(id,e){
  	window.open("/api/"+id);
  	e.stopPropagation();
  }

  //切换当前选项卡
  cut(data){
  	OS.dispatchEvent({
  		action:ACT.CUT_API,
  		data:data
  	})
    
  	this.setState({
  		cur:{a:data.fid,b:data.id}
  	})

  }

  render() {
  	var the = this;
    return (
    	<div className="con">
        {this.state.tips}
    		{
    			this.state.list.map(function(felem, findex) {
    				return (
    					<ul key={findex}>
    						<h3 className='clear'>{felem.name}<button onClick={
    							the.delCate.bind(the,felem.id)
    						}>删除分类</button><button className='add' onClick={
    							the.createApi.bind(the,felem.id)
    						}>添加API</button></h3>

    						{
    							felem.apis.map(function(elem, index) {
    								let curCla = (felem.id===the.state.cur.a && elem.id==the.state.cur.b) ? 'cur':'';
    								return <li className={curCla} key={index} onClick={
    									the.cut.bind(the,{
    										id:elem.id,
	    									name:elem.name,
	    									type:elem.type,
	    									mockcode:elem.mockcode,
                        fid:felem.id
    									})
    								}>{elem.name}<button onClick={
    									the.delApi.bind(the,elem.id)
    								}>删除</button> <button onClick={the.preview.bind(the,elem.id)}>预览</button></li>;
    							})
    						}
    					</ul>
    				);
    			})
    		}
		</div>
    );
  }
}











