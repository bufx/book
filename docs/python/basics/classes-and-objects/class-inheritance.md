# 类的继承

继承是面向对象的三大特征之一，也是实现软件复用的重要手段。

**Python 的继承是多继承机制，即一个子类可以同时有多个直接父类。**

**子类继承父类的属性和方法，同时子类可以扩展新的属性和方法。**

语法：`class 子类(父类1,父类2,...):`

## 单继承

示例

```python
"""
    类的继承
"""
# 定义一个水果类，作为父类
class Fruit:
    # 父类属性 口感
    taste = None

    # 父类方法 打印口感
    def say_taste(self):
        print(f"口感：{self.taste}")


# 定义香蕉子类，继承父类Fruit
class Banana(Fruit):
    # 子类属性 颜色
    color = None

    # 子类方法 打印颜色
    def say_color(self):
        print(f"香蕉颜色：{self.color}")

b1 = Banana()
b1.taste = "果肉芳香"
b1.say_taste()
b1.color = "黄色"
b1.say_color()

#======输出======
口感：果肉芳香
香蕉颜色：黄色
```

## 多继承

示例：

```python
"""
    类的继承
"""
# 定义一个水果类，作为父类
class Fruit:
    # 父类属性 口感
    taste = None

    # 父类方法 打印口感
    def say_taste(self):
        print(f"口感：{self.taste}")

# 在定义一个食物类，作为父类
class Food():
    # 父类属性 价格
    price = None

    # 父类方法 打印价格
    def say_price(self):
        print(f"价格：{self.price}")


# 定义香蕉子类，继承父类Fruit和Food
class Banana(Fruit, Food):
    # 子类属性 颜色
    color = None

    # 子类方法 打印颜色
    def say_color(self):
        print(f"香蕉颜色：{self.color}")

    # 重写 str 方法，更方便打印
    def __str__(self):
        return f"口感：{self.taste}，颜色：{self.color}，价格：{self.price}"

b1 = Banana()
b1.taste = "果肉芳香"
b1.say_taste()
b1.color = "黄色"
b1.say_color()
b1.price = 10
b1.say_price()
print(b1)

#======输出======
口感：果肉芳香
香蕉颜色：黄色
价格：10
口感：果肉芳香，颜色：黄色，价格：10
```

## 重写父类属性和方法

示例：
```python
"""
    类的继承
"""
# 定义一个水果类，作为父类
class Fruit:
    # 父类属性 口感
    taste = None

    # 父类方法 打印口感
    def say_taste(self):
        print(f"口感：{self.taste}")

# 在定义一个食物类，作为父类
class Food():
    # 父类属性 价格
    price = None

    # 父类方法 打印价格
    def say_price(self):
        print(f"价格：{self.price}")


# 定义香蕉子类，继承父类Fruit和Food
class Banana(Fruit, Food):
    # 子类属性 颜色
    color = None

    # 重写父类属性 价格
    price = 8.8

    # 子类方法 打印颜色
    def say_color(self):
        print(f"香蕉颜色：{self.color}")

    # 重写 str 方法，更方便打印
    def __str__(self):
        return f"口感：{self.taste}，颜色：{self.color}，价格：{self.price}"

    # 重写父类方法 打印价格
    def say_price(self):
        print(f"香蕉价格：{self.price}")

b1 = Banana()
b1.taste = "果肉芳香"
b1.say_taste()
b1.color = "黄色"
b1.say_color()

# 输出重写的属性值
print(b1.price)
# 输出重写的方法
b1.say_price()

b1.price = 10
b1.say_price()
print(b1)

#======输出======
口感：果肉芳香
香蕉颜色：黄色
8.8
香蕉价格：8.8
香蕉价格：10
口感：果肉芳香，颜色：黄色，价格：10
```

## 子类调用父类属性和方法

我们self调用的是子类继承下来的属性和方法。如果我们想调用父类的属性和方法，可以通过如下两种方式:

- 方式一：`父类名.父类属性` `父类名.方法(self) `
- 方式二：`super().父类属性` `super().方法()`

```python
"""
    类的继承
"""
# 定义一个水果类，作为父类
class Fruit:
    # 父类属性 口感
    taste = None

    # 父类方法 打印口感
    def say_taste(self):
        print(f"口感：{self.taste}")

# 在定义一个食物类，作为父类
class Food():
    # 父类属性 价格
    price = None

    # 父类方法 打印价格
    def say_price(self):
        print(f"价格：{self.price}")


# 定义香蕉子类，继承父类Fruit和Food
class Banana(Fruit, Food):
    # 子类属性 颜色
    color = None

    # 重写父类属性 价格
    price = 8.8

    # 子类方法 打印颜色
    def say_color(self):
        print(f"香蕉颜色：{self.color}")

    # 重写 str 方法，更方便打印
    def __str__(self):
        return f"口感：{self.taste}，颜色：{self.color}，价格：{self.price}"

    # 重写父类方法 打印价格
    def say_price(self):
        print(f"香蕉价格：{self.price}")

        # 调用父类属性
        print(f"父类属性打印：{Food.price}，或者 {super().price}")
        # 调用父类方法
        Food.say_price(self)
        super().say_price()

b1 = Banana()
b1.taste = "果肉芳香"
b1.say_taste()
b1.color = "黄色"
b1.say_color()

# 输出重写的属性值
print(b1.price)
# 输出重写的方法
b1.say_price()

b1.price = 10
b1.say_price()
print(b1)

#======输出======
口感：果肉芳香
香蕉颜色：黄色
8.8
香蕉价格：8.8
父类属性打印：None，或者 None
价格：8.8
价格：8.8
香蕉价格：10
父类属性打印：None，或者 None
价格：10
价格：10
口感：果肉芳香，颜色：黄色，价格：10
```



