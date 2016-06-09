import React from 'react';
import OS from '../managerEvent'
import ACT from '../action'

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  createProject(){
    OS.dispatchEvent({
      action:ACT.CREATE_PROJECT
    })
  }

  render() {
    return (
		<div className="header">
			<h1>MOCK <span>API</span></h1>
			<div className="create">
				<button onClick={this.createProject}>Create New Project</button>
			</div>
		</div>
    );
  }
}
