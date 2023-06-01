const mysql = require('mysql');

const config = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '1234432u',
  database: 'wuziqi',
};
console.log('创建mysql连接池：全局只执行一次');
let pool = mysql.createPool(config);

module.exports = (sql, paramsArray, callback) => {
  pool.getConnection((err, connection) => { // 获取连接的回调
    if (err) {
      callback(err, connection);
      return;
    }
    connection.query(sql, paramsArray, (queryErr, result) => {
      callback(queryErr, result);
    });
    connection.release(); // 释放连接到连接池中
  });
};