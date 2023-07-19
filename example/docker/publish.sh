#!/bin/bash
echo 打包完成,准备发布
echo 设置构建参数
interfacePath=smartMemory
port=8033
serverOuterIp=175.178.210.102
serverInnerIp=10.0.8.14
version=1.0.0
dockerPath=$(pwd)
projectPath=$(dirname "$PWD")
projectName=$(basename "$projectPath")
#nginx_config="$dockerPath/nginx.conf"
#cat>"${nginx_config}"<<EOF
#server {
#    listen       80;
#    server_name  175.178.210.102;
#
#    access_log off;
#
#    location /pkyingyu/pub/$interfacePath/ {
#       # 这里不能写 localhost或127.0.0.1，需要写局域网ip(推荐),或外网ip。否则只会在容器内部找
#       proxy_pass http://$serverInnerIp:$port;
#       proxy_connect_timeout 10s;
#       proxy_read_timeout 10s;
#       proxy_send_timeout 10s;
#    }
#
#    location /pkyingyu/pri/$interfacePath/ {
#       # 这里不能写 localhost或127.0.0.1，需要写局域网ip(推荐),或外网ip。否则只会在容器内部找
#       proxy_pass http://$serverInnerIp:$port;
#       proxy_connect_timeout 10s;
#       proxy_read_timeout 10s;
#       proxy_send_timeout 10s;
#   }
#
#    error_page   500 502 503 504  /50x.html;
#    location = /50x.html {
#        root   /usr/share/nginx/html;
#    }
#}
#EOF
location_config="$dockerPath/location.lo"
cat>"${location_config}"<<EOF
    location /pkyingyu/pub/$interfacePath/ {
       # 这里不能写 localhost或127.0.0.1，需要写局域网ip(推荐),或外网ip。否则只会在容器内部找
       proxy_pass http://$serverInnerIp:$port;
       proxy_connect_timeout 10s;
       proxy_read_timeout 10s;
       proxy_send_timeout 10s;
    }

    location /pkyingyu/pri/$interfacePath/ {
       # 这里不能写 localhost或127.0.0.1，需要写局域网ip(推荐),或外网ip。否则只会在容器内部找
       proxy_pass http://$serverInnerIp:$port;
       proxy_connect_timeout 10s;
       proxy_read_timeout 10s;
       proxy_send_timeout 10s;
   }
EOF

echo
echo 设置的构建参数如下
echo 接口路径:$interfacePath
echo 暴露给宿主机端口:$port
echo 服务器内网Ip:$serverInnerIp
echo 构建版本:$version
echo docker目录:$dockerPath
echo "发布项目：${projectPath}"
echo "发布项目名称：$projectName"
#使用-e参数，会支持转义符
#echo -e "nginx配置:$(cat $dockerPath/nginx.conf)"
echo -e "nginx配置:$(cat $dockerPath/location.lo)"
echo
echo 设置构建参数完成, 开始发布
echo
#echo 清理docker目录
#rm "${dockerPath}/*.jar"
echo 开始拷贝资源
echo "复制build中的jar包到docker目录"
jarFile=$(ls "${projectPath}/build/libs")
cp "${projectPath}/build/libs/${jarFile}" "${dockerPath}/app.jar"
echo "复制resources中的配置文件到docker目录"
cp -R "${projectPath}/src/main/resources/" "${dockerPath}/"
echo 拷贝资源完成
echo
echo 开始上传资源
ssh root@175.178.210.102 "mkdir -p /root/myJarImages/pkyy/${projectName}"
scp ${dockerPath}/* root@175.178.210.102:/root/myJarImages/pkyy/${projectName}
echo "上传成功"
echo
echo "在远程执行 docker.sh脚本 构建镜像"
ssh root@175.178.210.102 "sh /root/myJarImages/pkyy/${projectName}/docker.sh /root/myJarImages/pkyy/${projectName} ${projectName} ${port} ${version}"

#ssh 远程执行命令
#ssh root@175.178.210.102 "命令..."
#scp免密登录
#scp ~/.ssh/id_rsa.pub  root@175.178.210.102:/root/.ssh/a.pub
#cat ~/.ssh/a.pub >> ~/.ssh/authorized_keys

#task publishJar {
#    dependsOn 'bootJar' //在执行publishApk时，自动先执行bootJar
#    doLast {
#        def scriptPath = project.projectDir + "/docker/publish.sh"
#        commandLine 'sh', scriptPath
#    }
#}
