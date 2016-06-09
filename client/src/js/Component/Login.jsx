import React from 'react';
import $ from 'jquery';
import _t from '../tools';
import OS from '../managerEvent'
import ACT from '../action'

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	tips:''
    }
  }

  //提交账号密码
  onSubmit(t){
  	let name = t.refs.myname.value;
  	let word = t.refs.myword.value;
  	let the = this;

  	if(!name && !word){
  		this.setState({
  			tips:'账号密码不能为空...'
  		})
  	}else if(_t.filterString(name) && _t.filterString(word)){
  		this.setState({tips:''})

	  	$.ajax({
			url:'http://localhost:3002/checkout?username='+name+'&password='+word,
			type:'GET',
			dataType:'json'
		})
		.done(function(data){
			t.refs.myname.value = '';
			t.refs.myword.value = '';
			if(data.state === 'success'){
				window.location.href = '#/';
				OS.dispatchEvent({
					action:ACT.LOGIN_SUCCESS,
					data:data.id
				})
			}
			if(data.state === 'fail'){
				the.setState({tips:'用户名或密码不正确...'})
			}
		})
  	}
  }

  render() {
    return (
		<div className='login'>
			<p><span>Username:</span><input ref='myname' type='text' /></p>
			<p><span>Password:</span><input ref='myword' type='password' /></p>
			<div className='btn'><button onClick={this.onSubmit.bind(this,this)}>Submit</button></div>
			<p className='tips'>{this.state.tips}</p>
		</div>
    );
  }
}
