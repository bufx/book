# Kubernetes集群的安装

## 安装方式介绍

- **minikube**
  只是一个 K8S 集群模拟器，只有一个节点的集群，只为测试用，master 和 worker 都在一起
- **直接用云平台 Kubernetes**
  可视化搭建，只需简单几步就可以创建好一个集群。
  优点：安装简单，生态齐全，负载均衡器、存储等都给你配套好，简单操作就搞定
- **裸机安装（Bare Metal）**
  至少需要两台机器（主节点、工作节点个一台），需要自己安装 Kubernetes 组件，配置会稍微麻烦点。
  可以到各云厂商按时租用服务器，费用低，用完就销毁。
  缺点：配置麻烦，缺少生态支持，例如负载均衡器、云存储。


## minikube

### 安装

>1. 需要提前[安装好 Docker](https://blog.buubiu.com/2021/02/01/Docker的基本概念/#通用方式安装)
>2. 必须用[非root用户安装](https://blog.buubiu.com/2021/02/01/Docker的基本概念/#创建非root用户（可选）)

安装非常简单，支持各种平台，[安装方法](https://minikube.sigs.k8s.io/docs/start/)

本篇以Centos 7.9为例：

1. 安装Docker

2. 安装minikube(除了安装在root下执行，其他都在非root下执行)

   ```sh
   $ curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-latest.x86_64.rpm
     % Total    % Received % Xferd  Average Speed   Time    Time  Time  Current
                                    Dload  Upload   Total   Spent    Left  Speed
     100 14.9M  100 14.9M    0     0    758k      0 --:--:-- 2207k
   $ sudo rpm -Uvh minikube-latest.x86_64.rpm
   准备中...                          ################################# [100%]
   正在升级/安装...
      1:minikube-1.24.0-0                ################################# [100%]
   ```

### 启动集群

```sh
# 启动集群
$ minikube start
😄  minikube v1.24.0 on Centos 7.9.2009 (amd64)
✨  Automatically selected the docker driver

⛔  Requested memory allocation (1833MB) is less than the recommended minimum 1900MB. Deployments may fail.


🧯  The requested memory allocation of 1833MiB does not leave room for system overhead (total system memory: 1833MiB). You may face stability issues.
💡  Suggestion: Start minikube with less memory allocated: 'minikube start --memory=1833mb'

👍  Starting control plane node minikube in cluster minikube
🚜  Pulling base image ...
💾  Downloading Kubernetes v1.22.3 preload ...
    > preloaded-images-k8s-v13-v1...: 501.73 MiB / 501.73 MiB  100.00% 6.11 MiB
    > index.docker.io/kicbase/sta...: 355.77 MiB / 355.78 MiB  100.00% 1.55 MiB
❗  minikube was unable to download gcr.io/k8s-minikube/kicbase:v0.0.28, but successfully downloaded docker.io/kicbase/stable:v0.0.28 as a fallback image
🔥  Creating docker container (CPUs=2, Memory=1833MB) ...
❗  This container is having trouble accessing https://k8s.gcr.io
💡  To pull new external images, you may need to configure a proxy: https://minikube.sigs.k8s.io/docs/reference/networking/proxy/
🐳  Preparing Kubernetes v1.22.3 on Docker 20.10.8 ...
    ▪ Generating certificates and keys ...
    ▪ Booting up control plane ...
    ▪ Configuring RBAC rules ...
🔎  Verifying Kubernetes components...
    ▪ Using image gcr.io/k8s-minikube/storage-provisioner:v5
🌟  Enabled addons: default-storageclass, storage-provisioner
💡  kubectl not found. If you need it, try: 'minikube kubectl -- get pods -A'
🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
```

### 设置环境变量别名

```sh
$ alias kubectl="minikube kubectl --"
# 初始化 pod
$ kubectl get pod
```

### 查看节点

```sh
# 查看节点。kubectl 是一个用来跟 K8S 集群进行交互的命令行工具
$ kubectl -- get pods -A
    > kubectl.sha256: 64 B / 64 B [--------------------------] 100.00% ? p/s 0s
    > kubectl: 44.73 MiB / 44.73 MiB  [--------------] 100.00% 8.30 MiB/s 5.6s
NAMESPACE     NAME                               READY   STATUS    RESTARTS       AGE
kube-system   coredns-78fcd69978-t87dw           1/1     Running   0              104s
kube-system   etcd-minikube                      1/1     Running   0              119s
kube-system   kube-apiserver-minikube            1/1     Running   0              2m1s
kube-system   kube-controller-manager-minikube   1/1     Running   0              117s
kube-system   kube-proxy-z44rx                   1/1     Running   0              105s
kube-system   kube-scheduler-minikube            1/1     Running   0              117s
kube-system   storage-provisioner                1/1     Running   1 (101s ago)   116s
```

### 安装集群可视化（可选）

```sh
$ minikube dashboard
🔌  Enabling dashboard ...
    ▪ Using image kubernetesui/dashboard:v2.3.1
    ▪ Using image kubernetesui/metrics-scraper:v1.0.7
🤔  Verifying dashboard health ...
🚀  Launching proxy ...
🤔  Verifying proxy health ...
🎉  Opening http://127.0.0.1:33489/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/ in your default browser...
👉  http://127.0.0.1:33489/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/

```

### 停止集群

```sh
$ minikube stop
✋  Stopping node "minikube"  ...
🛑  Powering off "minikube" via SSH ...
🛑  1 node stopped.
```

### 清空集群

```sh
$ minikube delete --all
🔥  Deleting "minikube" in docker ...
🔥  Removing /home/docker/.minikube/machines/minikube ...
💀  Removed all traces of the "minikube" cluster.
🔥  Successfully deleted all profiles
```

## 云平台搭建

- [腾讯云 TKE](https://cloud.tencent.com/product/tke)（控制台搜索容器）
- [阿里云 ACK](https://www.aliyun.com/product/kubernetes) （控制台搜索容器）

## 裸机搭建（Bare Metal）

**主节点需要组件**

- docker（也可以是其他容器运行时）
- kubectl 集群命令行交互工具
- kubeadm 集群初始化工具
- kubelet 管理 Pod 和容器，确保他们健康稳定运行。

**工作节点需要组件** [文档](https://kubernetes.io/zh/docs/concepts/overview/components/#node-components)

- docker（也可以是其他容器运行时）
- kubelet 管理 Pod 和容器，确保他们健康稳定运行
- kubeadm 集群初始化工具
- kube-proxy 网络代理，负责网络相关的工作

### 开始安装

> 你也可以试下 [这个项目](https://github.com/lework/kainstall)，用脚本快速搭建 K8S 裸机集群
> 当然，为了更好的理解，你应该先手动搭建一次

1. 设置对应主机名

   ```sh
   # 每个节点分别设置对应主机名
   $ hostnamectl set-hostname master
   $ hostnamectl set-hostname node1
   $ hostnamectl set-hostname node2
   
   # 查看是否修改成功
   $ hostname
   ```

2. 修改 hosts

   ```sh
   # 所有节点都修改 hosts,ip需要修改成实际的
   $ vi /etc/hosts
   10.211.55.101 master
   10.211.55.102 node1
   10.211.55.103 node2
   ```

3. 关闭 SELinux

   ```sh
   # 所有节点关闭 SELinux
   $ setenforce 0
   $ sed -i --follow-symlinks 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/sysconfig/selinux
   ```

4. 禁用交换分区(所有节点都执行)

   - 临时关闭swap，重启后失效

     ```sh
     # 临时关闭swap，重启后失效
     $ swapoff -a
     ```

   - 永久关闭

     ```sh
     $ swapoff -a
     # 编辑 /etc/fstab 删除或注释掉 swap 一行
     $ swapoff -a && sudo sed -i 's/^.*swap/#&/g' /etc/fstab
     ```

4. 防火墙关闭

   ```sh
   # 所有节点确保防火墙关闭
   $ systemctl stop firewalld && systemctl disable firewalld
   ```

5. 添加安装源

   ```sh
   # 所有节点 添加 k8s 安装源
   $ cat <<EOF > kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
   enabled=1
   gpgcheck=1
   repo_gpgcheck=1
   gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
   EOF
   
   $ mv kubernetes.repo /etc/yum.repos.d/
   
   # 所有节点 添加 Docker 安装源
   $ yum install -y yum-utils
   $ yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
   ```

6. 安装所需组件

   ```sh
   # master 节点 安装 docker kubectl kubeadm kubelet
   $ yum install -y docker-ce kubectl kubeadm kubelet
   
   # node1 node2 节点 安装 docker kubeadm kubelet
   $ yum install -y docker-ce kubeadm kubelet
   ```

7. 启动 kubelet、docker，并设置开机启动（所有节点）

   ```sh
   $ systemctl enable kubelet
   $ systemctl start kubelet
   $ systemctl enable docker
   $ systemctl start docker
   ```

9. 修改系统配置，在文件 /etc/sysctl.conf 追加一行 （所有节点）

   ```sh
   $ echo "net.bridge.bridge-nf-call-iptables = 1" >> /etc/sysctl.conf
   $ sysctl --system
   ```

### 修改 docker 配置

```sh
# kubernetes 官方推荐 docker 等使用 systemd 作为 cgroupdriver，否则 kubelet 启动不了
$ cat <<EOF > daemon.json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "registry-mirrors": ["https://lz2nib3q.mirror.aliyuncs.com"]
}
EOF
$ mv daemon.json /etc/docker/

# 重启生效
$ systemctl daemon-reload
$ systemctl restart docker
```

### 初始化集群

1. 用 [kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/) 初始化集群（仅在主节点执行）：

   ```sh
   # 初始化集群控制台 Control plane
   # 失败了可以用 kubeadm reset 重置
   
   # --pod-network-cidr 指定pod的IP地址范围，禁止与宿主机节点同网段，所以如果节点IP运行在192.168..，就使用10.0.0.0/16。如果是10.0..，就使用192.168.0.0/16
   $ kubeadm init --pod-network-cidr=10.244.0.0/16 --image-repository=registry.aliyuncs.com/google_containers
   
   # 记得把 kubeadm join xxx 保存起来
   # 忘记了重新获取：kubeadm token create --print-join-command
   
   # 复制授权文件，以便 kubectl 可以有权限访问集群
   $ mkdir -p $HOME/.kube
   $ cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
   $ chown $(id -u):$(id -g) $HOME/.kube/config
   
   # 在其他机器上创建 ~/.kube/config 文件也能通过 kubectl 访问到集群
   ```

2. 把工作节点加入集群（只在工作节点跑）

   ```sh
   $ kubeadm join 10.211.55.101:6443 --token xxx --discovery-token-ca-cert-hash xxx
   ```

3. 安装网络插件，否则 node 是 NotReady 状态（主节点跑）

   ```sh
   $ kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
   ```

4. 查看集群状态

   ```sh
   $ kubectl get nodes
   NAME     STATUS   ROLES                  AGE     VERSION
   master   Ready    control-plane,master   24m     v1.23.1
   node1    Ready    <none>                 7m17s   v1.23.1
   node2    Ready    <none>                 3m52s   v1.23.1
   ```

### 设置网络

如果你运行 `kubectl describe pod/pod-name` 发现 Events 中有下面这个错误

```sh
networkPlugin cni failed to set up pod "test-k8s-68bb74d654-mc6b9_default" network: open /run/flannel/subnet.env: no such file or directory
```



在每个节点创建文件`/run/flannel/subnet.env`写入以下内容即可解决

```sh
FLANNEL_NETWORK=10.244.0.0/16
FLANNEL_SUBNET=10.244.0.1/24
FLANNEL_MTU=1450
FLANNEL_IPMASQ=true
```



### 清空集群

1. 先清空与子节点的通信（主节点执行）

   ```sh
   # kubectl drain <node name> --delete-emptydir-data --force --ignore-daemonsets
   $ kubectl drain node1 --delete-emptydir-data --force --ignore-daemonsets
   
   $ kubectl drain node2 --delete-emptydir-data --force --ignore-daemonsets
   ```

2. 删除节点（主节点执行）

   ```sh
   # kubectl delete node <node name>
   $ kubectl delete node node1
   
   $ kubectl delete node node2
   ```

3. 重置 kubeadm（所有节点执行）

   ```sh
   $ kubeadm reset
   ```

