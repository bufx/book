# Kubernetes-命名空间的使用

## 介绍

如果一个集群中部署了多个应用，所有应用都在一起，就不太好管理，也可以导致名字冲突等。
我们可以使用 namespace 把应用划分到不同的命名空间，跟代码里的 namespace 是一个概念，只是为了划分空间。

官方[文档](https://kubernetes.io/zh/docs/concepts/overview/working-with-objects/namespaces/)


## 使用命名空间

### 创建

```sh
$ kubectl create namespace testapp
namespace/testapp created
```

### 查看

```sh
# 查看命名空间
# 或者 kubectl get namespace
$ kubectl get ns
NAME              STATUS   AGE
default           Active   6d1h
kube-node-lease   Active   6d1h
kube-public       Active   6d1h
kube-system       Active   6d1h
testapp           Active   90s

# 一般在查看所有 all 的时候，默认查看的是 default 的命名空间
$ kubectl get all -n default
NAME                             READY   STATUS    RESTARTS   AGE
pod/mongodb-client               1/1     Running   0          35m
pod/my-mongo-mongodb-0           1/1     Running   0          52m
pod/my-mongo-mongodb-1           1/1     Running   0          52m
pod/my-mongo-mongodb-arbiter-0   1/1     Running   0          52m

NAME                                        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)     AGE
service/kubernetes                          ClusterIP   10.96.0.1    <none>        443/TCP     6d1h
service/my-mongo-mongodb-arbiter-headless   ClusterIP   None         <none>        27017/TCP   52m
service/my-mongo-mongodb-headless           ClusterIP   None         <none>        27017/TCP   52m

NAME                                        READY   AGE
statefulset.apps/my-mongo-mongodb           2/2     52m
statefulset.apps/my-mongo-mongodb-arbiter   1/1     52m

# 部署应用到指定的命名空间
$ kubectl apply -f app.yml --namespace testapp

# 查询指定命名空间的 pod
$ kubectl get pod --namespace kube-system
NAME                               READY   STATUS    RESTARTS       AGE
coredns-78fcd69978-mk82n           1/1     Running   5 (17h ago)    6d1h
etcd-minikube                      1/1     Running   5 (17h ago)    6d1h
kube-apiserver-minikube            1/1     Running   5 (90m ago)    6d1h
kube-controller-manager-minikube   1/1     Running   5 (17h ago)    6d1h
kube-proxy-pbjtn                   1/1     Running   5 (17h ago)    6d1h
kube-scheduler-minikube            1/1     Running   5 (90m ago)    6d1h
storage-provisioner                1/1     Running   11 (90m ago)   6d1h
```

### 切换默认命名空间

```sh
$ kubectl config set-context --current --namespace=<名字空间名称>
```



## 快速切换 namespace

可以用 [kubens](https://github.com/ahmetb/kubectx) 快速切换 namespace

```sh
# 切换命名空间
$ kubens kube-system
# 回到上个命名空间
$ kubens -
# 切换集群
$ kubectx minikube
```

