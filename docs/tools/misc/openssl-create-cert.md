# OpenSSL创建证书

一般Linux都自带安装了OpenSSL：

```sh
$ openssl
OpenSSL> version
OpenSSL 1.0.2k-fips  26 Jan 2017
OpenSSL> exit
```

## 基本概念

- **CA**：认证机构。有自己的**证书**，可以拿自己的证书给别人签名然后收钱，这个星球上的CA被几家说英语的人垄断了。在这里我们会虚拟出一个CA机构，然后用他来给自己的证书认证签名。
- **(网站)证书** ：发送给客户端的证书，其中大部分是公钥。是一个包含自己网站的公钥、认证、签名等信息的文件。
- **(网站)私钥** ：服务器留存的解密私钥(server)

*注意区分 **CA机构的证书**（可以拿来给其他网站证书签名）和 **自己网站的证书**（不可以），不一样*

## 基本流程

1. 搞一个虚拟的CA机构，生成一个证书
2. 生成一个自己的密钥，然后填写证书认证申请，拿给上面的CA机构去签名
3. 于是就得到了**（自建CA机构认证的）签名证书**

### 首先，虚构一个CA认证机构出来

```sh
# 生成CA认证机构的证书私钥key
# 需要设置密码，输入两次
$ openssl genrsa -aes256 -out ca.key 2048

# 去除密钥里的密码(可选),或者称之为公钥
# 这里需要再输入一次原来设的密码
$ openssl rsa -in ca.key -out ca.key

# 用私钥ca.key生成CA认证机构的证书ca.crt,这里会让你输入一堆信息，比如组织名称、个人信息等(除了密码外其他的可以直接回车跳过，有的系统必须填个邮箱)
# 其实就是相当于用私钥生成公钥，再把公钥包装成证书,如果第二步没有做，其实就是相当于用私钥包装成证书
# 注意设置有效期（一般都设1年）
$ openssl req -new -x509 -key ca.key -out ca.crt -days 365

### 这个证书ca.crt有的又称为"根证书",因为可以用来认证其他证书
```

### 其次，才是生成网站的证书

*用上面那个虚构出来的CA机构来认证，不收钱！*

```sh
# 生成自己网站的密钥server.key
# 需要设置密码，输入两次
$ openssl genrsa -aes256 -out server.key 2048

# 去除密钥里的密码(可选),或者称之为公钥
# 这里需要再输入一次原来设的密码
$ openssl rsa -in server.key -out server.key

# 生成自己网站证书的请求文件,这里会让你输入一堆信息，比如组织名称、个人信息等(除了密码外其他的可以直接回车跳过，有的系统必须填个邮箱)
# 如果找外面的CA机构认证，也是发个请求文件给他们
# 这个私钥(如果第二步没做，这里就是公钥）就包含在请求文件中了，认证机构要用它来生成网站的公钥，然后包装成一个证书
$ openssl req -new -key server.key -out server.csr

# 使用虚拟的CA认证机构的证书ca.crt，来对自己网站的证书请求文件server.csr进行处理，生成签名后的证书server.crt
# 这里需要再输入一次原来设的 ca.key 的密码
# 注意设置序列号和有效期（一般都设1年)
$ openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -set_serial 01 -days 365 -out server.crt
# 或者 设置序号可以用-CAcreateserial替代
$ openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -days 365 -out server.crt
```

至此，私钥`server.key`和证书`server.crt`已全部生成完毕，可以放到网站源代码中去用了。

## 导出p12格式根证书

```sh
# 把上面生成的 网站证书私钥 server.key 与 已签名的网站证书 server.crt 合并到一个pkcs12格式的文件
# 这里需要再输入一次原来设的 server.key 的密码
# 需要设置 server.p12 密码，输入两次
$ openssl pkcs12 -export -clcerts -in server.crt -inkey server.key -out server.p12
```

## 导出jks格式根证书

`JKS`证书是Java常用的证书：

在JDK bin目录下有个证书工具 `keytool`

### p12转jks

```sh
# 需要设置 server.jks 密码，输入两次
# 这里需要再输入一次原来设的 server.p12 的密码
$ keytool -importkeystore -srckeystore server.p12 -srcstoretype pkcs12 -deststoretype JKS -destkeystore server.jks
```

### crt转pfx在转jks

```sh
# crt转pfx
#
# 这里需要再输入一次原来设的 server.key 的密码
# 需要设置 server.pfx 密码，输入两次
$ openssl pkcs12 -export -inkey server.key -in server.crt -out server.pfx

# pfx转jks
#
# 需要设置 server.jks 密码，输入两次
# 这里需要再输入一次原来设的 server.pfx 的密码
$ keytool -importkeystore -srckeystore server.pfx -srcstoretype pkcs12 -deststoretype jks -destkeystore server.jks
```

### keytool直接生成jks

```sh
# 创建一个新的JKS(Java Key Store)文件
# 这里会让你输入一堆信息，比如组织名称、个人信息等(除了密码外其他的可以直接回车跳过，有的系统必须填个邮箱)
# 这里会让你输入两个密码，一个是 server.jks 的密码， 还有一个是自己网站的密钥（类似上面章节 2.2 的 server.key）
$ keytool -genkeypair -alias serverkey -keypass 123456 -storepass 123456 \
-dname "C=CN,ST=JS,L=SZ,O=buubiu,OU=dev,CN=bu" \
-keyalg RSA -keysize 2048 -validity 365 -keystore server.jks

# 生成自己网站证书的请求文件
# 这里需要再输入一次上一步设的 server.jks 的密码
# 这里还需要再输入一次上一步设的 自己网站的密钥（server.key） 的密码
$ keytool -certreq -alias serverkey -keyalg RSA -keystore server.jks -file server.csr

# 使用虚拟的CA认证机构的证书ca.crt,用ca对请求文件进行签名（ca的生成请参考上面）
# 使用虚拟的CA认证机构的证书ca.crt，来对自己网站的证书请求文件server.csr进行处理，生成签名后的证书server.crt
# 这里需要再输入一次原来设的 ca.key 的密码
# 注意设置序列号和有效期（一般都设1年)
$ openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out server.crt -days 365
# 或者 设置序号可以用-CAcreateserial替代
$ openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 365

# 导入已签名的证书 server.crt 到 server.jks
# 这里需要再输入一次第一步设的 server.jks 的密码
# 这里还需要再输入一次第一步设的 自己网站的密钥（server.key） 的密码
$ keytool -importcert -alias serverkey -file server.crt -keystore server.jks
```

#### 生成的jks转p12

```sh
$ keytool -importkeystore -srckeystore server.jks -destkeystore server.p12 \
-srcalias serverkey -destalias serverkey \
-srcstoretype jks -deststoretype pkcs12 \
-srcstorepass 123456 -deststorepass 123456 \
-noprompt
正在将密钥库 server.jks 导入到 server.p12...
```
