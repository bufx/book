# Debian 9快速开启Google BBR的方法

### 方法

- 修改系统变量

```shell
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
```

- 保存生效

```shell
sysctl -p
```

- 查看内核是否已开启 BBR

```shell
sysctl net.ipv4.tcp_available_congestion_control
```

显示以下即已开启：

```shell
# sysctl net.ipv4.tcp_available_congestion_control
net.ipv4.tcp_available_congestion_control = bbr cubic reno
```

- 查看 BBR 是否启动

```shell
lsmod | grep bbr
```

显示以下即启动成功：

```shell
# lsmod | grep bbr
tcp_bbr                20480  14
```
