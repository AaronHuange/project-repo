FROM java:8u102-jre
MAINTAINER AaronHuange
# 临时文件目录/tmp: 在主机 /var/lib/docker 目录下创建一个临时文件，并链接到容器的/tmp
VOLUME /tmp
# 将jar包添加到容器中并更名为app.jar
COPY app.jar app.jar
# 运行jar包
#EXPOSE 8093
#RUN bash -c 'touch /app.jar'
ENTRYPOINT ["java","-jar","-Xms50m","-Xmx50m","-Duser.timezone=GMT+08","-Dloader.path=lib","/app.jar"]
