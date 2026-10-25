# Pandas2高级函数应用

Pandas提供了一些很有用的复用函数，工具函数，方便我们开发过程中简化代码和操作。我们有必要学习和掌握。

## apply()方法

`apply()` 是 pandas 中用于对 DataFrame 或 Series 按行/列应用自定义函数的核心方法。它提供了灵活的数据处理能力。

基本语法：

```python
# DataFrame 使用 apply()
df.apply(func, axis=0, raw=False, result_type=None, args=(), **kwargs)

# Series 使用 apply()
series.apply(func, args=(), **kwargs)
```

参数说明：

| 参数            | 说明                                                         |
| :-------------- | :----------------------------------------------------------- |
| **func**        | 要应用的函数，可以是内置函数、lambda 或自定义函数。          |
| **axis**        | 应用方向：<br>- 0 或 'index'：按列应用（默认）<br>- 1 或 'columns'：按行应用。 |
| **raw**         | 输入数据的类型：<br>- False（默认）：将行/列作为 Series 传递<br>- True：传递 NumPy 数组。 |
| **result_type** | 控制返回类型（仅在 axis=1 时有效）：<br>- 'expand'：将结果合并为 DataFrame<br>- 'reduce'：返回 Series（默认）<br>- 'broadcast'：保留原始形状。 |
| **args**        | 传递给 func 的额外位置参数（元组形式）。                     |
| **\*\*kwargs**  | 传递给 func 的关键字参数。                                   |

示例：

计算每列总和以及计算每行总和

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({'A': [1, 2], 'B': [3, 4]})
print(df)
print('------------------')


print(df.apply(np.sum)) # 计算每列的和
print('------------------')

print(df.apply(lambda row: row['A'] + row['B'], axis=1)) # 计算每行的和

#======输出======
   A  B
0  1  3
1  2  4
------------------
A    3
B    7
dtype: int64
------------------
0    4
1    6
dtype: int64
```

## pipe()方法

`pipe()` 是 pandas 中用于链式调用函数的工具，允许将 DataFrame 或 Series 作为参数传递给自定义函数，并支持多步骤操作。通过将数据处理流程分解为多个函数并用 `pipe()` 串联，代码可读性和复用性显著提升。以下是详细解析：

语法：

```python
df.pipe(func, *args, **kwargs)
```

*   **参数**：
    *   `func`：处理数据的函数（或包含函数和关键字参数的元组）。
    *   `*args`：传递给 func 的位置参数（第一个参数默认为 DataFrame 自身）。
    *   `**kwargs`：传递给 func 的关键字参数。
*   **返回值**：函数 `func` 处理后的结果（通常为 DataFrame 或 Series）。

我们看一个示例：

```python
import pandas as pd

# 创建一个简单的 DataFrame
data = {'A': [1, None, 3], 'B': [None, 5, 6]}
df = pd.DataFrame(data)
print(df)
print('------------------')

# 自定义函数 用于删除缺失值 并用0填充
def remove_na(df):
    return df.fillna(0)

# 自定义一个函数 用于添加列C 该列的值为A列和B列的和
def add_column(df):
    df['C'] = df['A'] + df['B']
    return df

# 使用 pipe() 方法
df_new = df.pipe(remove_na).pipe(add_column)
print(df_new)

#======输出======
     A    B
0  1.0  NaN
1  NaN  5.0
2  3.0  6.0
------------------
     A    B    C
