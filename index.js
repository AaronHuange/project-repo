const myexpress = require('express');
const logger = require('morgan');
const router = require('./routers/routers.js');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const session = require('express-session');
const cookie = require('cookie-parser');
const cors = require('cors'); // 允许跨域
<% if (TYPE !== 'HTTP接口项目') { %>
<%= const expressWs = require('express-ws') %>
<% } %>
const { getCommandPath, existFile } = require('./lib/file/fileutil');
const fs = require('fs'); // 引入 WebSocket 包

const myapp = myexpress();
myapp.use(logger('dev')); // 控制台打印访问日志
<% if (TYPE !== 'HTTP接口项目') { %>
<%= expressWs(myapp); // myapp需要expressWs一次,router中配置websocket路由时也要expressWs一次 %>
<% } %>
myapp.use(cookie()); // 启用cookie
myapp.use(session({ // 启用session：使用 resp.session.data 、resp.session.data.xxx = any 、 resp.session.data = {}
  name: 'sessionName', // name不能包含中文,否则会报错：name无效
  secret: '秘钥用来干嘛的',
  resave: true,
  rolling: true,
  cookie: {
    maxAge: 60 * 1000
  },
  saveUninitialized: true
}));
myapp.use(cors());
myapp.use(bodyParser.urlencoded({ extended: false })) // 配置post方式的body解析(否则req.body拿不到)
myapp.use(bodyParser.json()); // 配置post方式的body转为json
myapp.use(router); // 先匹配接口
myapp.use(myexpress.static(__dirname + '/static')); // 设置可直接访问的静态目录, 再匹配静态资源
// myapp.use(favicon(__dirname + '/resource/images/jb.png')); // 配置网页的favicon(纯接口项目建议不配置)
myapp.use((req, resp) => {  // 配置404
  resp.status(404);
  resp.send({ code: 404 });
  // resp.sendFile('件路径');
  // resp.redirect('重定向地址');
});
myapp.listen(8080, () => {
  console.log('服务启动成功：8080');
});
