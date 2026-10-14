# Kubernetes-StatefuSet的使用

## 什么是 StatefulSet

`StatefulSet` 是用来管理有状态的应用，例如数据库。
 `deployment` 部署的应用，都是不需要存储数据，不需要记住状态的，可以随意扩充副本，每个副本都是一样的，可替代的。而像数据库、Redis 这类有状态的，则不能随意扩充副本。StatefulSet 会固定每个 Pod 的名字


下面以部署 `Mongodb`为例讲解：

## 部署 StatefulSet 类型的 Mongodb

1. 编写 yaml 文件

```yaml mongo.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mongodb
spec:
  serviceName: mongodb
  replicas: 3
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
        - name: mongo
          image: mongo:4.4
          # IfNotPresent 仅本地没有镜像时才远程拉，Always 永远都是从远程拉，Never 永远只用本地镜像，本地没有则报错
          imagePullPolicy: IfNotPresent
---
apiVersion: v1
kind: Service
metadata:
  name: mongodb
spec:
  selector:
    app: mongodb
  type: ClusterIP
  # HeadLess
  clusterIP: None
  ports:
    - port: 27017
      targetPort: 27017
```

2. 执行 yaml 

```sh
$ kubectl apply -f mongo.yaml
statefulset.apps/mongodb created
service/mongodb created

# 查看 statefulset
$ kubectl get statefulset
NAME      READY   AGE
mongodb   3/3     4m37s

# 查看 pod
$ kubectl get pod -o wide
NAME        READY   STATUS    RESTARTS   AGE     IP           NODE       NOMINATED NODE   READINESS GATES
mongodb-0   1/1     Running   0          2m28s   172.17.0.4   minikube   <none>           <none>
mongodb-1   1/1     Running   0          75s     172.17.0.3   minikube   <none>           <none>
mongodb-2   1/1     Running   0          72s     172.17.0.5   minikube   <none>           <none>
```

## StatefulSet 特性

1. Service 的 `CLUSTER-IP` 是空的，Pod 名字也是固定的。

```sh
# 查看 service
$ kubectl get svc
NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          4d8h
mongodb      ClusterIP      None            <none>        27017/TCP        4m1s
```



2. Pod 创建和销毁是有序的，创建是顺序的，销毁是逆序的。

