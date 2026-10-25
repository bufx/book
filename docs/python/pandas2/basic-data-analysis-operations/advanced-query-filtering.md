# Pandas2高级查询过滤

介绍几个非常好用的数据过滤输出方法，它们经常用在一些复杂的数据处理过程中。

## 根据数据类型筛选列

`pandas` 的 `select_dtypes()` 方法用于根据数据类型筛选 DataFrame 的列，支持通过包含或排除特定数据类型来灵活选择数据。以下是详细说明及示例：

方法定义：

```python
DataFrame.select_dtypes(include=None, exclude=None)
```

参数说明：

*   `include`：包含的数据类型，支持字符串或列表。
*   `exclude`：排除的数据类型，同样支持字符串或列表。
*   至少需指定 `include` 或 `exclude` 中的一个。

支持的通用类型：

*   **数值类型**：`'number'`（包括 `int`、`float`、`complex` 等）。
*   **整数**：`'int'`（涵盖所有位宽，如 `int32`、`int64`）。
*   **浮点数**：`'float'`。
*   **对象类型**：`'object'`（通常为字符串或混合类型）。
*   **日期时间**：`'datetime'` 或 `'datetime64'`。
*   **时间增量**：`'timedelta'` 或 `'timedelta64'`。
*   **分类数据**：`'category'`。
*   **布尔类型**：`'bool'`。

示例：

```python
import pandas as pd

df = pd.read_excel('../student_scores.xlsx')  # 读取excel，返回DataFrame数据集对象

print(df)
print('------------------')

df = df.select_dtypes(include='number')  # 只保留数据类型的列
print(df)

#======输出======
     姓名      学号        出生日期 性别  语文分数  数学分数  英语分数
0   钱NU  s80191  2008-06-21  女     5    39    57
1   孙TA  s97980  2005-07-07  男    67    30     1
2   赵NZ  s91660  2005-04-29  女    68    84    47
3   王TK  s65913  2006-01-23  男    54     5    37
4   钱OK  s93724  2008-06-03  女    26    60    99
..  ...     ...         ... ..   ...   ...   ...
95  王hl  s54194  2008-10-31  女    49    76    54
96  李CQ  s33733  2005-09-15  男     7     7    95
97  赵GS  s45697  2005-05-27  女    60    99     8
98  赵zM  s16426  2008-02-20  女    55    85    49
99  赵vv  s36429  2008-06-13  女    11    48    98

[100 rows x 7 columns]
------------------
    语文分数  数学分数  英语分数
0      5    39    57
1     67    30     1
2     68    84    47
3     54     5    37
4     26    60    99
..   ...   ...   ...
95    49    76    54
96     7     7    95
97    60    99     8
98    55    85    49
99    11    48    98

[100 rows x 3 columns]
```

## 根据条件筛选

`pandas` 的 `where()` 方法用于根据条件筛选数据，**保留满足条件的值，并将不满足条件的值替换为指定的值**（默认为 `NaN`）。与 `numpy` 的 `where()` 不同，它更适用于对 DataFrame 或 Series 进行元素级的条件操作。以下是详细说明及示例：

方法定义：

```python
DataFrame.where(cond, other=nan, inplace=False, axis=None, level=None, errors='raise', try_cast=False)
```

参数详解：

| 参数       | 说明                                                         |
| :--------- | :----------------------------------------------------------- |
| `cond`     | 条件表达式（布尔类型的 `DataFrame`、`Series`、数组或可调用对象），决定保留哪些值。 |
| `other`    | 替换不满足条件的值，默认为 `NaN`。可以是标量、数组、`DataFrame`、`Series` 或可调用对象。 |
| `inplace`  | 是否原地修改数据（不推荐使用，建议直接赋值）。               |
| `axis`     | 对齐轴（默认为 `None`，按元素对齐）。                        |
| `level`    | 多层索引的层级。                                             |
| `errors`   | 处理无效值的方式（`'raise'` 或 `'ignore'`）。                |
| `try_cast` | 尝试将结果转换为输入类型（仅适用于某些特定类型）。           |

核心行为：

*   **保留满足条件的值**，不满足条件的值替换为 `other`。
*   与 `mask()` 方法相反：`df.where(cond)` 等价于 `df.mask(~cond)`。

示例一：

