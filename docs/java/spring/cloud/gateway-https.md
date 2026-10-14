# Gateway配置HTTPS证书

## 介绍

> The gateway can listen for requests on HTTPS by following the usual Spring server configuration. （网关可以通过遵循通常的Spring服务器配置监听HTTPS上的请求）											--[SpringCloud官网](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#tls-and-ssl)

下面举例说明如何进行配置：

## 生成证书

目前Java支持 类型为 `JKS`、`P12`的证书。

证书本应是花钱买，客户端才能通过根CA仓库识别证书。

如果是自定义生成的证书，客户端访问时，会提示不安全的链接 是否继续访问，或者客户端可以将证书导入自己的本地CA仓库。

生成证书可以通过 [OpenSSL创建证书](https://blog.buubiu.com/2021/12/08/OpenSSL创建证书/)，或者jdk的工具[Keytool创建证书](https://blog.buubiu.com/2021/12/09/Keytool创建证书/)生成

## gateway配置

在yml文件启用ssl：

### PKCS12方式

```yaml
server:
  ssl:
    enabled: true
    # 别名
    key-alias: serverkey
    # 设置的密码
    key-store-password: 123456
    # p12文件，放在resources路径下
    key-store: classpath:server-keystore.p12
    # 密钥类型
    key-store-type: PKCS12
```

### JKS方式

```yaml
server:
  ssl:
    enabled: true
    # 别名
    key-alias: serverkey
    # 设置的密钥库密码
    key-store-password: 123456
    # 设置的密钥密码
    key-password: 123456
    # jks文件，放在resources路径下
    key-store: classpath:server.keystore
    # 密钥类型
    key-store-type: JKS
    # 密钥提供方：默认SUN
    key-store-provider: SUN
```

