# 工程简介
我坦白了,只是JWT的生成和验证这样简单的库而已
# 使用
- 修改配置
```
ssoconfig.properties文件中配置了如下：
pkyingyu.sso.jwtMd5Sign=pkyingyu.mp
//pkyingyu.sso.jwtRSAPrivateKey=dfsafsfsfasfsfsfsfsfsdfsfasfsf
pkyingyu.sso.encryptType=MD5
pkyingyu.sso.timeUnit=m //过期时间单位 秒：s、分：m、时：h、天：d、毫秒：ms
pkyingyu.sso.timeValue=10
```

- 添加扫描
```
@ComponentScan(basePackages = {"com.pkyingyu.sblibs.sso.**"})
```

- API
```
//获取jwt
Map<String, String> map = new HashMap<>();
map.put("userId", "1111");
String jwt = JWTManager.getJWT(map);

//验证jwt
VerifyResult result = JWTManager.verifyJWT(jwt);
boolean success = result.getVerifyResultEnum() == VerifyResultEnum.SUCCESS;
```
