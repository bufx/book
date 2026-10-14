# centos7防火墙设置firewalld-cmd

**常用命令**

```shell
systemctl start firewalld # 启动
systemctl stop firewalld # 停止
systemctl enable firewalld # 启用自动启动
systemctl disable firewalld # 禁用自动启动
systemctl status firewalld # 查看状态  或者
firewall-cmd --state #查看状态
firewall-cmd --list-ports #查看端口开放列表
```

**添加端口**

```shell
firewall-cmd --permanent --zone=public --add-port=7001/tcp
firewall-cmd --permanent --zone=public --add-port=8080/udp
```

**删除端口**

```shell
firewall-cmd --permanent --zone=public --remove-port=8080/tcp
```

**生效**

```shell
firewall-cmd --reload
```
