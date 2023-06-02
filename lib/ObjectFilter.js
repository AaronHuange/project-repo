module.exports = {
  filter(sqlBean, ...fields) {
    fields?.forEach((field) => {
      sqlBean[field] = undefined; // undefined不会输出到响应,null会输出到响应
    });
    return sqlBean;
  }
};