# seata支持nacos注册中心和配置中心

Seata支持注册服务到Nacos，以及支持Seata所有配置放到Nacos配置中心，在Nacos中统一维护；

具体步骤如下：

## 项目里添加nacos-client依赖

只需要在seata-common公共模块项目里添加maven依赖，其他子模块都有了，方便；

```xml pom.xml
<dependency>
  <groupId>com.alibaba.nacos</groupId>
  <artifactId>nacos-client</artifactId>
</dependency>
```

## 集成Nacos注册中心

### seata的TM和RM修改配置

seata-order/seata-account/seata-web子项目 `application.yml`配置改下，主要修改服务分组和集群分组的配置：

把：

```yaml application.yml
seata:
  service:
    vgroup-mapping: 
      my_test_tx_group: default
    grouplist: 
      default: 127.0.0.1:8091
    enable-degrade: false
    disable-global-transaction: false
```

改为：

```yaml application.yml
seata:
  registry:
    type: nacos
    nacos:
      application: seata-server #seata-server端注册到nacos上到名称
      server-addr: 127.0.0.1:8848
      group: "SEATA_GROUP"
      namespace: "9961be45-128a-4e89-a16b-646131fb2c3a"
      username: ""
      password: ""
      cluster: "default"
```

### seata-server端修改配置

在`registry.conf`中修改registry-type为nacos，并且修改相应的nacos信息

```sh registry.conf
registry {
  # file 、nacos 、eureka、redis、zk、consul、etcd3、sofa
  type = "nacos"

  nacos {
    application = "seata-server"
    serverAddr = "127.0.0.1:8848"
    group = "SEATA_GROUP"
    namespace = "9961be45-128a-4e89-a16b-646131fb2c3a"
    cluster = "default"
    username = ""
    password = ""
  }
 }
```

## 集成Nacos配置中心

### seata的TM和RM修改配置

seata-order/seata-account/seata-web子项目 `application.yml`配置添加config信息：

```yaml application.yml
seata:
  registry:
    type: nacos
    nacos:
      application: seata-server #seata-server端注册到nacos上到名称
      server-addr: 127.0.0.1:8848
      group: "SEATA_GROUP"
      namespace: "9961be45-128a-4e89-a16b-646131fb2c3a"
      username: ""
      password: ""
      cluster: "default"
  config:
    nacos:
      server-addr: 127.0.0.1:8848
      group: "SEATA_GROUP"
      namespace: "9961be45-128a-4e89-a16b-646131fb2c3a"
      username: ""
      password: ""
```

### seata-server端修改配置

在`registry.conf`中修改config-type为nacos，并且修改相应的nacos信息

```sh registry.conf
config {
  # file、nacos 、apollo、zk、consul、etcd3
  type = "nacos"

  nacos {
    serverAddr = "127.0.0.1:8848"
    namespace = "9961be45-128a-4e89-a16b-646131fb2c3a"
    group = "SEATA_GROUP"
    username = ""
    password = ""
  }
}
```

## 初始化seata配置

作为Nacos配置中心，需要把seata的一些配置上传到Nacos，配置比较多，官方给了一个config.txt，修改后，通过脚本上传到Nacos。

### 下载config.txt

下载地址：[config.txt](https://github.com/seata/seata/blob/1.4.2/script/config-center/config.txt)

### 修改部分配置

```properties config.txt
......
service.vgroupMapping.my_test_tx_group=default
service.default.grouplist=127.0.0.1:8091
service.enableDegrade=false
service.disableGlobalTransaction=false
......
store.mode=db
......
store.db.url=jdbc:mysql://127.0.0.1:3306/db_seata?useUnicode=true&rewriteBatchedStatements=true
store.db.user=root
store.db.password=root
```

### 执行初始化脚本

nacos提供了执行脚本：[nacos-config.sh](https://github.com/seata/seata/blob/1.4.2/script/config-center/nacos/nacos-config.sh)

执行命令：

```sh
sh nacos-config.sh -h localhost -p 8848 -g SEATA_GROUP -t 9961be45-128a-4e89-a16b-646131fb2c3a -u username -w password
```

参数说明：

-h：host，nacos的地址，默认值是localhost。

-p：端口，nacos的端口，默认值为8848。

-g：配置分组，默认值为"seata_group"。

-t：租户信息，对应于NACOS的NAMESPACE ID字段，默认值为""。

-u：用户名，Nacos 1.2.0+在权限控制上，默认值为''""。

-w：密码，Nacos 1.2.0+在权限控制上，默认值为""。
