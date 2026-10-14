# 类的构造方法

Python类里的 `__init__` 方法就是类的构造方法，用作构造对象，同时还可以给对象初始化属性值用。 

假如类里面没有写init构造方法，**默认会提供一个空的构造方法**。 

## 无参构造方法

说明 构造对象的时候，调用了init构造方法;

示例：

```python
"""
    类的构造方法
"""
# 定义人类
class Person:
    # 属性 姓名
    name = None
    # 属性 年龄
    age = None

    # 无参构造方法
    def __init__(self):
        print("无参构造方法")

    # 成员方法 say 打印输出当前对象的姓名和年龄
    def say(self):
        print(f"姓名：{self.name}，年龄：{self.age}")

    def say2(self, msg):
        print(f"姓名：{self.name}，年龄：{self.age}，备注：{msg}")

# 创建一个对象 zhangsan
# 说明 构造对象的时候，调用了init构造方法;
zhangsan = Person()
zhangsan.name = "张三"
zhangsan.age = 21
zhangsan.say()
zhangsan.say2("成年了")

# 在创建一个对象 lisi
lisi = Person()
lisi.name = "李四"
lisi.age = 18
lisi.say()
lisi.say2("未成年")

#======输出======
无参构造方法
姓名：张三，年龄：21
姓名：张三，年龄：21，备注：成年了
无参构造方法
姓名：李四，年龄：18
姓名：李四，年龄：18，备注：未成年
```

## 有参构造方法

可以通过有参init构造方法，来初始化对象属性

```python
"""
    类的构造方法
"""
# 定义人类
class Person:
    # 属性 姓名
    name = None
    # 属性 年龄
    age = None

    # # 无参构造方法
    # def __init__(self):
    #     print("无参构造方法")
    
    # 有参构造方法
    def __init__(self, name, age):
        self.name = name
        self.age = age
        
    # 成员方法 say 打印输出当前对象的姓名和年龄
    def say(self):
        print(f"姓名：{self.name}，年龄：{self.age}")

    def say2(self, msg):
        print(f"姓名：{self.name}，年龄：{self.age}，备注：{msg}")

# 创建一个对象 zhangsan
zhangsan = Person("张三", 22)
# zhangsan.name = "张三"
# zhangsan.age = 21
zhangsan.say()
zhangsan.say2("成年了")

# 在创建一个对象 lisi
lisi = Person("李四", 18)
# lisi.name = "李四"
# lisi.age = 18
lisi.say()
lisi.say2("未成年")

#======输出======
姓名：张三，年龄：22
姓名：张三，年龄：22，备注：成年了
姓名：李四，年龄：18
姓名：李四，年龄：18，备注：未成年
```

