# 自定义异常类

实际开发中，有时候系统提供的异常类型不能满足开发的需求。这时候可以通过创建一个新的异常类来拥有自己的异常。

异常类继承自 Exception 类，可以直接继承或者间接继承。

```python
"""
    自定义异常类
"""
# 判断字符串是否超长
class TooLongException(Exception):

    def __init__(self, length):
        self.length = length

    def __str__(self):
        return f"长度是：{self.length}，超长了"

def name_test():
    try:
        name = input("请输入您的姓名：")
        if len(name) > 4:
            raise TooLongException(len(name))
        else:
            print(name)
    except TooLongException as tle:
        print("出现了异常，", tle)

name_test()

#======输出======
请输入您的姓名：张三李四我
出现了异常， 长度是：5，超长了
```

