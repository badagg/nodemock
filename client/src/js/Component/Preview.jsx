import React from 'react';
import OS from '../managerEvent'
import ACT from '../action'
import Mock from 'mockjs';
import Highlight from 'react-highlight';

export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.talk = {
      'Hello':'欢迎使用Mock Api...'
    }
    this.state = {
    	code:this.talk
    }

    this.init();
  }

  init(){
  	var the = this;
  	OS.addEvent(function(e){
  		if(e.action === ACT.CUT_API){
  			the.rendMock(e.data.mockcode);
  		}
  		if(e.action === ACT.EDITOR_CODE){
  			the.rendMock(e.data);
  		}
      if(e.action === ACT.DEL_API_SUCCESS){
        the.setState({
          code:the.talk
        })
      }
  	})
  }

  rendMock(data){
  	var code = eval("("+data+")");
  	var json = Mock.mock(code)
  	this.setState({
  		code:json
  	})
  }

  render() {
  	var str = JSON.stringify(this.state.code, null, 4);
    return (
      <div className='edit-box'>
      	<Highlight className='hljs'>
		  {str}
		</Highlight>
      </div>
    );
  }
}
