const myexpress = require('express');
const jwtManager = require('../lib/jwt/JwtManager.js');
const websocketServer = require('../config/websocketServer.js');
const router = myexpress.Router();
websocketServer(router);

// 用于相关控制器
const userController = require('../controller/userController');
const rankController = require('../controller/rankController');

router.get('/pri/*', (req, res, next) => {
  console.log('拦截所有 /pri 开头的请求');
  const jwt = req.header('token');
  const isSuccess = jwtManager.validateJwt(jwt);
  if (!isSuccess) {
    res.send({ code: '996', msg: '登录失效' });
    return;
  }
  next(); // 下一个路由匹配(即下面的)、也可以使用 resp.redirect重定向到特定地址
});
router.post('/pub/login', userController.login);
router.get('/pub/register', userController.register);
router.get('/pri/userInfo', userController.userInfo);
router.get('/pub/getRank', rankController.getRank);
// router.get('/article/:articleName/', (req, res) => {
//   console.log('patch 参数测试')
// });
module.exports = router;
