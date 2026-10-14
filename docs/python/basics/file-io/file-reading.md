# 文件读取操作

## 引入

Python的内置库提供了对文件的IO操作，可以对文件进行打开,读,写,关闭等操作。

首先用Python内置的open()函数打开一个文件，创建一个file对象，相关的方法才可以调用它进行 读写。

语法：`file object = open(file_name, mode, encoding....)`

- `filename`：一个包含了你要访问的文件名称的字符串值，要求是全路径或者相对路径
- `mode`：文件的访问模式，只读，写入，追加等
- `encoding`：读取数据的编码格式，只有文本文件时才能加该参数

mode是文件的读写方式:

- `r`：只读模式，不能写入，默认的格式，必须是文件已经存在
- `w`：只写模式，覆盖写入，如果文件不存在，创建文件并写入
- `a`：追加写入，在原来文件内容的基础上，继续写入数据
- `r+`：读写模式，需要文件已存在
- `w+`：读写模式，文件可以不存在，它可以先创建、再读写
- `b`：二进制读写，对非文本文件的读写

## 基本读取操作

编写测试.txt文本：

```text
python.org是个学习python的好网站
spring.io是个学习Java的好网站
都会这两个就更好了
```

### 打开文件 `open`

```python
# 打开文件 open() r 只读模式 要求文件必须存在
f = open("测试.txt", "r", encoding="utf-8")
print(type(f))

#======输出======
<class '_io.TextIOWrapper'>
```

### 读取文件 `read`

注意：当文件读取以后，会有一个游标停在那里，如果继续读取的话，从游标的位置继续往后读，除非关闭文件close()

```python
# 打开文件 open() r 只读模式 要求文件必须存在
f = open("测试.txt", "r", encoding="utf-8")

# 读取文件 read()
print("读取15个字符：", f.read(15))
print("读取全部内容：", f.read())

#======输出======
读取15个字符： python.org是个学习p
读取全部内容： ython的好网站
spring.io是个学习Java的好网站
都会这两个就更好了
```

### 读取文件全部行`readlines`

返回列表 ，并可以用遍历来输出每行

```python
# 打开文件 open() r 只读模式 要求文件必须存在
f = open("测试.txt", "r", encoding="utf-8")

# 读取文件全部行，返回列表 readlines()
lines = f.readlines()
print(type(lines))
print(lines)
for line in lines:
    print(line, end = "")

#======输出======
<class 'list'>
['python.org是个学习python的好网站\n', 'spring.io是个学习Java的好网站\n', '都会这两个就更好了']
python.org是个学习python的好网站
spring.io是个学习Java的好网站
都会这两个就更好了
```

### 逐行读取 `readline`

如果有很多行，这种写法不现实

```python
# 打开文件 open() r 只读模式 要求文件必须存在
f = open("测试.txt", "r", encoding="utf-8")

# 逐行读取 readline()
print(f.readline(), end = "")
print(f.readline(), end = "")
print(f.readline(), end = "")

#======输出======
python.org是个学习python的好网站
spring.io是个学习Java的好网站
都会这两个就更好了
```

所以可以用while来遍历逐行读取：

```python
# 打开文件 open() r 只读模式 要求文件必须存在
f = open("测试.txt", "r", encoding="utf-8")

line = f.readline()
while line:
    print(line, end = "")
    line = f.readline()

#======输出======
python.org是个学习python的好网站
spring.io是个学习Java的好网站
都会这两个就更好了
```

### 逐行读取for遍历

while的写法还可以用简化的for遍历(**最常用**)

```python
# 打开文件 open() r 只读模式 要求文件必须存在
f = open("测试.txt", "r", encoding="utf-8")

# 简化的for遍历
for line in f:
    print(line, end = "")

#======输出======
python.org是个学习python的好网站
spring.io是个学习Java的好网站
都会这两个就更好了
```

### 手动关闭文件对象

上面的一些文件操作都需要显示的调用close()方法，关闭文件对象。

```python
f.close()
```

### 自动关闭对象

前面读取文件方式，都是需要显示的调用close()方法，关闭文件对象。有时候写代码，忘记关闭，那就麻烦了。

所以python提供了一种自动关闭文件对象的操作方式。

`with open` ：**执行完后，自动关闭文件对象**

```python
# 自动关闭文件对象
with open("测试.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line, end="")

#======输出======
python.org是个学习python的好网站
spring.io是个学习Java的好网站
都会这两个就更好了
```