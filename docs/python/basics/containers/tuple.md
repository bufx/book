# 元组tuple

元组是多个元素的集合，但是不能修改，区别于列表。

## 元组的定义

语法：
```python
# 赋值定义
元组变量名称 = ( 元素1, 元素2, 元素3, 元素4, ... )
# 空元组定义
元组变量名称 =()
元组变量名称 = tuple()
```

注意点：

**假如只有一个元素，后面要加个逗号，否则会当做字符串定义处理**

示例：

```python
"""
    元组的定义
"""
# 赋值定义
t1 = ("java", "python", "c",)
print(f"t1={t1}, 类型={type(t1)}")

# 注意点，假如只有一个元素，后面要加个逗号，否则会当做字符串定义处理
t2 = ("java")
print(f"t2={t2}, 类型={type(t2)}")

t3 = ("java",)
print(f"f3={t3}, 类型={type(t3)}")

# 空元组定义
t4 = ()
t5 = tuple()
print(f"t4={t4}, 类型={type(t4)}")
print(f"t5={t5}, 类型={type(t5)}")

# 元组里的元素类型没有限制
t6 = ("python", 222, 4.145, True)
print(f"t6={t6}, 类型={type(t6)}")

# 元组里可以嵌套元组
t7 = ((1, 2, 3), (4, 5, 6),)
print(f"t7={t7}, 类型={type(t7)}")

#======输出======
t1=('java', 'python', 'c'), 类型=<class 'tuple'>
t2=java, 类型=<class 'str'>
f3=('java',), 类型=<class 'tuple'>
t4=(), 类型=<class 'tuple'>
t5=(), 类型=<class 'tuple'>
t6=('python', 222, 4.145, True), 类型=<class 'tuple'>
t7=((1, 2, 3), (4, 5, 6)), 类型=<class 'tuple'>
```

## 元组的常用方法

下标索引用法和列表一样，唯一区别就是不能修改元素

### 基础用法

示例：

```python
"""
    元组的常用方法
"""
t1 = ("java", "python", "c",)
# 下标索引用法和列表一样，唯一区别就是不能修改元素
print(t1[1])
print(t1[-1])
t1[2] = "c#"

t2 = ((1, 2, 3), (4, 5, 6),)
print(t2[1][1])

#======输出======
python
c
Traceback (most recent call last):
  File "元组的常用方法.py", line 8, in <module>
    t1[2] = "c#"
    ~~^^^
TypeError: 'tuple' object does not support item assignment
```

### index

查找元组中指定元素的下标，不存在就报错

语法：`index(元素)方法`

```python
# index(元素)方法，查找元组中指定元素的下标，不存在就报错
t3 = ("java", "python", "c",)
print(t3.index("python"))

#======输出======
1
```

### count

统计某元素在元组中的个数

语法：`count(元素)`

```python
# count(元素) 统计某元素在元组中的个数
t4 = ("java", "python", "c", "python", "php")
print(t4.count("python"))

#======输出======
2
```

### len

统计元组内一共有多少元素

语法：`len(元组)`

```py
# len(元组)，统计元组内一共有多少元素
t5 = ("java", "python", "c", "python", "php")
print(len(t5))

#======输出======
5
```

## 元组的遍历

若需要获取元组的所有元素，我们可以通过前面学过的while或者for循环遍历来获取;

```python
t6 = ["java", "python", "c"]

# for循环
for ele in t6:
    print(ele)

# while循环
i = 0
while i < len(t6):
    ele = t6[i]
    print(ele)
    i += 1

#======输出======
java
python
c
java
python
c
```

