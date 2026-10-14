# Zookeeper的客户端基本命令

进入客户端操作如下常用指令

## ls path

查看特定节点下面的子节点，比如

```shell
[root@localhost bin]# ./zkCli.sh -server 192.168.91.4:2181
.....
[zk: 192.168.91.4:2181(CONNECTED) 1] ls /
[zookeeper]
[zk: 192.168.91.4:2181(CONNECTED) 2] ls /zookeeper
[config, quota]
[zk: 192.168.91.4:2181(CONNECTED) 3] ls /zookeeper/config
[]
[zk: 192.168.91.4:2181(CONNECTED) 4] ls /zookeeper/quota
[]
[zk: 192.168.91.4:2181(CONNECTED) 5]
```

----

## create path data

创建一个节点，并给节点绑定数据（默认是持久性节点）

- `create path data` 				创建持久性节点(默认是持久性节点)
- `create -s path data`       创建持久性顺序节点
- `create -e path data` 	   创建临时性节点(注意：临时节点不能含有任何子节点)
- `create -e -s path data` 创建临时顺序节点(注意：临时节点不能含有任何子节点)

```shell
[zk: 192.168.91.4:2181(CONNECTED) 5] create /q_node q_buubiu
Created /q_node
[zk: 192.168.91.4:2181(CONNECTED) 6] ls /
[q_node, zookeeper]
[zk: 192.168.91.4:2181(CONNECTED) 7] create -s /qs_node qs_buubiu
Created /qs_node0000000002
[zk: 192.168.91.4:2181(CONNECTED) 8] create -s /qs_node qs_buubiu
Created /qs_node0000000003
[zk: 192.168.91.4:2181(CONNECTED) 9] create -s /qs_node qs_buubiu
Created /qs_node0000000004
[zk: 192.168.91.4:2181(CONNECTED) 10] ls /
[q_node, qs_node0000000002, qs_node0000000003, qs_node0000000004, zookeeper]
[zk: 192.168.91.4:2181(CONNECTED) 11] create -e /e_node e_buubiu
Created /e_node
[zk: 192.168.91.4:2181(CONNECTED) 12] ls /
[e_node, q_node, qs_node0000000002, qs_node0000000003, qs_node0000000004, zookeeper]
[zk: 192.168.91.4:2181(CONNECTED) 13] create -e -s /es_node es_buubiu
Created /es_node0000000006
[zk: 192.168.91.4:2181(CONNECTED) 14] create -e -s /es_node es_buubiu
Created /es_node0000000007
[zk: 192.168.91.4:2181(CONNECTED) 15] create -e -s /es_node es_buubiu
Created /es_node0000000008
[zk: 192.168.91.4:2181(CONNECTED) 16] ls /
[e_node, es_node0000000006, es_node0000000007, es_node0000000008, q_node, qs_node0000000002, qs_node0000000003, qs_node0000000004, zookeeper]
[zk: 192.168.91.4:2181(CONNECTED) 17] create /e_node/aa
Ephemerals cannot have children: /e_node/aa
[zk: 192.168.91.4:2181(CONNECTED) 18] quit

WATCHER::

WatchedEvent state:Closed type:None path:null
2021-04-17 07:00:27,673 [myid:] - INFO  [main:ZooKeeper@1232] - Session: 0x1000009ace20001 closed
2021-04-17 07:00:27,675 [myid:] - ERROR [main:ServiceUtils@42] - Exiting JVM with code 1
2021-04-17 07:00:27,675 [myid:] - INFO  [main-EventThread:ClientCnxn$EventThread@570] - EventThread shut down for session: 0x1000009ace20001
[root@localhost bin]# ./zkCli.sh -server 192.168.91.4:2181
.....
[zk: 192.168.91.4:2181(CONNECTED) 0] ls /
[q_node, qs_node0000000002, qs_node0000000003, qs_node0000000004, zookeeper]
[zk: 192.168.91.4:2181(CONNECTED) 1]
```

----

## stat path

查看节点状态

```shell
[zk: 192.168.91.4:2181(CONNECTED) 1] stat /q_node
cZxid = 0x8  #创建节点的事物id
ctime = Sat Apr 17 06:46:26 CST 2021  #创建节点时间
mZxid = 0x8  #修改节点的事物id
mtime = Sat Apr 17 06:46:26 CST 2021  #修改节点时间
pZxid = 0x8  #父节点的事物id
cversion = 0  #节点创建时的版本号
dataVersion = 0  #节点数据的版本号
aclVersion = 0  #acl的版本号
ephemeralOwner = 0x0 #临时节点的节点所有者，因为不是临时节点，所以值为十六进制的0
dataLength = 8  #节点中存储数据的长度
numChildren = 0  #所含有子节点的数量
[zk: 192.168.91.4:2181(CONNECTED) 2]
```

----

## get path

获得（查看）节点上绑定的数据信息

```shell
[zk: 192.168.91.4:2181(CONNECTED) 2] get /q_node
q_buubiu
[zk: 192.168.91.4:2181(CONNECTED) 3]
```

----

## set path data

修改节点数据

