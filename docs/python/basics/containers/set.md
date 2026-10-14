# 集合set

集合是多个元素的集合，但是不能有重复元素，是`{}`，区别于列表[]，元组()和字符串""。

## 集合的定义

语法：

```python
#赋值定义
集合变量名称 ={元素1, 元素2, 元素3, 元素4, ...}
#空集合定义
集合变量名称 = set()
```

示例：
```python
"""
    集合的定义
"""
# 定义集合
set1 = {"java", "python", "php"}
set2 = {"java", "python", "php", "java"}
print(f"set1 = {set1}, type={type(set1)}")
print(f"set2 = {set2}, type={type(set2)}")

# 定义空集合
set3 = set()
print(f"set3 = {set3}, type={type(set3)}")

#======输出======
set1 = {'java', 'php', 'python'}, type=<class 'set'>
set2 = {'java', 'php', 'python'}, type=<class 'set'>
set3 = set(), type=<class 'set'>
```

## 集合的常用方法

因为集合是无序的，所以集合不支持下标索引访问。
集合和列表一样，也是可以修改的。

### add

添加元素到集合，假如元素集合里存在，则忽略

语法：`add(元素)`

```python
"""
    集合的常用方法
"""
# add(元素),添加元素到集合，假如元素集合里存在，则忽略
set1 = {"java", "python", "php"}
set1.add("c")
set1.add("java")
print(set1)

#======输出======
{'php', 'java', 'python', 'c'}
```

### pop

随机从集合中获取一个元素，并且返回；原集合会少一个

语法：`pop()`

```python
# pop()，随机从集合中获取一个元素，并且返回；原集合会少一个
set2 = {"java", "python", "php"}
set2_1 = set2.pop()
print(set2)
print(set2_1)

#======输出======
{'python', 'java'}
php
```

### clear

清空集合

语法：`clear()`

```python
# clear()，清空集合
set3 = {"java", "python", "php"}
set3.clear()
print(set3)

#======输出======
set()
```

### difference

返回差集

语法：

`集合1.difference(集合2)`：**集合1有但是集合2没有的新集合；原集合都不变**

```python
# 集合1.difference(集合2) 返回差集 (集合1有但是集合2没有的新集合)；原集合都不变
set4 = {"a", "b", "c"}
set5 = {"a", "d", "e"}
set4_1 = set4.difference(set5)
print(set4)
print(set5)
print(set4_1)

#======输出======
{'c', 'a', 'b'}
{'a', 'd', 'e'}
{'c', 'b'}
```

### difference_update

删除差集

语法：

`集合1.difference_update(集合2) `：**集合1内，删除和集合2相同的元素；集合1变了，集合2不变**

```python
# 集合1.difference_update(集合2) ,删除差集。集合1内，删除和集合2相同的元素;集合1变了，集合2不变
set6 = {"a", "b", "c"}
set7 = {"a", "d", "e"}
set6.difference_update(set7)
print(set6)
print(set7)

#======输出======
{'b', 'c'}
{'e', 'a', 'd'}
```

### union

语法：

`集合1.union(集合2)`：**返回合并集合1，集合2后的新集合；原集合都不变**

```python
# 集合1.union(集合2)，返回合并集合1，集合2后的新集合;原集合都不变
set8 = {"a", "b", "c"}
set9 = {"a", "d", "e"}
set8_1 = set8.union(set9)
print(set8)
print(set9)
print(set8_1)

#======输出======
{'c', 'b', 'a'}
{'a', 'e', 'd'}
{'b', 'c', 'e', 'd', 'a'}
```

### len

统计元素个数

语法：`len(集合)`

```python
# len(集合)统计元素个数
set10 = {"a", "b", "c"}
print(len(set10))

#======输出======
3
```

## 集合的遍历

因为集合不支持下标索引，所以不能用while循环，可以用for循环遍历

```python
# 遍历
set11 = {"a", "b", "c"}
for ele in set11:
    print(ele)

#======输出======
a
b
c
```



