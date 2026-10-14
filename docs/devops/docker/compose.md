# Docker Compose使用

## 简介

`Compose` 项目是 Docker 官方的开源项目，负责实现对 Docker 容器集群的快速编排。从功能上看，跟 `OpenStack` 中的 `Heat` 十分类似。

其代码目前在 https://github.com/docker/compose 上开源。

`Compose` 定位是 「定义和运行多个 Docker 容器的应用（Defining and running multi-container Docker applications）」，其前身是开源项目 Fig。

通过第一部分中的介绍，我们知道使用一个 `Dockerfile` 模板文件，可以让用户很方便的定义一个单独的应用容器。然而，在日常工作中，经常会碰到需要多个容器相互配合来完成某项任务的情况。例如要实现一个 Web 项目，除了 Web 服务容器本身，往往还需要再加上后端的数据库服务容器，甚至还包括负载均衡容器等。

`Compose` 恰好满足了这样的需求。它允许用户通过一个单独的 `docker-compose.yml` 模板文件（YAML 格式）来定义一组相关联的应用容器为一个项目（project）。


`Compose` 中有两个重要的概念：

- 服务 (`service`)：一个应用的容器，实际上可以包括若干运行相同镜像的容器实例。
- 项目 (`project`)：由一组关联的应用容器组成的一个完整业务单元，在 `docker-compose.yml` 文件中定义。

`Compose` 的默认管理对象是项目，通过子命令对项目中的一组容器进行便捷地生命周期管理。

`Compose` 项目由 Python 编写，实现上调用了 Docker 服务提供的 API 来对容器进行管理。因此，只要所操作的平台支持 Docker API，就可以在其上利用 `Compose` 来进行编排管理。

## 安装与卸载

### linux

在 Linux 上的也安装十分简单，从 官方 GitHub Release 处直接下载编译好的二进制文件即可。例如，在 Linux 64 位系统上直接下载对应的二进制包。

```bash
$ sudo curl -L https://github.com/docker/compose/releases/download/1.25.5/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
```

### macos、window

Compose 可以通过 Python 的包管理工具 pip 进行安装，也可以直接下载编译好的二进制文件使用，甚至能够直接在 Docker 容器中运行。`Docker Desktop for Mac/Windows 自带 docker-compose 二进制文件，安装 Docker 之后可以直接使用`。

### bash命令补全通用下载

```shell
$ curl -L https://raw.githubusercontent.com/docker/compose/1.25.5/contrib/completion/bash/docker-compose > /etc/bash_completion.d/docker-compose
```

### 卸载

- 如果是二进制包方式安装的，删除二进制文件即可。

```shell
$ sudo rm /usr/local/bin/docker-compose
```

### 测试安装成功

```shell
$ docker-compose --version
 docker-compose version 1.27.4, build 40524192
```

## docker compose入门

### 两个重要概念

- 项目 (`project`)：有多个服务共同组成一个完整业务单元，定义在docker-compose.yml文件中

- 服务 (`service`)：一个服务对应一个应用容器，一个项目中可以存在多个服务

### 第一个docker-compose程序

1. 在一个空目录中创建一个docker-compose.yml文件

2. 在配置文件中定义一个项目存在哪些服务

   ```yaml
   version: "3.0" #定义版本，官方要求，最高为4.0
   services: #所有的服务
     tomcat: #服务名，唯一
       image: tomcat:8.0-jre8 #创建当前这个服务使用哪个镜像
       ports: #映射端口，是个数组
         - 8080:8080
   ```

3. 运行docker-compose

   **注意：必须保障运行命令的目录存在docker-compose.yml**

   ```shell
   docker-compose up #启动这个项目的所有服务
   docker-compose up -d #后台启动这个项目的所有服务
   ```

## docker-compose模版文件

模板文件是使用 `Compose` 的核心，涉及到的指令关键字也比较多。这里面大部分指令跟 `docker run` 相关参数的含义都是类似的。

