# Elasticsearch的高级设置

## 常用配置

实际生产环境中会遇到各种配置优化，这里记录一下：

### 分片数设置

以下两种方法：

1. 在任意支持curl命令的服务中执行:

```shell
curl -X PUT  http://127.0.0.1:9200/_cluster/settings -d '{  "transient": {    "cluster": {      "max_shards_per_node":10000    }  }}' -H 'Content-Type: application/json'
```

2. 在相应的kibana中执行：

```json
PUT /_cluster/settings
{
  "transient": {
    "cluster": {
      "max_shards_per_node":10000
    }
  }
}
```

### 分页查询数量设置

#### 设置当前索引

```json
PUT 索引名/_settings
{ 
  "index" : { "max_result_window" : 10000000 } 
}
```

#### 设置当前所有已存在的索引

```json
PUT /_settings
{ 
  "index" : { "max_result_window" : 10000000 } 
}
```

或者

```json
PUT /_all/_settings?preserve_existing=true
{
  "index.max_result_window" : "13000"
}
```

#### 通过索引模版设置

以下两种方法：

1. 在任意支持curl命令的服务中执行：

```shell
curl -XPUT -H "Content-Type: application/json" http://127.0.0.1:9200/_template/index_max_result_window -d '{"order":100,"index_patterns":["*"],"settings":{"index.max_result_window":100000000}}'
```

2. 在相应的kibana中执行：

```json
PUT _template/index_max_result_window
{
  "order": 100, 
  "index_patterns": ["*"],
  "settings": {
    "index.max_result_window": 100000000
  }
}
```

### 过滤删除索引

```json
DELETE /*,-buubiu4*,-.kibana_*
```

### 忽略索引是否存在查询

```json
GET /localhost_github_apm_8_2_0_segment-20210208/_search?ignore_unavailable=true
{
	"from": 0,
	"size": 15,
	"query": {
		"bool": {
			"must": [{
				"range": {
					"time_bucket": {
						"from": 20200201000000,
						"to": 20210218999999,
						"include_lower": true,
						"include_upper": true,
						"boost": 1.0
					}
				}
			}],
			"adjust_pure_negative": true,
			"boost": 1.0
		}
	},
	"sort": [{
		"latency": {
			"order": "desc"
		}
	}]
}
```

### 清除缓存

```json
POST /_all/_cache/clear?fielddata=true  #仅清除字段缓存
POST /_all/_cache/clear?query=true      #仅清除查询缓存
POST /_all/_cache/clear?request=true    #仅清除请求缓存
```