```sh
# 首先修改 yaml ，副本数量改为10，然后在执行 yaml
$ kubectl apply -f mongo.yaml
statefulset.apps/mongodb configured
service/mongodb unchanged

# 查看 pod 的变化，发现 ID的创建 是有顺序的
$ kubectl get pod -o wide
NAME        READY   STATUS    RESTARTS   AGE     IP             NODE       NOMINATED NODE   READINESS GATES
mongodb-0   1/1     Running   0          7m48s   172.17.0.4     minikube   <none>           <none>
mongodb-1   1/1     Running   0          6m35s   172.17.0.3     minikube   <none>           <none>
mongodb-2   1/1     Running   0          6m32s   172.17.0.5     minikube   <none>           <none>
mongodb-3   1/1     Running   0          17s     172.17.0.2     minikube   <none>           <none>
mongodb-4   1/1     Running   0          14s     172.17.0.7     minikube   <none>           <none>
mongodb-5   1/1     Running   0          13s     172.17.0.8     minikube   <none>           <none>
mongodb-6   1/1     Running   0          11s     172.17.0.9     minikube   <none>           <none>
mongodb-7   1/1     Running   0          9s      172.17.0.10    minikube   <none>           <none>
mongodb-8   1/1     Running   0          5s      172.17.0.11    minikube   <none>           <none>
mongodb-9   1/1     Running   0          3s      172.17.0.12    minikube   <none>           <none>

# 然后在修改 ymal，副本改为3，然后执行 yaml
$ kubectl apply -f mongo.yaml
statefulset.apps/mongodb configured
service/mongodb unchanged

# 查看 pod 的变化，发现 ID的删除也是有顺序的，是创建的逆序
$ kubectl get pod -o wide
NAME        READY   STATUS    RESTARTS   AGE     IP            NODE       NOMINATED NODE   READINESS GATES
mongodb-0   1/1     Running   0          9m55s   172.17.0.4    minikube   <none>           <none>
mongodb-1   1/1     Running   0          8m42s   172.17.0.3    minikube   <none>           <none>
mongodb-2   1/1     Running   0          8m39s   172.17.0.5    minikube   <none>           <none>

# 通过输出 yaml 来查看,会多一个 hostname
$ kubectl get endpoints mongodb -o yaml
apiVersion: v1
kind: Endpoints
metadata:
  creationTimestamp: "2022-01-11T09:32:08Z"
  labels:
    service.kubernetes.io/headless: ""
  name: mongodb
  namespace: default
  resourceVersion: "29984"
  uid: fa3a0607-61dc-4b7d-b566-d8c026cf4e94
subsets:
- addresses:
  # 会多一个 hostname
  - hostname: mongodb-1
    ip: 172.17.0.3
    nodeName: minikube
    targetRef:
      kind: Pod
      name: mongodb-1
      namespace: default
      resourceVersion: "29433"
      uid: 776c156e-c3d7-44ed-8822-b5dbdabaf5ec
  # 会多一个 hostname
  - hostname: mongodb-0
    ip: 172.17.0.4
    nodeName: minikube
    targetRef:
      kind: Pod
      name: mongodb-0
      namespace: default
      resourceVersion: "29420"
      uid: 7c1dff67-14d7-4bd5-b5f1-ee1e733beba4
  # 会多一个 hostname
  - hostname: mongodb-2
    ip: 172.17.0.5
    nodeName: minikube
    targetRef:
      kind: Pod
      name: mongodb-2
      namespace: default
      resourceVersion: "29446"
      uid: 5a6c3dc5-9a33-4c89-bef0-05073fa29b43
  ports:
  - port: 27017
    protocol: TCP
```



3. Pod 重建不会改变名字，除了IP，所以不要用IP直连

   - 访问时，如果直接使用 Service 名字连接，会随机转发请求
   - 要连接指定 Pod，可以这样`pod-name.service-name`

   运行一个临时 Pod 连接数据测试下：

   ```sh
   # mongodb-client： pod 名称
   # --rm：表示 临时的，退出即删除
   # --image: 使用的镜像地址
   # --command -- bash：进入容器内命令行
   $ kubectl run mongodb-client --rm --tty -i --restart='Never' --image docker.io/bitnami/mongodb:4.4.10-debian-10-r20 --command -- bash
   If you don't see a command prompt, try pressing enter.
   
   # 使用 'mongodb-0.mongodb'连接其中一个
   I have no name!@mongodb-client:/$ $ mongo --host mongodb-0.mongodb
   MongoDB shell version v4.4.10
   connecting to: mongodb://mongodb-0.mongodb:27017/?compressors=disabled&gssapiServiceName=mongodb
   Implicit session: session { "id" : UUID("4e965766-ac5b-4e81-aaba-c78f404fed68") }
   MongoDB server version: 4.4.11
   ---
   The server generated these startup warnings when booting:
           2022-01-11T10:10:12.341+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
           2022-01-11T10:10:12.342+00:00: /sys/kernel/mm/transparent_hugepage/enabled is 'always'. We suggest setting it to 'never'
           2022-01-11T10:10:12.342+00:00: /sys/kernel/mm/transparent_hugepage/defrag is 'always'. We suggest setting it to 'never'
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
   > show dbs
   admin   0.000GB
   config  0.000GB
   local   0.000GB
   > use test
   switched to db test
   > db.users.save({'_id':'buubiu', 'name':'buubiu_k8s'})
   WriteResult({ "nMatched" : 0, "nUpserted" : 1, "nModified" : 0, "_id" : "buubiu" })
   > db.user.find()
   > db.users.find()
   { "_id" : "buubiu", "name" : "buubiu_k8s" }
   >
   ```

   

## Web 应用连接 Mongodb

在集群内部，我们可以通过服务名字访问到不同的服务
指定连接第一个：`mongodb-0.mongodb`

