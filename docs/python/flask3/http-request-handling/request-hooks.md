# request请求钩子

有时候我们业务需要对请求做一些鉴权，日志，统计分析等功能，这时候可以对请求进行预处理( `preprocessing` )和后处理( `postprocessing` )，

这时可以使用Flask提供的一些请求钩子( Hook)，它们可以**用来注册在请求处理的不同阶段执行的处理函数(或称为回调函数，即 Callback)**。

这些请求钩子使用装饰器实现，通过程序实例app调用。

Flask3默认实现的三种请求钩子如下所示。

| 钩子               | 说明                                                         |
| ------------------ | ------------------------------------------------------------ |
| `before_request`   | 注册一个函数，在处理每个请求前运行                           |
| `after_request`    | 注册一个函数，如果没有异常（或者有异常但自己捕获了），会在每个请求结束后运行 |
| `teardown_request` | 注册一个函数，即使有未处理的异常抛出，会在每个请求结束后运行。如果发生异常,会传入异常对象作为参数到注册的函数中 |

示例一：无异常

```python
# request请求钩子
@app.route('/test_hook')
def test_hook():
    print('do something...')
    return 'ok'

@app.before_request
def do_somthing_before():
    print('before_request', request.url)

@app.after_request
def do_something_after(response):
    print('after_request', request.url)
    return response

@app.teardown_request
def do_something_teardown(exception):
    print('teardown_request', exception, request.url)

#======输出======
before_request http://127.0.0.1:5000/test_hook
do something...
after_request http://127.0.0.1:5000/test_hook
teardown_request None http://127.0.0.1:5000/test_hook
```

示例二：有异常

```python
# request请求钩子
@app.route('/test_hook')
def test_hook():
    print('do something...')
    a = 1 / 0
    return 'ok'

@app.before_request
def do_somthing_before():
    print('before_request', request.url)

@app.after_request
def do_something_after(response):
    print('after_request', request.url)
    return response

@app.teardown_request
def do_something_teardown(exception):
    print('teardown_request', exception, request.url)

#======输出======
before_request http://127.0.0.1:5000/test_hook
do something...
teardown_request division by zero http://127.0.0.1:5000/test_hook
127.0.0.1 - - [16/Sep/2026 14:47:43] "GET /test_hook HTTP/1.1" 500 -
Traceback (most recent call last):
  File "01-helloWorld/app.py", line 5, in test_hook
    a = 1 / 0
        ~~^~~
ZeroDivisionError: division by zero
```