### container-name

指定容器名称。默认将会使用 `项目名称_服务名称_序号` 这样的格式。

```yaml
container_name: tomcat01
```

> 注意: 指定容器名称后，该服务将无法进行扩展（scale），因为 Docker 不允许多个容器具有相同的名称。

### image

指定镜像名称或者镜像ID或者镜像摘要。如果镜像在本地不存在，`Compose` 将会尝试拉取这个镜像。

```yaml
image: tomcat
image: tomcat:8.0
image: a4j32def
```

### ports

暴漏端口信息。使用 **宿主机端口:容器端口** 格式，或者仅仅指定容器的端口（宿主将会随机选择端口）都可以。

```yaml
ports:
 - "3000"
 - "8000:8000"
 - "49100:22"
 - "127.0.0.1:8001:8001"
```

> 注意：当使用 **宿主机端口:容器端口** 格式来映射端口时，如果你使用的容器端口小于 60 并且没放到引号里，可能会得到错误结果，因为 `YAML` 会自动解析 `xx:yy` 这种数字格式为 60 进制。为避免出现这种问题，建议数字串都采用引号包括起来的字符串格式。

### volumes

数据卷所挂载路径设置。可以设置为宿主机路径(`HOST:CONTAINER`)或者数据卷名称(`VOLUME:CONTAINER`)，并且可以设置访问模式 （`HOST:CONTAINER:ro`）。

该指令中路径支持相对路径。

```yaml
volumes:
 - /root/mysqldata:/var/lib/mysql
 - cache:/tmp/cache
 - ~/configs:/etc/configs/:ro
```

如果路径为数据卷名称，必须在文件中配置数据卷。

```yaml
version: "3.0"

service:
  tomcat01: #服务名称
    volumes: #完成宿主机与容器中的目录做数据卷挂载 相当于 run -v
      - /root/apps:/usr/local/tomcat/webapps #使用自定义路径映射
      - tomcatwebapps01:/usr/local/tomcat/webapps #使用自动创建卷名映射，但前提需要用指令‘volume’在下面声明这个卷名
      
volumes: #声明上面服务所使用的自动创建卷名
  tomcatwebapps01: #声明指令的卷名 compose自动创建该卷名，但是卷名之前会自动加上项目名（当前目录名），若要使用自定义卷名，需要使用命令‘external‘
    external: #使用自定义卷名
      true #true：确定使用指定卷名，但是前提需要先手动用‘docker volume create xxx’ 创建卷名，否则启动报错
```

### networks

配置容器连接的网络。

```yaml
version: "3.0"

service:
  tomcat01: #服务名称
    image: tomcat:8.0-jre8 #使用哪个镜像 相当于 run image
    networks: #代表当前服务使用哪个网络桥
      - hello #跟volumes类似，前提需要用指令‘networks’在下面声明这个卷名
      
networks: #定义服务用到的网络桥
  hello: #定义上面的服务用到的网桥名称 默认创建的是bridge,但是卷名之前会自动加上项目名（当前目录名），若要使用自定义卷名，需要使用命令‘external‘
    external: #使用自定义网桥名
      true: #true：确定使用指定网桥，但是前提需要先手动用‘docker network create hello’ 创建卷名，否则启动报错
```

### environment

设置环境变量。可以使用数组`key:value`或字典`-key=value`两种格式。

只写环境变量的名称，则Compose会自动获取宿主机上对应的环境变量的值，可以用来防止泄露不必要的数据。

```yaml
environment:
  MYSQL_ROOT_PASSWORD: root
  MYSQL_ROOT_PASSWORD:
  IS_ENABLE: "yes"
#或者
environment:
  - MYSQL_ROOT_PASSWORD=root
  - MYSQL_ROOT_PASSWORD
  - IS_ENABLE="yes"
```

