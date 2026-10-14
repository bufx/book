# Zookeeper的配置文件详细说明

## 配置文件解释

路径：`/opt/software/apache-zookeeper-3.7.0/conf/zoo.cfg`

```properties
# The number of milliseconds of each tick
# 集群节点之间的心跳时间 2秒
tickTime=2000
# The number of ticks that the initial
# synchronization phase can take
# 初始化集群时，集群节点之间同步超时时间：10*2s=20秒
initLimit=10
# The number of ticks that can pass between
# sending a request and getting an acknowledgement
# 集群在运行过程中同步数据超时时间：5*2s=10秒
syncLimit=5
# the directory where the snapshot is stored.
# do not use /tmp for storage, /tmp here is just
# example sakes.
# 默认数据存储位置
dataDir=/tmp/zookeeper
# the port at which the clients will connect
# zk服务监听端口号
clientPort=2181
# the maximum number of client connections.
# increase this if you need to handle more clients
# 最大连接数量，即线程池线程数量
#maxClientCnxns=60
#
# Be sure to read the maintenance section of the
# administrator guide before turning on autopurge.
#
# http://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_maintenance
#
# The number of snapshots to retain in dataDir
# 数据是存在内存里面的，zk会根据事物id机制进行做快照，当快照达到多少个后进行合并
#autopurge.snapRetainCount=3
# Purge task interval in hours
# Set to "0" to disable auto purge feature
# 多久进行一个合并，为0:不进行自动合并  为1:一个小时进行一次判断快照个数是否大于等于3，如果满足则进行合并
#autopurge.purgeInterval=1
```