```shell
[zk: 192.168.91.4:2181(CONNECTED) 3] set /q_node q_buubiu1
[zk: 192.168.91.4:2181(CONNECTED) 4] get /q_node
q_buubiu1
[zk: 192.168.91.4:2181(CONNECTED) 5] stat /q_node
cZxid = 0x8
ctime = Sat Apr 17 06:46:26 CST 2021
mZxid = 0x13
mtime = Sat Apr 17 07:12:10 CST 2021
pZxid = 0x8
cversion = 0
dataVersion = 1
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 9
numChildren = 0
[zk: 192.168.91.4:2181(CONNECTED) 6]
```

----

## ls2 path(3.5.9版本开始弃用)

查看节点下孩子和当前节点的状态，相当于`ls path`和`stat path`的组合命令

```shell
[zk: 192.168.91.4:2181(CONNECTED) 6] ls /
[q_node, qs_node0000000002, qs_node0000000003, qs_node0000000004, zookeeper]
[zk: 192.168.91.4:2181(CONNECTED) 7] stat /
cZxid = 0x0
ctime = Thu Jan 01 08:00:00 CST 1970
mZxid = 0x0
mtime = Thu Jan 01 08:00:00 CST 1970
pZxid = 0x11
cversion = 13
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 0
numChildren = 5
[zk: 192.168.91.4:2181(CONNECTED) 8] ls2 /
[q_node, qs_node0000000002, qs_node0000000003, qs_node0000000004, zookeeper]
cZxid = 0x0
ctime = Thu Jan 01 08:00:00 CST 1970
mZxid = 0x0
mtime = Thu Jan 01 08:00:00 CST 1970
pZxid = 0x11
cversion = 13
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 0
numChildren = 5
[zk: 192.168.91.4:2181(CONNECTED) 9] 
```

----

## history

查看操作历史

```shell
[zk: 192.168.91.4:2181(CONNECTED) 9] history
0 - ls /
1 - stat /q_node
2 - get /q_node
3 - set /q_node q_buubiu1
4 - get /q_node
5 - stat /q_node
6 - ls /
7 - stat /
8 - ls2 /
9 - history
[zk: 192.168.91.4:2181(CONNECTED) 10]
```

----

## delete path

删除节点（**注意：删除的节点不能包含子节点**）

```shell
[zk: 192.168.91.4:2181(CONNECTED) 10]  delete /qs_node0000000002
[zk: 192.168.91.4:2181(CONNECTED) 11] ls /
[q_node, qs_node0000000003, qs_node0000000004, zookeeper]
[zk: 192.168.91.4:2181(CONNECTED) 15] create /qs_node0000000003/name buubiu
Created /qs_node0000000003/name
[zk: 192.168.91.4:2181(CONNECTED) 16] ls /qs_node0000000003
[name]
[zk: 192.168.91.4:2181(CONNECTED) 17] delete /qs_node0000000003
Node not empty: /qs_node0000000003
[zk: 192.168.91.4:2181(CONNECTED) 18]
```

----

## rmr path(3.7.0版本开始弃用)

递归删除节点（**注意：会将当前节点下的所有子节点删除，谨慎操作**）

```shell
[zk: 192.168.91.4:2181(CONNECTED) 18] ls /qs_node0000000003
[name]
[zk: 192.168.91.4:2181(CONNECTED) 19] rmr /qs_node0000000003
[zk: 192.168.91.4:2181(CONNECTED) 20] ls /
[q_node, qs_node0000000004, zookeeper]
[zk: 192.168.91.4:2181(CONNECTED) 21]
```

## deleteall path

递归删除节点（**注意：会将当前节点下的所有子节点删除，谨慎操作**）

```shell
[zk: 192.168.91.4:2181(CONNECTED) 18] ls /qs_node0000000003
[name]
[zk: 192.168.91.4:2181(CONNECTED) 19] deleteall /qs_node0000000003
[zk: 192.168.91.4:2181(CONNECTED) 20] ls /
[q_node, qs_node0000000004, zookeeper]
[zk: 192.168.91.4:2181(CONNECTED) 22]
```

## quit

退出当前会话（会话失效）

```shell
[zk: 192.168.91.4:2181(CONNECTED) 22] quit
2021-04-17 07:34:47,636 [myid:192.168.91.4:2181] - WARN  [main-SendThread(192.168.91.4:2181):ClientCnxn$SendThread@1284] - An exception was thrown while closing send thread for session 0x1000009ace20002.
EndOfStreamException: Unable to read additional data from server sessionid 0x1000009ace20002, likely server has closed socket
	at org.apache.zookeeper.ClientCnxnSocketNIO.doIO(ClientCnxnSocketNIO.java:77)
	at org.apache.zookeeper.ClientCnxnSocketNIO.doTransport(ClientCnxnSocketNIO.java:350)
	at org.apache.zookeeper.ClientCnxn$SendThread.run(ClientCnxn.java:1280)

WATCHER::

WatchedEvent state:Closed type:None path:null
2021-04-17 07:34:47,743 [myid:] - INFO  [main:ZooKeeper@1232] - Session: 0x1000009ace20002 closed
2021-04-17 07:34:47,745 [myid:] - ERROR [main:ServiceUtils@42] - Exiting JVM with code 0
2021-04-17 07:34:47,745 [myid:] - INFO  [main-EventThread:ClientCnxn$EventThread@570] - EventThread shut down for session: 0x1000009ace20002
[root@localhost bin]#
```
