# Kubernetes-Helm的使用

## 介绍

`Helm`类似 maven,  npm，pip，docker hub, 可以理解为是一个软件库，可以方便快速的为我们的集群安装一些第三方软件。
使用 Helm 我们可以非常方便的就搭建出来 MongoDB / MySQL 副本集群，YAML 文件别人都给我们写好了，直接使用。[官网](https://helm.sh/zh/)，[应用中心](https://artifacthub.io/)


## 安装 Helm

安装 [文档](https://helm.sh/zh/docs/intro/install/)

```sh
$ curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
  % Total    % Received % Xferd  Average Speed   Time    Time  Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  100 11156  100 11156    0     0    13136      0 --:--:-- 13140
Downloading https://get.helm.sh/helm-v3.7.2-linux-amd64.tar.gz
Verifying checksum... Done.
Preparing to install helm into /usr/local/bin
helm installed into /usr/local/bin/helm
```



## 常用命令

### 安装源（添加仓库）

`helm repo add 源的名称 源的地址`

如：`helm repo add bitnami https://charts.bitnami.com/bitnami`

### 安装服务

`helm install 自定义的服务名 服务名`

如：`helm install my-mongo bitnami/mongodb`

### 查看已安装

`helm ls`

### 删除已安装

`helm delete 自定义的服务名 或者 helm uninstall 自定义的服务名`

如：`helm delete my-mongo 或者 helm uninstall my-mongo`

### 更新已安装

`helm upgrade 自定义的服务名 --install`

如：`helm upgrade my-mongo --install`

## 安装 MongoDB 示例

### 单机安装

```sh
# 安装源
$ helm repo add bitnami https://charts.bitnami.com/bitnami
"bitnami" has been added to your repositories

# 安装 MongoDB
$ helm install my-mongo bitnami/mongodb
NAME: my-mongo
LAST DEPLOYED: Thu Jan 13 09:45:55 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
CHART NAME: mongodb
CHART VERSION: 10.31.3
APP VERSION: 4.4.11

** Please be patient while the chart is being deployed **

MongoDB&reg; can be accessed on the following DNS name(s) and ports from within your cluster:
    # 提示已安装的 mongodb 的连接地址
    my-mongo-mongodb.default.svc.cluster.local

To get the root password run:
    # 提示你如何获得密码
    export MONGODB_ROOT_PASSWORD=$(kubectl get secret --namespace default my-mongo-mongodb -o jsonpath="{.data.mongodb-root-password}" | base64 --decode)

To connect to your database, create a MongoDB&reg; client container:

    kubectl run --namespace default my-mongo-mongodb-client --rm --tty -i --restart='Never' --env="MONGODB_ROOT_PASSWORD=$MONGODB_ROOT_PASSWORD" --image docker.io/bitnami/mongodb:4.4.11-debian-10-r12 --command -- bash

Then, run the following command:
    mongo admin --host "my-mongo-mongodb" --authenticationDatabase admin -u root -p $MONGODB_ROOT_PASSWORD

To connect to your database from outside the cluster execute the following commands:

		# 提示你怎么连接 mongodb
    kubectl port-forward --namespace default svc/my-mongo-mongodb 27017:27017 &
    mongo --host 127.0.0.1 --authenticationDatabase admin -p $MONGODB_ROOT_PASSWORD
    
# 查看 pod
$ kubectl get pod -o wide
NAME                                READY   STATUS    RESTARTS   AGE     IP            NODE       NOMINATED NODE   READINESS GATES
my-mongo-mongodb-798559bb5d-jhzx9   1/1     Running   0          5m32s   172.17.0.4    minikube   <none>           <none>

# 查看所有
$ kubectl get all
NAME                                    READY   STATUS    RESTARTS   AGE
pod/my-mongo-mongodb-798559bb5d-jhzx9   1/1     Running   0          5m55s

NAME                       TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)     AGE
service/kubernetes         ClusterIP   10.96.0.1        <none>        443/TCP     6d
service/my-mongo-mongodb   ClusterIP   10.103.169.139   <none>        27017/TCP   5m55s

NAME                               READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/my-mongo-mongodb   1/1     1            1           5m55s

NAME                                          DESIRED   CURRENT   READY   AGE
replicaset.apps/my-mongo-mongodb-798559bb5d   1         1         1       5m55s
```



### 集群安装

```sh
# 安装源
$ helm repo add bitnami https://charts.bitnami.com/bitnami
"bitnami" has been added to your repositories

# 安装 MongoDB，安装前删除一下
$ helm ls
NAME    	NAMESPACE	REVISION	UPDATED                                	STATUS  	CHART          	APP VERSION
my-mongo	default  	1       	2022-01-13 09:45:55.138740938 +0800 CST	deployed	mongodb-10.31.3	4.4.11

$ helm delete my-mongo
release "my-mongo" uninstalled

$ kubectl get all
NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   6d

# 指定架构(集群)和密码
$ helm install my-mongo bitnami/mongodb --set architecture="replicaset",auth.rootPassword="mongopass"
NAME: my-mongo
LAST DEPLOYED: Thu Jan 13 10:01:32 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
CHART NAME: mongodb
CHART VERSION: 10.31.3
APP VERSION: 4.4.11

** Please be patient while the chart is being deployed **

MongoDB&reg; can be accessed on the following DNS name(s) and ports from within your cluster:
    # 提示已安装的 mongodb 的连接地址
    my-mongo-mongodb-0.my-mongo-mongodb-headless.default.svc.cluster.local:27017
    my-mongo-mongodb-1.my-mongo-mongodb-headless.default.svc.cluster.local:27017

To get the root password run:

    export MONGODB_ROOT_PASSWORD=$(kubectl get secret --namespace default my-mongo-mongodb -o jsonpath="{.data.mongodb-root-password}" | base64 --decode)

To connect to your database, create a MongoDB&reg; client container:

    kubectl run --namespace default my-mongo-mongodb-client --rm --tty -i --restart='Never' --env="MONGODB_ROOT_PASSWORD=$MONGODB_ROOT_PASSWORD" --image docker.io/bitnami/mongodb:4.4.11-debian-10-r12 --command -- bash

Then, run the following command:
    mongo admin --host "my-mongo-mongodb-0.my-mongo-mongodb-headless.default.svc.cluster.local:27017,my-mongo-mongodb-1.my-mongo-mongodb-headless.default.svc.cluster.local:27017" --authenticationDatabase admin -u root -p $MONGODB_ROOT_PASSWORD
    
# 查看 pod
$ kubectl get pod -o wide
NAME                         READY   STATUS    RESTARTS   AGE     IP            NODE       NOMINATED NODE   READINESS GATES
my-mongo-mongodb-0           1/1     Running   0          2m50s   172.17.0.4     minikube   <none>           <none>
my-mongo-mongodb-1           1/1     Running   0          2m38s   172.17.0.5     minikube   <none>           <none>
my-mongo-mongodb-arbiter-0   1/1     Running   0          2m50s   172.17.0.3     minikube   <none>           <none>

# 查看所有
$ kubectl get all
NAME                             READY   STATUS    RESTARTS   AGE
pod/my-mongo-mongodb-0           1/1     Running   0          3m10s
pod/my-mongo-mongodb-1           1/1     Running   0          2m58s
pod/my-mongo-mongodb-arbiter-0   1/1     Running   0          3m10s

NAME                                        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)     AGE
service/kubernetes                          ClusterIP   10.96.0.1    <none>        443/TCP     6d
service/my-mongo-mongodb-arbiter-headless   ClusterIP   None         <none>        27017/TCP   3m10s
service/my-mongo-mongodb-headless           ClusterIP   None         <none>        27017/TCP   3m10s

NAME                                        READY   AGE
statefulset.apps/my-mongo-mongodb           2/2     3m10s
statefulset.apps/my-mongo-mongodb-arbiter   1/1     3m10s

# 查看 pv pvc sc 
$ kubectl get pv
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                                STORAGECLASS    REASON   AGE
pvc-6680772f-8205-4af3-a8e5-ef661f05a350   8Gi        RWO            Delete           Bound    default/datadir-my-mongo-mongodb-0   standard                 25m
pvc-b8bdec22-3b62-4f27-9f1b-aababc804e2b   8Gi        RWO            Delete           Bound    default/datadir-my-mongo-mongodb-1   standard                 25m

$ kubectl get pvc
NAME                         STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS    AGE
datadir-my-mongo-mongodb-0   Bound    pvc-6680772f-8205-4af3-a8e5-ef661f05a350   8Gi        RWO            standard        25m
datadir-my-mongo-mongodb-1   Bound    pvc-b8bdec22-3b62-4f27-9f1b-aababc804e2b   8Gi        RWO            standard        25m

$ kubectl get sc
NAME                 PROVISIONER                    RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
standard (default)   k8s.io/minikube-hostpath       Delete          Immediate              false                  6d1h
```



### 连接 MongoDB

```sh
# 查看密码 然后在用 base64 解码 ,bW9uZ29wYXNz=mongopass
$ kubectl get secret my-mongo-mongodb -o json
# 或者输出为 yaml 查看
$ kubectl get secret my-mongo-mongodb -o yaml > secret.yaml
apiVersion: v1
data:
  mongodb-replica-set-key: T3MzMjVIYms2Tg==
  mongodb-root-password: bW9uZ29wYXNz 
kind: Secret
metadata:
  annotations:
    meta.helm.sh/release-name: my-mongo
    meta.helm.sh/release-namespace: default
  creationTimestamp: "2022-01-13T02:01:32Z"
  labels:
    app.kubernetes.io/component: mongodb
    app.kubernetes.io/instance: my-mongo
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/name: mongodb
    helm.sh/chart: mongodb-10.31.3
  name: my-mongo-mongodb
  namespace: default
  resourceVersion: "52760"
  uid: d35f498f-4bb7-43cb-a1b4-fadc6446648f
type: Opaque

# 临时运行一个包含 mongo client 的 debian 系统
$ kubectl run mongodb-client --rm --tty -i --restart='Never' --image docker.io/bitnami/mongodb:4.4.10-debian-10-r20 --command -- bash
If you don't see a command prompt, try pressing enter.

# 进去 mongodb 这个是主节点，可以读写
I have no name!@mongodb-client:/$ mongo --host my-mongo-mongodb-0.my-mongo-mongodb-headless.default.svc.cluster.local:27017 -u root -p mongopass
MongoDB shell version v4.4.10
connecting to: mongodb://my-mongo-mongodb-0.my-mongo-mongodb-headless.default.svc.cluster.local:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("fdece2d2-01de-4b14-a326-ed7923a3d32e") }
MongoDB server version: 4.4.11
---
The server generated these startup warnings when booting:
        2022-01-13T02:01:42.564+00:00: /sys/kernel/mm/transparent_hugepage/enabled is 'always'. We suggest setting it to 'never'
        2022-01-13T02:01:42.564+00:00: /sys/kernel/mm/transparent_hugepage/defrag is 'always'. We suggest setting it to 'never'
---
---
        Enable MongoDB's free cloud-based monitoring service, which will then receive and display
        metrics about your deployment (disk utilization, CPU, operation statistics, etc).

        The monitoring data is available on a MongoDB website with a unique URL accessible to you
        and anyone you share it with. MongoDB may use this information to make
        product improvements and to suggest MongoDB products and deployment options to you.

        To enable free monitoring, run: db.enableFreeMonitoring()
        To permanently disable this reminder, run: db.disableFreeMonitoring()
---
rs0:PRIMARY> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
rs0:PRIMARY> exit
bye

# 进去 mongodb 这个是从节点，只读节点
I have no name!@mongodb-client:/$ mongo --host my-mongo-mongodb-1.my-mongo-mongodb-headless.default.svc.cluster.local:27017 -u root -p mongopass
MongoDB shell version v4.4.10
connecting to: mongodb://my-mongo-mongodb-1.my-mongo-mongodb-headless.default.svc.cluster.local:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("bf4c9990-abfa-47e6-88e6-b49ce70a5c04") }
MongoDB server version: 4.4.11
---
The server generated these startup warnings when booting:
        2022-01-13T02:02:01.245+00:00: /sys/kernel/mm/transparent_hugepage/enabled is 'always'. We suggest setting it to 'never'
        2022-01-13T02:02:01.245+00:00: /sys/kernel/mm/transparent_hugepage/defrag is 'always'. We suggest setting it to 'never'
        2022-01-13T02:01:42.564+00:00:
        2022-01-13T02:02:01.370+00:00: ** WARNING: This replica set has a Primary-Secondary-Arbiter architecture, but readConcern:majority is enabled
        2022-01-13T02:02:01.370+00:00: **          for this node. This is not a recommended configuration. Please see
        2022-01-13T02:02:01.370+00:00: **          https://dochub.mongodb.org/core/psa-disable-rc-majority
        2022-01-13T02:02:01.371+00:00:
---
---
        Enable MongoDB's free cloud-based monitoring service, which will then receive and display
        metrics about your deployment (disk utilization, CPU, operation statistics, etc).

        The monitoring data is available on a MongoDB website with a unique URL accessible to you
        and anyone you share it with. MongoDB may use this information to make
        product improvements and to suggest MongoDB products and deployment options to you.

        To enable free monitoring, run: db.enableFreeMonitoring()
        To permanently disable this reminder, run: db.disableFreeMonitoring()
---
rs0:SECONDARY> show dbs
uncaught exception: Error: listDatabases failed:{
	"topologyVersion" : {
		"processId" : ObjectId("61df8818d1bd992fb7d6ff94"),
		"counter" : NumberLong(3)
	},
	"operationTime" : Timestamp(1642040662, 1),
	"ok" : 0,
	"errmsg" : "not master and slaveOk=false",
	"code" : 13435,
	"codeName" : "NotPrimaryNoSecondaryOk",
	"$clusterTime" : {
		"clusterTime" : Timestamp(1642040662, 1),
		"signature" : {
			"hash" : BinData(0,"Q9kV+ODHLfyTrw1sN4d8momJPnw="),
			"keyId" : NumberLong("7052505087951765510")
		}
	}
} :
_getErrorWithCode@src/mongo/shell/utils.js:25:13
Mongo.prototype.getDBs/<@src/mongo/shell/mongo.js:147:19
Mongo.prototype.getDBs@src/mongo/shell/mongo.js:99:12
shellHelper.show@src/mongo/shell/utils.js:937:13
shellHelper@src/mongo/shell/mongo.js:144:5
shellHelper@src/mongo/shell/mongo.js:819:13
@(shellhelp2):1:1
rs0:SECONDARY> exit
bye

# 也可以转发集群里的端口到宿主机访问 mongodb
$ kubectl port-forward service/my-mongo-mongodb-headless 27017:27017
Forwarding from 127.0.0.1:27017 -> 27017
Forwarding from [::1]:27017 -> 2701
```

