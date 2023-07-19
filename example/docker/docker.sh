#!/bin/bash
echo "docker.sh 接收到参数：$1，$2，$3，$4"
port=$3
version=$4
# 为什么使用脚本，而不是用dockerfile文件：脚本可以从本地机器传参数到服务器执行
#echo "脚本路径 $0"
#echo "参数 $1" docker需要的文件目录
#echo "参数 $2" 项目名称

#初始化数据库
#将宿主机的sql文件拷贝到容器内部
#cp $1/nginx.conf /root/dockerData/nginx/conf.d/nginx-$2.conf
cp $1/location.lo /root/dockerData/nginx/conf.d/nginx-$2.lo
docker cp $1/initSql.sh mysql8:/home/initSql.sh
docker cp $1/init.sql mysql8:/home/init.sql
echo "在远程 docker的mysql8容器中执行/home/initSql.sh脚本 初始化数据库结构"
docker exec -d mysql8 /bin/bash /home/initSql.sh

echo 删除原来的镜像
docker rmi -f pkyy-$2:$version
echo 构建新的镜像
docker build -t pkyy-$2:$version $1
echo 删除原来的容器
docker stop pkyy-$2
docker rm pkyy-$2
#docker rm $(docker ps -qf status=exited)
echo 从镜像运行容器
docker run -d --name pkyy-$2 --net=host -p $port:$port pkyy-$2:$version
docker logs pkyy-$2

echo 配置nginx代理

echo 重新启动nginx
docker stop nginx
docker rm nginx
docker run --name nginx -p 80:80 \
-v /root/dockerData/nginx/nginx.conf:/etc/nginx/nginx.conf \
-v /root/dockerData/nginx/conf.d:/etc/nginx/conf.d \
-v /root/dockerData/nginx/log:/var/log/nginx \
-v /root/dockerData/nginx/html:/usr/share/nginx/html \
-d nginx:1.24.0

#echo 刷新nginx (下面的命令没有作用，也没有报错。。。)
#docker exec nginx -s reload
#docker exec -d nginx /bin/bash nginx -s reload /root/dockerData/nginx/conf.d/nginx-$2.conf

#echo 刷新nginx,试试这个？
#docker restart nginx
echo
docker logs nginx
echo
echo "容器状态如下：（防止其他进行异常,比如OOM导致其他容器挂了）"
docker ps -a
echo
echo "当前内存情况,单位MB：（用于判断后续是否会发生内存方面的问题）"
free -m
echo
echo 完成