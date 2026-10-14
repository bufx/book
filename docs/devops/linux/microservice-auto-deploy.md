# 微服务自动部署命令说明

## 基础命令

```sh
# 显示当前目录
$ basepath=$(cd `dirname $0`; pwd)
$ echo $basepath

# 获取本地IP
$ LAN_IP=$(ip addr| grep inet|grep -v 127.0.0.1|grep -v inet6|awk '{print $2}'|cut -d "/" -f 1 | awk '{print $1}' | head -1)
$ echo $LAN_IP

# 禁用防火墙
$ systemctl stop firewalld && systemctl disable firewalld

# 禁用selinux
$ getenforce | grep -iq 'Enforcing' && setenforce 0
$ sed -i 's|SELINUX=\(.*\)|SELINUX=disabled|g' /etc/selinux/config

# $? 用法：获取上一次命令的返回值。0表示执行成功，非零值表示出错
$ result=$(rpm -qa|egrep "httpd|ansible|createrepo")
$ echo $?
1

# pushd 用法：另附文章说明
# createrepo 用法：另附文章说明
```