如果变量名称或者值中用到 `true|false，yes|no` 等表达 [布尔](https://yaml.org/type/bool.html) 含义的词汇，最好放到引号里，避免 YAML 自动解析某些内容为对应的布尔语义。这些特定词汇，包括

```bash
y|Y|yes|Yes|YES|n|N|no|No|NO|true|True|TRUE|false|False|FALSE|on|On|ON|off|Off|OFF
```

### command

覆盖容器启动后默认执行的命令

```yaml
command: echo "hello world"
```

### env_file

从文件中获取环境变量，可以为单独的文件路径或列表，支持相对路径和绝对路径

如果有变量名称与 `environment` 指令冲突，则按照惯例，以后者为准。

```yaml
env_file: .env

env_file:
  - ./mysql.env
  - ./apps/mysql.env
  - /opt/mysql.env
```

环境变量文件中每一行必须符合格式，支持 `#` 开头的注释行。

```bash
# mysql.env: Set development environment
MYSQL_ROOT_PASSWORD=root
```

### depends_on

解决容器的依赖、启动先后的问题。以下例子中会先启动 `tomcat02` `redis` `mysql` 再启动 `tomcat01`

```yaml
version: "3.0"

service:
  tomcat01: 
    image: tomcat:8.0-jre8 
    depends_on: #代表这个容器必须依赖哪些容器启动之后才能启动
      - tomcat02 #这里是服务名，不是容器名
      - redis
      - mysql
      
  tomcat02:
    image: tomcat:8.0-jre8
      
  mysql:
    image: mysql:5.7.32
      
  redis:
    image: reids:5.0.10
```

> 注意：`tomcat02` 服务不会等待 `tomcat02` `redis` `mysql`「完全启动」之后才启动。

### healthcheck

通过命令检查容器是否健康运行。

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost"]
  interval: 1m30s
  timeout: 10s
  retries: 3
```

### sysctls

配置容器内核参数，可以使用数组`key:value`或字典`-key=value`两种格式。

用来修改容器中系统内部参数，并不是必须的，有些服务启动会受容器内操作系统参数限制，可能会无法启动，所以必须通过修改容器中参数才能启动。

```yaml
sysctls:
  net.core.somaxconn: 1024
  net.ipv4.tcp_syncookies: 0
#或者
sysctls:
  - net.core.somaxconn=1024
  - net.ipv4.tcp_syncookies=0
```

### ulimits

指定容器的 ulimits 限制值。

用来修改容器中系统内部进程数限制，日后使用时可以根据当前容器运行的服务要求镜像修改。

例如，es指定最大进程数为 65535，指定文件句柄数为 20000（软限制，应用可以随时修改，不能超过硬限制） 和 40000（系统硬限制，只能 root 用户提高）。

```yaml
  ulimits:
    nproc: 65535
    nofile:
      soft: 20000
      hard: 40000
```

### build

指定`Dockerfile`所在文件夹的路径（可以是绝对路径或者相对`docker-compose.yml`文件的路径）。Compose将会利用它自动构建这个镜像，然后使用这个镜像。

使用 `context` 指令指定 `Dockerfile` 所在文件夹的路径。

使用 `dockerfile` 指令指定 `Dockerfile` 文件名。

```yaml
version: "3.0"

service:

  demo:
    build: #启动服务时先将build命令中指定的Dockerfile打包成镜像，再运行容器
      context: ./demo #指定上下文目录Dockerfile所在目录，相对docker-compose.yml的路径，或者绝对路径
      dockerfile: Dockerfile #指定Dockerfile文件名
    container_name: demo #指定容器名称
    ports: #指定端口
      - "8082:8082"
    networks:
      - hello
    depends_on: #依赖哪些服务
      - tomcat01
```




### 完整的简单模版文件

`docker-compose.yml`

```yaml
version: "3.0" #https://docs.docker.com/compose/compose-file/ 目前最高3.8

service:

  demo:
    build: #启动服务时先将build命令中指定的Dockerfile打包成镜像，再运行容器
      context: demo #指定上下文目录Dockerfile所在目录，相对docker-compose.yml的路径，或者绝对路径
      dockerfile: Dockerfile #指定Dockerfile文件名
    container_name: demo #指定容器名称
    ports: #指定端口
      - "8082:8082"
    networks:
      - hello
    depends_on:
      - tomcat01
      
  tomcat01: #服务名称
    container_name: tomcat01 #相当于 run --name
    image: tomcat:8.0-jre8 #使用哪个镜像 相当于 run image
    ports: #用来完成宿主机与容器的端口映射 相当于 run -p
      - "8080:8080"
    volumes: #完成宿主机与容器中的目录做数据卷挂载 相当于 run -v
      - /root/apps:/usr/local/tomcat/webapps #使用自定义路径映射
      - tomcatwebapps01:/usr/local/tomcat/webapps #使用自动创建卷名映射，但前提需要用指令‘volumes’在下面声明这个卷名
    networks: #代表当前服务使用哪个网络桥
      - hello #跟volumes类似，前提需要用指令‘networks’在下面声明这个卷名
    depends_on: #代表这个服务必须依赖哪些服务启动之后才能启动
      - tomcat02 #这里是服务名，不是容器名
      - redis
      - mysql
    healthcheck: #用来检查容器是否健康运行
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 1m30s
      timeout: 10s
      retries: 3
    sysctls: #配置容器内核参数
      - net.core.somaxconn=1024
      - net.ipv4.tcp_syncookies=0
    ulimits: #指定容器的 ulimits 限制值
      nproc: 65535
      nofile:
        soft: 20000
        hard: 40000
      
  tomcat02:
    container_name: tomcat02
    image: tomcat:8.0-jre8
    ports: 
      - "8081:8080"
    volumes:
      - tomcatwebapps02:/usr/local/tomcat/webapps 
    networks:
      - hello
      
  mysql:
    container_name: mysql
    image: mysql:5.7.32
    ports: 
      - "3306:3306"
    volumes:
      - mysqldata:/var/lib/mysql
      - mysqlconf:/etc/mysql
    networks:
      - hello 
    environment: #配置环境变量 相当于 run -e
      - MYSQL_ROOT_PASSWORD=root
    env_file: #用来将environment环境中的配置放入到指定配置文件中，支持绝对路径和相对路径
      - mysql.evn #当前目录下
      
  redis:
    container_name: redis
    image: reids:5.0.10
    ports: 
      - "6379:6379"
    volumes:
      - redisdata:/data
    networks:
      - hello
    command: "redis-server --appendonly yes" #覆盖容器启动后运行的默认命令
      
volumes: #声明上面服务所使用的自动创建卷名
  tomcatwebapps01: #声明指令的卷名 compose自动创建该卷名，但是卷名之前会自动加上项目名（当前目录名），若要使用自定义卷名，需要使用命令‘external‘
  external: #使用自定义卷名
    true #true：确定使用指定卷名，但是前提需要先手动用‘docker volume create tomcatwebapps01’ 创建卷名，否则启动报错
    tomcatwebapps02:
    mysqldata:
    mysqlconf:
    
networks: #定义服务用到的网络桥
  hello: #定义上面的服务用到的网桥名称 默认创建的是bridge,但是卷名之前会自动加上项目名（当前目录名），若要使用自定义卷名，需要使用命令‘external‘
    external: #使用自定义网桥名
      true: #true：确定使用指定网桥，但是前提需要先手动用‘docker network create hello’ 创建卷名，否则启动报错
```

## docker-compose 常用指令

### 模版指令和指令的区别

- **模版指令：**用来书写在docker-compose.yml文件中的指令称之为模版指令 用来为项目中的**服务**进行操作的。
- **指令：**用来对整个docker-compose.yml对应的这个**项目**操作，书写docker-compose命令之后的命令。

#### 命令对象与格式

对于 Compose 来说，大部分命令的对象既可以是项目本身，也可以指定为项目中的服务或者容器。如果没有特别的说明，命令对象将是项目，这意味着项目中所有的服务都会受到命令影响。

执行 `docker-compose [COMMAND] --help` 或者 `docker-compose help [COMMAND]` 可以查看具体某个命令的使用格式。

`docker-compose` 命令的基本的使用格式是

```bash
docker-compose [-f=<arg>...] [options] [COMMAND] [ARGS...]
```

#### 命令选项

- `-f, --file FILE` 指定使用的 Compose 模板文件，默认为 `docker-compose.yml`，可以多次指定。
- `-p, --project-name NAME` 指定项目名称，默认将使用所在目录名称作为项目名。
- `--x-networking` 使用 Docker 的可拔插网络后端特性
- `--x-network-driver DRIVER` 指定网络后端的驱动，默认为 `bridge`
- `--verbose` 输出更多调试信息。
- `-v, --version` 打印版本并退出。

### 常用命令

#### up

用来启动所有docker-compose服务

格式为 `docker-compose up [options] [SERVICE...]`。

- 该命令十分强大，它将尝试自动完成包括构建镜像，（重新）创建服务，启动服务，并关联服务相关容器的一系列操作。

- 链接的服务都将会被自动启动，除非已经处于运行状态。

- 可以说，大部分时候都可以直接通过该命令来启动一个项目。

- 默认情况，`docker-compose up` 启动的容器都在前台，控制台将会同时打印所有容器的输出信息，可以很方便进行调试。

- 当通过 `Ctrl-C` 停止命令时，所有容器将会停止。

- 如果使用 `docker-compose up -d`，将会在后台启动并运行所有的容器。一般推荐生产环境下使用该选项。

- 默认情况，如果服务容器已经存在，`docker-compose up` 将会尝试停止容器，然后重新创建（保持使用 `volumes-from` 挂载的卷），以保证新启动的服务匹配 `docker-compose.yml` 文件的最新内容

#### down

用来关闭所有docker-compose服务，如果网络不是自定义创建的，会一并移除。

格式为`docker-compose down [SERVICE...]`

#### exec

进入指定容器

格式为：`docker-compose exec SERVICE bash`

#### ps

列出项目中目前的所有容器

格式为 `docker-compose ps [options] [SERVICE...]`

选项：

- `-q` 只打印容器的 ID 信息。

#### restart

重启项目中的服务，如果不写服务ID，默认重启所有服务

格式为 `docker-compose restart [options] [SERVICE...]`

选项：

- `-t, --timeout TIMEOUT` 指定重启前停止容器的超时（默认为 10 秒）。

#### rm

删除所有（停止状态的）服务容器。推荐先执行 `docker-compose stop` 命令来停止容器。

格式为 `docker-compose rm [options] [SERVICE...]`

选项：

- `-f, --force` 强制直接删除，包括非停止状态的容器。一般尽量不要使用该选项。
- `-v` 删除容器所挂载的数据卷，**谨慎操作**。

#### start

启动项目中的服务

格式为 `docker-compose start [SERVICE...]`

#### stop

停止已经处于运行状态的容器，但不删除它。通过 `docker-compose start` 可以再次启动这些容器

格式为 `docker-compose stop [options] [SERVICE...]`

选项：

- `-t, --timeout TIMEOUT` 停止容器时候的超时（默认为 10 秒）。

#### top

查看某个容器内运行的进程

格式为`docker-compose top [SERVICE...]`

#### pause

暂停项目中某个服务

格式为`docker-compose pause [SERVICE...]`

#### uppause

恢复处于暂停状态中的服务。

格式为 `docker-compose unpause [SERVICE...]`

#### logs

查看项目中服务的日志

格式为`docker-compose logs [options] [SERVICE...]`

选项：

- `-f`  滚动查看日志