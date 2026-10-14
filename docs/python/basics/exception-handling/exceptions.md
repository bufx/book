# 异常的概念

异常是指程序运行的过程中出现了错误，也叫Bug。

示例一：

因为Person类没有sex属性，对象访问sex属性，就报错了。这样就出现了bug，也就是程序异常。

```python
"""
    异常的概念
"""
# 定义人类
class Person:
    # 属性 姓名
    name = None
    # 属性 年龄
    age = None

print(Person().sex)

#======输出======
Traceback (most recent call last):
  File "异常的概念.py", line 11, in <module>
    print(Person().sex)
          ^^^^^^^^^^^^
AttributeError: 'Person' object has no attribute 'sex'
```

示例二：

0是不能作为被除数的，所以程序也出异常了。

```python
"""
    异常的概念
"""
# 定义人类
class Person:
    # 属性 姓名
    name = None
    # 属性 年龄
    age = None

# print(Person().sex)
print(1/0)

#======输出======
Traceback (most recent call last):
  File "异常的概念.py", line 12, in <module>
    print(1/0)
          ~^~
ZeroDivisionError: division by zero
```

