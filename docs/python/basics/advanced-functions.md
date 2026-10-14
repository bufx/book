# 函数进阶

## 函数的多返回值

复杂业务情况，函数可以有多个返回值，类型也不限制。

语法：`return 返回值1,返回值2,...返回值n`

- **函数返回类型是元组tuple类型**

- **可以通过一个元组变量接收，也可以通过多个变量接收（变量的个数要一致）**

```python
"""
    函数的多返回值
"""
def test():
    return 1, "python", True

# 返回元组类型
result = test()
print(f"result={result},type={type(result)}")

# 通过多个变量接收，变量的个数要一致
a, b, c = test()
print(a, b, c)

#======输出======
result=(1, 'python', True),type=<class 'tuple'>
1 python True
```

## 函数的不定长参数

前面我们学过位置参数，关键字参数，默认值参数。

现在我们再学习一个不定长参数，主要用于不确定调用的时候会传递多少个参数的场景。

不定长参数的类型分为**位置传递**，和**关键字传递**两种。

### 位置传递

通过**元组tuple类型的 \*args** 来实现

语法：`函数名(*args)`

```python
"""
    函数的不定长参数
"""
# 不定长参数(位置传递)
def test(*args):
    print(args, type(args))

test(1, "python", True)
test(True, 3.14)
test()

#======输出======
(1, 'python', True) <class 'tuple'>
(True, 3.14) <class 'tuple'>
() <class 'tuple'>
```



### 关键字传递

通过**字典dict类型的 \*\*kwargs** 来实现

语法：`函数名(**kwargs)`

```python
# 不定长参数(关键字传递)
def test2(**kwargs):
    print(kwargs, type(kwargs))

test2(name = "张三", age = 11)
test2()

#======输出======
{'name': '张三', 'age': 11} <class 'dict'>
{} <class 'dict'>
```

## 使用函数变量

Python的函数也是一种值，所有函数都是function对象，这意味着可以把函数本身赋值给变量。

```python
"""
    使用函数变量
"""

# 定义计算两个参数相加的函数
def add(x, y):
    return x + y

# 将add函数赋值给my_func，则my_func可以被当做add使用
my_func = add

print(my_func(1, 2))
print(add(1, 2))

#======输出======
3
3
```

## 使用函数作为函数形参

有时候需要定义一个函数，该函数的大部分计算逻辑都能确定，但某些处理逻辑暂时无法确定

这意味着某些程序代码需要动态改变，如果希望调用函数时能动态传入这些代码，那么就需要在函数中定义 函数形参，这样在调用该函数时通过传入不同的函数作为参数，从而动态改变这段代码。

```python
"""
    使用函数作为函数形参
"""
def test(x, y, fn):
    return fn(x, y)

def add(x, y):
    return x + y

def sub(x, y):
    return x - y

print(test(2, 1, add))
print(test(2, 1, sub))

#======输出======
3
1
```

## 使用函数作为返回值

Python还支持使用函数作为其他函数的返回值

```python
"""
    使用函数作为返回值
"""
def test(bol):
    if bol:
        return add
    else:
        return sub

def add(x, y):
    return x + y

def sub(x, y):
    return x - y

b1 = test(True)
print(b1, b1(1, 2))
b2 = test(False)
print(b2, b2(1, 2))

#======输出======
<function add at 0x10c4a2f00> 3
<function sub at 0x10c73a560> -1
```

## lambda匿名函数

前面我们所学的函数定义，都是有函数名的。 

**lambda函数是没有名称的，也就是匿名函数。**

使用场景： **我们在只需要一次性使用的函数的时候，就可以用lambda匿名函数，简单方便快捷。**

语法:

`lambda 传入参数:函数体` **注意：函数体只能写一行，不支持多行**

```python
"""
    lambda匿名函数
"""
def test(x, y, fn):
    return fn(x, y)

# def add(x, y):
#     return x + y

# def sub(x, y):
#     return x - y

print(test(2, 1, lambda x, y: x + y))
print(test(2, 1, lambda x, y: x - y))

#======输出======
3
1
```