```python
import pandas as pd

df = pd.read_excel('../student_scores.xlsx')  # 读取excel，返回DataFrame数据集对象

print(df)
print('------------------')

# 只保留数据类型的列
df = df.select_dtypes(include='number')
print(df)
print('------------------')

# 查看及格的分数，其他用NaN显示
print(df.where(df >= 60))
print('------------------')

# 查看及格的分数，其他用'不及格'显示
print(df.where(df >= 60, '不及格'))
print('------------------')

# 支持lambda，查询数学分数大于90的数据
print(df.where(lambda d: d.数学分数 > 90))

#======输出======
     姓名      学号        出生日期 性别  语文分数  数学分数  英语分数
0   钱NU  s80191  2008-06-21  女     5    39    57
1   孙TA  s97980  2005-07-07  男    67    30     1
2   赵NZ  s91660  2005-04-29  女    68    84    47
3   王TK  s65913  2006-01-23  男    54     5    37
4   钱OK  s93724  2008-06-03  女    26    60    99
..  ...     ...         ... ..   ...   ...   ...
95  王hl  s54194  2008-10-31  女    49    76    54
96  李CQ  s33733  2005-09-15  男     7     7    95
97  赵GS  s45697  2005-05-27  女    60    99     8
98  赵zM  s16426  2008-02-20  女    55    85    49
99  赵vv  s36429  2008-06-13  女    11    48    98

[100 rows x 7 columns]
------------------
    语文分数  数学分数  英语分数
0      5    39    57
1     67    30     1
2     68    84    47
3     54     5    37
4     26    60    99
..   ...   ...   ...
95    49    76    54
96     7     7    95
97    60    99     8
98    55    85    49
99    11    48    98

[100 rows x 3 columns]
------------------
    语文分数  数学分数  英语分数
0    NaN   NaN   NaN
1   67.0   NaN   NaN
2   68.0  84.0   NaN
3    NaN   NaN   NaN
4    NaN  60.0  99.0
..   ...   ...   ...
95   NaN  76.0   NaN
96   NaN   NaN  95.0
97  60.0  99.0   NaN
98   NaN  85.0   NaN
99   NaN   NaN  98.0

[100 rows x 3 columns]
------------------
   语文分数 数学分数 英语分数
0   不及格  不及格  不及格
1    67  不及格  不及格
2    68   84  不及格
3   不及格  不及格  不及格
4   不及格   60   99
..  ...  ...  ...
95  不及格   76  不及格
96  不及格  不及格   95
97   60   99  不及格
98  不及格   85  不及格
99  不及格  不及格   98

[100 rows x 3 columns]
------------------
    语文分数  数学分数  英语分数
0    NaN   NaN   NaN
1    NaN   NaN   NaN
2    NaN   NaN   NaN
3    NaN   NaN   NaN
4    NaN   NaN   NaN
..   ...   ...   ...
95   NaN   NaN   NaN
96   NaN   NaN   NaN
97  60.0  99.0   8.0
98   NaN   NaN   NaN
99   NaN   NaN   NaN

[100 rows x 3 columns]
```

## 根据条件筛选

`pandas` 的 `mask()` 方法与 `where()` 方法功能相反，**用于替换满足条件的值为指定值**（默认为 `NaN`），**保留不满足条件的值**。它是数据清洗和条件替换的常用工具，适用于对 DataFrame 或 Series 进行元素级操作。以下是详细说明及示例：

方法定义：

```python
DataFrame.mask(
    cond,                # 条件表达式
    other=nan,           # 替换值（默认为NaN）
    inplace=False,       # 是否原地修改
    axis=None,           # 对齐轴
    level=None,          # 多层索引层级
    errors='raise',      # 错误处理
    try_cast=False       # 类型转换尝试
)
```

我们看下示例：

```python
import pandas as pd

df = pd.read_excel('../student_scores.xlsx')  # 读取excel，返回DataFrame数据集对象

print(df)
print('------------------')

# 只保留数据类型的列
df = df.select_dtypes(include='number')
print(df)
print('------------------')

# 保留不满足条件的数据，其他用NaN显示
print(df.mask(df >= 60))

#======输出======
     姓名      学号        出生日期 性别  语文分数  数学分数  英语分数
0   钱NU  s80191  2008-06-21  女     5    39    57
1   孙TA  s97980  2005-07-07  男    67    30     1
2   赵NZ  s91660  2005-04-29  女    68    84    47
3   王TK  s65913  2006-01-23  男    54     5    37
4   钱OK  s93724  2008-06-03  女    26    60    99
..  ...     ...         ... ..   ...   ...   ...
95  王hl  s54194  2008-10-31  女    49    76    54
96  李CQ  s33733  2005-09-15  男     7     7    95
97  赵GS  s45697  2005-05-27  女    60    99     8
98  赵zM  s16426  2008-02-20  女    55    85    49
99  赵vv  s36429  2008-06-13  女    11    48    98

[100 rows x 7 columns]
------------------
    语文分数  数学分数  英语分数
0      5    39    57
1     67    30     1
2     68    84    47
3     54     5    37
4     26    60    99
..   ...   ...   ...
95    49    76    54
96     7     7    95
97    60    99     8
98    55    85    49
99    11    48    98

[100 rows x 3 columns]
------------------
    语文分数  数学分数  英语分数
0    5.0  39.0  57.0
1    NaN  30.0   1.0
2    NaN   NaN  47.0
3   54.0   5.0  37.0
4   26.0   NaN   NaN
..   ...   ...   ...
95  49.0   NaN  54.0
96   7.0   7.0   NaN
97   NaN   NaN   8.0
98  55.0   NaN  49.0
99  11.0  48.0   NaN

[100 rows x 3 columns]
```