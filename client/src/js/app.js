/**
 * @introduction  Entry
 * @authors       Null (email:Null@yhd.cn)
 * @date          Null
 * @update        Null
 */
import '../css/base.scss';
import '../css/app.scss';

// import react
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory,useRouterHistory,browserHistory} from 'react-router';
import { createHashHistory } from 'history'

// import Hello
import Main from './Component/Main.jsx';
import Login from './Component/Login.jsx';

// queryKey 去掉路由后随机 _k 参数
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

// router
var MyRouter = (
	<Router history={appHistory}>
		<Route path="/" component={Main}>
			<Route path="/login" component={Login} />
		</Route>
	</Router>
)

// Render
render( MyRouter, document.getElementById('app'));