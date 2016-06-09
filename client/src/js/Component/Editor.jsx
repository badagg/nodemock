import React from 'react';
import OS from '../managerEvent'
import ACT from '../action'
import TabOverride from 'taboverride';

export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.talk = "{'Hello':'欢迎使用Mock Api...'}";
    this.state = {
    	code:this.talk,
      error:true
    }

    this.init();
  }

  init(){
  	var the = this;
  	OS.addEvent(function(e){
  		if(e.action === ACT.CUT_API){
  			the.setState({
  				code:e.data.mockcode || ''
  			})
  			
  			OS.dispatchEvent({
		  		action:ACT.EDITOR_CODE,
		  		data:e.data.mockcode
		  	})
  		}

      if(e.action === ACT.DEL_API_SUCCESS){
        the.setState({
          code:the.talk
        })
      }

  	})
  }

  changeText(e){
    let val = e.target.value;
  	this.setState({
  		code: val
  	});

    if(this.isObject(val)){
      this.setState({
        error:true
      })
      OS.dispatchEvent({
        action:ACT.EDITOR_CODE,
        data:val
      })
    }else{
      this.setState({
        error:false
      })
    }
  }

  //判断是否是对象格式
  isObject(val){
    var newVal = null;
    try{
      newVal = eval("("+val+")");
      if(typeof newVal === 'object'){
        return true;
      }else{
        return false;
      }
    }catch(e){
      return false;
    }
  }

  componentDidUpdate() {
    this.refs.myArea.focus();
  }

  componentDidMount() {
    //https://github.com/wjbryant/taboverride
    TabOverride.tabSize(4);
    TabOverride.set(this.refs.myArea);
  }

  render() {
    var cla = this.state.error ? 'edit-box code' : 'edit-box code error';
    return (
    	<textarea ref='myArea' className={cla} value={this.state.code} onChange={this.changeText.bind(this)}></textarea>
    );
  }
}
