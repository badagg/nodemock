var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var Mock = require('mockjs');

//打开数据库
function openMysql(){
	connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'root',
		port     : '8889',
		database : 'mock'
	});
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//用户登录
router.get('/checkout',function(req, res) {
	var name = req.query.username;
	var word = req.query.password;
	//var callback = req.query.callback;
	var isLogin = false;
	var id = null;

	//用户匹配数据库
	openMysql();
	var $sql = 'select * from users';
	connection.query($sql,function(err, rows, fields) {
		if(err){
			res.send({"state":0});
			return;
		}
		for(var k in rows){
			if(rows[k].username == name && rows[k].password == word){
				isLogin = true;
				id = rows[k].id;
				break;
			}
		}
		var data = isLogin ? {'state':'success','id':id} : {'state':'fail'};
		//var newData = callback+"("+JSON.stringify(data, null, 4)+")";
		//res.send(newData);
		res.json(data);
	});
	connection.end();
});

//输出API list
router.get('/apilist', function(req, res, next) {
	var uid = req.query.uid;
	//var callback = req.query.callback;

	//查找对于UID的API
	openMysql();
	connection.query('select * from projects where uid='+uid+' order by id DESC',function(err, rows, fields) {
		var m = 0;
		var n = rows.length;
		if(n<1){
			res.json({'state':0})
			return;
		}
		selectApi();
		
		function selectApi(){
			openMysql();
			var pid = rows[m].id;
			connection.query('select * from apis where pid='+pid+' order by id DESC',function(err2, rows2, fields2) {
				rows[m].apis = rows2;
				if(m<n-1){
					m++;
					selectApi();
				}else{
					//res.send(callback+"("+JSON.stringify(rows, null, 4)+")");
					res.json(rows);
				}
			});
			connection.end();
		}
		
	});
	connection.end();
});

//创建项目
router.post('/createproject',function(req, res) {
	var data = {
		uid:req.body.uid,
		name:req.body.name
	}

	openMysql();
	var $sql = 'INSERT INTO projects SET ?';
	connection.query($sql,data,function(err, rows, fields) {
		if(err){
			res.json({'state':'fail'});
			return;
		}
		res.json({'state':'success'});
	});
	connection.end();
})

//创建API
router.post('/createapi',function(req, res) {
	var data = {
		pid:req.body.pid,
		name:req.body.name,
		type:req.body.format,
		mockcode:'{}'
	}
	
	openMysql();
	var $sql = 'INSERT INTO apis SET ?';
	connection.query($sql,data,function(err, rows, fields) {
		if(err){
			res.json({'state':'fail'});
			return;
		}
		res.json({'state':'success'});
	});
	connection.end();
})

//保存API
router.post('/saveapi',function(req, res) {
	var id = req.body.id;
	var format = req.body.format;
	var code = req.body.code;

	openMysql();
	var $sql = 'UPDATE apis SET type = ? , mockcode= ? WHERE id = ?';
	var data = [format,code,id];
	connection.query($sql,data,function(err, results) {
		if(err){
			res.json({'state':'fail'});
			return;
		}
		res.json({'state':'success'});
	});
	connection.end();
})

//删除API
router.post('/delapi',function(req, res) {
	var id = req.body.id;

	openMysql();
	var $sql = 'DELETE FROM apis WHERE id='+id;
	connection.query($sql,function(err, result) {
		if(err){
			res.json({'state':'fail'});
			return;
		}
		res.json({'state':'success'});
	});
	connection.end();
})

//删除API
router.post('/delcate',function(req, res) {
	var id = req.body.id;

	openMysql();
	var $sql = 'DELETE FROM projects WHERE id='+id;
	connection.query($sql,function(err, result) {
		if(err){
			res.json({'state':'fail'});
			return;
		}
		res.json({'state':'success'});
	});
	connection.end();
})

//API路由
router.get('/api/*', function(req, res, next) {
	var id = req.params[0];
	var callback = req.query.callback;

	openMysql();
	var $sql = 'select * from apis where id='+id;
	connection.query($sql,function(err, rows, fields) {
		if(rows.length != 1){
			res.send({"state":0,"message":"没有找到对于api"});
		}else{
			var type = rows[0].type;
			var code = eval("("+rows[0].mockcode+")");
			var data = Mock.mock(code);
			var newData = (type === 'jsonp') ? callback+"("+JSON.stringify(data, null, 4)+")" : JSON.stringify(data, null, 4)
			res.send(newData);
		}
	});
	connection.end();
});


module.exports = router;
