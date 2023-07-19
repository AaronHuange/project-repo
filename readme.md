### 啥东西
gradle版本、gradle版本、gradle版本、gradle版本、gradle版本、gradle版本、gradle版本

pkyy的java后台项目的gradle版本。将慢慢综合其他maven版本


// TODO 主键索引、普通索引，组合索引，唯一索引 分别怎么定义

Java程序员进阶之路
```shell
https://tobebetterjavaer.com/springboot/springtask.html#%E5%85%B3%E4%BA%8E-spring-task
```
较好的文章
```shell
# MySQL中针对大数据量常用技术：查询优化，数据转移 转载
https://blog.51cto.com/tuziwo/2126758
```

```shell
mysqldump -h 127.0.0.1 -P 3306 -uroot -p1234432u `pkyingyu-user` > ./pkyingyu_dictionaries.sql
CREATE DATABASE `pkyingyu-user` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */
mysql -h127.0.0.1 -uroot -p1234432u<./pkyingyu-user.sql;
CREATE DATABASE `pkyingyu_dictionaries` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */
mysql -h127.0.0.1 -uroot -p1234432u<./pkyingyu_dictionaries.sql;

checksum table user;
```

***

### 常见问题：

- 在idea中另一个模块或者第三方库的代码import且使用的好好的, 但是一编译就各种找不到。就算是最简单的空方法调用都不行。 则进行下图所示设置。(这问题浪费整整满满的一个周日。翻了各种书尝试了各种方法.......)
  ![电脑出问题,网上找了一张图片](https://bbsmax.ikafan.com/static/L3Byb3h5L2h0dHBzL2ltZzIwMjAuY25ibG9ncy5jb20vaS1iZXRhLzE2ODA5ODgvMjAyMDAzLzE2ODA5ODgtMjAyMDAzMDQyMTIxMzk2NTAtMTYxMDQ1NjQ1MC5wbmc=.jpg)

- 上面是运行的时候的现象，在build打包的时候也会出现类似情况。 
  这个是因为下面的配置true没有开启，导致打jar包被跳过。
  就没有jar包产物。导致启动不了： 
  ```
  subprojects { jar.enabled=true }
  ```
- no main manifest attribute, in xxxxx-SNAPSHOT.jar
可能是依赖没有打进jar包
```
jar {
    manifest {
        attributes 'Main-Class': "com.pkyingyu.mp.everyday.EveryDayApplication"
    }
    from {
        //添加依懒到打包文件
        configurations.compile.collect { it.isDirectory() ? it : zipTree(it) }
    }
}
```

- .IllegalArgumentException: No auto configuration classes found in META-INF/spring.factories. If you are using a custom packaging, make sure that file is correct
  - 是不是用build命令打包了？？，应该要用bootJar命令打包
  
- Error creating bean with name 'entityManagerFactory' defined in class path resource [org/springframework/boot/autoconfigure/orm/jpa/HibernateJpaConfiguration.class]
  - 运行jar包的java版本需要1.8的java命令。
- Caused by: org.gradle.cache.LockTimeoutException: Timeout waiting to lock execution history cache (/Volumes/SD_1TB/project/spring/springclound-gradle/.gradle/6.1.1/executionHistory). It is currently in use by another Gradle instance
  - 这个错误消息表示Gradle无法获取执行历史记录缓存的锁，因为它当前正在被另一个Gradle实例使用。这可能是因为同一项目上有另一个Gradle进程正在运行并持有缓存锁。
  ```shell
    # 确认是否有其他Gradle进程在运行：打开终端应用程序并输入以下命令：
    ps aux | grep gradle
    # 终止Gradle进程
    pkill -f gradle
    # 删除Gradle锁定文件
    rm **/*.lock
    # 更改Gradle缓存目录：打开终端应用程序并输入以下命令：这将将Gradle的缓存目录更改为您的主目录中的.gradle目录。您可以将此命令添加到您的bash配置文件中，以便每次打开终端时都使用该缓存目录
    export GRADLE_USER_HOME=~/.gradle
  ```
  
  
