# Docker中的网络配置

## 为什么要提供网络功能

Docker 允许通过外部访问容器互联的方式来提供网络服务。

## Docker 容器与操作系统通信机制

当 Docker 启动时，会自动在主机上创建一个 `docker0` 虚拟网桥，实际上是 Linux 的一个 bridge，可以理解为一个软件交换机。它会在挂载到它的网口之间进行转发。

同时，Docker 随机分配一个本地未占用的私有网段（在 [RFC1918](https://tools.ietf.org/html/rfc1918) 中定义）中的一个地址给 `docker0` 接口。比如典型的 `172.17.42.1`，掩码为 `255.255.0.0`。此后启动的容器内的网口也会自动分配一个同一网段（`172.17.0.0/16`）的地址。


当创建一个 Docker 容器的时候，同时会创建了一对 `veth pair` 接口（当数据包发送到一个接口时，另外一个接口也可以收到相同的数据包）。这对接口一端在容器内，即 `eth0`；另一端在本地并被挂载到 `docker0` 网桥，名称以 `veth` 开头（例如 `vethAQI2QT`）。通过这种方式，主机可以跟容器通信，容器之间也可以相互通信。Docker 就创建了在主机和所有容器之间一个虚拟共享网络。

![](networking-img/networking-step01.png)

## Docker 网络使用

**注意：**一般在使用docker网桥(bridge)实现容器与容器通信时，都是站在一个应用角度进行容器通信的。

### 查看网桥配置

```dockerfile
docker network ls
```

### 创建自定义网桥

```dockerfile
docker network create buubiu(网桥名称)
#或者 默认就是 bridge
docker network create -d bridge buubiu(网桥名称)
```

### 查看网桥详情

```dockerfile
docker inspect buubiu(网桥名称)
```

### 删除一个网桥

```dockerfile
docker network rm 网桥名称
```

### 启动容器指定使用网桥

```dockerfile
docker run -d -p 8080:8080 --name myTomcat01 --network buubiu tomcat 
docker run -d -p 8081:8080 --name myTomcat02 --network buubiu tomcat 
```

`注意:`

`1. 一旦指定网桥后--name指定名字就是主机名,多个容器指定在同一个网桥时,可以在任意一个容器中使用主机名与容器进行互通`

`2.  使用run命令指定网桥时，这个网桥必须存在，否则创建不成功`

