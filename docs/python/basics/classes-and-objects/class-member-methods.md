# 类的成员方法

类中有属性，用来记录对象数据;

类中也有方法，用来描述对象的行为;

类中的方法和前面所学函数语法一致。 

**类里面访问成员变量，可以用self关键字，在定义成员方法的时候，第一个参数self关键字必须填写。 self表示当前的类对象**

示例：

```python
"""
    类的成员方法
"""
# 定义人类
class Person:
    # 属性 姓名
    name = None
    # 属性 年龄
    age = None

    # 成员方法 say 打印输出当前对象的姓名和年龄
    def say(self):
        print(f"姓名：{self.name}，年龄：{self.age}")

    def say2(self, msg):
        print(f"姓名：{self.name}，年龄：{self.age}，备注：{msg}")

# 创建一个对象 zhangsan
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
姓名：张三，年龄：21
姓名：张三，年龄：21，备注：成年了
姓名：李四，年龄：18
姓名：李四，年龄：18，备注：未成年
```

