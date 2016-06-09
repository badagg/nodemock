import React from 'react';
import OS from '../managerEvent'
import ACT from '../action'

export default class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name:'',
      view:false
    }

    this.format = 'jsop';
    this.id = null;
    this.code = null;

    this.init();
  }

  init(){
    var the = this;
    OS.addEvent(function(e){
      if(e.action === ACT.CUT_API){
        the.setState({
          name:e.data.name,
          view:true
        })
        the.refs.mySelect.value = e.data.type;
        the.format = e.data.type;
        the.id = e.data.id;
      }
      if(e.action === ACT.EDITOR_CODE){
        the.code = e.data;
      }
      if(e.action === ACT.DEL_API_SUCCESS){
        the.setState({
          view:false
        })
      }
    })
  }

  getSelect(e){
    this.format = e.target.value;
  }

  save(){
    //console.log(this.id,this.format,this.code)
    var the = this;
    OS.dispatchEvent({
      action:ACT.SAVE_API,
      data:{
        id:the.id,
        format:the.format,
        code:the.code
      }
    })
  }

  render() {
    var cla = this.state.view ? 'create view' : 'create';
    return (
  		<div className="footer">
  			<div className={cla}>
          <span>Selected-api: <em>{this.state.name}</em></span>
          <select ref='mySelect' onChange={this.getSelect.bind(this)}>
            <option value='jsonp'>JSONP</option>
            <option value='json'>JSON</option>
          </select>
  				<button onClick={this.save.bind(this)}> Save </button>
  			</div>
  		</div>
    );
  }
}
