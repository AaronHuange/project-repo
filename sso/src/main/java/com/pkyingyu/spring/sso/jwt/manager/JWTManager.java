package com.pkyingyu.spring.sso.jwt.manager;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.AlgorithmMismatchException;
import com.auth0.jwt.exceptions.SignatureVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pkyingyu.spring.sso.config.JWTConfigBean;
import com.pkyingyu.spring.sso.jwt.entities.VerifyResult;
import com.pkyingyu.spring.sso.jwt.enums.TimeUnit;
import com.pkyingyu.spring.sso.utils.DateUtil;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Map;
import java.util.function.BiConsumer;

@EnableAutoConfiguration
@Component
public class JWTManager {

    //private static SSOCinfigProp ssoCinfigProp;

//    @Autowired
//    public void setSsoCinfigProp(SSOCinfigProp mssoCinfigProp) {
//        ssoCinfigProp = mssoCinfigProp;
//    }

//    public static String SING = "default"; //第三部分生成时的盐值
//    public static String privateKey = "default"; //RSA私钥

    /*** 通过jwt和负载的key获取负载对应key的值 ***/
    public static <T> T getPayLoadByKey(String jwt, String key) {
        if (StringUtils.isEmpty(jwt)) {
            System.out.println("isEmpty(jwt)");
            return null;
        }

        String[] jwtArray = jwt.split("[.]");

        if (jwtArray.length != 3) {
            System.out.println("length != 3");
            return null;
        }

        String payLoadBase64 = jwtArray[1];
        String payLoadJson = new String(Base64.decodeBase64(payLoadBase64));
        //将对象转换为JSON格式字符串
        ObjectMapper mapper = new ObjectMapper();
        try {
            //忽略不知道的字段，还可以通过在响应对象类上架注解的方式
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            Map map = mapper.readValue(payLoadJson.replaceAll("\n|\t|\r", ""), Map.class);
            if (map == null) {
                return null;
            }

            Object o = map.get(key);
            if (o == null) {
                return null;
            }
            return (T) o;
        } catch (IOException e) {
            //e.printStackTrace();
            return null;
        }
    }

    public static long getLongPayLoadByKey(String jwt, String key) {
        long result = 0;
        try {
            result = Long.parseLong(getPayLoadByKey(jwt, key));
        } catch (Exception e) {
            // TODO 异常打印
        }
        return result;
    }

    public static long getLongPayLoadByKeyFromRequest(HttpServletRequest request, String key) {
        String jwt = request.getHeader("token");
        return JWTManager.getLongPayLoadByKey(jwt, key);
    }

    private static JWTConfigBean jwtConfigBean = new JWTConfigBean();

    public static JWTConfigBean getJwtConfigBean() {
        return jwtConfigBean;
    }

    public static void setJwtConfigBean(JWTConfigBean mjwtConfigBean) {
        jwtConfigBean = mjwtConfigBean;
    }

    /*** 生成JWT ***/
    public static String getJWT(Map<String, String> map) {
        if ("MD5".equals(jwtConfigBean.getEncryptType())) {
            Algorithm algorithmMD5 = Algorithm.HMAC256(jwtConfigBean.getJwtMd5Sign());
            return JWT(algorithmMD5, map);
        }
        // 生成 RSA 密钥对生成器
        KeyPairGenerator keyPairGenerator = null;
        try {
            keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return "";
        }
        // 初始化密钥长度
        keyPairGenerator.initialize(2048);
        // 生成 RSA 密钥对
        KeyPair keyPair = keyPairGenerator.generateKeyPair();
        // 生成 JWT 算法
        Algorithm algorithmRSA = Algorithm.RSA256((RSAPublicKey) keyPair.getPublic(), (RSAPrivateKey) keyPair.getPrivate());
        return JWT(algorithmRSA, map);
    }

    /*** 解析JWT ***/
    public static VerifyResult verifyJWT(String jwt) {
        if ("MD5".equals(jwtConfigBean.getEncryptType())) {
            Algorithm algorithmMD5 = Algorithm.HMAC256(jwtConfigBean.getJwtMd5Sign());
            return _verifyJWT(jwt, algorithmMD5);
        }
        // 生成 RSA 密钥对生成器
        KeyPairGenerator keyPairGenerator = null;
        try {
            keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return VerifyResult.Result_JWT_ERROR;
        }
        // 初始化密钥长度
        keyPairGenerator.initialize(2048);
        // 生成 RSA 密钥对
        KeyPair keyPair = keyPairGenerator.generateKeyPair();
        // 生成 JWT 算法
        Algorithm algorithmRSA = Algorithm.RSA256((RSAPublicKey) keyPair.getPublic(), (RSAPrivateKey) keyPair.getPrivate());
        return _verifyJWT(jwt, algorithmRSA);
    }


