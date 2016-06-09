import React from 'react';
import ApiList from './ApiList.jsx';
import Editor from './Editor.jsx';
import Preview from './Preview.jsx';

export default class ContentWrap extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
		<div className='wrap'>
			<div className="item cate">
				<ApiList uid={this.props.uid} />
			</div>
			<div className="item edit">
				<Editor />
			</div>
			<div className="item json">
				<Preview />
			</div>
		</div>
    );
  }
}
