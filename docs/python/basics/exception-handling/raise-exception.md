# 使用raise引发异常

当程序出现错误时，系统会自动引发异常。除此之外，Python也允许程序自行引发异常，自行引发异常

使用`raise`语句来完成。 一般是业务逻辑上，业务异常问题，我们可以自行引发异常。

语法：`raise [exceptionName [(reason)]]`

示例一：

后面不加具体类名 默认为 `RuntimeError`

```python
"""
    使用raise引发异常
"""
try:
    age = 17
    if age < 18:
        raise
    else:
        print("放行")
except Exception as e:
    print(type(e))

#======输出======
<class 'RuntimeError'>
```

示例二：

```python
"""
    使用raise引发异常
"""
try:
    age = 17
    if age < 18:
        raise Exception
    else:
        print("放行")
except Exception as e:
    print(type(e))

#======输出======
<class 'Exception'>
```

