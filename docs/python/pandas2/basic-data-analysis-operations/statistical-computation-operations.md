# Pandas2统计计算操作

Pandas2可以对Series与DataFrame进行快速的描述性统计，如求和、 平均数、最大值、方差等，这些是最基础也最实用的统计方法。对于 DataFrame，这些统计方法会按列进行计算，最终产出一个以列名为索引、以计算值为值的Series。

## 统计描述操作

`df.describe()`会返回一个有所有的数字列的统计表，每一行对应一个统计指标，有总数、平均数、标准差、最小值、四分位数、最大值等，这个表对我们初步了解数据很有帮助。

```python
# 导入pandas库，去别名pd
import pandas as pd

df = pd.read_csv('../student_scores.csv')

print(df.describe())

#======输出======
             语文分数        数学分数        英语分数
count  100.000000  100.000000  100.000000
mean    50.050000   46.970000   49.470000
std     30.690496   29.181928   28.442554
min      3.000000    1.000000    2.000000
25%     22.000000   26.750000   26.000000
50%     48.500000   38.000000   50.500000
75%     77.250000   68.250000   73.250000
max    100.000000  100.000000   99.000000
```

## 数学统计操作

Pandas2支持常用的数学统计方法，如平均数、中位数、众数、方差等，还可以结合NumPy使用其更加丰富的统计功能。我们先来使用`mean()`计算一下平均数，DataFrame使用统计函数后会生成一个Series，这个Series的索引为每个数字类型列的列名，值为此次的平均数。如果 DataFrame没有任何数字类型列，则会报错。

```python
DataFrame.mean(
    axis=0,               # 计算方向（行或列）
    skipna=True,          # 是否跳过缺失值
    numeric_only=None,    # 是否仅计算数值列
    level=None,           # 针对分层索引的层级
    **kwargs
)
```

示例:

```python
# 导入pandas库，去别名pd
import pandas as pd

df = pd.read_csv('../student_scores.csv')

# 计算某列数值平均分数。df.列名.mean()
print(df.语文分数.mean())

print("----------")

# 计算每一行的平均分数。df.mean(axis=1, numeric_only=True)
print(df.mean(axis=1, numeric_only=True))

print("----------")
# 设置索引，查询指定数据;
print(df.set_index('姓名').mean(axis=1, numeric_only=True).head(3))

#======输出======
50.05
----------
0     54.000000
1     39.666667
2     37.333333
3     80.333333
4     41.666667
        ...    
95    64.333333
96    38.666667
97    55.000000
98    48.333333
99    61.666667
Length: 100, dtype: float64
----------
姓名
吴To    54.000000
王Mu    39.666667
吴Km    37.333333
dtype: float64
```

## 统计函数操作

`pandas` 提供丰富的统计方法，用于快速计算数据的汇总指标。以下是常用方法：

| 方法         | 作用                 | 语法示例               |
| :----------- | :------------------- | :--------------------- |
| `sum()`      | 求和                 | `df.sum(axis=0)`       |
| `mean()`     | 平均值               | `df.mean(skipna=True)` |
| `median()`   | 中位数               | `df.median()`          |
| `mode()`     | 众数（返回所有众数） | `df.mode()`            |
| `std()`      | 标准差               | `df.std()`             |
| `var()`      | 方差                 | `df.var()`             |
| `min()`      | 最小值               | `df.min()`             |
| `max()`      | 最大值               | `df.max()`             |
| `count()`    | 非缺失值数量         | `df.count()`           |
| `quantile()` | 分位数（如中位数）   | `df.quantile(0.5)`     |
| `describe()` | 快速统计摘要         | `df.describe()`        |

求语文的最高分，`df.语文分数.max()`

```python
# 导入pandas库，去别名pd
import pandas as pd

df = pd.read_csv('../student_scores.csv')

# 求语文的最高分，df.语文分数.max()
print(df.语文分数.max())

#======输出======
100
```

