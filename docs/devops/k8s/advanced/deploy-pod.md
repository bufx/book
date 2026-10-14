# Kubernetes部署Pod

## 简介

Kubernetes 跟 Docker 等很多项目最大的不同，就在于它不推荐你使用命令行的方式直接运行容器（虽然 Kubernetes 项目也支持这种方式，比如：kubectl run），而是希望你用 YAML 文件的方式，即：把容器的定义、参数、配置，统统记录在一个 YAML 文件中，然后用这样一句指令把它运行起来：

`kubectl create -f 我的配置文件`

这么做最直接的好处是，你会有一个文件能记录下 Kubernetes 到底“run”了什么。

## 配置文件

`nginx-deployment.yaml`

```yaml
apiVersion: apps/v1
# 指定了这个 API 对象的类型（Type），是一个 Deployment
# 1.所谓 Deployment，是一个定义多副本应用（即多个副本 Pod）的对象
# 2.此外，Deployment 还负责在 Pod 定义发生变化时，对每个副本进行滚动更新（Rolling Update）
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    # 过滤规则的定义，我们一般称之为：Label Selector
    matchLabels:
      app: nginx
  # 定义的 Pod 副本个数是：2
  replicas: 2
  # 定义了一个 Pod 模版
  template:
    # 一个 Kubernetes 的 API 对象的定义，大多可以分为 Metadata 和 Spec 两个部分
    # 前者(metadata)存放的是API 对象的“标识”，即元数据
    metadata:
      # 一组 key-value 格式的标签
      # 可以通过这个 Labels 字段从 Kubernetes 中过滤出它所关心的被控制对象,
      # 在本例中，Deployment 会把所有正在运行的、携带“app: nginx”标签的 Pod 识别为被管理的对象，并确保这些 Pod 的总数严格等于两个
      labels:
        app: nginx
    # 后者（spec)：存放的，则是属于这个对象独有的定义，用来描述它所要表达的功能
    # 包含一个容器
    spec:
      containers:
      # 容器名称
      - name: nginx
      # 容器的镜像是 nginx:1.7.9
        image: nginx:1.7.9
        # 容器监听端口是 80
        ports:
        - containerPort: 80
        # 声明自己要挂载哪个 Volume
        volumeMounts: 
        # 容器内部的路径
        - mountPath: "/usr/share/nginx/html"
        # 挂载名称
          name: nginx-vol
          
      # 定义了这个Pod的所有 Volume
      volumes:
      # 挂载名称
      - name: nginx-vol
        # 挂载的类型为emptyDir
        # 等同于Docker 的隐式 Volume 参数，即：不显式声明宿主机目录的 Volume，Kubernetes 会在宿主机上创建一个临时目录，这个目录将来就会被绑定挂载到容器所声明的 Volume 目录上，最后交给 Docker
        emptyDir: {}
      # 挂载名称
      - name: nginx-vol2
        # 挂载类型为hostPath，即显式的 Volume 定义，类似docker的 -v
        hostPath: 
          # 宿主机的绝对路径
          path: " /var/data"
```

在这里，**`Pod 就是 Kubernetes 世界里的“应用”；而一个应用，可以由多个容器组成。`**

需要注意的是，像这样使用一种 API 对象（Deployment）管理另一种 API 对象（Pod）的方法，在 Kubernetes 中，叫作“**控制器**”模式（controller pattern）。在我们的例子中，Deployment 扮演的正是 Pod 的控制器的角色。

## 运行配置文件

### 运行命令

- 使用`kubectl apply`命令(**推荐**)，既能创建，也能更新

  ```sh
  $ kubectl apply -f nginx-deployment.yaml
  deployment.apps/nginx-deployment apply
  ```

  

- 使用 `kubectl create`命令，只能创建，不能更新

  ```sh
  $ kubectl create -f nginx-deployment.yaml
  deployment.apps/nginx-deployment created
  ```

### 查看运行状态

```sh
$ kubectl get pods -l app=nginx
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-5d59d67564-b9925   1/1     Running   0          40s
nginx-deployment-5d59d67564-tmxk4   1/1     Running   0          40s
```

`-l`:获取所有匹配 app:nginx 标签的 Pod。

