# 函数的返回值

## 基础使用

函数执行完毕，可以返回数据给方法的调用者，通过return关键字

```python
"""
    函数的返回值
"""
# 定义加方法函数
def add(x, y):
    result = x + y
    # 通过return关键字，把x+y的结果返回给函数的调用者
    return result

# 定义变量r，接收函数的返回值
r = add(1, 2)
print(f"调用add(1, 2)的返回结果是{r}")

r2 = add(2, 3)
print(f"调用add(2, 3)的返回结果是{r2}")

#======输出======
调用add(1, 2)的返回结果是3
调用add(2, 3)的返回结果是5
```

## 多个返回值

如果程序需要有多个返回值，则既可将多个值包装成列表之后返回，也可直接返回多个值。如果Python 函数直接返回多个值，Python会自动将多个返回值封装成元组。(后续讲到元组，我们给下实例讲解 下)

## None返回值

如果函数没有使用return语句返回数据，则函数返回的是None值。None是空的意思。

### 示例

```python
"""
    None返回值
"""
# 定义最基础的函数 helloworld
def say_helloworld():
    print("Python你好")
    
result = say_helloworld()
print(f"返回结果{result}，类型{type(result)}")

#======输出======
Python你好
返回结果None，类型<class 'NoneType'>
```

上面示例等同于return None

```python
"""
    None返回值
"""
# 定义最基础的函数 helloworld
def say_helloworld():
    print("Python你好")
    return None

result = say_helloworld()
print(f"返回结果{result}，类型{type(result)}")

#======输出======
Python你好
返回结果None，类型<class 'NoneType'>
```

### None值作用

1. 可以用于`if`判断

   ```python
   def check_user(userName, password):
       if userName == "python" and password == "123456":
           return "success"
       else:
           return None
   
   result = check_user("python", "123456")
   print(f"返回结果{result}")
   
   # 1. 用于if判断
   # 也可以这样写 if result == None
   # if result = "success"
   if not result:
       print("登录失败")
   
   #======输出======
   Python你好
   返回结果None，类型<class 'NoneType'>
   返回结果success
   ```

   

2. 用于声明无初始化内容的变量

   ```python
   # 2. 用于声明无初始化内容的变量，暂时没有值
   userName = None
   ```

   