1. 通过 deployment 启动 web 镜像

```yaml deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  # 部署名字
  name: test-k8s
spec:
  replicas: 2
  # 用来查找关联的 Pod，所有标签都匹配才行
  selector:
    matchLabels:
      app: test-k8s
  # 定义 Pod 相关数据
  template:
    metadata:
      labels:
        app: test-k8s
    spec:
      # 定义容器，可以多个
      containers:
      - name: test-k8s # 容器名字
        image: ccr.ccs.tencentyun.com/k8s-tutorial/test-k8s:v3-mongo # 镜像
      # 等待 mongodb 起来后才启动
      initContainers:
      - name: wait-mongo
        image: busybox:1.28
        command: ['sh', '-c', "until nslookup mongodb; do echo waiting for mongo; sleep 2; done"]
---
apiVersion: v1
kind: Service
metadata:
  name: test-k8s
spec:
  selector:
    app: test-k8s
  # 默认 ClusterIp 集群内可访问，NodePort 节点可访问，LoadBalancer 负载均衡模式（需要负载均衡器才可用）
  type: NodePort
  ports:
    - nodePort: 31000   # 节点端口，范围固定 30000 ~ 32767
      port: 8080        # 本 Service 的端口
      targetPort: 8080  # 容器端口
```

2. 部署 yaml

```sh
$ kubectl apply -f deployment.yaml
deployment.apps/test-k8s created
service/test-k8s created

$ kubectl get pod -o wide
NAME                        READY   STATUS    RESTARTS      AGE   IP           NODE       NOMINATED NODE   READINESS GATES
mongodb-0                   1/1     Running   1 (27m ago)   51m   172.17.0.3   minikube   <none>           <none>
mongodb-1                   1/1     Running   1 (27m ago)   50m   172.17.0.2   minikube   <none>           <none>
mongodb-2                   1/1     Running   1 (27m ago)   50m   172.17.0.4   minikube   <none>           <none>
test-k8s-7f8b7548fc-22cxs   1/1     Running   0             26s   172.17.0.6   minikube   <none>           <none>
test-k8s-7f8b7548fc-6pv6c   1/1     Running   0             26s   172.17.0.7   minikube   <none>           <none>

$ kubectl get svc
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP          4d9h
mongodb      ClusterIP   None           <none>        27017/TCP        52m
test-k8s     NodePort    10.104.13.44   <none>        8080:31000/TCP   50s
```

3. 端口转发

```sh
$ kubectl port-forward service/test-k8s 8090:8080
Forwarding from 127.0.0.1:8090 -> 8080
Forwarding from [::1]:8090 -> 8080
Handling connection for 8090

# 在 minikube 本机器 访问
$ curl http://localhost:8090
index page

IP lo172.17.0.6, hostname: test-k8s-7f8b7548fc-22cxs

$ kubectl get all
NAME                            READY   STATUS    RESTARTS        AGE
pod/mongodb-0                   1/1     Running   2 (6m23s ago)   62m
pod/mongodb-1                   1/1     Running   2 (6m24s ago)   60m
pod/mongodb-2                   1/1     Running   2 (6m24s ago)   60m
pod/test-k8s-7f8b7548fc-22cxs   1/1     Running   1 (3m1s ago)    10m
pod/test-k8s-7f8b7548fc-6pv6c   1/1     Running   1 (3m1s ago)    10m

NAME                 TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
service/kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP          4d9h
service/mongodb      ClusterIP   None           <none>        27017/TCP        62m
service/test-k8s     NodePort    10.104.13.44   <none>        8080:31000/TCP   10m

NAME                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/test-k8s   2/2     2            2           10m

NAME                                  DESIRED   CURRENT   READY   AGE
replicaset.apps/test-k8s-7f8b7548fc   2         2         2       10m

NAME                       READY   AGE
statefulset.apps/mongodb   3/3     62m
```



**pod 重建后，数据库的内容丢失了**,这时候需要进行 **数据持久化**

```sh
# 重新部署 statefulset
$ kubectl rollout restart statefulset mongodb
```

