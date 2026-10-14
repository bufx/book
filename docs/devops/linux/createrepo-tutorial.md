# Linux中createrepo自建仓库教程

## 了解如何获取RPM包

在默认配置下使用yum命令安装完软件后安装包是不会保留的，如果想在本地也留存一份安装包，只需要将yum配置文件/etc/yum.conf中的keepcache=0改为1即可，这样安装包都会留存在cachedir所指定的目录中，如下：

```sh
$ cat /etc/yum.conf 
[main]
cachedir=/var/cache/yum/$basearch/$releasever
keepcache=0
debuglevel=2
logfile=/var/log/yum.log
exactarch=1
obsoletes=1
gpgcheck=1
plugins=1
installonly_limit=5
bugtracker_url=http://bugs.centos.org/set_project.php?project_id=23&ref=http://bugs.centos.org/bug_report_page.php?category=yum
distroverpkg=centos-release
```

该目录下还会根据不同的yum源创建不同的目录，软件包通过哪个源安装的就会保存在哪个目录中，同时相关依赖包也会自动下载，需要注意的如果执行了`yum clean all`的话是会删除掉这些安装包的：

```sh
$ ll
总用量 8
drwxr-xr-x. 4 root root 278 4月  14 16:20 base
drwxr-xr-x. 4 root root 183 4月  14 16:20 extras
-rw-r--r--. 1 root root  79 4月  14 16:21 timedhosts
-rw-r--r--. 1 root root 451 4月  14 16:20 timedhosts.txt
drwxr-xr-x. 4 root root 183 4月  14 16:20 updates
$ pwd
/var/cache/yum/x86_64/7
```

如果仅仅只是想下载软件包而不进行安装，只需要加--downloadonly选项即可，示例:

```sh
$ yum install httpd --downloadonly --downloaddir=/data/packages
```

详细用法见：[Centos下载rpm全量依赖包的方式](./Centos下载rpm全量依赖包的方式.md)

## 自建YUM本地仓库

1. 首先建立一个目录用于存放安装包，然后使用createrepo来创建repository仓库，如果系统里没有该命令的话需要先进行createrepo的安装

```sh
$ mkdir /opt/yum/repo
$ yum -y install createrepo
$ createrepo /opt/yum/repo  #将该目录制作成软件仓库
```

2. 命令执行成功后会在该目录下创建一个repodata目录

```sh
$ createrepo /opt/yum/repo
Saving Primary metadata
Saving file lists metadata
Saving other metadata
Generating sqlite DBs
Sqlite DBs complete
$ ll /opt/yum/repo/
总用量 4
drwxr-xr-x. 2 root root 4096 4月  14 16:29 repodata
```

3. 创建.repo配置文件指向到本地仓库的路径，注意文件名一定要是.repo结尾

```sh
# 文件内不要有中文
# name: yum仓库的名字
# baseurl: 仓库路径，由于是放在本地的只能用file协议而不是http
# enabled: 开启该仓库
# gpgcheck: 不做gpg检查
$ vi /etc/yum.repos.d/buubiu.repo
[buubiu]
name=buubiu
baseurl=file:///opt/yum/repo
enabled=1
gpgcheck=0
```

4. 通过 `yum repolist` 命令查看仓库及包的数量，可以看到创建的buubiu仓库已经加载，而由于我们没有在目录中存放任何的rpm包，所以显示数量为0

```sh
$ yum repolist
已加载插件：fastestmirror
Loading mirror speeds from cached hostfile
 * base: mirrors.dgut.edu.cn
 * extras: mirrors.dgut.edu.cn
 * updates: mirrors.dgut.edu.cn
buubiu                                                                                                                                | 2.9 kB  00:00:00     
buubiu/primary_db                                                                                                                     | 1.1 kB  00:00:00     
源标识                                                                    源名称                                                                       状态
base/7/x86_64                                                             CentOS-7 - Base                                                              10,072
buubiu                                                                    buubiu                                                                            0
extras/7/x86_64                                                           CentOS-7 - Extras                                                               509
updates/7/x86_64                                                          CentOS-7 - Updates                                                            3,732
repolist: 14,313
```

## 创建YUM远程仓库

在第二步的操作中只是在本地建立了一个YUM仓库，这样别人是无法使用的。所以通常会在计划任务中把公网YUM源同步到本地（推荐使用reposync），同步后再执行一次createrepo更新元数据，最后把仓库目录通过FTP或者Nginx、Apache、NFS服务等共享出来，然后客户端的配置文件中修改如下：

```sh
$ vi /etc/yum.repos.d/buubiu.repo
[buubiu]
name=buubiu
baseurl=http://127.0.0.1
enabled=1
gpgcheck=0
```

