# Kubernetes的部署-kubeadm方式二

## 准备工作

### 修改hostsname

```sh
$ vi /etc/hosts
172.16.198.102 master
172.16.198.103 node1
172.16.198.104 node2
```

### 关闭并禁止防火墙

```sh
$ systemctl stop firewalld && systemctl disable firewalld
```



### 关闭swap

- 临时关闭，重启失效

  ```sh
  $ swapoff -a
  
  # 重新开启
  $ swapon -a
  ```

- 永久关闭

  ```sh
  # 编辑/etc/fstab 注释掉最后一行
  $ vi /etc/fstab
  # 重启生效
  ```



## 安装docker并启动

参考[安装Docker](https://buubiu.com/2021/02/01/Docker的基本概念/#Docker的安装)一节安装Docker

- 安装docker依赖

  ```sh
  $ sudo yum install -y yum-utils \
    device-mapper-persistent-data \
    lvm2
  ```

- 设置docker的yum源

  ```sh
  $ sudo yum-config-manager \
      --add-repo \
      https://download.docker.com/linux/centos/docker-ce.repo
  ```

- 安装最新版的docker

  ```sh
  $ sudo yum install -y docker-ce docker-ce-cli containerd.io
  ```

- 配置阿里云镜像加速以及Docker 守护程序

  ```sh
  $ mkdir -p /etc/docker
  $ vi /etc/docker/daemon.json
  {
    "registry-mirrors": [
    	"https://lz2nib3q.mirror.aliyuncs.com"
    ],
    "exec-opts": ["native.cgroupdriver=systemd"],
    "log-driver": "json-file",
    "log-opts": {
      "max-size": "100m"
    },
    "storage-driver": "overlay2"
  }
  ```

- 启动docker

  ```sh
  $ sudo systemctl enable docker
  $ sudo systemctl start docker
  ```

## 开始安装

### 添加 kubeadm 的源

```sh
$ cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

### yum安装

```sh
$ yum -y install kubeadm
# 设置kubelet自启动
$ systemctl enable kubelet
```

## 部署  Master 节点

```sh
# 查看需要下载的镜像
$ kubeadm config images list
# 因为阿里云没有dns镜像，需要提前下载一个镜像 并修改 tag
$ docker pull coredns/coredns:1.8.0
$ docker tag coredns/coredns:v1.8.0 registry.aliyuncs.com/google_containers/coredns/coredns:v1.8.0
# 开始安装主节点
$ kubeadm init --image-repository registry.aliyuncs.com/google_containers

# 安装成功后执行
$ mkdir -p $HOME/.kube
$ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
$ sudo chown $(id -u):$(id -g) $HOME/.kube/config

# 安装网络插件
$ kubectl apply -f https://github.com/weaveworks/weave/releases/download/latest_release/weave-daemonset-k8s-1.11.yaml

# 查看节点列表
$ kubectl get nodes
# 查看pod
$ kubectl get pods -n kube-system
```

## 部署 node 节点

```sh
# 执行步骤1，2，3
# 加入主节点
$ kubeadm join 172.16.198.101:6443 --token ha3qeh.9eqf46erh8kpmwl8 \
	--discovery-token-ca-cert-hash sha256:1b76a7ac832e7582527c9d7e618289784bf4d00b414c2350023e8622d85eba1d
```