0  1.0  0.0  1.0
1  0.0  5.0  5.0
2  3.0  6.0  9.0
```

### 与apply()比较

| 方法        | 操作对象              | 用途                            | 性能     |
| :---------- | :-------------------- | :------------------------------ | :------- |
| **pipe()**  | 整个 DataFrame/Series | 链式调用函数，处理整体数据      | 高效     |
| **apply()** | 行或列 (Series)       | 对每行/列应用函数（如逐行计算） | 逐行较慢 |

## map()方法

`map()` 是 pandas 中用于对 DataFrame 或者 Series 中的每个元素应用自定义函数的工具。它逐元素遍历数据，适合对全局DataFrame或者单个Series数据或者进行统一格式转换或简单计算。

语法：

```python
dmap(func, na_action=None)
```

*   **参数**：
    *   `func`：作用于每个元素的函数（输入标量值，返回标量值）。
    *   `na_action`（可选）：
        *   `None`（默认）：正常处理所有元素，包括 NaN。
        *   `'ignore'`：跳过 NaN 元素，不应用函数。
*   **返回值**：
    *   返回一个新的 DataFrame或者Series，原数据不受影响（需显式赋值覆盖）。

Series示例：

```python
import pandas as pd

s = pd.Series([1, 2, 3])
print(s)
print('------------------')

print(s.map(lambda x: x * 2)) # 对Series中的每个元素进行2倍操作

#======输出======
0    1
1    2
2    3
dtype: int64
------------------
0    2
1    4
2    6
dtype: int64
```

DataFrame示例：

```python
import pandas as pd
df = pd.DataFrame({'A': [1, 2], 'B': [3, 4]})
print(df)
print('------------------')

print(df.map(lambda x: x * 2))  # 所有元素翻倍

#======输出======
   A  B
0  1  3
1  2  4
------------------
   A  B
0  2  6
1  4  8
```

## agg()方法

`agg()`（或 `aggregate()`）是 pandas 中用于聚合计算的核心方法，可对 DataFrame、Series 或 GroupBy 对象执行灵活的聚合操作。它允许对多列应用多种函数，支持跨行统计、分组汇总及自定义逻辑，是数据分析中的常用工具。

基本语法：

```python
# 对 DataFrame 或 GroupBy 对象使用
df.agg(func=None, axis=0, *args, **kwargs)

# 对 Series 使用
series.agg(func=None, axis=0, *args, **kwargs)
```

参数说明：

| 参数           | 说明                                                         |
| :------------- | :----------------------------------------------------------- |
| **func**       | 聚合函数，支持函数名（字符串）、函数对象、函数列表或字典。   |
| **axis**       | 应用方向：<br>- 0 或 'index'：按列聚合（默认）<br>- 1 或 'columns'：按行聚合。 |
| **\*args**     | 传递给聚合函数的位置参数（如 `percentiles=[0.5, 0.9]`）。    |
| **\*\*kwargs** | 传递给聚合函数的关键字参数。                                 |

我们看几个示例：

示例 1：单列多函数聚合

```python
import pandas as pd

data = {
    'Price': [100, 150, 80, 200],
    'Quantity': [3, 2, 5, 4]
}
df = pd.DataFrame(data)
print(df)
print('------------------')

# 对 'Price' 列计算均值、最大值和极差
price_stats = df['Price'].agg(['mean', 'max', lambda x: x.max() - x.min()])
print(price_stats)

#======输出======
   Price  Quantity
0    100         3
1    150         2
2     80         5
3    200         4
------------------
mean        132.5
max         200.0
<lambda>    120.0
Name: Price, dtype: float64
```

示例 2：多列差异化聚合

```python
import pandas as pd

data = {
    'Price': [100, 150, 80, 200],
    'Quantity': [3, 2, 5, 4]
}
df = pd.DataFrame(data)
print(df)
print('------------------')

# 对 'Price' 求和和均值，对 'Quantity' 求最大值
result = df.agg({
    'Price': ['sum', 'mean'],
    'Quantity': 'max'
})
print(result)

#======输出======
   Price  Quantity
0    100         3
1    150         2
2     80         5
3    200         4
------------------
      Price  Quantity
sum   530.0       NaN
mean  132.5       NaN
max     NaN       5.0
```

示例 3：分组聚合

```python
import pandas as pd

