# 模块的概念和基本使用

在Python的标准安装中，包含了一组自带的模块，这些模块被成为“标准库”。比如常用的 math,random,datetime,os,json等等。

此外，还有很多的第三方模块，比如pymysql,numpy,requests,pandas等等。通过这些强大的扩展库， 形成了Python的强大“生态圈”

## 模块概念

Python的模块(Module)，其实就是.py结尾的Python文件，模块里可以定义类，变量，函数，以及可执 行的代码。我们导入模块，就可以用这些模块的功能

## 基本使用

模块导入有两种语法。

### 导入整个模块

导入整个模块，**这里导入的整个模块内的所有成员，包括变量，函数，类等。**

语法：`import 模块名1 [ as 别名1 ], 模块名2 [ as 别名2 ], ...，模块名n [ as 别名n ]`

示例一：import 模块名

```python
import random

print(random.randint(1, 10))

#======输出======
10
```

示例二：import 模块名 as 别名

```python
import random as r

print(r.randint(1, 10))

#======输出======
4
```

示例三：import 模块1,模块2

```python
import random, time

print("开始，过5秒执行")
time.sleep(5)
print(random.randint(1, 10))
print("结束")

#======输出======
开始，过5秒执行
1
结束
```

示例四：import 模块1 as 别名1,模块2 as 别名2

```python
import random as r, time as t

print("开始，过5秒执行")
t.sleep(5)
print(r.randint(1, 10))
print("结束")

#======输出======
开始，过5秒执行
8
结束
```



### 导入模块中指定成员

导入整个模块，**成员可以是变量，函数，类等。**

语法：`from 模块名 import 成员名1 [ as 别名1 ], 成员名2 [ as 别名2 ], ...，成员名2 [ as 别名2 ] `

示例一：from 模块 import 成员

```python
from random import randint

print(randint(1, 10))

#======输出======
10
```

示例二：from 模块 import 成员 as 成员别名

```python
from random import randint as ri

print(ri(1, 10))

#======输出======
5
```

示例三：from 模块 import 成员1,成员2

```python
from random import randint, random

print(randint(1, 10))
print(random()) # 随机生成0到1的小数 包含0

#======输出======
9
0.863139179422507
```

示例四：from 模块 import 成员1 as 成员别名1,成员2 as 成员别名2

```python
from random import randint as ri, random as rd

print(ri(1, 10))
print(rd()) 

#======输出======
1
0.5458171205657718
```

示例五：from 模块 import *

```py
from random import *

print(randint(1, 10))
print(random())

#======输出======
9
0.3077937352232275