**在命令行中，所有 key-value 格式的参数，都使用“=”而非“:”表示**

### 查看一个 API 对象的细节

命令格式：`kubectl describe pod <PodNAME>`

```sh
$ kubectl describe pod nginx-deployment-5d59d67564-b9925
Name:         nginx-deployment-67655c6769-ktbxv
Namespace:    default
Priority:     0
Node:         node2/172.16.198.103
Start Time:   Wed, 26 May 2021 22:41:32 +0800
Labels:       app=nginx
              pod-template-hash=67655c6769
Annotations:  <none>
Status:       Running
IP:           10.47.0.7
IPs:
  IP:           10.47.0.7
Controlled By:  ReplicaSet/nginx-deployment-67655c6769
Containers:
  nginx:
    Container ID:   docker://96d4fa867e89c330cd94cc4febcae5d9ce610ac40b5ad8392612ef77a829fe2f
    Image:          nginx:1.8
    Image ID:       docker-pullable://nginx@sha256:c97ee70c4048fe79765f7c2ec0931957c2898f47400128f4f3640d0ae5d60d10
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Wed, 26 May 2021 22:41:34 +0800
    Ready:          True
    Restart Count:  0
    Environment:    <none>
    Mounts:
      /usr/share/nginx/html from nginx-vol (rw)
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-swqh8 (ro)
Conditions:
  Type              Status
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True
Volumes:
  nginx-vol:
    Type:       EmptyDir (a temporary directory that shares a pod's lifetime)
    Medium:
    SizeLimit:  <unset>
  nginx-vol2:
    Type:          HostPath (bare host directory volume)
    Path:           /var/data
    HostPathType:
  kube-api-access-swqh8:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    ConfigMapOptional:       <nil>
    DownwardAPI:             true
QoS Class:                   BestEffort
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type    Reason     Age    From               Message
  ----    ------     ----   ----               -------
  Normal  Scheduled  5m21s  default-scheduler  Successfully assigned default/nginx-deployment-67655c6769-ktbxv to node2
  Normal  Pulled     5m19s  kubelet            Container image "nginx:1.8" already present on machine
  Normal  Created    5m19s  kubelet            Created container nginx
  Normal  Started    5m19s  kubelet            Started container nginx
[root@master ~]#
```

在 kubectl describe 命令返回的结果中，可以清楚地看到这个 Pod 的详细信息，比如它的 IP 地址等等。其中，有一个部分值得你特别关注，它就是 **Events（事件）**。

在 Kubernetes 执行的过程中，对 API 对象的所有重要操作，都会被记录在这个对象的 Events 里，并且显示在 kubectl describe 指令返回的结果中。

比如，对于这个 Pod，我们可以看到它被创建之后，被调度器调度（Successfully assigned）到了 node2，拉取了指定的镜像（pulling image），然后启动了 Pod 里定义的容器（Started container）。所以，这个部分正是我们将来进行 Debug 的重要依据。**如果有异常发生，你一定要第一时间查看这些 Events**，往往可以看到非常详细的错误信息。

### 对镜像变更

修改yaml文件即可

```yaml
...    
    spec:
      containers:
      - name: nginx
        image: nginx:1.8 #这里被从1.7.9修改为1.8
        ports:
      - containerPort: 80
```

- 使用 `kubectl apply`命令(**推荐**)

  ```sh
  $ kubectl apply -f nginx-deployment.yaml
  deployment.apps/nginx-deployment apply
  ```

  

- 使用`kubectl replace`命令

  ```sh
  $ kubectl replace -f nginx-deployment.yaml
  deployment.apps/nginx-deployment replaced
  ```

  

### 进入Pod中

命令格式：`kubectl exec -it <PodNAME>`

```sh
$ kubectl exec -it nginx-deployment-64c9d67564-gnnxl -- /bin/bash
root@nginx-deployment-64c9d67564-gnnxl:/# ls
bin  boot  dev	etc  home  lib	lib64  media  mnt  opt	proc  root  run  sbin  srv  sys  tmp  usr  var
```

### 删除Pod

```sh
$ kubectl delete -f nginx-deployment.yaml
deployment.apps "nginx-deployment" deleted
```
