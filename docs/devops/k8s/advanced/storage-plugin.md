# Kubernetes部署容器存储插件

## 简介

很多时候我们需要用数据卷（Volume）把外面宿主机上的目录或者文件挂载进容器的 Mount Namespace 中，从而达到容器和宿主机共享这些目录或者文件的目的。容器里的应用，也就可以在这些数据卷中新建和写入文件。

可是，如果你在某一台机器上启动的一个容器，显然无法看到其他机器上的容器在它们的数据卷里写入的文件。**这是容器最典型的特征之一：无状态。**

而容器的持久化存储，就是用来保存容器存储状态的重要手段：存储插件会在容器里挂载一个基于网络或者其他机制的远程数据卷，使得在容器里创建的文件，实际上是保存在远程存储服务器上，或者以分布式的方式保存在多个节点上，而与当前宿主机没有任何绑定关系。这样，无论你在其他哪个宿主机上启动新的容器，都可以请求挂载指定的持久化存储卷，从而访问到数据卷里保存的内容。**这就是“持久化”的含义。**

## 使用Rook存储插件

由于 Kubernetes 本身的松耦合设计，绝大多数存储项目，比如 Ceph、GlusterFS、NFS 等，都可以为 Kubernetes 提供持久化存储能力。在这次的部署实战中，我会选择部署一个很重要的 Kubernetes 存储插件项目：**Rook。**

Rook 项目是一个基于 Ceph 的 Kubernetes 存储插件（它后期也在加入对更多存储实现的支持）。不过，不同于对 Ceph 的简单封装，Rook 在自己的实现中加入了水平扩展、迁移、灾难备份、监控等大量的企业级功能，使得这个项目变成了一个完整的、生产级别可用的容器存储插件。

得益于容器化技术，用几条指令，Rook 就可以把复杂的 Ceph 存储后端部署起来：

### 安装

在主节点执行：

```sh

$ kubectl apply -f https://raw.githubusercontent.com/rook/rook/master/cluster/examples/kubernetes/ceph/common.yaml

$ kubectl apply -f https://raw.githubusercontent.com/rook/rook/master/cluster/examples/kubernetes/ceph/operator.yaml

$ kubectl apply -f https://raw.githubusercontent.com/rook/rook/master/cluster/examples/kubernetes/ceph/crds.yaml

$ kubectl apply -f https://raw.githubusercontent.com/rook/rook/master/cluster/examples/kubernetes/ceph/cluster.yaml
```

### 验证

在部署完成后，你就可以看到 Rook 项目会将自己的 Pod 放置在由它自己管理的 Namespace 当中：

```sh
$ kubectl get pods -n rook-ceph
NAME                                            READY   STATUS             RESTARTS   AGE
csi-cephfsplugin-76z8v                          2/3     ImagePullBackOff   0          2m31s
csi-cephfsplugin-grcfb                          2/3     ImagePullBackOff   0          2m31s
csi-cephfsplugin-provisioner-6f75644874-fjd7f   2/6     ErrImagePull       0          2m31s
csi-cephfsplugin-provisioner-6f75644874-s8vtx   2/6     ErrImagePull       0          2m31s
csi-rbdplugin-jvg76                             2/3     ImagePullBackOff   0          2m32s
csi-rbdplugin-provisioner-67fb987799-t7hvf      2/6     ErrImagePull       0          2m32s
csi-rbdplugin-provisioner-67fb987799-wkbrj      2/6     ErrImagePull       0          2m32s
csi-rbdplugin-r4p7t                             2/3     ImagePullBackOff   0          2m32s
rook-ceph-mon-a-canary-7856b7fb64-p7zg5         1/1     Running            0          2m13s
rook-ceph-mon-b-canary-56d9f5ccd9-skhl7         1/1     Running            0          2m13s
rook-ceph-mon-c-canary-dc75bd77d-llrv4          0/1     Pending            0          2m13s
rook-ceph-operator-84c85574d9-rm5nj             1/1     Running            4          12m
```

这样，一个基于 Rook 持久化存储集群就以容器的方式运行起来了，而接下来在 Kubernetes 项目上创建的所有 Pod 就能够通过 Persistent Volume（PV）和 Persistent Volume Claim（PVC）的方式，在容器里挂载由 Ceph 提供的数据卷了。

而 Rook 项目，则会负责这些数据卷的生命周期管理、灾难备份等运维工作。关于这些容器持久化存储的知识，我会在后续章节中专门讲解。

其实，是因为这个项目很有前途。如果你去研究一下 Rook 项目的实现，就会发现它巧妙地依赖了 Kubernetes 提供的编排能力，合理的使用了很多诸如 Operator、CRD 等重要的扩展特性（这些特性我都会在后面的文章中逐一讲解到）。这使得 Rook 项目，成为了目前社区中基于 Kubernetes API 构建的最完善也最成熟的容器存储插件。我相信，这样的发展路线，很快就会得到整个社区的推崇。

> 备注：其实，在很多时候，大家说的所谓“云原生”，就是“Kubernetes 原生”的意思。而像 Rook、Istio 这样的项目，正是贯彻这个思路的典范。在我们后面讲解了声明式 API 之后，相信你对这些项目的设计思想会有更深刻的体会。
