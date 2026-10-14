# 字符串str

字符串是多个字符的集合，同元组一样，是无法修改字符串内容的。

## 字符串的定义

语法：`字符串变量="内容"`

示例：

```python
"""
    字符串的定义
"""
str1 = "python.org 是个学习python的好地方"
print(f"str1={str1}, 类型是：{type(str1)}")
print(str1[1])
print(str1[-1])

#======输出======
str1=python.org 是个学习python的好地方, 类型是：<class 'str'>
y
方
```

## 字符串的常用方法

下标索引操作和前面的列表、元组用法一样。

虽然字符串不能被修改，但是返回一个操作过的新字符串，所以方法还不少。

### index

查找字符串中指定元素的下标，不存在就报错

语法：`index(元素)方法`

示例：

```python
# index(元素)方法，查找字符串中指定元素的下标，不存在就报错
str2 = "python.org 是个学习python的好地方"
print(str2.index("的"))

#======输出======
21
```

### replace

把字符串内的所有字符串1,替换成字符串2，然后方法返回一个 新字符串。(不是修改字符串操作)

如果不想全部替换，只替换前几个 用 replace(old字符串1，new字符串2，count)方法。

语法：

- `replace(old字符串1，new字符串2)`
- `replace(old字符串1，new字符串2，count)`

示例：

```python
# replace(old字符串1，new字符串2)，把字符串内的所有字符串1,替换成字符串2，然后方法返回一个 新字符串。(不是修改字符串操作)
# 如果不想全部替换，只替换前几个 用 replace(old字符串1，new字符串2，count)方法。
str3 = "python.org 是个学习python的好地方, 我要成为python老鸟"
str3_1 = str3.replace("python", "java")
print(str3)
print(str3_1)
str3_2 = str3.replace("python", "java", 2)
print(str3_2)

#======输出======
python.org 是个学习python的好地方, 我要成为python老鸟
java.org 是个学习java的好地方, 我要成为java老鸟
java.org 是个学习java的好地方, 我要成为python老鸟
```

### split

根据指定的分隔符字符串，将字符串分割成多个字符串，并存入列表对象中，方法返回列表对象。(不是修改字符串操作)

语法：`split(分隔符字符串)`

示例：

```python
# split(分隔符字符串)，根据指定的分隔符字符串，将字符串分割成多个字符串，并存入列表对象中，方法返回列表对象。(不是修改字符串操作)
str4 = "java php python"
l1 = str4.split(" ")
print(f"l1={l1}, type={type(l1)}")
str5 = "java,php,python"
l2 = str5.split(",")
print(f"l2={l2}, type={type(l2)}")

#======输出======
l1=['java', 'php', 'python'], type=<class 'list'>
l2=['java', 'php', 'python'], type=<class 'list'>
```

### strip

去掉前后空格，返回新的字符串

还可以去掉前后指定的字符串，返回新的字符串

语法：

- `strip()`
- `strip(字符串)`

示例：

```python
# strip()，去掉前后空格，返回新的字符串
# strip(字符串)，还可以去掉前后指定的字符串，返回新的字符串
str6 = "    java php python  "
print(str6)
print(str6.strip())
str7 = "@#java php python #@"
print(str7)
print(str7.strip("@#"))

#======输出======
    java php python  
java php python
@#java php python #@
java php python 
```

### count

统计字符串中出现指定字符串的个数

语法：`count(字符串)`

示例：

```python
# count(字符串)，统计字符串中出现指定字符串的个数
str8 = "java php python"
print(str8.count("th"))

#======输出======
1
```

### len

统计字符串的长度

语法：`len(字符串)`

示例：

```python
# len(字符串)，统计字符串的长度
str9 = "java php python"
print(len(str9))

#======输出======
15
```

