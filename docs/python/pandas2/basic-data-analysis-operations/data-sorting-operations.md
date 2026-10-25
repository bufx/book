# Pandas2数据排序操作

Pandas 2提供了多种灵活的数据排序方法，主要针对 DataFrame 和 Series 对象。

## 按值排序：sort_values()

这是最常用的排序方法，根据指定列或行的值进行排序。

具体语法：

```python
DataFrame.sort_values(by, axis=0, ascending=True, inplace=False, na_position='last')
```

参数说明：

*   `by`：要排序的列名（或行索引），可以是单个字符串或列表（多列排序）。
*   `axis`：排序方向，`0` 表示按列排序（默认），`1` 表示按行排序。
*   `ascending`：排序顺序，`True` 为升序，`False` 为降序（多列时可传入列表指定每列顺序）。
*   `inplace`：是否直接修改原对象，`False` 时返回新对象（默认）。
*   `na_position`：缺失值的位置，`'last'`（默认）或 `'first'`。

参考示例：

```python
import pandas as pd

data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David'],
    'Age': [25, 30, 22, 28],
    'Score': [85, 95, 75, 85]
}
df = pd.DataFrame(data)
print(df)
print('-----------------')


# 单列升序排序
df_sorted = df.sort_values(by='Age')
print(df_sorted)
print('-----------------')

# 多列排序：先按 Score 降序，再按 Age 升序
df_sorted = df.sort_values(by=['Score', 'Age'], ascending=[False, True])
print(df_sorted)

#======输出======
      Name  Age  Score
0    Alice   25     85
1      Bob   30     95
2  Charlie   22     75
3    David   28     85
-----------------
      Name  Age  Score
2  Charlie   22     75
0    Alice   25     85
3    David   28     85
1      Bob   30     95
-----------------
      Name  Age  Score
1      Bob   30     95
0    Alice   25     85
3    David   28     85
2  Charlie   22     75
```

## 按索引排序：sort_index()

根据索引（行或列标签）进行排序，常用于时间序列或需要恢复原始顺序的场景。

基本语法：

```python
DataFrame.sort_index(axis=0, ascending=True, inplace=False)
```

参数说明：

*   `axis`：`0` 表示按行索引排序（默认），`1` 表示按列索引排序。
*   `ascending`：排序顺序，`True` 为升序，`False` 为降序（多列时可传入列表指定每列顺序）。
*   `inplace`：是否直接修改原对象，`False` 时返回新对象（默认）。

示例：

```python
import pandas as pd

data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David'],
    'Age': [25, 30, 22, 28],
    'Score': [85, 95, 75, 88]
}
df = pd.DataFrame(data)
print(df)
print('-----------------')

# 按行索引降序排序
df_sorted_index = df.sort_index(ascending=False)
print(df_sorted_index)

print('-----------------')
# 按列索引升序排序
df_sorted_columns = df.sort_index(axis=1)
print(df_sorted_columns)

#======输出======
      Name  Age  Score
0    Alice   25     85
1      Bob   30     95
2  Charlie   22     75
3    David   28     88
-----------------
      Name  Age  Score
3    David   28     88
2  Charlie   22     75
1      Bob   30     95
0    Alice   25     85
-----------------
   Age     Name  Score
0   25    Alice     85
1   30      Bob     95
2   22  Charlie     75
3   28    David     88
```

## 处理缺失值 (na_position)

在 `sort_values` 中，可以通过 `na_position` 控制缺失值的位置：**默认排在最后，first表示排在最前**

```python
import pandas as pd

df_with_nan = pd.DataFrame({'A': [2, None, 1]})
print(df_with_nan)
print('-----------------')
df_sorted = df_with_nan.sort_values(by='A')  # NaN 默认排在最后
print(df_sorted)
print('-----------------')
df_sorted = df_with_nan.sort_values(by='A', na_position='first')  # NaN 排在最前
print(df_sorted)

#======输出======
     A
0  2.0
1  NaN
2  1.0
-----------------
     A
2  1.0
0  2.0
1  NaN
-----------------
     A
1  NaN
2  1.0
0  2.0
```

## 重置索引

排序后索引可能会混乱，可使用 `reset_index()` 重置：

- `drop=True` 会丢弃旧索引，生成新索引。

```python
import pandas as pd

data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David'],
    'Age': [25, 30, 22, 28],
    'Score': [85, 95, 75, 88]
}
df = pd.DataFrame(data)
print(df)
print('-----------------')

df_sorted = df.sort_values(by='Age').reset_index(drop=True) # 按照年龄升序排序并重置索引
print(df_sorted)

#======输出======
      Name  Age  Score
0    Alice   25     85
1      Bob   30     95
2  Charlie   22     75
3    David   28     88
-----------------
      Name  Age  Score
0  Charlie   22     75
1    Alice   25     85
2    David   28     88
3      Bob   30     95
```
