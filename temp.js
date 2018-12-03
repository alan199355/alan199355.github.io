// 正常启动 使用node server.js
let isAWUAT = 0;// 是否调用UAT的API 用于测试环境部署在外网的特殊情况

/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var url=require('url');
var path = require('path');
var fs = require('fs');
var app = express();
//var exphbs  = require('express-handlebars');
var logger = require('morgan');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
// 需要添加的莫捕快open todo


let MAPS =  {
  '192.168.33.30': {port: 9001, site: 'https://www.chenyi.com'},
  '192.168.33.38': {port: 9002, site: 'https://www.guochaowei.com'},
  '192.168.33.8': {port: 9003, site: 'https://www.guozhenshi.com'},
  '10.151.6.29': {port: 9004, site: 'https://www.yeqiang.com'},
}

if(isAWUAT){
  MAPS =  {
    '192.168.33.30': {port: 9001, site: 'https://awuatdev1.awfae.com'},
    '192.168.33.38': {port: 9002, site: 'https://awuatdev2.awfae.com'},
    '192.168.33.8': {port: 9003, site: 'https://awuatdev3.awfae.com'}
  }
}

// let fs = require('fs');
fs.exists('./app', function(){
  if(arguments[0]){// backoffice
    for(var i in MAPS){
      let map = MAPS[i];
      map.site += '/backoffice/login.html';
    }

    app.use('/backoffice',express.static(path.join(__dirname, 'app')));
  }else{
    app.use('/',express.static(path.join(__dirname, '')));
  }
})

let portAndSite = {};

findIPaddress();

function findIPaddress() {
  var os = require('os');
  var networkInterfaces = os.networkInterfaces();
  //   console.log(networkInterfaces)

  let ip;

  // for (var i in networkInterfaces) {
  // 	let networkInterface = networkInterfaces[i];
  // 	   console.log(networkInterface,'1111')
  // 	for (var j in networkInterface) {
  // 		let x = networkInterface[j]
  // 		if (x.family == 'IPv4') {
  //       ip = x.address;

  // 			// console.log(x.address)
  // 		}
  // 	}


  // 	if (ip) {
  // 		break;
  // 	}
  // }
  ip='10.151.6.29'

  portAndSite = MAPS[ip]
}

// process.argv.slice(2).forEach(function (val, index, array) {
//     if(val == 'x') {
app.all('/backoffice/*',function(request, respont) {
  proxy.web(request, respont, { target: 'http://127.0.0.1:9000'});
});
//     }
// });

// all environments
// app.set('port', port);

/**

 // 使用模板功能
 app.set('views', path.join(__dirname, 'deploy'));
 var Handlebars = exphbs.create({
  defaultLayout: 'index',
  layoutsDir: __dirname,
  extname: '.html'
});

 app.engine('html', Handlebars.engine);

 app.set('view engine', 'html');
 app.set('view options', {
  layout: false
});
 **/
//app.use(express.favicon());   // connect 内建的中间件，使用默认的 favicon 图标
//app.use(express.favicon(__dirname+"/deploy/favicon.ico"));

///connect 内建的中间件，设置根目录下的 public 文件夹为存放 image、css、js 等静态文件的目录。
// app.use(express.static(path.join(__dirname, 'WebContent')));
//connect 内建的中间件 在终端显示简单的日志。
// app.use(logger('dev'));

//app.use(express.json()); app.use(express.urlencoded()); app.use(express.multipart());
//app.use(express.bodyParser());

//connect 内建的中间件，可以协助处理 POST 请求，伪装 PUT、DELETE 和其他 HTTP 方法。
//app.use(express.methodOverride());

//调用路由解析的规则


// //调用路由解析的规则
app.all('/xweb/*',function(request, respont) {
  console.log('xweb', request.url.replace('xweb', 'web'));
  var path = request.url.replace('xweb', 'web');
  // 使用了superagent来发起请求
  var superagent = require('superagent');
  // 查询本机ip，这里需要根据实际情况选择get还是post
  // var sreq = superagent.get('http://192.168.32.241' + path);
  // var sreq = superagent.get('https://' + request.hostname + path);
  // var sreq = superagent.get('http://192.168.33.10' + path);
  sreq.pipe(respont);
  sreq.on('end', function(){
    // console.log('xweb done');
  });
  // proxy.web(request, respont, { target: 'http://192.168.32.241/'});
});

checkAndStart();

function listen(){
  var server = http.createServer(app);
  var p = portAndSite.port;
  server.listen(p, function(){
    console.log('Express server listening on port ' + p);
    setTimeout(function() {
      require('open')(portAndSite.site);
    },1000);
  });
}

function checkAndStart(){
  var child = require('child_process');
  var p = portAndSite.port;
  // 查到被占用的端口号
  child.exec('netstat -aon|findstr '+ p,
    function (error, stdout, stderr) {
      if(!stdout){
        return listen();
      }
      var starr = stdout.split('\n');
      var starrr = starr[0].split(/\s+/);
      starrr = starrr.filter(function(val) {
        return !!val;
      });
      var currport = starrr[1].replace(/^.+:(.*)$/g, '$1');
      if(p == currport) {
        console.log('taskkill /F /PID '+starrr[4])
        // KISS PID
        child.exec('taskkill /F /PID '+starrr[4],
          function (error, stdout, stderr) {
            setTimeout(listen, 500);
            if (error !== null) {
              console.log('kill error', error)
            }
          });

      }else {
        listen();
      }
    });
}