    private static String JWT(Algorithm algorithm, Map<String, String> map) {
        // 生成 JWT Token
        JWTCreator.Builder builder = JWT.create();
        map.forEach(new BiConsumer<String, String>() {
            @Override
            public void accept(String s, String s2) {
                builder.withClaim(s, s2); //自定义额外负载参数 int类型
            }
        });

        TimeUnit timeUnit = TimeUnit.MINUTES;
        switch (jwtConfigBean.getTimeUnit()) {  //秒：s、分：m、时：h、天：d、毫秒：ms
            case "s":
                timeUnit = TimeUnit.SECONDS;
                break;
            case "m":
                timeUnit = TimeUnit.MINUTES;
                break;
            case "h":
                timeUnit = TimeUnit.HOURS;
                break;
            case "d":
                timeUnit = TimeUnit.DAYS;
                break;
            case "ms":
                timeUnit = TimeUnit.MILLISECONDS;
                break;

        }

        return builder
//                .withIssuer("Self") // 预定义payload字段：签发者的名称，没设置则不会出现在负载中。取的时候也会返回null
//                .withSubject("Test Auth0 JWT") // 预定义payload字段：jwt所面向的用户的值，没设置则不会出现在负载中。取的时候也会返回null
//                .withAudience("Audience X", "Audience Y", "Audience Z") // 预定义payload字段：该jwt由谁接收，没设置则不会出现在负载中。取的时候也会返回null
                .withExpiresAt(DateUtil.getChangeDate(jwtConfigBean.getTimeValue(), timeUnit)) //jwt过期时间(某个时间点之后就失效了)
//                .withNotBefore(DateUtil.getChangeDate(0, TimeUnit.SECONDS)) // 定义在什么时间之前的时间(时间倒着走是不会过期的)，该jwt都是不可用的.
//                .withIssuedAt(DateUtil.getChangeDate(0, TimeUnit.SECONDS)) //生成签名的时间
//                .withJWTId("jwt-id-1")
                .sign(algorithm);
    }


    private static VerifyResult _verifyJWT(String jwt, Algorithm algorithm) {

        JWTVerifier jwtVerifier = JWT.require(algorithm).build();
        try {
            DecodedJWT decodedJWT = jwtVerifier.verify(jwt);
//            String header = decodedJWT.getHeader(); //获取标头 BASE64 部分
//            String payload = decodedJWT.getPayload(); //获取负载 BASE64 部分
//            String signature = decodedJWT.getSignature(); //获取jwt验证部分

//            if (jwt.equals(header + "." + payload + "." + signature)) { //手动验证是否有效
//                System.out.println("jwt有效");
//            }
//            decodedJWT.getAlgorithm(); //获取标头 alg 非BASE64 字段的值
//            decodedJWT.getType(); //获取标头 typ 非BASE64 字段的值
//            decodedJWT.getIssuer(); //
//            decodedJWT.getSubject(); //
//            decodedJWT.getAudience(); //
//            decodedJWT.getId(); //

//            decodedJWT.getClaim("payloadData1").asInt(); //获取 自定义额外负载参数 int类型
//            decodedJWT.getClaim("payloadData2").asString(); //获取 自定义额外负载参数 String类型
//            decodedJWT.getClaim("payloadData3").asBoolean(); //获取 自定义额外负载参数 Boolean类型

            //decodedJWT.getHeaderClaim("").asInt(); //获取 自定义额外标头参数 map类型中的某个 int类型key的值

//            System.out.println(new String(Base64.decodeBase64(header)));
//            System.out.println(new String(Base64.decodeBase64(payload)));
            return VerifyResult.success(decodedJWT);
        } catch (SignatureVerificationException e) {
            e.printStackTrace();
            return VerifyResult.Result_INVALIDE_SING;
        } catch (TokenExpiredException e) {
            e.printStackTrace();
            return VerifyResult.Result_JWT_EXPIRES;
        } catch (AlgorithmMismatchException e) {
            e.printStackTrace();
            return VerifyResult.Result_ENCRYPT_ERROR;
        } catch (Exception e) {
            e.printStackTrace();
            return VerifyResult.Result_JWT_ERROR;
        }
    }
}
