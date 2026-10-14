# 异常捕获与处理

如果出现程序异常，我们不去捕获和处理，那么程序遇到异常，就直接终止，后续的代码无法继续执行，这将是可怕的事情。

Python提供了完善的异常处理机制，可以实现捕获异常，处理异常，最终实现代码继续运行下去。从而 让程序具有极好的容错性，让程序更加的健壮。

## 使用try...except捕获异常

语法：

```python
try:
    可能会有异常的代码
except:
    出现异常的执行代码
```

示例：

```python
"""
    使用try...except捕获异常
"""
try:
    print(2/0)
except:
    print("出现了异常")
print("程序继续")

#======输出======
出现了异常
程序继续
```

## 捕获指定的异常

### 单except

```python
"""
    捕获指定的异常
"""
try:
    print(2/0)
except ZeroDivisionError as Z: # as 是指定别名
    print("出现了异常")
print("程序继续")

#======输出======
出现了异常
程序继续
```

### 多个except

```python
"""
    捕获指定的异常
"""
# 定义人类
class Person:
    # 属性 姓名
    name = None
    # 属性 年龄
    age = None

try:
    print(Person().sex)
except ZeroDivisionError as Z: # as 是指定别名
    print("出现了除0异常")
except AttributeError as A:
    print("出现了属性异常")
print("程序继续")

#======输出======
出现了属性异常
程序继续
```



### Exeption 与 BaseExeption

捕获所有异常，`BaseException`异常类是所有异常类的基类(老祖宗类)，所有异常类都是直接或者间接继承BaseException异常类;

`Exception`类是继承BaseException，并且有很多具体实现，大部分的异常类直接继承Exception，所以我们一般开发用Exeption。

```python
"""
    捕获指定的异常
"""
try:
    print(2/0)
except Exception as e:
    print("出现了异常")
print("程序继续")

#======输出======
出现了异常
程序继续
```

## 多异常捕获

假如程序块可能出现异常的种类比较多，我们可以用多异常捕获，只要出现其中一个异常，就会捕获到。

语法：

```python
try:
    可能会有多种异常的代码 
except (异常1,异常2...异常N):
    出现异常的执行代码
```

示例：

```python
"""
    多异常捕获
"""
# 定义人类
class Person:
    # 属性 姓名
    name = None
    # 属性 年龄
    age = None

try:
    print(Person().sex)
except (ZeroDivisionError, AttributeError):
    print("出现了除0异常或者属性异常")
except Exception:
    print("出现了未知异常")
print("程序继续")

#======输出======
出现了除0异常或者属性异常
程序继续
```

## else块

在Python的异常处理流程中还可添加一个else块，当 try块没有出现异常时，程序会执行else块。

```python
"""
    else块
"""
try:
    print(2/1)
except:
    print("出现了异常")
else:
    print("没有出现异常")
print("程序继续")

#======输出======
2.0
没有出现异常
程序继续
```

## finally块

在异常处理中，finally块中的代码无论是否出现异常，都会执行。

有些时候，程序在try块里打开了一些物理资源(例如数据库连接、网络连接和磁盘文件等)，这些物理资源都必须被显式回收。

```python
"""
    finally块
"""
try:
    print(2/0)
except:
    print("出现了异常")
else:
    print("没有出现异常")
finally:
    print("无论是否异常，都会执行")
print("程序继续")

#======输出======
出现了异常
无论是否异常，都会执行
程序继续
```

