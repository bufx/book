# 亚马逊aws 安装docker 和ssr

1. **选择 Red Hat**
2. **设置安全组**
3. **终端命令**

```shell
#sudo su
#yum -y update
#yum -y install wget
#yum install -y yum-utils device-mapper-persistent-data lvm2
#yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
# wget https://download.docker.com/linux/centos/7/x86_64/stable/Packages/containerd.io-1.2.6-3.3.el7.x86_64.rpm
# yum install -y containerd.io-1.2.6-3.3.el7.x86_64.rpm
# yum install -y docker-ce
# systemctl start docker
# sudo bash -c "$(wget -qO- https://raw.githubusercontent.com/Jigsaw-Code/outline-server/master/src/server_manager/install_scripts/install_server.sh)"
```
