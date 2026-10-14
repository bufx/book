# Nexus3介绍与安装

## Nexus介绍

目前 Nexus 分为 Nexus 2 和 Nexus 3 两个大版本，它们是并行的关系。与 Nexus 2 相比，Nexus 3 具有很多优势，例如支持更多的仓库格式（docker)、优化了用户的使用界面以及更加强大的搜索功能等等。这里介绍nexus3版本。


## 启动 Nexus 容器

容器挂载目录需要提前拷贝出来，然后在删除重启

```sh
$ docker run -d --name nexus3 \
    -p 8081:8081 \
    -v nexus-data:/nexus-data \
    sonatype/nexus3
```

首次运行需等待 3-5 分钟，你可以使用 `docker logs nexus3 -f` 查看日志：

```sh
$ docker logs -f nexus3

2021-12-16 09:31:12,339+0800 INFO  [jetty-main-1] *SYSTEM org.sonatype.nexus.bootstrap.jetty.JettyServer - 

-------------------------------------------------

Started Sonatype Nexus OSS 3.37.0-01

-------------------------------------------------
```

如果你看到以上内容，说明 `Nexus` 已经启动成功，你可以使用浏览器打开 `http://YourIP:8081` 访问 `Nexus` 了。

首次运行请通过以下命令获取初始密码，或者看挂在目录文件也可以(`/nexus-data/admin.password`)：

```sh
$ docker exec nexus3 cat /nexus-data/admin.password

c0f6a2f2-b617-40fa-878e-82da37beeeb5
```

首次启动 Nexus 的默认帐号是 `admin` ，密码则是上边命令获取到的，点击右上角登录，首次登录需更改初始密码。