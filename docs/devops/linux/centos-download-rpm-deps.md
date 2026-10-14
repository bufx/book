# Centos下载rpm全量依赖包的方式

## 介绍

通常生产环境由于安全原因都无法访问互联网。此时就需要进行离线安装，主要有两种方式：源码编译、rpm包安装。源码编译耗费时间长且缺乏编译环境，所以一般都选择使用离线 rpm 包安装。

## 验证环境

Red Hat 8.4 ，用的 Centos8 的 yum 源

## 查看依赖包

语法：`yum deplist NAME`

例如:

```sh
$ yum deplist tar
package: tar-2:1.30-5.el8.x86_64
  dependency: /bin/sh
   provider: bash-4.4.20-1.el8_4.x86_64
  dependency: /sbin/install-info
   provider: info-6.5-6.el8.x86_64
  dependency: libacl.so.1()(64bit)
   provider: libacl-2.2.53-1.el8.x86_64
  dependency: libacl.so.1(ACL_1.0)(64bit)
   provider: libacl-2.2.53-1.el8.x86_64
  dependency: libc.so.6(GLIBC_2.17)(64bit)
   provider: glibc-2.28-151.el8.x86_64
  dependency: libselinux.so.1()(64bit)
   provider: libselinux-2.9-5.el8.x86_64
  dependency: rtld(GNU_HASH)
   provider: glibc-2.28-151.el8.i686
   provider: glibc-2.28-151.el8.x86_64
```

## 下载依赖包

### repotrack(推荐)

**只下载不安装**

1. 安装 `yum-utils`（repotrack命令在此包中)

   ```sh
   $ yum -y install yum-utils
   ```

2. 下载 `tar`依赖包

   ```sh
   # --destdir 指定下载目录（不指定时，默认为当前目录）
   $ repotrack tar --destdir=/opt/rpm
   ```

### yumdownloader

**只下载不安装**


1. 安装 `yum-utils`（yumdownloader命令在此包中)

   ```sh
   $ yum -y install yum-utils
   ```

2. 下载 `tar`依赖包

   ```sh
   # --destdir 指定下载目录（不指定时，默认为当前目录）
   # --resolve 下载依赖的 rpm 包（不指定时，默认只下载 tar 包)
   $ yumdownloader tar --resolve --destdir=/opt/rpm
   ```


>仅会将主软件包和基于你现在的操作系统所缺少的依赖关系包一并下载。
>
>若想 像 repotrack 下载全量的，请使用下面命令：
>
>```sh
>$ yumdownloader tar --resolve --installroot=/opt/rpm --destdir=/opt/rpm --releasever=/
>```

### downloadonly

**只下载不安装**


1. 安装 `yum-download`

   ```sh
   $ yum -y install yum-download
   ```

2. 下载 `tar`依赖包

   ```sh
   $ yum -y install tar --downloadonly --downloaddir=/opt/rpm
   ```
>与 yumdownloader 命令一样，也是仅会将主软件包和基于你现在的操作系统所缺少的依赖关系包一并下载。
>
>若想 像 repotrack 下载全量的，请使用下面命令：
>
>```sh
>$ yum -y install tar --downloadonly --downloaddir=/opt/rpm  --installroot=/opt/rpm --destdir=/opt/rpm --releasever=/
>```


## 离线安装 rpm

```sh
# 忽略依赖安装
$ rpm -Uvh --force --nodeps *.rpm
```

