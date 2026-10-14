# consul导入导出的使用

## 介绍

官方地址：https://www.consul.io/commands/kv

命令：`consul kv`

该kv命令用于通过命令行与 Consul 的 KV 存储进行交互。它公开了用于从存储中插入、更新、读取和删除的顶级命令。此命令在 Consul 0.7.1 及更高版本中可用。

KV 存储也可以通过 [HTTP API](https://www.consul.io/api-docs/kv)访问。

```sh
$ consul kv -h
用法：consul kv <subcommand> [options] [args] 

Subcommands：

    delete 从 KV 存储中删除数据
    export 以 JSON 格式导出部分 KV 树
    get 从 KV 存储中检索或列出数据
    import 导入部分JSON 格式的 KV 树
    put 设置或更新 KV 存储中的数据

```

## Delete(删除)

命令：`consul kv delete [options] [KEY_OR_PREFIX]`

该`kv delete`命令从给定路径的 Consul 的 KV 存储中删除值。如果路径中不存在键，则不采取任何操作。

例子：

1. 删除 KV 存储中名为“config/buubiu/serviceconfig”的键的值：

```sh
# 无 acl
$ consul kv delete config/buubiu/serviceconfig
Success! Deleted key: config/buubiu/serviceconfig

# 有 acl
$ consul kv delete -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/serviceconfig
Success! Deleted key: config/buubiu/serviceconfig

# docker exec执行
$ docker exec -i consul consul kv delete -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/serviceconfig
Success! Deleted key: config/buubiu/serviceconfig
```

2. 删除多个(`-recurse`)

```sh
# 删除以 config/buubiu 前缀开头key的所有键
$ consul kv delete -recurse -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/
```



## Export(导出)

命令：`consul kv export [options] [PREFIX]`

该`kv export`命令用于从 Consul 的 KV 存储中检索给定前缀的 KV 对，并将其以 JSON 格式输出到标准输出。该命令通常与 `consul kv import` 命令配合使用，用于在 Consul 集群之间迁移或备份整个键值树。

例子：

```sh
# 导出到当前界面为JSON
$ consul kv export -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/serviceconfig
[
	{
		"key": "config/buubiu/serviceconfig",
		"flags": 0,
		"value": "c2VydmljZS5wb3J0OiA4MDgwCmFwcGxpY2F0aW9uOgoJbmFtZTogZGVtbw=="
	},
	{
		"key": "config/buubiu/serviceconfig1",
		"flags": 0,
		"value": "c2VydmljZS5wb3J0OiA4MDgwCmFwcGxpY2F0aW9uOgoJbmFtZTogZGVtbw=="
	}
]

# 导出为一个JSON文件
$ consul kv export -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/serviceconfig > config_buubiu_serviceconfig.json

# docker exec执行
$ docker exec -i consul consul kv export -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/serviceconfig > config_buubiu_serviceconfig.json
```



## Get(查看)

命令：`consul kv get [options] [KEY_OR_PREFIX]`

该`kv get`命令从给定键名的 Consul 的 KV 存储中检索值。如果不存在具有该名称的键，则返回错误。如果存在具有该名称但没有数据的键，则不返回任何内容。需要键名或前缀。

例子：

### 查看KEY内容

```sh
# 查看某一个 KEY 的值
$ consul kv get -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA=="  config/buubiu/serviceconfig
service.port: 8080
application:
	name: demo
	
# 查看某一个 KEY 的值,转为base64
$ consul kv get -base64 -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA=="  config/buubiu/serviceconfig
c2VydmljZS5wb3J0OiA4MDgwCmFwcGxpY2F0aW9uOgoJbmFtZTogZGVtbw==

# 查看某一个 KEY 的值，并保存在一个JSON文件中
$ consul kv get -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA=="  config/buubiu/serviceconfig > config_buubiu_serviceconfig.json

# docker exec执行
$ docker exec -i consul consul kv get -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA=="  config/buubiu/serviceconfig > config_buubiu_serviceconfig.json
```

### 查看详细KEY

要查看有关密钥的详细信息，请指定`-detailed`标志。这将输出有关密钥的所有已知元数据，包括`ModifyIndex` 和任何用户提供的标志：

```sh
# 详细查看某个KEY
$ consul kv get -detailed -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA=="  config/buubiu/serviceconfig
CreateIndex      580
Flags            0
Key              config/buubiu/serviceconfig
LockIndex        0
ModifyIndex      594
Session          -
Value            service.port: 8080
application:
      name: demo
```

### 按前缀查看

要将路径视为前缀并列出以给定前缀开头的所有条目，请指定`-recurse`标志：

```sh
# 查看所有KEY前缀为 ‘config/buubiu/‘的条目
$ consul kv get -recurse -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/
config/buubiu/serviceconfig:service.port: 8080
application:
	name: demo
config/buubiu/serviceconfig1:service.port: 8080
application:
	name: demo
	
# 查看所有KEY前缀为 ‘config/buubiu/‘的条目详细信息
$ consul kv get -recurse -detailed -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/
CreateIndex      580
Flags            0
Key              config/buubiu/serviceconfig
LockIndex        0
ModifyIndex      594
Session          -
Value            service.port: 8080
application:
      name: demo

CreateIndex      600
Flags            0
Key              config/buubiu/serviceconfig1
LockIndex        0
ModifyIndex      600
Session          -
Value            service.port: 8080
application:
      name: demo
```

### 只查看KEY

```sh
# 要仅列出以指定前缀开头的键，请改用该-keys 选项。这会提高性能并产生更小的有效负载：
$ consul kv get -keys -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/
config/buubiu/serviceconfig
config/buubiu/serviceconfig1

# 要列出根目录下的所有键
$ consul kv get -keys -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA=="
config/
```



## Import(导入)

命令：`consul kv import [options] [DATA]`

该`kv import`命令用于从`kv export`命令生成的 JSON 文件中导入 KV 对。

例子：

适用于从`kv export`命令生成的 JSON 文件中导入 KV 对

文件示例：

```json config_buubiu_serviceconfig.json
[
	{
		"key": "config/buubiu/serviceconfig1",
		"flags": 0,
		"value": "c2VydmljZS5wb3J0OiA4MDgwCmFwcGxpY2F0aW9uOgoJbmFtZTogZGVtbw=="
	},
	{
		"key": "config/buubiu/serviceconfig2",
		"flags": 0,
		"value": "c2VydmljZS5wb3J0OiA4MDgwCmFwcGxpY2F0aW9uOgoJbmFtZTogZGVtbw=="
	}
]
```



```sh
# 从文件导入，文件名前添加 @
$ consul kv import -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" @config_buubiu_serviceconfig.json
Imported: config/buubiu/serviceconfig

# 从标准输入导入
$ cat config_buubiu_serviceconfig.json | consul kv import -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" -
Imported: config/buubiu/serviceconfig3
Imported: config/buubiu/serviceconfig4

# 可以直接传递 JSON，但必须注意 shell 转义
$ consul kv import -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" "$(cat config_buubiu_serviceconfig.json)"
Imported: config/buubiu/serviceconfig7
Imported: config/buubiu/serviceconfig8

# docker exec 从标准输入导入
$ cat config_buubiu_serviceconfig.json | docker exec -i consul consul kv import -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" -
Imported: config/buubiu/serviceconfig5
Imported: config/buubiu/serviceconfig6

# docker exec 直接传递 JSON
docker exec -i consul consul kv import -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" "$(cat config_buubiu_serviceconfig.json)"
Imported: config/buubiu/serviceconfig9
Imported: config/buubiu/serviceconfig10


# 要在前缀下导入，请使用-prefix选项
# -prefix- 导入数据的键前缀。默认值为空，表示根。在 Consul 1.10 中添加。
$ cat config_buubiu_serviceconfig.json | consul kv import -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" -prefix=sub/dir/ -
```



## Put(更新)

命令：`consul kv put [options] KEY [DATA]` **会覆盖原有的值**

该`kv put`命令将数据写入 KV 存储中的给定路径。一次写入多个条目时，请改用`kv import`

例子：

### 普通字符串

```sh
# 要在 KV 存储中为名为“config/buubiu/serviceconfig”的键插入值“test”
$ consul kv put -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/serviceconfig "test"
Success! Data written to: config/buubiu/serviceconfig

# 或者放到前面,通过指定符号-从标准输入读取值
$ echo "test" | consul kv put -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/serviceconfig -

# 或者监听键盘录入
$ consul kv put -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/serviceconfig -
hello world  buubiu 我是谁
<CTRL+D>
Success! Data written to: config/buubiu/serviceconfig

# docker exec 执行以上命令
# 要在 KV 存储中为名为“config/buubiu/serviceconfig”的键插入值“test”
$ docker exec -i consul consul kv put -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/serviceconfig "test"
Success! Data written to: config/buubiu/serviceconfig

# 或者放到前面,通过指定符号-从标准输入读取值
$ echo "test" | docker exec -i consul consul kv put -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/serviceconfig -

# 或者监听键盘录入
$ docker exec -i consul consul kv put -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/serviceconfig -
hello world  buubiu 我是谁
<CTRL+D>
Success! Data written to: config/buubiu/serviceconfig
```

### Base64编码的值

如果`-base64`设置了标志，则给定数据将在写入之前进行 Base64 解码：

```sh
$ consul kv put -base64 -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/serviceconfig "c2VydmljZS5wb3J0OiA4MDgwCmFwcGxpY2F0aW9uOgoJbmFtZTogZGVtbw=="
Success! Data written to: config/buubiu/serviceconfig

# docker exec
$ docker exec -i consul consul kv put -base64 -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/serviceconfig "c2VydmljZS5wb3J0OiA4MDgwCmFwcGxpY2F0aW9uOgoJbmFtZTogZGVtbw=="
Success! Data written to: config/buubiu/serviceconfig
```

### 较长字符

**不推荐，格式可能会出现问题**

```sh
$ consul kv put -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/serviceconfig - <<EOF
service.port: 8080
application:
	name: demo
EOF
Success! Data written to: config/buubiu/serviceconfig

# docker exec 
$ docker exec -i consul consul kv put -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/serviceconfig - <<EOF
service.port: 8080
application:
	name: demo
EOF
Success! Data written to: config/buubiu/serviceconfig
```

### 读取文件

也可以通过 有符号 `@`的标识来读取文件，支持 `JSON YAML YML`

文件示例：

```yaml config_buubiu_serviceconfig.yml
service.port: 8080
application:
	name: demo
```



```sh
$ consul kv put -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/buubiu/serviceconfig @config_buubiu_serviceconfig.yml
Success! Data written to: config/buubiu/serviceconfig

# docker exec不支持
```





## 扩展

### 导入文件夹下面所有yml文件

```sh
$ for i in $(ls *); do var=$i; filename=${var%*.yml}; cat ${filename}.yml | docker exec -i consul consul kv put -http-addr="http://127.0.0.1:8500" -token="p2BE1AtpwPbrxZdC6k+eXA==" config/${filename}/serviceconfig -; done
```

