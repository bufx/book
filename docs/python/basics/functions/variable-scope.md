# 变量作用域

**在程序中定义一个变量时，这个变量是有作用范围的，变量的作用范围被称为它的作用域。**根据定义变
量的位置，变量分为两种。

- 局部变量：在函数中定义的变量，包括参数，都被称为局部变量。
- 全局变量：在函数外面、全局范围内定义的变量，被称为全局变量。

## 局部变量

示例：

```python
"""
    变量作用域
"""
def test():
    name = "jack"
    # 定义局部变量name
    print(name)
    
test()
# 报错，name变量在函数test()内部定义，外部不能访问
print(name)

#======输出======
jack
Traceback (most recent call last):
  File "变量作用域.py", line 11, in <module>
    print(name)
          ^^^^
NameError: name 'name' is not defined
```

## 全局变量

示例一：
```python
"""
    变量作用域
"""
#定义全局变量 name2
name2 = "Jack"

def test():
    # 定义局部变量name
    name = "jack"
    # 打印局部变量name
    print(name)

    name2 = "Marry"

test()
# 报错，name变量在函数test()内部定义，外部不能访问
# print(name)

# 打印全局变量
print(name2)

#======输出======
jack
Jack
```

示例二：

```python
"""
    变量作用域
"""
#定义全局变量 name2
name2 = "Jack"

def test():
    # 定义局部变量name
    name = "jack"
    # 打印局部变量name
    print(name)

    # 声明全局变量name2
    global name2
    name2 = "Marry"

test()
# 报错，name变量在函数test()内部定义，外部不能访问
# print(name)

# 打印全局变量
print(name2)

#======输出======
jack
Marry
```

