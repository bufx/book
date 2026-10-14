# Python的动态性

Python是动态语言，动态语言的典型特征就是：**类、对象的属性、方法都可以动态增加和修改**。 

## 类动态性

就是给类动态添加属性和方法，**动态添加的方法，要加上self参数**；然后整个类都有了添加的属性和方法，对所有对象生效。

语法：

```python
def 函数名(self):
类名.属性=属性值
类名.方法名=函数名
```

示例：

```python
"""
    Python的动态性-类动态性
"""
# 类动态性
class Dog:
    name = None

    def say(self):
        print(f"{self.name}：汪汪")

dog = Dog()
dog.name = "jack"
dog.say()

# 给类动态添加age属性
Dog.age = 11

def action_func(self):
    print(f"{self.name}：还能跑，年龄{self.age}")
# 给类动态添加方法action
Dog.action = action_func
dog.action()


# 其他对象也适用
dog2 = Dog()
dog2.name = "Marry"
dog2.action()

#======输出======
jack：汪汪
jack：还能跑，年龄11
Marry：还能跑，年龄11
```

## 对象动态性

就是只给一个对象动态添加属性和方法，**其他对象作用不到，动态添加的方法不需要加上self参数**

语法：

```python
def 函数名():
对象.属性=属性值
对象.方法名=函数名
```

示例：

```python
"""
    Python的动态性-对象动态性
"""
# 对象动态性
class Dog:
    name = None

    def say(self):
        print(f"{self.name}：汪汪")

dog = Dog()
dog.name = "jack"
dog.say()

# 给对象动态添加age属性
dog.age = 11

def action_func():
    print("还能跑")
# 给对象动态添加方法action
dog.action = action_func
dog.action()


# 其他对象不适用
dog2 = Dog()
dog2.name = "Marry"
print(dog2.age)  # 报错 dog2没有age属性
dog2.action() # 报错 dog2没有action方法

#======输出======
jack：汪汪
还能跑
Traceback (most recent call last):
  File "Python的动态性-对象动态性.py", line 28, in <module>
    print(dog2.age)
          ^^^^^^^^
AttributeError: 'Dog' object has no attribute 'age'
Traceback (most recent call last):
  File "Python的动态性-对象动态性.py", line 29, in <module>
    dog2.action()
    ^^^^^^^^^^^
AttributeError: 'Dog' object has no attribute 'action'
```

