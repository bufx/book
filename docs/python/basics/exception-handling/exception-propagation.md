# 异常的传递性

异常是具有传递性的，假如方法A调用方法B，方法B调用方法C，如果方法C代码出现异常，并且没有处理异常，则会传递给方法B，同理，如果B依然没有处理异常，则最终传递给方法A。

## 异常传递性

```python
"""
    异常的传递性
"""
def funC():
    print("funC()开始")
    1 / 0
    print("funC()结束")

def funB():
    print("funB()开始")
    funC()
    print("funB()结束")

def funA():
    print("funA()开始")
    funB()
    print("funA()结束")

funA()

#======输出======
funA()开始
funB()开始
funC()开始
Traceback (most recent call last):
  File "异常的传递性.py", line 19, in <module>
    funA()
    ~~~~^^
  File "异常的传递性.py", line 16, in funA
    funB()
    ~~~~^^
  File "异常的传递性.py", line 11, in funB
    funC()
    ~~~~^^
  File "异常的传递性.py", line 6, in funC
    1 / 0
    ~~^~~
ZeroDivisionError: division by zero
```

## 捕获异常

```python
"""
    异常的传递性
"""
def funC():
    print("funC()开始")
    1 / 0
    print("funC()结束")

def funB():
    print("funB()开始")
    funC()
    print("funB()结束")

def funA():
    print("funA()开始")
    funB()
    print("funA()结束")

try:
    funA()
except Exception as e:
    print(e)

#======输出======
funA()开始
funB()开始
funC()开始
division by zero
```

