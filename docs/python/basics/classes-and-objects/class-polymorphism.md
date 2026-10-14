# 类的多态

多态是指：多种状态，即完成某个行为时，使用不同的对象会得到不同的状态。
**通过继承和重写实现。**

示例：

`pass`：**关键字pass**表示一个空的占位符语句 什么都不做。让代码整体完整

```python
"""
    多态
"""
# 定义一个父类
class Animal:
    # 定义一个空方法 关键字pass表示一个空的占位符语句 什么都不做。让代码整体完整
    def say(self):
        pass

# 定义子类狗
class Dog(Animal):
    def say(self):
        print("汪汪")

# 定义子类猫
class Cat(Animal):
    def say(self):
        print("喵喵")

# 定义多态
def say_something(animal):
    animal.say()

dog = Dog()
cat = Cat()
say_something(dog)
say_something(cat)

#======输出======
汪汪
喵喵
```

