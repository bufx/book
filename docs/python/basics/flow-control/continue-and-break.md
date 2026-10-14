# 循环控制continue和break

## 介绍

为了增强循环控制逻辑能力，python提供了`continue`和`break`循环控制支持。 

- **continue** 中断本次循环，直接进入下一次循环

- **break** 直接结束循环

示例：continue案例，跳过4打印结果

```python
"""
    循环控制continue和break
"""

# 正常循环
for i in range(1, 10):
    print(i, end = " ")
print()

# continue语句，跳过4打印结果
for i in range(1, 10):
    if i == 4:
        continue
    print(i, end = " ")
print()

#======输出======
1 2 3 4 5 6 7 8 9 
1 2 3 5 6 7 8 9 
```

示例：break案例，遇到4直接结束:

```python
"""
    循环控制continue和break
"""

# 正常循环
for i in range(1, 10):
    print(i, end = " ")
print()

# break语句，遇到4直接结束
for i in range(1, 10):
    if i == 4:
        break
    print(i, end = " ")
print()

#======输出======
1 2 3 4 5 6 7 8 9 
1 2 3 
```



## 求水仙花数

水仙花数是指一个 3 位数，它的每个数位上的数字的 3次幂之和等于它本身。例如:1^3 + 5^3+ 3^3 =153。

示例：用for循环实现

```python
"""
    求水仙花数
    水仙花数是指一个 3 位数，它的每个数位上的数字的 3次幂之和等于它本身。例如:1^3 + 5^3+ 3^3 =153。
"""

# 用for循环实现
# 数字xyz
for x in range(1, 10):  # 百位数x，取值范围1-9
    for y in range(0, 10):  # 十位数y，取值范围0-9
        for z in range(0, 10):  # 个位数z，取值范围0-9
            s1 = x * 100 + y * 10 + z  # 本身值
            s2 = x ** 3 + y ** 3 + z ** 3  # 每个数位上的数字的 3次幂之和
            if s1 == s2:
                print(f"for循环实现水仙花数有：{s1}")

#======输出======
for循环实现水仙花数有：153
for循环实现水仙花数有：370
for循环实现水仙花数有：371
for循环实现水仙花数有：407
```

示例：用while循环实现

```python
# 用while循环实现
# 数字xyz
x = 1
while x <= 9:  # 百位数x，取值范围1-9
    y = 0
    while y <= 9: # 十位数y，取值范围0-9
        z = 0
        while z <= 9: # 个位数z，取值范围0-9
            s1 = x * 100 + y * 10 + z  # 本身值
            s2 = x ** 3 + y ** 3 + z ** 3  # 每个数位上的数字的 3次幂之和
            if s1 == s2:
                print(f"while循环实现水仙花数有：{s1}")
            z += 1
        y += 1
    x += 1

#======输出======
while循环实现水仙花数有：153
while循环实现水仙花数有：370
while循环实现水仙花数有：371
while循环实现水仙花数有：407
```



