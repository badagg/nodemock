import React from 'react';
import Header from './Header.jsx';
import ContentWrap from './ContentWrap.jsx';
import Footer from './Footer.jsx';
import Alert from './Alert.jsx';
import Login from './Login.jsx';
import OS from '../managerEvent'
import ACT from '../action'

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uid:null,
      isLogin:false
    }

    this.init();
  }

  init(){
    let the = this;
    OS.addEvent(function(e){
      if(e.action === ACT.LOGIN_SUCCESS){
        the.setState({
          uid:e.data,
          isLogin:true
        })
      }
    })
  }

  render() {
    var mods = [];
    if(this.state.isLogin){
      mods.push(<Header key={1} />);
      mods.push(<ContentWrap key={2} uid={this.state.uid}/>);
      mods.push(<Footer key={3} />);
      mods.push(<Alert key={4} />);
    }else{
      mods.push(<Login key={0} />);
    }

    return (
      <div className='root-wrap code'>
      	{mods}
      </div>
    );
  }
}
