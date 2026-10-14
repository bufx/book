# request请求对象与url传参

request请求对象封装了从客户端发来的请求报文信息，我们可以从中获取所有数据。

## 请求对象

 request对象包含的常用属性:

| 属性    | 说明                                                         |
| ------- | ------------------------------------------------------------ |
| method  | 当前的请求方法                                               |
| form    | 表单参数及其值的字典对象                                     |
| args    | 查询字符串的字典对象                                         |
| values  | 包含所有数据的字典对象                                       |
| json    | 如果mimetype是application/json，这个参数将会解析json数据，如果不是则返回 None |
| headers | http 协议请求头                                              |
| cookies | cookie名称和值的字典对象                                     |
| files   | 与上传文件有关的数据                                         |

## 基本使用

示例：url无参数

```python app.py
# url无参
@app.route('/blog/list')
def blog_list():
    return '博客列表'
```

示例：url变量参数

语法：`@app.route('/blog/detail/<int:id>')` **\<int:变量名\>是变量转换器**

```python
# url路径参数
@app.route('/blog/detail/<int:id>')
def blog_detail(id):
    '''
    url变量 示例url请求 /blog/1
    :param id:
    :return:
    '''
    return f'博客id={id}的详情页面'
```

示例：url代码参数

```python
# url带参数
@app.route('/blog/page')
def blog_page():
    '''
    url带参数，示例url请求 /blog/page?page=1&size=10
    :return:
    '''
    page = request.args.get('page', default=1, type=int)
    size = request.args.get('size', default=10, type=int)
    print(f'page={page}, size={size}')
    return '分页博客列表'
```



内置的URL变量转换器

| 转换器 | 说明                                                         |
| ------ | ------------------------------------------------------------ |
| string | 默认值，不包含斜线的字符串                                   |
| int    | 整型                                                         |
| float  | 浮点数                                                       |
| path   | 包含斜线的字符串。static路由的url规则中的finlename变量就使用了这个转换器 |
| any    | 匹配一系列给定值中的一个元素                                 |
| uuid   | UUID字符串                                                   |

