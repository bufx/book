# Kubernetes-ConfigMap与Secret的使用

## ConfigMap

数据库连接地址，这种可能根据部署环境变化的，我们不应该写死在代码里。
Kubernetes 为我们提供了 ConfigMap，可以方便的配置一些变量。[文档](https://kubernetes.io/zh/docs/concepts/configuration/configmap/)


1. 创建 yaml

```yaml configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mongo-config
data:
  mongoHost: mongodb-0.mongodb
```

2. 部署 yaml

```sh
$ kubectl apply -f configmap.yaml
configmap/mongo-config created

# 查看所有的 configmap
$ kubectl get configmap
NAME               DATA   AGE
kube-root-ca.crt   1      5d7h
mongo-config       1      8s

# 以 yaml 查看configmap
$ kubectl get configmap mongo-config -o yaml
apiVersion: v1
data:
  mongoHost: mongodb-0.mongodb
kind: ConfigMap
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","data":{"mongoHost":"mongodb-0.mongodb"},"kind":"ConfigMap","metadata":{"annotations":{},"name":"mongo-config","namespace":"default"}}
  creationTimestamp: "2022-01-12T08:29:46Z"
  name: mongo-config
  namespace: default
  resourceVersion: "48470"
  uid: 8cfaa997-0e6c-4290-b620-cd9db02d9a16
```

## Secret

一些重要数据，例如密码、TOKEN，我们可以放到 secret 中。[文档](https://kubernetes.io/zh/docs/concepts/configuration/secret/)，[配置证书](https://kubernetes.io/zh/docs/concepts/configuration/secret/#tls-secret)

> 注意，数据要进行 Base64 编码

1. 创建 yaml

```yaml secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: mongo-secret
# Opaque 用户定义的任意数据，更多类型介绍 https://kubernetes.io/zh/docs/concepts/configuration/secret/#secret-types
type: Opaque
data:
  # 数据要 base64。https://tools.fun/base64.html
  mongo-username: bW9uZ291c2Vy
  mongo-password: bW9uZ29wYXNz
```

2. 部署 yaml

```sh
$ kubectl apply -f secret.yaml
secret/mongo-secret created

# 查看所有 secret
$ kubectl get secret
NAME                  TYPE                                  DATA   AGE
default-token-m2x8s   kubernetes.io/service-account-token   3      5d7h
mongo-secret          Opaque                                2      9s

# 以 yaml 方式查看 secret
$ kubectl get secret mongo-secret -o yaml
apiVersion: v1
data:
  mongo-password: bW9uZ29wYXNz
  mongo-username: bW9uZ291c2Vy
kind: Secret
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","data":{"mongo-password":"bW9uZ29wYXNz","mongo-username":"bW9uZ291c2Vy"},"kind":"Secret","metadata":{"annotations":{},"name":"mongo-secret","namespace":"default"},"type":"Opaque"}
  creationTimestamp: "2022-01-12T09:05:51Z"
  name: mongo-secret
  namespace: default
  resourceVersion: "49988"
  uid: a2e1f7e5-c5b8-4814-928a-5422c78f8678
type: Opaque
```



## 使用方法

### 作为环境变量使用

#### 举例一：自定义的镜像

之前的 `deployment`类型的 test-k8s，若镜像里面要使用环境变量，则可以在 yaml 文件中加入 `env`

```sh
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
      # 等待 mongodb 起来后才启动
      initContainers:
      - name: wait-mongo
        image: busybox:1.28
        command: ['sh', '-c', "until nslookup mongodb; do echo waiting for mongo; sleep 2; done"]
      # 定义容器，可以多个
      containers:
      - name: test-k8s # 容器名字
        image: ccr.ccs.tencentyun.com/k8s-tutorial/test-k8s:v4-configmap # 镜像
        env:
          - name: MONGO_USERNAME # 定义一个环境变量名：MONGO_USERNAME 供镜像里面的程序使用
            valueFrom: # 环境变量的值的来源
              secretKeyRef: # 环境变量的值来自 secret 类型的 yaml 中
                name: mongo-secret # 环境变量的值来自 serect 中的 metadata.name=mongo-secret 的配置文件
                key: mongo-username # 环境变量的值来自 metadata.name=mongo-secret 中的 data.mongo-username
          - name: MONGO_PASSWORD
            valueFrom:
              secretKeyRef:
                name: mongo-secret
                key: mongo-password
          - name: MONGO_ADDRESS
            valueFrom:
              configMapKeyRef: # 环境变量的值来自 configmap 类型的 yaml 中
                name: mongo-config # 环境变量的值来自 configmap 中的 metadata.name=mongo-config 的配置文件
                key: mongoHost # 环境变量的值来自 metadata.name=mongo-config 中的 data.mongoHost
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



#### 举例二：公共镜像

之前 `statefulset`类型的 `mongodb` 加上用户名和密码

```yaml mongo.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mongodb
spec:
  serviceName: mongodb
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  serviceName: mongodb
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
          env:
          - name: MONGO_INITDB_ROOT_USERNAME # 官方镜像规定的数据库用户名环境变量名称
            valueFrom:
              secretKeyRef:
                name: mongo-secret
                key: mongo-username
          - name: MONGO_INITDB_ROOT_PASSWORD # 官方镜像规定的数据库密码环境变量名称
            valueFrom:
              secretKeyRef:
                name: mongo-secret
                key: mongo-password
          # Secret 的所有数据定义为容器的环境变量，Secret 中的键名称为 Pod 中的环境变量名称
          # envFrom:
          # - secretRef:
          #     name: mongo-secret
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
      protocol: TCP
      targetPort: 27017
```

### 挂载为文件（更适合证书文件）

挂载后，会在容器中对应路径生成文件，一个 key 一个文件，内容就是 value，[文档](https://kubernetes.io/zh/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod)

```yaml pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
```
