# 隐藏和封装

封装(`Encapsulation`)是面向对象的三大特征之一(另外两个是继承和多态)。

它指的是将对象的状态信息隐藏在对象内部，不允许外部程序直接访问对象内部信息，而是通过该类所提供的方法来实现对内部信息的操作和访问。

Python里私有属性和方法的定义，命名以`__`开头(两个下划线) 

- 私有属性和方法，外部对象无法直接访问，否则报错。
- 私有属性和方法只能类内部通过self访问使用。

```python
"""
    隐藏和封装
"""
# 定义人类
class Person:
    # 属性 姓名
    name = None
    # 属性 年龄
    age = None

    # 定义私有属性 得分
    __score = None

    # 有参构造方法
    def __init__(self, name, age, score):
        self.name = name
        self.age = age
        self.__score = score

    # 成员方法 say 打印输出当前对象的姓名和年龄
    def say(self):
        print(f"姓名：{self.name}，年龄：{self.age}，得分：{self.__score}")
        self.__check_score()

    # 定义私有方法 若不及格叫家长
    def __check_score(self):
        if self.__score < 60:
            print(f"叫{self.name}的家长来下")

# 创建一个对象 zhangsan
zhangsan = Person("张三", 22, 66)
# print(zhangsan.__score) # 访问私有属性 报错
zhangsan.say()

# 在创建一个对象 lisi
lisi = Person("李四", 21, 55)
# lisi.__check_score() # 访问私有方法 报错
lisi.say()

#======输出======
姓名：张三，年龄：22，得分：66
姓名：李四，年龄：21，得分：55
叫李四的家长来下
```

