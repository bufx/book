# Pandas2数据类型转换操作

Pandas 提供了灵活的方法来处理数据类型转换，以下是最常见操作及代码示例：

## 查看数据类型

```python
import pandas as pd

df = pd.DataFrame({
    'A': ['1', '2', '3'],
    'B': [4, 5, 6],
    'C': ['2025-01-01', '2025-02-01', '2025-03-01']
})

print(df)
print('-----------------')
print(df.dtypes)

#======输出======
   A  B           C
0  1  4  2025-01-01
1  2  5  2025-02-01
2  3  6  2025-03-01
-----------------
A      str
B    int64
C      str
dtype: object
```

## 使用 astype()

**使用 astype() 转换类型**

基本转换：

```python
import pandas as pd

df = pd.DataFrame({
    'A': ['1', '2', '3'],
    'B': [4, 5, 6],
    'C': ['2025-01-01', '2025-02-01', '2025-03-01']
})

df['A'] = df['A'].astype(int)     # 转换为整数
df['B'] = df['B'].astype(float)   # 转换为浮点数
print(df.dtypes)
print('-----------------')
print(df)

#======输出======
A      int64
B    float64
C        str
dtype: object
-----------------
   A    B           C
0  1  4.0  2025-01-01
1  2  5.0  2025-02-01
2  3  6.0  2025-03-01
```

## 使用 pd.to_numeric()

**使用 pd.to_numeric() 处理数值转换**

to_numeric()方法详解：

```python
pandas.to_numeric(
    arg,
    errors='raise',
    downcast=None
)
```

参数说明：

| 参数       | 类型                                                  | 说明                                                         |
| :--------- | :---------------------------------------------------- | :----------------------------------------------------------- |
| `arg`      | Series, list, 一维数组                                | 需要转换的输入数据                                           |
| `errors`   | {'ignore', 'raise', 'coerce'}, 默认 'raise'           | 控制无效值的处理方式：<br>- 'raise'：遇到非数值字符报错（默认）<br>- 'coerce'：将无效值转为 NaN<br>- 'ignore'：保留原值，不转换（**pandas 1.3+弃用**） |
| `downcast` | {'integer', 'signed', 'unsigned', 'float'}, 默认 None | 降低内存占用：<br>- 'integer' / 'signed' / 'unsigned'：寻找最小整数类型（如 int8, int16）<br>- 'float'：寻找最小浮点类型（如 float32） |

使用 `errors='coerce'` 避免转换失败导致程序中断。

```python
import pandas as pd

s = pd.Series(['1', '2', 'apple', '4'])

print(s)
print('-----------------')

s_numeric = pd.to_numeric(s, errors='coerce')  # 无效值转为 NaN
print(s_numeric)

print('-----------------')
s2 = pd.Series([1.0, 2.0, 3.0])
s2 = pd.to_numeric(s2, downcast='integer')  # 转换为最小整数类型 (int8/int16/...)
print(s2)

#======输出======
0        1
1        2
2    apple
3        4
dtype: str
-----------------
0    1.0
1    2.0
2    NaN
3    4.0
dtype: float64
-----------------
0    1
1    2
2    3
dtype: int8
```

## 日期时间转换to_datetime()

```python
import pandas as pd

df = pd.DataFrame({
    'A': ['1', '2', '3'],
    'B': [4, 5, 6],
    'C': ['2025-01-01', '2025-02-01', 'ccc']
})
print(df)
print('-----------------')
print(df.dtypes)
print('-----------------')

df['C'] = pd.to_datetime(df['C'], errors='coerce')  # 转换为 datetime 类型
print(df)
print('-----------------')
print(df.dtypes)

#======输出======
   A  B           C
0  1  4  2025-01-01
1  2  5  2025-02-01
2  3  6         ccc
-----------------
A      str
B    int64
C      str
dtype: object
-----------------
   A  B          C
0  1  4 2025-01-01
1  2  5 2025-02-01
2  3  6        NaT
-----------------
A               str
B             int64
C    datetime64[us]
dtype: object
```

## 处理缺失值与类型推断

### 处理缺失值 fillna()

fillna()填充缺失值后转换：`fillna(22) 填充 NaN 为 22`

```python
import pandas as pd

df = pd.DataFrame({
    'A': ['1', '2', '3'],
    'B': [4, 5, 6],
    'C': ['2025-01-01', '2025-02-01', 'ccc']
})
print(df)
print('-----------------')

df['D'] = ['10', None, '30'] # 添加一列
print(df)
print('-----------------')
print(df.dtypes)
df['D'] = df['D'].fillna(22).astype(int)  # 填充 NaN 后转为整数 fillna(22) 填充 NaN 为 22
print('-----------------')
print(df)
print('-----------------')
print(df.dtypes)

#======输出======
   A  B           C
0  1  4  2025-01-01
1  2  5  2025-02-01
2  3  6         ccc
-----------------
   A  B           C    D
0  1  4  2025-01-01   10
1  2  5  2025-02-01  NaN
2  3  6         ccc   30
-----------------
A      str
B    int64
C      str
D      str
dtype: object
-----------------
   A  B           C   D
0  1  4  2025-01-01  10
1  2  5  2025-02-01  22
2  3  6         ccc  30
-----------------
A      str
B    int64
C      str
D    int64
dtype: object
```

### 类型推断 convert_dtypes()

Pandas可以用`convert_dtypes`智能地推断各列的数据类型，会返回一个按推断修改后的DataFrame。

```python
import pandas as pd

df = pd.DataFrame({
    'A': ['1', '2', '3'],
    'B': [4, 5, 6]
})
print(df)
print('-----------------')
print(df.dtypes)
df = df.convert_dtypes()  # 自动推断更合适的数据类型
print('-----------------')
print(df)
print('-----------------')
print(df.dtypes)

#======输出======
   A  B
0  1  4
1  2  5
2  3  6
-----------------
A      str
B    int64
dtype: object
-----------------
   A  B
0  1  4
1  2  5
2  3  6
-----------------
A    string
B     Int64
dtype: object
```