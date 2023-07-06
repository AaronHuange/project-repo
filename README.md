### 框架
项目由***nestjs+fastify+typeorm*** 搭建

### 版本要求
node 18以上、 pnpm 8.2.0以上

### 文档
- nestjs中文文档：https://docs.nestjs.cn/
- nestjs的graphql文档：https://docs.nestjs.com/graphql/quick-start
- typeorm中文文档：https://typeorm.bootcss.com/

### 说明
本地模拟get请求：
```shell
curl http://127.0.0.1:3305/xxx
```
本地模拟post请求：
```shell
```
本地模拟put请求：
```shell
```
本地模拟delete请求：
```shell
```


### 安装依赖
* pnpm install

### 创建配置文件

运行项目首先需要在跟目录创建.env文件，为数据库的URL地址配置 DATABASE_URL="mysql://account:password@localhost:port/database_name"

> 环境-dev -test 生产不需要这个 如：https://cloud-service.lixiaoyun.com
``` sql
CREATE DATABASE `lxcloud_form` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```
```shell
PLATFORM_URL="https://cloud-service-dev.lixiaoyun.com"
PORT="3305"
DATABASE_URL_HOST='localhost'
DATABASE_URL_PORT='3306'
DATABASE_URL_DATABASE='lxcloud_form'
DATABASE_URL_USERNAME='root'
DATABASE_URL_PASSWORD='xxx'
```

### 运行项目

* pnpm start

> start命令包含先编译生成prisma模型文件，然后启动nestjs服务，本地目前调试的url地址为 http://localhost:3300/api/v1/formGraphql/test

### 项目开发

* 一般表Model创建好了几乎不用动 prisma/schema.prisma
* 修改比较点多的就是往src/modules添加服务xx.controller.ts接口，或者在现有的controller添加新的接口
* 新增的controller再注册到src/controllers.ts文件中去

***其它的文件一般就不用动了***

### migration

- create

```bash
typeorm migration:create ./src/migrations/UpdateFormParentId
```

### graphql

#### filter

操作符号：

| 操作符        | 类型      | 说明        |
|------------|---------|-----------|
| eq         | any     | 等于        |
| ne         | any     | 不等于       |
| gt         | any     | 大于        |
| gte        | any     | 大于等于      |
| lt         | any     | 小于        |
| lte        | any     | 小于等于      |
| in         | array   | 包含        |
| notIn      | array   | 不包含       |
| like       | string  | 匹配        |
| notLike    | string  | 非匹配       |
| between    | array   | 区间，[1,2]  |
| notBetween | array   | 非区间，[1,2] |
| regexp     | any     | 正则        |
| any        | any     | 小于等于      |
| null       | boolean | 空         |
| and        | object  | 并且        |
| or         | object  | 或         |

- 示例

```json
{
  "filter": {
    "id": {
      "eq": "1"
    },
    "createdAt": {
      "between": [
        "2023-06-12 19:04:05",
        "2023-06-12 19:04:05"
      ]
    }
  }
}
```

```json
{
  "filter": {
    "id": {
      "eq": "1"
    },
    "or": {
      "name": {
        "eq": "test"
      }
    }
  }
}
```

组合嵌套条件查询

```json
{
  "filter": {
    "and": {
      "createdAt": {
        "between": [
          1,
          2
        ]
      }
    },
    "or": {
      "createdAt": {
        "between": [
          1,
          2
        ]
      }
    }
  }
}
```