data = {
    'Region': ['North', 'South', 'North', 'South'],
    'Sales': [200, 150, 300, 250],
    'Profit': [50, 30, 80, 40]
}
df = pd.DataFrame(data)
print(df)
print('------------------')

# 按 'Region' 分组后聚合
grouped = df.groupby('Region').agg({
    'Sales': ['sum', 'mean'],
    'Profit': lambda x: x.mean() / x.std()
})
print(grouped)

#======输出======
  Region  Sales  Profit
0  North    200      50
1  South    150      30
2  North    300      80
3  South    250      40
------------------
       Sales           Profit
         sum   mean  <lambda>
Region                       
North    500  250.0  3.064129
South    400  200.0  4.949747
```

## transform()方法

`transform()` 是 pandas 中用于 **保持数据形状不变** 的转换方法，尤其适合在分组操作中应用函数后保留原始数据的维度。与 `agg()`（聚合）不同，`transform()` 会将计算结果广播到每个元素的位置，确保输出与输入的行数一致。以下是其核心特性和使用方法的详细解析：

语法：

```python
# 对 DataFrame/Series 使用
df.transform(func, axis=0, *args, **kwargs)

# 对 GroupBy 对象使用
grouped.transform(func, *args, **kwargs)
```

参数说明：

| 参数           | 说明                                                         |
| :------------- | :----------------------------------------------------------- |
| **func**       | 应用于数据的函数，支持字符串函数名、函数对象、列表或字典。   |
| **axis**       | 应用方向（仅对非分组对象有效）：<br>- 0 或 'index'：按列处理<br>- 1 或 'columns'：按行处理。 |
| **\*args**     | 传递给函数的位置参数。                                       |
| **\*\*kwargs** | 传递给函数的关键字参数。                                     |

| 场景           | 推荐方法                 |
| :------------- | :----------------------- |
| 多步骤链式处理 | `pipe()`                 |
| 逐行/列计算    | `apply()`                |
| 聚合统计       | `agg()` 或 `transform()` |

示例 1：分组求和和广播

```python
import pandas as pd

# 创建示例数据
df = pd.DataFrame({
    'Group': ['A', 'A', 'B', 'B', 'B'],
    'Value': [1, 2, 3, 4, 5]
})
print(df)
print('------------------')

# 计算每组的和，并广播到每个元素
df['Group_Sum'] = df.groupby('Group')['Value'].transform('sum')
print(df)

#======输出======
  Group  Value
0     A      1
1     A      2
2     B      3
3     B      4
4     B      5
------------------
  Group  Value  Group_Sum
0     A      1          3
1     A      2          3
2     B      3         12
3     B      4         12
4     B      5         12
```

示例 2：自定义函数（组内去均值）

```python
import pandas as pd

# 创建示例数据
df = pd.DataFrame({
    'Group': ['A', 'A', 'B', 'B', 'B'],
    'Value': [1, 2, 3, 4, 5]
})
print(df)
print('------------------')

def demean(x):
    return x - x.mean()

# 计算每组的均值，并从每个元素中广播去均值，实现去内均值
df['Demeaned'] = df.groupby('Group')['Value'].transform(demean)
print(df)

#======输出======
  Group  Value
0     A      1
1     A      2
2     B      3
3     B      4
4     B      5
------------------
  Group  Value  Demeaned
