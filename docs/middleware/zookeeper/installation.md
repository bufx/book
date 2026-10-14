# Zookeeper的安装

安装分为两种：

- Linux系统原生安装
- Docker方式安装

## Linux系统安装

### 安装jdk并配置环境变量

1. 将jdk的rpm包传入到Linux服务器中，并执行以下命令：

```shell
[root@localhost software]# rpm -ivh jdk-8u281-linux-x64.rpm
警告：jdk-8u281-linux-x64.rpm: 头V3 RSA/SHA256 Signature, 密钥 ID ec551f03: NOKEY
准备中...                          ################################# [100%]
正在升级/安装...
   1:jdk1.8-2000:1.8.0_281-fcs        ################################# [100%]
Unpacking JAR files...
	tools.jar...
	plugin.jar...
	javaws.jar...
	deploy.jar...
	rt.jar...
	jsse.jar...
	charsets.jar...
	localedata.jar...
[root@localhost software]#
```

默认安装目录在`/usr/java/jdk1.8.0_281-amd64`

```shell
[root@localhost bin]# find / -name java
/etc/pki/ca-trust/extracted/java
/etc/pki/java
/etc/alternatives/java
/var/lib/alternatives/java
/usr/bin/java
/usr/java
/usr/java/jdk1.8.0_281-amd64/bin/java
/usr/java/jdk1.8.0_281-amd64/jre/bin/java
[root@localhost bin]#
```

2. 配置环境变量

在文件`/etc/profile`最后加上如下命令：

```shell
export JAVA_HOME=/usr/java/jdk1.8.0_281-amd64
export PATH=$PATH:$JAVA_HOME/bin
```

让环境变量生效：

```shell
source /etc/profile
```

### 安装ZK

#### 下载zk安装包

https://mirrors.bfsu.edu.cn/apache/zookeeper/zookeeper-3.7.0/apache-zookeeper-3.7.0-bin.tar.gz

#### 上传到服务器中并解压缩

```shell
tar -zxvf apache-zookeeper-3.7.0.tar.gz
```

#### 重命名安装目录

```shell
mv apache-zookeeper-3.7.0-bin apache-zookeeper-3.7.0
```

#### 修改配置文件

路径：`/opt/software/apache-zookeeper-3.7.0/conf/zoo_sample.cfg`，修改完后重命名为`zoo.cfg`

确保路径`dataDir=/tmp/zookeeper`存在即可

```properties
# The number of milliseconds of each tick
tickTime=2000
# The number of ticks that the initial
# synchronization phase can take
initLimit=10
# The number of ticks that can pass between
# sending a request and getting an acknowledgement
syncLimit=5
# the directory where the snapshot is stored.
# do not use /tmp for storage, /tmp here is just
# example sakes.
dataDir=/tmp/zookeeper
# the port at which the clients will connect
clientPort=2181
# the maximum number of client connections.
# increase this if you need to handle more clients
#maxClientCnxns=60
#
# Be sure to read the maintenance section of the
# administrator guide before turning on autopurge.
#
# http://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_maintenance
#
# The number of snapshots to retain in dataDir
#autopurge.snapRetainCount=3
# Purge task interval in hours
# Set to "0" to disable auto purge feature
#autopurge.purgeInterval=1
```

#### 启动zk

在zk的bin目录下，指定配置文件运行zkServer.sh

```shell
[root@localhost apache-zookeeper-3.7.0]# ./bin/zkServer.sh start ./conf/zoo.cfg
ZooKeeper JMX enabled by default
Using config: ./conf/zoo.cfg
Starting zookeeper ... STARTED
[root@localhost apache-zookeeper-3.7.0]#
```

#### 使用jps查看启动是否成功

```shell
[root@localhost apache-zookeeper-3.7.0]# jps
3148 QuorumPeerMain
3182 Jps
[root@localhost apache-zookeeper-3.7.0]#
```

#### 启动客户端连接到zk

在bin目录下，使用zkCli.sh

命令：``./bin/zkCli.sh -server 192.168.91.4:2181` 本机可不写-server

**注意：可以通过`./bin/zkCli.sh help`查看客户端所有可执行的命令**

```shell
root@localhost apache-zookeeper-3.7.0]# ./bin/zkCli.sh -server 192.168.91.4:2181
Connecting to 192.168.91.4:2181
.......
WATCHER::

WatchedEvent state:SyncConnected type:None path:null
[zk: 192.168.91.4:2181(CONNECTED) 0] ls /
[zookeeper]
[zk: 192.168.91.4:2181(CONNECTED) 1]
```

## Docker安装zk

### 获取镜像

```shell
docker pull zookeeper:3.7.0
```

### 启动zk服务

```shell
docker run -d -p 2181:2181 --name zookeeper zookeeper:3.7.0
```

### 检查是否启动成功

进入docker进程查看

```shell
➜ docker exec -it 2c bash
root@2c5ea7b1d406:/apache-zookeeper-3.7.0-bin# pwd
/apache-zookeeper-3.7.0-bin
root@2c5ea7b1d406:/apache-zookeeper-3.7.0-bin# cd bin/
root@2c5ea7b1d406:/apache-zookeeper-3.7.0-bin/bin# ./zkCli.sh
```








