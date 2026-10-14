# 枚举类

## 概念

在某些情况下，一个类的对象是有限且固定的，比如季节类，它只有4个对象；再比如星期，只有星期一到星期日。

**这种实例有限且固定的类，在Python中被称为枚举类。**

**枚举类不能被修改，自然也不能被继承。**

## 基础使用

1. 定义枚举类方式有两种：

   - 直接使用Enum列出多个枚举值来创建枚举类

   - 通过继承Enum基类来派生枚举类

2. 每个枚举元组成员都有name和value两个属性，name是枚举值变量名，value是枚举值的序号，从1开始。

3. 访问枚举对象的方式：

   - 根据枚举对象访问name和value

   - 根据枚举变量名来访问枚举对象

   - 根据枚举值访问枚举对象

4. 提供`__members__`属性，该属性返回一个dict字典，包含了所有枚举实例；通过`__members__`属性，访问所有枚举值

## 直接使用Enum定义

适合简单的枚举；

语法：

```python
import enum

# Enum第一个参数是类名；第二个参数是元组，用于列出所有枚举值；
类名 = enum.Enum("类名",("枚举值1","枚举值2"...))
```

示例：

```python
"""
    枚举类-直接使用Enum定义
"""
import enum

# 定义一个Season枚举类，Enum第一个参数是类名；第二个参数是元组，用于列出所有枚举值
# 每个枚举元组成员都有name和value两个属性，name是枚举值变量名，value是枚举值的序号，从1开始
Season = enum.Enum("Season", ("SPRING", "SUMMER", "FALL", "WINTER"))

# 根据枚举对象访问name和value
print(Season.SPRING)
print(Season.SPRING.name)
print(Season.SPRING.value)

# 根据枚举变量名来访问枚举对象
print(Season["SUMMER"])
print(Season["SUMMER"].name)
print(Season["SUMMER"].value)

# 根据枚举值访问枚举对象
print(Season(3))
print(Season(3).name)
print(Season(3).value)

# 提供__members__属性，该属性返回一个dict字典，包含了所有枚举实例；通过__members__属性，访问所有枚举值
for name, member in Season.__members__.items():
    print(name, "=>", member, ",", member.value)

#======输出======
Season.SPRING
SPRING
1
Season.SUMMER
SUMMER
2
Season.FALL
FALL
3
SPRING => Season.SPRING , 1
SUMMER => Season.SUMMER , 2
FALL => Season.FALL , 3
WINTER => Season.WINTER , 4
```



## 继承Enum基类定义

适合复杂的枚举，这种方式还可以定义额外方法

语法：

```python
import enum

class 类名(enum.Enum):
```

示例：

```python
"""
    枚举类-直接使用Enum定义
"""
import enum

class Week(enum.Enum):
    MON = "星期一"
    TUE = "星期二"
    WED = "星期三"
    THU = "星期四"
    FRI = "星期五"
    SAT = "星期六"
    SUN = "星期日"

    # 定义额外方法
    def info(self):
        print(f"这个是代表星期的一个数值：{self.value}")

# 根据枚举对象访问name和value
print(Week.MON)
print(Week.MON.name)
print(Week.MON.value)

# 根据枚举变量名来访问枚举对象
print(Week["TUE"])
print(Week["TUE"].name)
print(Week["TUE"].value)

# 根据枚举值访问枚举对象
print(Week("星期三"))
print(Week("星期三").name)
print(Week("星期三").value)

# 调用额外方法
Week.THU.info()

# 通过 __members__访问所有枚举值
for name, member in Week.__members__.items():
    print(name, "=>", member, ",", member.value)

#======输出======
Week.MON
MON
星期一
Week.TUE
TUE
星期二
Week.WED
WED
星期三
这个是代表星期的一个数值：星期四
MON => Week.MON , 星期一
TUE => Week.TUE , 星期二
WED => Week.WED , 星期三
THU => Week.THU , 星期四
FRI => Week.FRI , 星期五
SAT => Week.SAT , 星期六
SUN => Week.SUN , 星期日
```

