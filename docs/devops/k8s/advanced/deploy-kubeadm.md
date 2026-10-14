# Kubernetes的部署-kubeadm方式

目前，Kubernetes 支持在多种环境下使用，包括本地主机（Ubuntu、Debian、CentOS、Fedora 等）、云服务（[腾讯云](https://cloud.tencent.com/act/cps/redirect?redirect=10058&cps_key=3a5255852d5db99dcd5da4c72f05df61)、[阿里云](https://www.aliyun.com/product/kubernetes?source=5176.11533457&userCode=8lx5zmtu&type=copy)、[百度云](https://cloud.baidu.com/product/cce.html) 等）。

可以使用以下几种方式部署 Kubernetes：

- kubeadm

- docker-desktop

- 一步步部署 kubernetes 集群

  可以参考 [opsnull/follow-me-install-kubernetes-cluster](https://github.com/opsnull/follow-me-install-kubernetes-cluster) 项目一步步部署 kubernetes 集群。

接下来对以上几种方式进行详细介绍。

------

## 准备开始

- 一台兼容的 Linux 主机。Kubernetes 项目为基于 Debian 和 Red Hat 的 Linux 发行版以及一些不提供包管理器的发行版提供通用的指令

- 每台机器 2 GB 或更多的 RAM （如果少于这个数字将会影响你应用的运行内存)

- 2 CPU 核或更多

- 集群中的所有机器的网络彼此均能相互连接(公网和内网都可以)

- 节点之中不可以有重复的主机名、MAC 地址或 product_uuid。

  ```shell
  #修改主机名
  [root@localhost ~]# cat /etc/hosts
  127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
  ::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
  172.16.198.3 server1
  172.16.198.4 server2
  172.16.198.5 server3
  [root@localhost ~]#
  ```

  - 你可以使用命令 `ip link` 或 `ifconfig -a` 来获取网络接口的 MAC 地址
  - 可以使用 `sudo cat /sys/class/dmi/id/product_uuid` 命令对 product_uuid 校验

  一般来讲，硬件设备会拥有唯一的地址，但是有些虚拟机的地址可能会重复。 Kubernetes 使用这些值来唯一确定集群中的节点。 如果这些值在每个节点上不唯一，可能会导致安装失败。

- 开启机器上的某些端口。

  也可以关闭并禁用防火墙：

  ```bash
  $ systemctl stop firewalld && systemctl disable firewalld
  ```

  - 控制平面节点

  | 协议 | 方向 | 端口范围  | 作用                    | 使用者                       |
| ---- | ---- | --------- | ----------------------- | ---------------------------- |
  | TCP  | 入站 | 6443      | Kubernetes API 服务器   | 所有组件                     |
  | TCP  | 入站 | 2379-2380 | etcd 服务器客户端 API   | kube-apiserver, etcd         |
  | TCP  | 入站 | 10250     | Kubelet API             | kubelet 自身、控制平面组件   |
  | TCP  | 入站 | 10251     | kube-scheduler          | kube-scheduler 自身          |
  | TCP  | 入站 | 10252     | kube-controller-manager | kube-controller-manager 自身 |
  
  - 工作节点

  | 协议 | 方向 | 端口范围    | 作用           | 使用者                     |
| ---- | ---- | ----------- | -------------- | -------------------------- |
  | TCP  | 入站 | 10250       | Kubelet API    | kubelet 自身、控制平面组件 |
  | TCP  | 入站 | 30000-32767 | NodePort 服务† | 所有组件                   |

- 允许 iptables 检查桥接流量(可选)

  ```bash
  cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
  br_netfilter
  EOF
  
  cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
  net.bridge.bridge-nf-call-ip6tables = 1
  net.bridge.bridge-nf-call-iptables = 1
  EOF
  sudo sysctl --system
  ```

- 禁用交换分区。为了保证 kubelet 正常工作，你 **必须** 禁用交换分区。

  - 临时关闭swap，重启后失效

  ```shell
  #临时关闭swap，重启后失效
  $ swapoff -a
  ```

  - 永久关闭

    - 编辑/etc/fstab  注释掉最后一行

    ```shell
    
    $ vi /etc/fstab
    
    #
    # /etc/fstab
    # Created by anaconda on Mon Apr 19 21:45:29 2021
    #
    # Accessible filesystems, by reference, are maintained under '/dev/disk'
    # See man pages fstab(5), findfs(8), mount(8) and/or blkid(8) for more info
    #
    /dev/mapper/centos-root /                       xfs     defaults        0 0
    UUID=a6721c24-7d5a-4b12-90cd-f3a239de944c /boot                   xfs     defaults        0 0
    # /dev/mapper/centos-swap swap                    swap    defaults        0 0
    ```

    - 编辑/etc/sysctl.d/k8s.conf，最后加入 vm.swappiness = 0

    ```shell
    $ vi /etc/sysctl.d/k8s.conf
    net.bridge.bridge-nf-call-ip6tables = 1
    net.bridge.bridge-nf-call-iptables = 1
    vm.swappiness = 0
    $ sysctl --system
    ```

- 关闭SELinux

  把 SELINUX=enforcing 改为 SELINUX=disabled

  ```shell
  $ vi /etc/selinux/config
  
  # This file controls the state of SELinux on the system.
  # SELINUX= can take one of these three values:
  #     enforcing - SELinux security policy is enforced.
  #     permissive - SELinux prints warnings instead of enforcing.
  #     disabled - No SELinux policy is loaded.
  SELINUX=disabled
  # SELINUXTYPE= can take one of three values:
  #     targeted - Targeted processes are protected,
  #     minimum - Modification of targeted policy. Only selected processes are protected.
  #     mls - Multi Level Security protection.
  SELINUXTYPE=targeted
  $ setenforce 0
  $ getenforce
  Permissive
  ```

## 使用 kubeadm 部署 kubernetes

在每台机器上安装以下的软件包：

- `kubeadm`：用来初始化集群的指令。
- `kubelet`：在集群中的每个节点上用来启动 Pod 和容器等。
- `kubectl`：用来与集群通信的命令行工具。

### 安装Docker

参考[安装Docker](https://buubiu.com/2021/02/01/Docker的基本概念/#Docker的安装)一节安装Docker

### 在线安装kubelet,kubeadm,kubectl

#### Ubuntu/Debian

1. 更新 `apt` 包索引并安装使用 Kubernetes `apt` 仓库所需要的包：

   ```shell
   sudo apt-get update
   sudo apt-get install -y apt-transport-https ca-certificates curl
   ```

2. 下载 Google Cloud 或者 阿里云 公开签名秘钥：

   ```shell
   sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
   ```

   或者

   ```shell
   sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg
   ```

3. 添加 Kubernetes `apt` 仓库 或者 阿里云 仓库：

   ```shell
   echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```
或者
   ```shell
   echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://mirrors.aliyun.com/kubernetes/apt kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. 更新 `apt` 包索引，安装 kubelet、kubeadm 和 kubectl，并锁定其版本(可选)：

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```

#### CentOS/Fedora

1. 使用Google镜像源或者阿里云镜像源安装：

   ```shell
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-\$basearch
   enabled=1
   gpgcheck=1
   repo_gpgcheck=1
   gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
   exclude=kubelet kubeadm kubectl
   EOF
   ```

   或者

   ```shell
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
   
2. yum安装

   - 直接安装最新版本

     ```shell
     sudo yum install -y kubelet kubeadm kubectl
     ```

   - 指定版本安装（有可能最新版本和centos7不兼容）

     ```shell
     #查询可用的版本
     #disablerepo：禁止查看所有
     #enablerepo：只允许查看
     $ yum --disablerepo="*" --enablerepo="kubernetes" list available --showduplicates -y
     
     #1.18.0版本比较稳定，这里安装1.18.0
     $ yum install -y --enablerepo="kubernetes" kubelet-1.18.0-0.x86_64 kubeadm-1.18.0-0.x86_64 kubectl-1.18.0-0.x86_64
     ```

     

#### 无包管理器的系统

1. 安装 CNI 插件（大多数 Pod 网络都需要）：

```bash
CNI_VERSION="v0.8.2"
sudo mkdir -p /opt/cni/bin
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_VERSION}/cni-plugins-linux-amd64-${CNI_VERSION}.tgz" | sudo tar -C /opt/cni/bin -xz
```

2. 定义要下载命令文件的目录。

> **说明：**
>
> `DOWNLOAD_DIR` 变量必须被设置为一个可写入的目录。 如果你在运行 Flatcar Container Linux，可将 `DOWNLOAD_DIR` 设置为 `/opt/bin`。

```bash
DOWNLOAD_DIR=/usr/local/bin
sudo mkdir -p $DOWNLOAD_DIR
```

3. 安装 crictl（kubeadm/kubelet 容器运行时接口（CRI）所需）

```bash
CRICTL_VERSION="v1.17.0"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-amd64.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

4. 安装 `kubeadm`、`kubelet`、`kubectl` 并添加 `kubelet` 系统服务：

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
cd $DOWNLOAD_DIR
sudo curl -L --remote-name-all https://storage.googleapis.com/kubernetes-release/release/${RELEASE}/bin/linux/amd64/{kubeadm,kubelet,kubectl}
sudo chmod +x {kubeadm,kubelet,kubectl}

RELEASE_VERSION="v0.4.0"
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/kubepkg/templates/latest/deb/kubelet/lib/systemd/system/kubelet.service" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /etc/systemd/system/kubelet.service
sudo mkdir -p /etc/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/kubepkg/templates/latest/deb/kubeadm/10-kubeadm.conf" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

### 激活并启动 `kubelet`

```bash
$ systemctl enable --now kubelet
#查看kubelet版本
$ kubelet --version
#查看启动是否成功(到目前不是running正常)
$ systemctl status kubelet
#若启动失败，查看失败原因
$ journalctl -xefu kubelet
```

### 配置kubeadm命令行提示

1. 安装`bash-completion`

```shell
$ yum install -y bash-completion
```

2. 让提示生效

```shell
#编辑 /root/.bashrc 最后追加一下内容
$ vi /root/.bashrc
source /usr/share/bash-completion/bash_completion
source <(kubectl completion bash)
source <(kubeadm completion bash)
$ source /root/.bashrc
```

### 部署集群

#### 初始化master主节点

```bash
$ sudo kubeadm init \
--apiserver-advertise-address=172.16.198.3 \
--image-repository registry.aliyuncs.com/google_containers \
--kubernetes-version v1.18.0 \
--pod-network-cidr 10.244.0.0/16
```

- `--apiserver-advertise-address `指定哪一台机器作为集群的第一台主机
- `--image-repository` 指定镜像站地址
- `--kubernetes-version` 指定k8s的当前版本，跟当前版本一致
- `--pod-network-cidr` 参数与后续 CNI 插件有关，这里以 `flannel` 为例，若后续部署其他类型的网络插件请更改此参数。

执行成功会输出

```shell
...
[addons] Applied essential addon: kube-proxy

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 172.16.198.3:6443 --token rvpzzt.3gwnmotcapinra6q \
    --discovery-token-ca-cert-hash sha256:9728236a9ea68b174d7c34011353b561240260a15f907c18de3a2c7eac9d0647
```

**注意：**

1. token 有效期24小时，过期的话需要用以下命令生成：

   ```shell
   #查看token列表
   [root@server1 ~]# kubeadm token list
   TOKEN                     TTL         EXPIRES                     USAGES                   DESCRIPTION                                                EXTRA GROUPS
   rvpzzt.3gwnmotcapinra6q   18h         2021-04-21T15:23:49+08:00   authentication,signing   The default bootstrap token generated by 'kubeadm init'.   system:bootstrappers:kubeadm:default-node-token
   #生成token
   [root@server1 ~]# kubeadm token create
   W0420 21:21:58.768890   17752 configset.go:202] WARNING: kubeadm cannot validate component configs for API groups [kubelet.config.k8s.io kubeproxy.config.k8s.io]
   yoqnpb.7ycamplku2ya5qre
   [root@server1 ~]#
   ```


##### 配置可查看集群环境命令

要想在控制台查看集群情况，请执行以下命令：

- 如果是Linux管理员可以

```shell
$ export KUBECONFIG=/etc/kubernetes/admin.conf
```

- 如果是Linux普通用户可以

```shell
$ mkdir -p $HOME/.kube
$ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
$ sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

##### 配置网络

因为之前初始化的时候使用的是flannel，所以要配置一下相关网络

1. 新增文件`kube-flannel.yml`（只在主节点就行了）

   https://github.com/flannel-io/flannel/blob/master/Documentation/kube-flannel.yml

   ```yaml
   ---
   apiVersion: policy/v1beta1
   kind: PodSecurityPolicy
   metadata:
     name: psp.flannel.unprivileged
     annotations:
       seccomp.security.alpha.kubernetes.io/allowedProfileNames: docker/default
       seccomp.security.alpha.kubernetes.io/defaultProfileName: docker/default
       apparmor.security.beta.kubernetes.io/allowedProfileNames: runtime/default
       apparmor.security.beta.kubernetes.io/defaultProfileName: runtime/default
   spec:
     privileged: false
     volumes:
     - configMap
     - secret
     - emptyDir
     - hostPath
     allowedHostPaths:
     - pathPrefix: "/etc/cni/net.d"
     - pathPrefix: "/etc/kube-flannel"
     - pathPrefix: "/run/flannel"
     readOnlyRootFilesystem: false
     # Users and groups
     runAsUser:
       rule: RunAsAny
     supplementalGroups:
       rule: RunAsAny
     fsGroup:
       rule: RunAsAny
     # Privilege Escalation
     allowPrivilegeEscalation: false
     defaultAllowPrivilegeEscalation: false
     # Capabilities
     allowedCapabilities: ['NET_ADMIN', 'NET_RAW']
     defaultAddCapabilities: []
     requiredDropCapabilities: []
     # Host namespaces
     hostPID: false
     hostIPC: false
     hostNetwork: true
     hostPorts:
     - min: 0
       max: 65535
     # SELinux
     seLinux:
       # SELinux is unused in CaaSP
       rule: 'RunAsAny'
   ---
   kind: ClusterRole
   apiVersion: rbac.authorization.k8s.io/v1
   metadata:
     name: flannel
   rules:
   - apiGroups: ['extensions']
     resources: ['podsecuritypolicies']
     verbs: ['use']
     resourceNames: ['psp.flannel.unprivileged']
   - apiGroups:
     - ""
     resources:
     - pods
     verbs:
     - get
   - apiGroups:
     - ""
     resources:
     - nodes
     verbs:
     - list
     - watch
   - apiGroups:
     - ""
     resources:
     - nodes/status
     verbs:
     - patch
   ---
   kind: ClusterRoleBinding
   apiVersion: rbac.authorization.k8s.io/v1
   metadata:
     name: flannel
   roleRef:
     apiGroup: rbac.authorization.k8s.io
     kind: ClusterRole
     name: flannel
   subjects:
   - kind: ServiceAccount
     name: flannel
     namespace: kube-system
   ---
   apiVersion: v1
   kind: ServiceAccount
   metadata:
     name: flannel
     namespace: kube-system
   ---
   kind: ConfigMap
   apiVersion: v1
   metadata:
     name: kube-flannel-cfg
     namespace: kube-system
     labels:
       tier: node
       app: flannel
   data:
     cni-conf.json: |
       {
         "name": "cbr0",
         "cniVersion": "0.3.1",
         "plugins": [
           {
             "type": "flannel",
             "delegate": {
               "hairpinMode": true,
               "isDefaultGateway": true
             }
           },
           {
             "type": "portmap",
             "capabilities": {
               "portMappings": true
             }
           }
         ]
       }
     net-conf.json: |
       {
         "Network": "10.244.0.0/16",
         "Backend": {
           "Type": "vxlan"
         }
       }
   ---
   apiVersion: apps/v1
   kind: DaemonSet
   metadata:
     name: kube-flannel-ds
     namespace: kube-system
     labels:
       tier: node
       app: flannel
   spec:
     selector:
       matchLabels:
         app: flannel
     template:
       metadata:
         labels:
           tier: node
           app: flannel
       spec:
         affinity:
           nodeAffinity:
             requiredDuringSchedulingIgnoredDuringExecution:
               nodeSelectorTerms:
               - matchExpressions:
                 - key: kubernetes.io/os
                   operator: In
                   values:
                   - linux
         hostNetwork: true
         priorityClassName: system-node-critical
         tolerations:
         - operator: Exists
           effect: NoSchedule
         serviceAccountName: flannel
         initContainers:
         - name: install-cni
           image: quay.io/coreos/flannel:v0.14.0-rc1
           command:
           - cp
           args:
           - -f
           - /etc/kube-flannel/cni-conf.json
           - /etc/cni/net.d/10-flannel.conflist
           volumeMounts:
           - name: cni
             mountPath: /etc/cni/net.d
           - name: flannel-cfg
             mountPath: /etc/kube-flannel/
         containers:
         - name: kube-flannel
           image: quay.io/coreos/flannel:v0.14.0-rc1
           command:
           - /opt/bin/flanneld
           args:
           - --ip-masq
           - --kube-subnet-mgr
           resources:
             requests:
               cpu: "100m"
               memory: "50Mi"
             limits:
               cpu: "100m"
               memory: "50Mi"
           securityContext:
             privileged: false
             capabilities:
               add: ["NET_ADMIN", "NET_RAW"]
           env:
           - name: POD_NAME
             valueFrom:
               fieldRef:
                 fieldPath: metadata.name
           - name: POD_NAMESPACE
             valueFrom:
               fieldRef:
                 fieldPath: metadata.namespace
           volumeMounts:
           - name: run
             mountPath: /run/flannel
           - name: flannel-cfg
             mountPath: /etc/kube-flannel/
         volumes:
         - name: run
           hostPath:
             path: /run/flannel
         - name: cni
           hostPath:
             path: /etc/cni/net.d
         - name: flannel-cfg
           configMap:
             name: kube-flannel-cfg
   ```

2. 提前下载镜像，防止安装失败(node节点最好也下载)

   ```shell
   docker pull quay.io/coreos/flannel:v0.14.0-rc1
   ```

3. 执行yml配置（只在主节点执行就行了）

   ```shell
   [root@server1 ~]# kubectl apply -f kube-flannel.yml
   podsecuritypolicy.policy/psp.flannel.unprivileged created
   clusterrole.rbac.authorization.k8s.io/flannel created
   clusterrolebinding.rbac.authorization.k8s.io/flannel created
   serviceaccount/flannel created
   configmap/kube-flannel-cfg created
   daemonset.apps/kube-flannel-ds created
   [root@server1 ~]#
   ```

#### 添加node工作节点

在 **另一主机** 重复 **部署集群** 以前的步骤，最后提前下载好flannel镜像，根据提示，加入到集群。

```shell
kubeadm join 172.16.198.3:6443 --token rvpzzt.3gwnmotcapinra6q \
    --discovery-token-ca-cert-hash sha256:9728236a9ea68b174d7c34011353b561240260a15f907c18de3a2c7eac9d0647
```

#### 查看集群情况

在主节点执行以下命令：

```shell
[root@server1 ~]# kubectl get nodes
NAME      STATUS   ROLES    AGE     VERSION
server1   Ready    master   5h48m   v1.18.0
server2   Ready    <none>   21s     v1.18.0
server3   Ready    <none>   12s     v1.18.0
[root@server1 ~]# kubectl get pod --all-namespaces
NAMESPACE     NAME                              READY   STATUS    RESTARTS   AGE
kube-system   coredns-7ff77c879f-7x5lm          1/1     Running   2          5h55m
kube-system   coredns-7ff77c879f-pwblv          1/1     Running   2          5h55m
kube-system   etcd-server1                      1/1     Running   2          5h55m
kube-system   kube-apiserver-server1            1/1     Running   2          5h55m
kube-system   kube-controller-manager-server1   1/1     Running   2          5h55m
kube-system   kube-flannel-ds-6qgbz             1/1     Running   0          7m38s
kube-system   kube-flannel-ds-79dws             1/1     Running   0          7m47s
kube-system   kube-flannel-ds-sjp2z             1/1     Running   2          3h32m
kube-system   kube-proxy-jk4wp                  1/1     Running   0          7m47s
kube-system   kube-proxy-s4vfp                  1/1     Running   0          7m38s
kube-system   kube-proxy-vkwth                  1/1     Running   2          5h55m
kube-system   kube-scheduler-server1            1/1     Running   3          5h55m
[root@server1 ~]#
```

## 执行报错集合

报错

```shell
[root@server2 ~]# kubeadm join 172.16.198.3:6443 --token rvpzzt.3gwnmotcapinra6q     --discovery-token-ca-cert-hash sha256:9728236a9ea68b174d7c34011353b561240260a15f907c18de3a2c7eac9d0647
W0420 21:10:51.619387    9540 join.go:346] [preflight] WARNING: JoinControlPane.controlPlane settings will be ignored when control-plane flag is not set.
[preflight] Running pre-flight checks
	[WARNING IsDockerSystemdCheck]: detected "cgroupfs" as the Docker cgroup driver. The recommended driver is "systemd". Please follow the guide at https://kubernetes.io/docs/setup/cri/
	[WARNING SystemVerification]: this Docker version is not on the list of validated versions: 20.10.6. Latest validated version: 19.03
error execution phase preflight: [preflight] Some fatal errors occurred:
	[ERROR FileContent--proc-sys-net-ipv4-ip_forward]: /proc/sys/net/ipv4/ip_forward contents are not set to 1
[preflight] If you know what you are doing, you can make a check non-fatal with `--ignore-preflight-errors=...`
To see the stack trace of this error execute with --v=5 or higher
```

​	解决

```shell
[root@server2 ~]# kubeadm reset
[root@server2 ~]# echo 1 > /proc/sys/net/ipv4/ip_forward
```

----
