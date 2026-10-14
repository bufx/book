# Docker中的数据卷配置

##  数据卷作用

用来实现容器与宿主机之间数据共享

##  数据卷特点

`数据卷` 是一个可供一个或多个容器使用的特殊目录，它绕过 UFS，可以提供很多有用的特性：

- `数据卷` 可以在容器之间共享和重用
- 对 `数据卷` 的修改会立马生效，双向都生效
- 对 `数据卷` 的更新，不会影响镜像，只影响容器
- `数据卷` 默认会一直存在，即使容器被删除

> 注意：`数据卷` 的使用，类似于 Linux 下对目录或文件进行 mount，镜像中的被指定为挂载点的目录中的文件会复制到数据卷中（仅数据卷为空时会复制）。


##  数据卷操作

###  自定义数据卷目录

**注意：**宿主机目录会覆盖容器内目录内容

```dockerfile
docker run -v 宿主机绝对目录:容器内绝对目录 容器名称｜容器ID
docker run -v 宿主机绝对目录:容器内绝对目录:ro 容器名称｜容器ID #ro代表容器内目录只读
  例如：docker run -d -p 8080:8080 --name myTomcat -v /root/apps:/usr/local/tomcat/webapps tomcat
```

###  自动数据卷目录

**注意：**这种方式会在docker运行容器时自动在宿主机中创建一个目录,并将容器目录文件复制到宿主机中

```dockerfile
docker run -v 卷名(任意别名):容器内绝对路径 	容器名称｜容器ID
docker run -v 卷名(任意别名):容器内绝对路径:ro 	容器名称｜容器ID #ro代表容器内目录只读
#例如：docker run -d -p 8080:8080 --name myTomcat -v aa:/usr/local/tomcat/webapps tomcat
```

###  容器内部执行的流程

1. aa代表一个数据卷名称，名称可以随便写，docker在发现aa目录不存在时，会自动创建这个数据卷，并自动映射宿主机某个目录

2. 同时在启动容器时会将aa对应容器目录中全部内容复制到aa映射到目录中

3. 这个aa目录在宿主机：/var/lib/docker/volumes/aa/_data

##  Docker操作数据卷

###  查看数据卷

```dockerfile
docker volume ls
```

###  查看数据卷详情

```dockerfile
docker volume inspect 卷名
#或者
docker inspect 卷名
```

###  创建数据卷

```dockerfile
docker volume create 卷名
```

###  删除数据卷

```dockerfile
#删除没有使用的所有数据卷
docker volume prune
#删除指定的数据卷
docker volume rm 卷名
```

