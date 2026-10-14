# Docker可视化工具Portainer的使用

## 简介

官网：https://www.portainer.io

Portainer is the definitive open source container management tool for Kubernetes, Docker, Docker Swarm and Azure ACI. It allows anyone to deploy and manage containers without the need to write code.

翻译：

Portainer是Kubernetes，Docker，Docker Swarm和Azure ACI的权威性开源容器管理工具。它允许任何人无需编写代码即可部署和管理容器。


## 安装

官方安装文档：https://documentation.portainer.io/quickstart/

1. 下载镜像

   ```dockerfile
   docker pull portainer/portainer-ce
   ```

2. 由于需要挂载操作数据，所有要提前创建volume

   ```dockerfile
   docker volume create portainer_data
   ```

3. 运行容器

   ```dockerfile
   docker run -d -p 8000:8000 -p 9000:9000 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce
   ```

   说明：

   - `8000` 是portainer与docker引擎交互docker.sock的
   - `9000`是供用户访问界面的
   - `--restart=always` 表示容器重启的方式，always 一停掉就重启，即一直保持启动状态
   - `var/run/docker.sock`挂载这个目录，为了操作docker引擎

## 登录和使用Portainer

浏览器访问：http://localhost:9000

![](portainer-img/portainer-step01.png)