0     A      1      -0.5
1     A      2       0.5
2     B      3      -1.0
3     B      4       0.0
4     B      5       1.0
```

### 与 agg() 和 apply() 的对比

| 方法            | 返回结果形状            | 典型用途                   | 性能 |
| :-------------- | :---------------------- | :------------------------- | :--- |
| **transform()** | 与原数据相同            | 组内标准化、填充、排名     | 高   |
| **agg()**       | 聚合后缩减（如单值/组） | 统计汇总（总和、均值等）   | 高   |
| **apply()**     | 任意形状                | 复杂逻辑（可返回任意结构） | 低   |

## copy()方法

`copy()` 是 pandas 中用于**创建对象副本**的方法，核心目的是避免因共享数据或视图操作引发意外的副作用。在数据操作中，如果不显式复制，某些操作可能作用于原始数据或临时中间对象，导致修改“丢失”或产生难以追踪的副作用。`copy()` 让你能明确控制操作对象是独立副本还是惰性副本。

**核心功能：**

- **创建独立副本**：`deep=True` 时生成与原始数据完全独立的新对象，修改副本不会影响原数据。
- **明确操作意图**：在从 DataFrame 筛选出子集后继续修改时，显式 `.copy()` 可表明你确实想要一个独立对象，避免歧义。
- **控制拷贝深度**：支持深拷贝（`deep=True`，默认）和浅拷贝（`deep=False`），但浅拷贝的语义在 pandas 3.0 前后发生了本质变化，需要特别注意。

基本语法：

```python
# DataFrame 使用 copy()
df_copy = df.copy(deep=True)    # 深拷贝（默认）
df_shallow = df.copy(deep=False) # 浅拷贝（惰性副本）

# Series 同理
series_copy = series.copy(deep=True)
```

**深拷贝 vs 浅拷贝（需区分 pandas 版本）：**

| 类型                    | 行为（pandas 3.0 前，CoW 未默认启用）                        | 行为（pandas 3.0+，CoW 默认）                                | 内存占用       | 适用场景                      |
| :---------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :------------- | :---------------------------- |
| **深拷贝** `deep=True`  | 递归复制数据和索引，完全独立于原对象。但若元素是 Python 对象，只复制引用，不递归复制对象内部 | 行为不变                                                     | 高             | 需要完全隔离修改              |
| **浅拷贝** `deep=False` | 仅复制数据和索引的引用，修改一方会影响另一方                 | **惰性副本**：仍不立即复制数据，但任一方被修改时会触发复制，**双方互不影响** | 低（延迟复制） | 只需临时结构、且接受 CoW 语义 |

> 关键变化：pandas 3.0 起 Copy-on-Write 成为默认，`deep=False` 不再是“改一个影响另一个”的旧语义，而是“写时复制”的惰性副本。

对比示例：

```python
import pandas as pd

# 原始数据
df = pd.DataFrame({'A': [1, 2], 'B': [3, 4]})
print(df)
print('------------------')

# 深拷贝（独立数据）
df_deep = df.copy(deep=True)
print('深拷贝的数据：')
print(df_deep)
print('------------------')
df_deep.loc[0, 'A'] = 100  # 仅修改副本
print('修改深拷贝数据后,原始数据不变：')
print(df)  # 原数据不变
print('------------------')
print('修改深拷贝数据后,深拷贝数据被修改：')
print(df_deep)  # 深拷贝数据被修改
print('------------------')

# 浅拷贝（共享数据）
df_shallow = df.copy(deep=False)
print('浅拷贝的数据：')
print(df_shallow)
print('------------------')
df_shallow.loc[0, 'A'] = 200  # 修改会影响原数据！
print('修改浅拷贝后（CoW 下原数据也不变）：')
print(df)  # 原数据被修改
print('------------------')
print('修改浅拷贝数据后,浅拷贝数据被修改：')
print(df_shallow)

#======输出======
   A  B
0  1  3
1  2  4
------------------
深拷贝的数据：
   A  B
0  1  3
1  2  4
------------------
修改深拷贝数据后,原始数据不变：
   A  B
0  1  3
1  2  4
------------------
修改深拷贝数据后,深拷贝数据被修改：
     A  B
0  100  3
1    2  4
------------------
浅拷贝的数据：
   A  B
0  1  3
1  2  4
------------------
修改浅拷贝后（CoW 下原数据也不变）：
   A  B
0  1  3
1  2  4
------------------
修改浅拷贝数据后,浅拷贝数据被修改：
     A  B
0  200  3
1    2  4
```