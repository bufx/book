# Keytool创建证书

## 简介

keytool 是java 用于管理密钥和证书的工具，[官方文档](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/keytool.html?spm=a2c6h.12873639.0.0.7ecf2157HKigWR)
其功能包括：

- 创建并管理密钥
- 创建并管理证书
- 作为CA 为证书授权
- 导入导出证书

**主要格式**
keytool 采用 keystore 文件来存储密钥及证书，其中可包括私钥、信任证书；
keystore 文件主要使用 JKS格式(也可支持其他格式)，带密钥存储；其中私钥的存储也有独立的密码；
[其他格式](https://docs.oracle.com/javase/8/docs/technotes/guides/security/StandardNames.html#KeyStore)

## keytool工具帮助命令

```sh
$ keytool -help
密钥和证书管理工具

命令:

 -certreq            生成证书请求
 -changealias        更改条目的别名
 -delete             删除条目
 -exportcert         导出证书
 -genkeypair         生成密钥对
 -genseckey          生成密钥
 -gencert            根据证书请求生成证书
 -importcert         导入证书或证书链
 -importpass         导入口令
 -importkeystore     从其他密钥库导入一个或所有条目
 -keypasswd          更改条目的密钥口令
 -list               列出密钥库中的条目
 -printcert          打印证书内容
 -printcertreq       打印证书请求的内容
 -printcrl           打印 CRL 文件的内容
 -storepasswd        更改密钥库的存储口令

使用 "keytool -command_name -help" 获取 command_name 的用法
```

## 生成私钥和证书

### keytool -genkey 帮助命令

```sh
$ keytool -genkey -help
keytool -genkeypair [OPTION]...

生成密钥对

选项:

 -alias <alias>                  要处理的条目的别名
 -keyalg <keyalg>                密钥算法名称
 -keysize <keysize>              密钥位大小
 -groupname <name>               Group name. For example, an Elliptic Curve name.
 -sigalg <sigalg>                签名算法名称
 -destalias <destalias>          目标别名
 -dname <dname>                  唯一判别名
 -startdate <startdate>          证书有效期开始日期/时间
 -ext <value>                    X.509 扩展
 -validity <valDays>             有效天数
 -keypass <arg>                  密钥口令
 -keystore <keystore>            密钥库名称
 -storepass <arg>                密钥库口令
 -storetype <storetype>          密钥库类型 支持：JKS(默认)和 PKCS12
 -providername <providername>    提供方名称
 -providerclass <providerclass>  提供方类名
 -providerarg <arg>              提供方参数
 -providerpath <pathlist>        提供方类路径
 -v                              详细输出
 -protected                      通过受保护的机制的口令

使用 "keytool -help" 获取所有可用命令
```

### 生成证书

#### 默认生成 jks 格式的证书

```sh
$ keytool -genkeypair -alias serverkey -keystore server.keystore
输入密钥库口令:
再次输入新口令:
它们不匹配。请重试
输入密钥库口令:
再次输入新口令:
您的名字与姓氏是什么?
  [Unknown]:  bu
您的组织单位名称是什么?
  [Unknown]:  buubiu
您的组织名称是什么?
  [Unknown]:  dev
您所在的城市或区域名称是什么?
  [Unknown]:  SZ
您所在的省/市/自治区名称是什么?
  [Unknown]:  JS
该单位的双字母国家/地区代码是什么?
  [Unknown]:  CN
CN=bu, OU=buubiu, O=buubiu, L=SZ, ST=JS, C=CN是否正确?
  [否]:y

输入 <serverkey> 的密钥口令
	(如果和密钥库口令相同, 按回车):
```

按提示 输入keystore 存储密码、私钥密码、个人信息，之后会生成 server.keystore文件
若不想输入参数，可提供参数：

```sh
# keysize 密钥长度(DSA算法对应的默认算法是sha1withDSA，不支持2048长度，此时需指定RSA)
$ keytool -genkeypair -alias serverkey -keypass 123456 -storepass 123456 \
-dname "C=CN,ST=JS,L=SZ,O=buubiu,OU=dev,CN=bu" \
-keyalg RSA -keysize 2048 -validity 365 -keystore server.keystore
```

#### 生成 pkcs12 格式的证书

跟上面同理，多了个指定证书的类型：

```sh
$ keytool -genkeypair -storetype PKCS12 -alias serverkey -keypass 123456 -storepass 123456 \
-dname "C=CN,ST=JS,L=SZ,O=buubiu,OU=dev,CN=bu" \
-keyalg RSA -keysize 2048 -validity 365 -keystore server.p12
```

## 查看keystore详情

### keytool -list帮助命令

```sh
$ keytool -list -help
keytool -list [OPTION]...

列出密钥库中的条目

选项:

 -rfc                            以 RFC 样式输出
 -alias <alias>                  要处理的条目的别名
 -keystore <keystore>            密钥库名称
 -storepass <arg>                密钥库口令
 -storetype <storetype>          密钥库类型
 -providername <providername>    提供方名称
 -providerclass <providerclass>  提供方类名
 -v                              详细输出
 -protected                      通过受保护的机制的口令

使用 "keytool -help" 获取所有可用命令
```

### 查看详情命令

```sh
$ keytool -list -storepass 123456 -keystore server.keystore
密钥库类型: jks
密钥库提供方: SUN

您的密钥库包含 1 个条目

serverkey, 2021-12-9, PrivateKeyEntry,
证书指纹 (SHA-256): CA:18:CD:D1:45:13:9F:86:07:4F:B4:42:89:9D:5C:EE:30:4F:85:09:7E:15:EA:3E:2A:53:AF:E3:BD:C1:9C:F7
```

### 查看更详细数据

加上-v

```sh
$ keytool -list -v -storepass 123456 -keystore server.keystore
密钥库类型(Keystore type): jks
密钥库提供方(Keystore provider): SUN

您的密钥库包含 1 个条目

别名: serverkey
创建日期: 2021-12-9
条目类型(Entry type): PrivateKeyEntry
证书链长度: 1
证书[1]:
所有者: C=CN, ST=JS, L=SZ, O=buubiu, OU=dev, CN=bu
发布者: C=CN, ST=JS, L=SZ, O=buubiu, OU=dev, CN=bu
序列号: 51cb8ed1
生效时间: Thu Dec 09 09:56:38 CST 2021, 失效时间: Fri Dec 09 09:56:38 CST 2022
证书指纹:
	 SHA1: 45:58:60:6B:69:82:D6:B0:E6:A9:80:24:B4:ED:91:2B:35:89:81:A3
	 SHA256: CA:18:CD:D1:45:13:9F:86:07:4F:B4:42:89:9D:5C:EE:30:4F:85:09:7E:15:EA:3E:2A:53:AF:E3:BD:C1:9C:F7
签名算法名称: SHA256withRSA
主体公共密钥算法: 2048 位 RSA 密钥
版本: 3

扩展:

#1: ObjectId: 2.5.29.14 Criticality=false
SubjectKeyIdentifier [
KeyIdentifier [
0000: 6A 6D BF 1B 1D 14 E2 AC   5C 76 F5 B6 A4 0B D5 5E  jm......\v.....^
0010: A1 E4 5F D5                                        .._.
]
]



*******************************************
*******************************************

```

## 证书导出

### keytool -exportcert 帮助命令

```sh
$ keytool -exportcert -help
keytool -exportcert [OPTION]...

导出证书

选项:

 -rfc                            以 RFC 样式输出
 -alias <alias>                  要处理的条目的别名
 -file <filename>                输出文件名
 -keystore <keystore>            密钥库名称
 -storepass <arg>                密钥库口令
 -storetype <storetype>          密钥库类型
 -providername <providername>    提供方名称
 -providerclass <providerclass>  提供方类名
 -v                              详细输出
 -protected                      通过受保护的机制的口令

使用 "keytool -help" 获取所有可用命令
```

### 导出证书

```sh
$ keytool -exportcert -alias serverkey -keystore server.keystore -storepass 123456 -file server.cer
存储在文件 <server.cer> 中的证书
```

此时导出的证书为DER编码格式，使用openssl 可以输出

```sh
$ openssl x509 -in server.cer -inform der -noout -text
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 1372294865 (0x51cb8ed1)
    Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN=bu, OU=dev, O=buubiu, L=SZ, ST=JS, C=CN
        Validity
            Not Before: Dec  9 01:56:38 2021 GMT
            Not After : Dec  9 01:56:38 2022 GMT
        Subject: CN=bu, OU=dev, O=buubiu, L=SZ, ST=JS, C=CN
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (2048 bit)
                Modulus:
                    00:82:69:72:34:fb:83:3a:b9:8d:75:d7:22:76:e1:
                    bc:8c:d7:d5:8d:a2:45:b2:2b:74:7d:42:95:6b:00:
                    d1:47:eb:67:fc:b8:f1:12:33:8a:8c:2b:e6:f2:8b:
                    8e:2b:14:6e:c7:c9:39:e5:5e:6b:68:b4:fe:3e:d5:
                    a0:a8:e7:84:65:93:93:79:77:fb:6b:d3:9c:14:87:
                    24:9e:2e:6f:72:c1:c3:ec:dc:9c:44:29:f2:d2:25:
                    7a:58:c6:0e:9e:1d:34:f6:9f:14:89:4a:4d:4a:e5:
                    7a:47:14:38:bf:4e:3d:0c:77:f7:0d:bc:c4:f8:7c:
                    fc:21:1d:29:f8:85:ac:11:94:9e:c1:3a:2a:22:8c:
                    ea:52:b5:30:04:69:8f:52:d7:e9:83:e4:91:1a:39:
                    98:e0:95:fa:6e:93:6d:ab:88:45:44:69:78:c2:32:
                    c3:ee:a1:c9:64:05:21:7b:23:7b:fc:fc:44:06:a2:
                    21:cf:ed:c6:88:9b:e5:a9:72:4f:6b:c0:10:10:6b:
                    0d:41:64:45:5b:48:8e:1c:50:f5:2b:ad:ab:e4:1a:
                    bb:d4:38:cc:4b:e3:87:e2:8d:a6:d2:19:71:b1:88:
                    99:f0:64:23:8b:05:50:c4:f1:85:8f:75:43:1a:38:
                    93:f4:2b:b1:4d:17:40:2d:81:fa:7c:75:c5:5f:18:
                    4d:cf
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Subject Key Identifier:
                6A:6D:BF:1B:1D:14:E2:AC:5C:76:F5:B6:A4:0B:D5:5E:A1:E4:5F:D5
    Signature Algorithm: sha256WithRSAEncryption
         78:98:a7:58:0c:e2:01:34:31:c0:e0:63:50:16:fb:ae:d2:a4:
         88:63:3f:1b:3c:f7:e7:de:5b:81:30:30:0d:9c:06:3e:56:10:
         9e:fd:fb:f5:fa:7e:02:78:fb:07:15:4d:b6:e4:77:2e:76:a5:
         76:33:87:45:9a:bc:1d:4e:b3:4e:92:02:98:e2:d2:c6:5a:5d:
         1d:dc:bb:e3:0f:73:ce:7f:c3:6c:90:84:99:97:c0:76:a9:d9:
         e3:ec:68:65:38:62:34:c6:64:a1:5f:11:07:af:e5:16:2c:4d:
         33:91:91:52:bc:c0:1e:9d:6e:a2:2e:92:e0:f8:ce:47:45:cb:
         ab:9c:20:0d:b3:ab:e5:5e:8a:63:5d:d7:23:0d:d9:34:e9:25:
         e9:8d:63:e5:ed:76:06:3e:c2:37:63:0a:43:68:d1:08:9b:92:
         e1:43:d5:83:b0:a1:f2:66:68:16:42:e0:86:88:8d:21:38:d4:
         9e:e8:47:9c:54:f7:b5:a9:f4:45:6a:69:59:44:f4:36:a7:88:
         c9:fd:9d:7a:e6:40:b7:ab:10:87:0c:52:ff:98:86:9a:29:70:
         39:5e:cc:f2:ac:46:3c:30:4e:60:d2:68:07:95:d2:58:60:70:
         44:7c:18:2b:d3:9c:76:8d:20:94:ff:eb:82:7b:38:13:a2:cb:
         58:e8:08:8c
```

加上 -rfc选项，可输出PEM编码格式的证书

```sh
$ keytool -exportcert -alias serverkey -keystore server.keystore -storepass 123456 -rfc -file server.cer
存储在文件 <server.cer> 中的证书
$ cat server.cer
-----BEGIN CERTIFICATE-----
MIIDRTCCAi2gAwIBAgIEUcuO0TANBgkqhkiG9w0BAQsFADBTMQswCQYDVQQDEwJi
dTEMMAoGA1UECxMDZGV2MQ8wDQYDVQQKEwZidXViaXUxCzAJBgNVBAcTAlNaMQsw
CQYDVQQIEwJKUzELMAkGA1UEBhMCQ04wHhcNMjExMjA5MDE1NjM4WhcNMjIxMjA5
MDE1NjM4WjBTMQswCQYDVQQDEwJidTEMMAoGA1UECxMDZGV2MQ8wDQYDVQQKEwZi
dXViaXUxCzAJBgNVBAcTAlNaMQswCQYDVQQIEwJKUzELMAkGA1UEBhMCQ04wggEi
MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCCaXI0+4M6uY111yJ24byM19WN
okWyK3R9QpVrANFH62f8uPESM4qMK+byi44rFG7HyTnlXmtotP4+1aCo54Rlk5N5
d/tr05wUhySeLm9ywcPs3JxEKfLSJXpYxg6eHTT2nxSJSk1K5XpHFDi/Tj0Md/cN
vMT4fPwhHSn4hawRlJ7BOioijOpStTAEaY9S1+mD5JEaOZjglfpuk22riEVEaXjC
MsPuoclkBSF7I3v8/EQGoiHP7caIm+Wpck9rwBAQaw1BZEVbSI4cUPUrravkGrvU
OMxL44fijabSGXGxiJnwZCOLBVDE8YWPdUMaOJP0K7FNF0Atgfp8dcVfGE3PAgMB
AAGjITAfMB0GA1UdDgQWBBRqbb8bHRTirFx29bakC9VeoeRf1TANBgkqhkiG9w0B
AQsFAAOCAQEAeJinWAziATQxwOBjUBb7rtKkiGM/Gzz3595bgTAwDZwGPlYQnv37
9fp+Anj7BxVNtuR3LnaldjOHRZq8HU6zTpICmOLSxlpdHdy74w9zzn/DbJCEmZfA
dqnZ4+xoZThiNMZkoV8RB6/lFixNM5GRUrzAHp1uoi6S4PjOR0XLq5wgDbOr5V6K
Y13XIw3ZNOkl6Y1j5e12Bj7CN2MKQ2jRCJuS4UPVg7Ch8mZoFkLghoiNITjUnuhH
nFT3tan0RWppWUT0NqeIyf2deuZAt6sQhwxS/5iGmilwOV7M8qxGPDBOYNJoB5XS
WGBwRHwYK9Ocdo0glP/rgns4E6LLWOgIjA==
-----END CERTIFICATE-----
```

## 导入证书

### keytool -importcert帮助命令

```sh
$ keytool -importcert -help
keytool -importcert [OPTION]...

导入证书或证书链

选项:

 -noprompt                       不提示
 -trustcacerts                   信任来自 cacerts 的证书
 -protected                      通过受保护的机制的口令
 -alias <alias>                  要处理的条目的别名
 -file <filename>                输入文件名
 -keypass <arg>                  密钥口令
 -keystore <keystore>            密钥库名称
 -storepass <arg>                密钥库口令
 -storetype <storetype>          密钥库类型
 -providername <providername>    提供方名称
 -providerclass <providerclass>  提供方类名
 -v                              详细输出

使用 "keytool -help" 获取所有可用命令
```

### 导入证书

一般为导入信任证书(SSL客户端使用)

```sh
$ keytool -importcert -file server.cer -alias client_trust_server -keystore client_trust.keystore -storepass 123456 -noprompt
证书已添加到密钥库中
$ ls
client_trust.keystore server.cer            server.keystore
```

导入后的证书为 **trustedCertEntry** 实体类型，而私钥证书为 **PrivateKeyEntry**

## 打印证书

### keytool -printcert 帮助命令

```sh
$ keytool -printcert -help
keytool -printcert [OPTION]...

打印证书内容

选项:

 -rfc                        以 RFC 样式输出
 -file <filename>            输入文件名
 -sslserver <server[:port]>  SSL 服务器主机和端口
 -jarfile <filename>         已签名的 jar 文件
 -v                          详细输出

使用 "keytool -help" 获取所有可用命令
```

### 打印证书

```sh
$ keytool -printcert -file server.cer
所有者: C=CN, ST=JS, L=SZ, O=buubiu, OU=dev, CN=bu
发布者: C=CN, ST=JS, L=SZ, O=buubiu, OU=dev, CN=bu
序列号: 51cb8ed1
生效时间: Thu Dec 09 09:56:38 CST 2021, 失效时间: Fri Dec 09 09:56:38 CST 2022
证书指纹:
	 SHA1: 45:58:60:6B:69:82:D6:B0:E6:A9:80:24:B4:ED:91:2B:35:89:81:A3
	 SHA256: CA:18:CD:D1:45:13:9F:86:07:4F:B4:42:89:9D:5C:EE:30:4F:85:09:7E:15:EA:3E:2A:53:AF:E3:BD:C1:9C:F7
签名算法名称: SHA256withRSA
主体公共密钥算法: 2048 位 RSA 密钥
版本: 3

扩展:

#1: ObjectId: 2.5.29.14 Criticality=false
SubjectKeyIdentifier [
KeyIdentifier [
0000: 6A 6D BF 1B 1D 14 E2 AC   5C 76 F5 B6 A4 0B D5 5E  jm......\v.....^
0010: A1 E4 5F D5                                        .._.
]
]
```

## 转换格式

### keytool -importkeystore 帮助命令

```sh
$ keytool -importkeystore -help
keytool -importkeystore [OPTION]...

从其他密钥库导入一个或所有条目

选项:

 -srckeystore <srckeystore>            源密钥库名称
 -destkeystore <destkeystore>          目标密钥库名称
 -srcstoretype <srcstoretype>          源密钥库类型
 -deststoretype <deststoretype>        目标密钥库类型
 -srcstorepass <arg>                   源密钥库口令
 -deststorepass <arg>                  目标密钥库口令
 -srcprotected                         受保护的源密钥库口令
 -srcprovidername <srcprovidername>    源密钥库提供方名称
 -destprovidername <destprovidername>  目标密钥库提供方名称
 -srcalias <srcalias>                  源别名
 -destalias <destalias>                目标别名
 -srckeypass <arg>                     源密钥口令
 -destkeypass <arg>                    目标密钥口令
 -noprompt                             不提示
 -providerclass <providerclass>        提供方类名
 -providerarg <arg>                    提供方参数
 -providerpath <pathlist>              提供方类路径
 -v                                    详细输出

使用 "keytool -help" 获取所有可用命令
```



### jks 格式转 pkcs12

```sh
$ keytool -importkeystore -srckeystore server.keystore -destkeystore server.p12 \
-srcalias serverkey -destalias serverkey \
-srcstoretype jks -deststoretype pkcs12 \
-srcstorepass 123456 -deststorepass 123456 \
-noprompt
正在将密钥库 server.keystore 导入到 server.p12...
```

### pkcs12 格式转 jks

与上面同理

```sh
$ keytool -importkeystore -srckeystore server.p12 -destkeystore server.keystore \
-srcalias serverkey -destalias serverkey \
-srcstoretype pkcs12 -deststoretype jks \
-srcstorepass 123456 -deststorepass 123456 \
-noprompt
正在将密钥库 server.p12 导入到 server.keystore...
```

## 场景示例

### 制作 Java SSL 双向证书

```sh
storepass=123456
keypass=123456
server_dname="C=CN,ST=JS,L=SZ,O=buubiu,OU=dev,CN=bu"
client_dname="C=CN,ST=JS,L=SZ,O=buubiu,OU=dev,CN=buc"
echo "generate server keystore"
keytool -genkeypair -alias serverkey -keypass $keypass -storepass $storepass \
    -dname $server_dname \
    -keyalg RSA -keysize 2048 -validity 3650 -keystore server.keystore
echo "generate client keystore"
keytool -genkeypair -alias clientkey -keypass $keypass -storepass $storepass \
    -dname $client_dname \
    -keyalg RSA -keysize 2048 -validity 3650 -keystore client.keystore
echo "export server certificate"
keytool -exportcert -keystore server.keystore -file server.cer -alias serverkey -storepass $storepass
echo "export client certificate"
keytool -exportcert -keystore client.keystore -file client.cer -alias clientkey -storepass $storepass
echo "add server cert to client trust keystore"
keytool -importcert -keystore client_trust.keystore -file server.cer -alias client_trust_server \
    -storepass $storepass -noprompt
echo "add client cert to server trust keystore"
keytool -importcert -keystore server_trust.keystore -file client.cer -alias server_trust_client \
    -storepass $storepass -noprompt
```

### Java 证书与 nginx 证书互转

Java通常使用JKS作为证书存储格式，而Nginx往往采用PEM证书格式，如何实现互转？

#### JKS 证书转 Nginx 证书

1. 第一步：jks 证书转 p12

```sh
$ keytool -importkeystore -srckeystore server.keystore -destkeystore server.p12 \
-srcalias serverkey -destalias serverkey \
-srcstoretype jks -deststoretype pkcs12 \
-srcstorepass 123456 -deststorepass 123456 \
-noprompt
正在将密钥库 server.keystore 导入到 server.p12...
$ ls
server.keystore server.p12
```

2. 第二步：p12 证书提取pem证书和私钥

```sh
$ openssl pkcs12 -in server.p12 -clcerts -nokeys -password pass:123456 -out server.crt
MAC verified OK
$ ls
server.crt      server.keystore server.p12
$ openssl pkcs12 -in server.p12 -nocerts -password pass:123456 -passout pass:123456 -out server.key
MAC verified OK
$ ls
server.crt      server.key      server.keystore server.p12
```

其中得到的私钥文件为PKCS#8 加密格式，证书和密钥均为PEM文件编码。

#### Nginx 证书转 JKS

1. 第一步：pem证书和私钥合成p12

```sh
$ ls
server.crt server.key
$ openssl pkcs12 -export -in server.crt -inkey server.key -passin pass:123456 -password pass:123456 -name serverkey -out server.p12
$ ls
server.crt server.key server.p12
```

注意定义-name 选项，这将作为keystore识别实体的参数

2. 第二步：p12 证书转jks 证书

```sh
$ keytool -importkeystore -srckeystore server.p12 -destkeystore server.keystore \
-srcalias serverkey -destalias serverkey \
-srcstoretype pkcs12 -deststoretype jks \
-srcstorepass 123456 -deststorepass 123456 \
-noprompt
正在将密钥库 server.p12 导入到 server.keystore...
$ ls
server.crt      server.key      server.keystore server.p12
```

**如果p12 文件中未指定实体名称，使用keytool转换时则不需提供srcalias/destalias参数，而输出的keystore实体名称默认为1**

### 其他

**已有的Nginx证书，如何快速在Java中添加信任** 
通过keytool -importcert 命令可直接导入信任证书

**keytool 通用格式为 jks，如何获取私钥**
通过程序读取，参考[stackoverflow](https://stackoverflow.com/questions/150167/how-do-i-list-export-private-keys-from-a-keystore?spm=a2c6h.12873639.0.0.7ecf2157HKigWR)
[JavaSE样例](http://www.java2s.com/Code/Java/Security/RetrievingaKeyPairfromaKeyStore.htm?spm=a2c6h.12873639.0.0.7ecf2157HKigWR)
