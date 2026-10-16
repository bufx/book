# Pandas2数据读取与导出

Pandas将数据加载到DataFrame后，就可以使用DataFrame对象的属性和方法进行操作。这些操作有的是完成数据分析中的常规统计工作，有的是对数据的加工处理。无论是在分析统计方面还是在加工处理方面，Pandas都提供了丰富且实用的功能。

Pandas可以将指定格式(CSV,Excel,SQL等)的数据读取到DataFrame中，并将DataFrame输出为指定格式(CSV,Excel,SQL等)的文件。

## Pandas2数据读取

Pandas 是一个强大的 Python 库，用于数据处理和分析。它提供了许多函数来读取和导入数据，支持多种文件格式，如 CSV、Excel、SQL 数据库、JSON 等。以下是一些常用的数据读取和导出方法：

| 格式   | 文件格式 | 读取函数         | 写入（导出）函数 |
| :----- | :------- | :--------------- | :--------------- |
| binary | Excel    | `read_excel`     | `to_excel`       |
| text   | CSV      | `read_csv`       | `to_csv`         |
| text   | JSON     | `read_json`      | `to_json`        |
| text   | 网页表格 | `read_html`      | `to_html`        |
| text   | 剪切板   | `read_clipboard` | `to_clipboard`   |
| SQL    | SQL      | `read_sql`       | `to_sql`         |

其中：

读取函数一般会赋值给一个变量 `df`, `df = pd.read_()`

输出函数是将变量自身进行操作并输出 `df.to()`

**常用函数方法**

Excel 对象

- `pd.ExcelFile` 对象 

- `pd.ExcelWriter` 对象

- `pd.ExcelWriter` 对象的属性和方法

读取数据

- `pd.read_csv()`

- `pd.read_excel()`

- `pd.json_normalize()`

- `pd.read_pickle()`

- `pd.read_table()`

- `pd.DataFrame.from_dict()` 从字典创建 DataFrame

- `pd.read_clipboard()` 从剪贴板读取数据

- `pd.read_json()` 读取 JSON

- `pd.read_sql()` 读取数据库数据

- `pd.read_fwf()` 读取固定宽度格式文件

- `pd.read_html()` 从 HTML 文档提取表格数据

- `pd.read_parquet()` 读取 Parquet 文件

导出数据

- `to_csv()` 导出为 CSV 文件

- `to_excel()` 导出为 Excel 文件

- `to_dict()` 输出字典

- `to_pickle()` 序列化为 pickle 文件

- `to_json()` 转换为 JSON 格式字符串

- `to_html()` 转换为 HTML 表格格式

- `to_sql()` 写入到关系型数据库

- `to_parquet()` 保存为 parquet 文件

### 读取CSV文件

CSV（Comma-Separated Values）是用逗号分隔值的数据形式，有时也称为字符分隔值，因为分隔字符也可以不是逗号。CSV文件的一般文件扩展名为`.csv`，用制表符分隔也常用`.tsv`作为扩展名。CSV不仅可以是一个实体文件，还可以是字符形式，以便于在网络上传输。

CSV不带数据样式，标准化较强，是最为常见的数据格式。

下面 `student_scores.csv` 可以看下格式。

![](data-reading-and-exporting-img/image-20261015231229746.png)

参考代码：

```python
import pandas as pd

df = pd.read_csv('student_scores.csv')

#======输出======
     姓名      学号        出生日期 性别  语文分数  数学分数  英语分数
0   吴To  s66972  2005-05-13  女    51    28    83
1   王Mu  s30438  2006-01-20  男     6    39    74
2   吴Km  s60881  2007-01-04  女    75    34     3
3   李iD  s92948  2006-02-16  男    85    96    60
4   孙ag  s87189  2008-03-20  女    66    22    37
..  ...     ...         ... ..   ...   ...   ...
95  孙NQ  s49832  2008-04-18  男    84    87    22
96  吴Ir  s11593  2008-01-12  男    25    28    63
97  李GW  s71803  2006-09-15  女     7   100    58
98  吴oN  s56294  2007-05-30  男     5    82    58
99  吴Zv  s87367  2008-07-01  女    94    18    73
```

### 读取Excel文件

参考代码：

```python
import pandas as pd

df = pd.read_excel('student_scores.xlsx')  # 默认读取第一个标签页Sheet
df2 = pd.read_excel('student_scores.xlsx', sheet_name="Sheet2")  # 指定标签Sheet页
print(df)
print("--------")
print(df2)

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
--------
   f   w  e  3
0  3  33  3  3
```

### 从SQL数据库读取

Pandas需要引入`SQLAlchemy`库来支持SQL，在`SQLAlchemy`的支持下，它可以实现所有常见数据库类型的查询、更新等操作。

首先第一步要安装`pymysql`，作为连接mysql的驱动，pip安装命令：

`pip install pymysql -i https://mirrors.aliyun.com/pypi/simple`

然后再安装下`sqlalchemy`库：pip安装命令

`pip install sqlalchemy -i https://mirrors.aliyun.com/pypi/simple`



参考代码：

```python
import pandas as pd

from sqlalchemy import create_engine

# 创建数据库引擎
# 注意：替换下面的用户名、密码、主机名和数据库名
engine = create_engine('mysql+pymysql://root:root@localhost:13306/db_pandas')

# 使用SQLAlchemy引擎读取数据到DataFrame
query = "SELECT * FROM t_student"
df = pd.read_sql_query(query, con=engine)
print(df)

#======输出======
   index  学号  姓名  语文  数学  英语
0      0   1  张三  99  44  88
1      1   2  李四  88  55  55
2      2   3  王五  77  55  66
```



### 读取JSON文件

JSON是互联网上非常通用的轻量级数据交换格式，是HTTP请求中数据的标准格式之一。Pandas提供的JSON读取方法在解析网络爬虫数据时，可以极大地提高效率。

json文件示例：

```json
[
  {
    "name": "Alice",
    "age": 25,
    "city": "New York"
  },
  {
    "name": "Bob",
    "age": 30,
    "city": "Los Angeles"
  },
  {
    "name": "Charlie",
    "age": 35,
    "city": "Chicago"
  }
]
```

参考代码：

```python
import pandas as pd

df = pd.read_json('file.json')
print(df)

#======输出======
      name  age         city
0    Alice   25     New York
1      Bob   30  Los Angeles
2  Charlie   35      Chicago
```



### 读取HTML表格

`pd.read_html()`函数可以接受HTML字符串、HTML文件、URL，并将HTML中的标签表格数据解析为DataFrame。如返回有多个df的列表，则可以通过索引取第几个。如果页面里只有一个表格，那么这个列表就只有一个DataFrame。

操作html，必须要安装lxml库：

`pip install lxml -i https://mirrors.aliyun.com/pypi/simple`

html表格文件示例：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Example Table</title>
</head>

<body>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Age</th>
                <th>City</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Alice</td>
                <td>25</td>
                <td>New York</td>
            </tr>
            <tr>
                <td>Bob</td>
                <td>30</td>
                <td>Los Angeles</td>
            </tr>
            <tr>
                <td>Charlie</td>
                <td>35</td>
                <td>Chicago</td>
            </tr>
        </tbody>
    </table>
</body>

</html>
```

参考代码：

```python
import pandas as pd

try:
    # 读取 HTML 文件
    dfs = pd.read_html('example.html')

    # 打印每个表格的基本信息和内容
    for i, df in enumerate(dfs):
        print(f"第 {i + 1} 个表格基本信息：")
        df.info()

        rows, columns = df.shape

        if rows < 10:
            print(f"第 {i + 1} 个表格全部内容信息：")
            print(df.to_csv(sep='\t', na_rep='nan'))
        else:
            print(f"第 {i + 1} 个表格前几行内容信息：")
            print(df.head().to_csv(sep='\t', na_rep='nan'))

except FileNotFoundError:
    print("错误：文件未找到，请检查文件路径。")
except ValueError:
    print("错误：文件中未找到有效的表格。")
except Exception as e:
    print(f"错误：发生了未知错误：{e}")

#======输出======
第 1 个表格基本信息：
<class 'pandas.DataFrame'>
RangeIndex: 3 entries, 0 to 2
Data columns (total 3 columns):
 #   Column  Non-Null Count  Dtype
---  ------  --------------  -----
 0   Name    3 non-null      str  
 1   Age     3 non-null      int64
 2   City    3 non-null      str  
dtypes: int64(1), str(2)
memory usage: 204.0 bytes
第 1 个表格全部内容信息：
	Name	Age	City
0	Alice	25	New York
1	Bob	30	Los Angeles
2	Charlie	35	Chicago
```



### 从剪切板读取

剪切板（Clipboard）是操作系统级的一个暂存数据的地方，它保存在内存中，可以在不同软件之间传递，非常方便。Pandas支持读取剪贴板中的结构化数据，这就意味着我们不用将数据保存成文件，而可以直接从网页、Excel等文件中复制，然后从操作系统的剪贴板中读取，非常方便。

复制下内容到剪切板：

```text
姓名 年龄 城市
小明 25 北京
小红 30 上海
小邓 35 广州
```

示例代码：

```python
import pandas as pd

df = pd.read_clipboard()
print(df)

#======输出======
   姓名  年龄  城市
0  小明  25  北京
1  小红  30  上海
2  小邓  35  广州
```

## Pandas2读取CSV

CSV格式文件是使用和处理最多的文件格式，Pandas2提供的read_csv()方法来读取csv文件，提供了很多强大的功能参数支持，让我们开发非常方便。 

首先我们去看下read_csv()的方法的参数定义:

```python
def read_csv(
    filepath_or_buffer: FilePath | ReadCsvBuffer[bytes] | ReadCsvBuffer[str],
    *,
    sep: str | None | lib.NoDefault = lib.no_default,
    delimiter: str | None | lib.NoDefault = None,
    # Column and Index Locations and Names
    header: int | Sequence[int] | None | Literal["infer"] = "infer",
    names: Sequence[Hashable] | None | lib.NoDefault = lib.no_default,
    index_col: IndexLabel | Literal[False] | None = None,
    usecols: UsecolsArgType = None,
    # General Parsing Configuration
    dtype: DtypeArg | None = None,
    engine: CSVEngine | None = None,
    converters: Mapping[HashableT, Callable] | None = None,
    true_values: list | None = None,
    false_values: list | None = None,
    skipinitialspace: bool = False,
    skiprows: list[int] | int | Callable[[Hashable], bool] | None = None,
    skipfooter: int = 0,
    nrows: int | None = None,
    # NA and Missing Data Handling
    na_values: (
        Hashable | Iterable[Hashable] | Mapping[Hashable, Iterable[Hashable]] | None
    ) = None,
    keep_default_na: bool = True,
    na_filter: bool = True,
    skip_blank_lines: bool = True,
    # Datetime Handling
    parse_dates: bool | Sequence[Hashable] | None = None,
    date_format: str | dict[Hashable, str] | None = None,
    dayfirst: bool = False,
    cache_dates: bool = True,
    # Iteration
    iterator: bool = False,
    chunksize: int | None = None,
    # Quoting, Compression, and File Format
    compression: CompressionOptions = "infer",
    thousands: str | None = None,
    decimal: str = ".",
    lineterminator: str | None = None,
    quotechar: str = '"',
    quoting: int = csv.QUOTE_MINIMAL,
    doublequote: bool = True,
    escapechar: str | None = None,
    comment: str | None = None,
    encoding: str | None = None,
    encoding_errors: str | None = "strict",
    dialect: str | csv.Dialect | None = None,
    # Error Handling
    on_bad_lines: str = "error",
    # Internal
    low_memory: bool = _c_parser_defaults["low_memory"],
    memory_map: bool = False,
    float_precision: Literal["high", "legacy", "round_trip"] | None = None,
    storage_options: StorageOptions | None = None,
    dtype_backend: DtypeBackend | lib.NoDefault = lib.no_default,
)
```



`pd.read_csv()` 是 pandas 中最常用的数据读取方法之一，用于从 CSV 文件中读取数据并创建 DataFrame。以下是其主要参数的详细说明：

**基本参数**

**1. filepath_or_buffer:**
*   必需参数，可以是文件路径、URL 或任何带有 `read()` 方法的对象
*   示例：`'data.csv'`, `'https://example.com/data.csv'`

**2. sep/delimiter:**
*   字段分隔符，默认为 `','`
*   示例：`'\t'` 用于制表符分隔的文件

**3. header:**
*   指定作为列名的行号，默认为 0（第一行）
*   设置为 `None` 表示没有标题行
*   示例：`header=0`, `header=None`

**4. names:**
*   用于结果的列名列表
*   如果文件不包含标题行，则应设置 `header=None`
*   示例：`names=['col1', 'col2', 'col3']`

**数据解析参数**

**1. index_col:**
*   用作行索引的列编号或列名
*   示例：`index_col=0`, `index_col='date'`

**2. usecols:**
*   指定要读取的列，可以是列名列表或列索引列表
*   示例：`usecols=[0, 1, 2]`, `usecols=['col1', 'col2']`

**3. dtype:**
*   指定列的数据类型
*   示例：`dtype={'col1': 'float64', 'col2': 'int32'}`

**4. parse_dates:**
*   尝试将指定列解析为日期
*   示例：`parse_dates=['date']`, `parse_dates=True` (尝试解析所有日期)

**5. date_parser:**
*   用于解析日期的函数
*   通常与 `parse_dates` 一起使用

**6. converters:**
*   列转换函数的字典
*   示例：`converters={'col1': lambda x: x.lower()}`

**缺失值处理**

**1. na_values:**
*   应识别为 NA/NaN 的字符串列表
*   示例：`na_values=['NA', 'N/A', 'missing']`

**2. keep_default_na:**
*   是否包含默认的 NaN 值列表，默认为 `True`
*   如果为 `False`，则仅识别 `na_values` 指定的值

**3. na_filter:**
*   是否检测缺失值标记，默认为 `True`
*   设置为 `False` 可以提高读取大文件的速度

**文件处理参数**

**1. nrows:**
*   从文件开头读取的行数
*   示例：`nrows=1000` (只读取前1000行)

**2. skiprows:**
*   从文件开头跳过的行数或行号列表
*   示例：`skiprows=5`, `skiprows=[0, 2]`

**3. skipfooter:**
*   从文件末尾跳过的行数
*   示例：`skipfooter=3` (跳过最后3行)

**4. encoding:**
*   文件编码，如 `'utf-8'`, `'gbk'`, `'latin1'` 等
*   示例：`encoding='utf-8'`

**5. engine:**
*   使用的解析引擎，可选 `'c'` (更快) 或 `'python'` (功能更全)
*   示例：`engine='python'`

**性能优化参数**

**1. chunksize:**
*   返回迭代器对象，每次迭代返回指定行数
*   用于处理大文件
*   示例：`chunksize=10000`

**2. memory_map:**
*   如果为 `True`，则使用内存映射文件进行读取
*   对于大文件可以提高性能

**3. low_memory:**
*   分块处理文件以减少内存使用，默认为 `True`
*   设置为 `False` 可以提高速度但增加内存使用

**其他参数**

**1. thousands:**
*   千位分隔符
*   示例：`thousands=','` (将 "1,000" 解析为 1000)

**2. decimal:**
*   小数点字符，默认为 `'.'`
*   示例：`decimal=','` (用于欧洲格式的小数点)

**3. comment:**
*   标识注释开始的字符
*   示例：`comment='#'` (跳过以 # 开头的行)

**4. verbose:**
*   是否输出解析信息，默认为 `False`

**5. skip_blank_lines:**
*   如果为 `True`，则跳过空行，默认为 `True`

### 示例一

**无列名CSV文件处理header,names**

对于无列名csv数据处理示例：

![](data-reading-and-exporting-img/image-20261016000627659.png){width=400}



没有列头的csv文件处理 header设置None, names指定列名称

```python
import pandas as pd

# 没有列头的csv文件处理  header设置None, names指定列名称
df = pd.read_csv('student_scores2.csv') # 默认把第一行作为列头了
df2 = pd.read_csv('student_scores2.csv', header=None) # 不要把第一行作为列头，它会生成一个列头
df3 = pd.read_csv('student_scores2.csv', header=None,
                 names=['姓名', '学号', '出生日期', '性别', '语文分数', '数学分数', '英语分数']) # 手动指定列头
print(df)
print("************")
print(df2)
print("************")
print(df3)

#======输出======
    吴To  s66972  2005-05-13  女  51   28  83
0   王Mu  s30438  2006-01-20  男   6   39  74
1   吴Km  s60881  2007-01-04  女  75   34   3
2   李iD  s92948  2006-02-16  男  85   96  60
3   孙ag  s87189  2008-03-20  女  66   22  37
4   吴Ge  s96571  2005-01-16  男   3   84  70
..  ...     ...         ... ..  ..  ...  ..
94  孙NQ  s49832  2008-04-18  男  84   87  22
95  吴Ir  s11593  2008-01-12  男  25   28  63
96  李GW  s71803  2006-09-15  女   7  100  58
97  吴oN  s56294  2007-05-30  男   5   82  58
98  吴Zv  s87367  2008-07-01  女  94   18  73

[99 rows x 7 columns]
************
      0       1           2  3   4    5   6
0   吴To  s66972  2005-05-13  女  51   28  83
1   王Mu  s30438  2006-01-20  男   6   39  74
2   吴Km  s60881  2007-01-04  女  75   34   3
3   李iD  s92948  2006-02-16  男  85   96  60
4   孙ag  s87189  2008-03-20  女  66   22  37
..  ...     ...         ... ..  ..  ...  ..
95  孙NQ  s49832  2008-04-18  男  84   87  22
96  吴Ir  s11593  2008-01-12  男  25   28  63
97  李GW  s71803  2006-09-15  女   7  100  58
98  吴oN  s56294  2007-05-30  男   5   82  58
99  吴Zv  s87367  2008-07-01  女  94   18  73

[100 rows x 7 columns]
************
     姓名      学号        出生日期 性别  语文分数  数学分数  英语分数
0   吴To  s66972  2005-05-13  女    51    28    83
1   王Mu  s30438  2006-01-20  男     6    39    74
2   吴Km  s60881  2007-01-04  女    75    34     3
3   李iD  s92948  2006-02-16  男    85    96    60
4   孙ag  s87189  2008-03-20  女    66    22    37
..  ...     ...         ... ..   ...   ...   ...
95  孙NQ  s49832  2008-04-18  男    84    87    22
96  吴Ir  s11593  2008-01-12  男    25    28    63
97  李GW  s71803  2006-09-15  女     7   100    58
98  吴oN  s56294  2007-05-30  男     5    82    58
99  吴Zv  s87367  2008-07-01  女    94    18    73

[100 rows x 7 columns]
```

### 示例二

**行索引index_col**

`index_col`指定行索引，用作行索引的列编号或列名。

```python
import pandas as pd

df = pd.read_csv('student_scores.csv')
df2 = pd.read_csv('student_scores.csv', index_col='学号') # 指定学号为行索引
print(df)
print("************")
print(df2)

#======输出======
     姓名      学号        出生日期 性别  语文分数  数学分数  英语分数
0   吴To  s66972  2005-05-13  女    51    28    83
1   王Mu  s30438  2006-01-20  男     6    39    74
2   吴Km  s60881  2007-01-04  女    75    34     3
3   李iD  s92948  2006-02-16  男    85    96    60
4   孙ag  s87189  2008-03-20  女    66    22    37
..  ...     ...         ... ..   ...   ...   ...
95  孙NQ  s49832  2008-04-18  男    84    87    22
96  吴Ir  s11593  2008-01-12  男    25    28    63
97  李GW  s71803  2006-09-15  女     7   100    58
98  吴oN  s56294  2007-05-30  男     5    82    58
99  吴Zv  s87367  2008-07-01  女    94    18    73

[100 rows x 7 columns]
************
         姓名        出生日期 性别  语文分数  数学分数  英语分数
学号                                          
s66972  吴To  2005-05-13  女    51    28    83
s30438  王Mu  2006-01-20  男     6    39    74
s60881  吴Km  2007-01-04  女    75    34     3
s92948  李iD  2006-02-16  男    85    96    60
s87189  孙ag  2008-03-20  女    66    22    37
...     ...         ... ..   ...   ...   ...
s49832  孙NQ  2008-04-18  男    84    87    22
s11593  吴Ir  2008-01-12  男    25    28    63
s71803  李GW  2006-09-15  女     7   100    58
s56294  吴oN  2007-05-30  男     5    82    58
s87367  吴Zv  2008-07-01  女    94    18    73

[100 rows x 6 columns]
```

### 示例三

**使用部分列usecols**

指定要读取的列，可以是列名列表或列索引列表。示例：`usecols=['col1', 'col2']` `usecols=[0, 1, 2]`。

示例：

```python
import pandas as pd

df = pd.read_csv('student_scores.csv', usecols=['学号', '语文分数'])
print(df)

#======输出======
        学号  语文分数
0   s66972    51
1   s30438     6
2   s60881    75
3   s92948    85
4   s87189    66
..     ...   ...
95  s49832    84
96  s11593    25
97  s71803     7
98  s56294     5
99  s87367    94

[100 rows x 2 columns]
```

### 示例四

**空值替换na_values和keep_default_na**

`na_values`参数的值是一组用于替换NA/NaN的值。如果传参，需要指定特定列的空值。以下值默认会被认定为空值

```python
['-1.#IND', '1.#QNAN', '1.#IND', '-1.#QNAN', '#N/A N/A', '#N/A', 'N/A', 
 'n/a', 'NA', '#NA', 'NULL', 'null', 'NaN', '-NaN', 'nan', '-nan', '']
```

使用`na_values`时需要关注下面`keep_default_na`的配合使用和影响，`keep_default_na`是否包含默认的NaN值列表，默认为 `True`。

下面是一个示例：空字符串和X作为Na值。

![](data-reading-and-exporting-img/image-20261016003554902.png){width=400}

```python
import pandas as pd

# 默认把空的显示为 NaN
df = pd.read_csv('student_scores3.csv') 
# 设置空显示空
df2 = pd.read_csv('student_scores3.csv', keep_default_na=False) 
# 把X也表示为空，显示为NaN
df3 = pd.read_csv('student_scores3.csv', keep_default_na=True, na_values=['X'])
print(df)
print("************")
print(df2)
print("************")
print(df3)

#======输出======
     姓名      学号        出生日期 性别  语文分数  数学分数  英语分数
0   吴To  s66972  2005-05-13  女    51    28    83
1   王Mu  s30438  2006-01-20  男     6    39    74
2   吴Km     NaN  2007-01-04  女    75    34     3
3   李iD  s92948         NaN  男    85    96    60
4   孙ag       X  2008-03-20  女    66    22    37
..  ...     ...         ... ..   ...   ...   ...
95  孙NQ  s49832  2008-04-18  男    84    87    22
96  吴Ir  s11593  2008-01-12  男    25    28    63
97  李GW  s71803  2006-09-15  女     7   100    58
98  吴oN  s56294  2007-05-30  男     5    82    58
99  吴Zv  s87367  2008-07-01  女    94    18    73

[100 rows x 7 columns]
************
     姓名      学号        出生日期 性别  语文分数  数学分数  英语分数
0   吴To  s66972  2005-05-13  女    51    28    83
1   王Mu  s30438  2006-01-20  男     6    39    74
2   吴Km          2007-01-04  女    75    34     3
3   李iD  s92948              男    85    96    60
4   孙ag       X  2008-03-20  女    66    22    37
..  ...     ...         ... ..   ...   ...   ...
95  孙NQ  s49832  2008-04-18  男    84    87    22
96  吴Ir  s11593  2008-01-12  男    25    28    63
97  李GW  s71803  2006-09-15  女     7   100    58
98  吴oN  s56294  2007-05-30  男     5    82    58
99  吴Zv  s87367  2008-07-01  女    94    18    73

[100 rows x 7 columns]
************
     姓名      学号        出生日期 性别  语文分数  数学分数  英语分数
0   吴To  s66972  2005-05-13  女    51    28    83
1   王Mu  s30438  2006-01-20  男     6    39    74
2   吴Km     NaN  2007-01-04  女    75    34     3
3   李iD  s92948         NaN  男    85    96    60
4   孙ag     NaN  2008-03-20  女    66    22    37
..  ...     ...         ... ..   ...   ...   ...
95  孙NQ  s49832  2008-04-18  男    84    87    22
96  吴Ir  s11593  2008-01-12  男    25    28    63
97  李GW  s71803  2006-09-15  女     7   100    58
98  吴oN  s56294  2007-05-30  男     5    82    58
99  吴Zv  s87367  2008-07-01  女    94    18    73

[100 rows x 7 columns]
```

## Pandas2读取Excel

Excel格式文件是办公使用和处理最多的文件格式之一，相比CSV文件，Excel是有样式的。Pandas2提供的read_excel()方法来读取excel文件，提供了很多强大的功能参数支持，让我们开发非常方便。 

首先我们去看下read_excel()的方法的参数定义，很大一部分和csv参数一样。

```python
def read_excel(
    io,
    sheet_name: str | int | list[IntStrT] | None = 0,
    *,
    header: int | Sequence[int] | None = 0,
    names: SequenceNotStr[Hashable] | range | None = None,
    index_col: int | str | Sequence[int] | None = None,
    usecols: int
    | str
    | Sequence[int]
    | Sequence[str]
    | Callable[[HashableT], bool]
    | None = None,
    dtype: DtypeArg | None = None,
    engine: Literal["xlrd", "openpyxl", "odf", "pyxlsb", "calamine"] | None = None,
    converters: dict[str, Callable] | dict[int, Callable] | None = None,
    true_values: Iterable[Hashable] | None = None,
    false_values: Iterable[Hashable] | None = None,
    skiprows: Sequence[int] | int | Callable[[int], object] | None = None,
    nrows: int | None = None,
    na_values=None,
    keep_default_na: bool = True,
    na_filter: bool = True,
    verbose: bool = False,
    parse_dates: list | dict | bool = False,
    date_format: dict[Hashable, str] | str | None = None,
    thousands: str | None = None,
    decimal: str = ".",
    comment: str | None = None,
    skipfooter: int = 0,
    storage_options: StorageOptions | None = None,
    dtype_backend: DtypeBackend | lib.NoDefault = lib.no_default,
    engine_kwargs: dict | None = None,
)
```



所以我们这里讲解一些read_excel独有的方法参数：

**1. io:**
*   类型: str, bytes, ExcelFile, xlrd.Book, path object, 或 file-like object
*   作用: Excel 文件的路径或文件对象

**2. sheet_name:**
*   类型: str, int, list, 或 None (默认 0)
*   作用: 指定要读取的工作表
*   示例:
    *   `0`: 读取第一个工作表
    *   `"sheet1"`: 读取名为"Sheet1"的工作表
    *   `[0, 1]`: 读取前两个工作表，返回字典
    *   `None`: 读取所有工作表，返回字典

参考代码：

```python
import pandas as pd

df = pd.read_excel('student_scores.xlsx')  # 默认读取第一个标签页Sheet
df2 = pd.read_excel('student_scores.xlsx', sheet_name="Sheet2")  # 指定第二个标签Sheet页
df3 = pd.read_excel('student_scores.xlsx', sheet_name=1)  # 指定第二个标签Sheet页
df4 = pd.read_excel('student_scores.xlsx', sheet_name=[0, 1])  # 读取前两个工作表，返回字典，key是指定的0 和 1
df5 = pd.read_excel('student_scores.xlsx', sheet_name=None)  # 读取所有工作表，返回字典，key是Sheet页名称
print(df)
print("--------")
print(df2)
print("--------")
print(df3)
print("--------")
print(df4)
print("--------")
print(df5)

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
--------
   f   w  e  3
0  3  33  3  3
--------
   f   w  e  3
0  3  33  3  3
--------
{0:      姓名      学号        出生日期 性别  语文分数  数学分数  英语分数
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

[100 rows x 7 columns], 1:    f   w  e  3
0  3  33  3  3}
--------
{'Sheet1':      姓名      学号        出生日期 性别  语文分数  数学分数  英语分数
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

[100 rows x 7 columns], 'Sheet2':    f   w  e  3
0  3  33  3  3}
```

## Pandas2数据导出

任何原始格式的数据载入DataFrame后，都可以使用类似 DataFrame.to_csv()的方法输出到相应格式的文件或者目标系统里。 

支持导出的格式比较多，常用的有csv，excel，sql，html等。

![](data-reading-and-exporting-img/image-20261016125207686.png){width=400}

### 导出CSV文件

导出csv文件我们使用to_csv()方法，pandas2提供了丰富的参数来实现强大的导出功能，我们看下 to_csv()方法的参数:

```python
def to_csv(
    self,
    path_or_buf: FilePath | WriteBuffer[bytes] | WriteBuffer[str] | None = None,
    *,
    sep: str = ",",
    na_rep: str = "",
    float_format: str | Callable | None = None,
    columns: Sequence[Hashable] | None = None,
    header: bool | list[str] = True,
    index: bool = True,
    index_label: IndexLabel | None = None,
    mode: str = "w",
    encoding: str | None = None,
    compression: CompressionOptions = "infer",
    quoting: int | None = None,
    quotechar: str = '"',
    lineterminator: str | None = None,
    chunksize: int | None = None,
    date_format: str | None = None,
    doublequote: bool = True,
    escapechar: str | None = None,
    decimal: str = ".",
    errors: OpenFileErrors = "strict",
    storage_options: StorageOptions | None = None,
)
```

`to_csv()` 是 pandas 中用于将 DataFrame 导出为 CSV 文件的重要方法。以下是该方法的参数详解：

**基本参数**

1. **path_or_buf** (str, path object, file-like object, 默认为 None)
    * 文件路径或文件对象
    * 如果为 None，则返回 CSV 字符串
2. **sep** (str, 默认为 ',')
    * 指定分隔符
    * 例如: `sep='\t'` 表示制表符分隔
3. **na_rep** (str, 默认为 '')
    * 缺失值表示方式
    * 例如: `na_rep='NA'` 会将缺失值显示为 NA
4. **float_format** (str, 默认为 None)
    * 浮点数格式字符串
    * 例如: `float_format='%.2f'` 保留两位小数
5. **columns** (sequence, 可选)
    * 指定要写入的列
    * 例如: `columns=['col1', 'col3']`
6. **header** (bool or list of str, 默认为 True)
    * 是否写入列名
    * 如果传入列表，则用作列名
7. **index** (bool, 默认为 True)
    * 是否写入行索引
8. **index_label** (str or sequence, 默认为 None)
    * 索引列的列名
    * 如果传入列表且有多级索引，则为每级指定名称

**编码与日期格式**

1. **encoding** (str, 默认为 None)
    * 编码方式
    * 例如: `encoding='utf-8'` 或 `encoding='gbk'`
2. **date_format** (str, 默认为 None)
    * 日期格式字符串
    * 例如: `date_format='%Y-%m-%d'`

**性能相关参数**

1. **mode** (str, 默认为 'w')
    * Python 写入模式
    * `'w'` 表示写入，`'a'` 表示追加
2. **compression** (str or dict, 默认为 'infer')
    * 压缩方式
    * 可选: `'infer'`, `'gzip'`, `'bz2'`, `'zip'`, `'xz'`, `None`
3. **quoting (int or csv.QUOTE_*, 默认为 csv.QUOTE_MINIMAL)**
    * **引用约定**
    * **选项:**
        * **csv.QUOTE_ALL (引用所有字段)**
        * **csv.QUOTE_MINIMAL (仅引用包含特殊字符的字段)**
        * **csv.QUOTE_NONNUMERIC (引用所有非数字字段)**
        * **csv.QUOTE_NONE (不引用)**
4. **quotechar (str, 默认为 '"')**
    * **用于引用的字符**
5. **line_terminator (str, 默认为 '\n')**
    * **行结束符**

**其他参数**

1. **chunksize (int, 默认为 None)**
    * **按指定行数分批写入**
2. **doublequote (bool, 默认为 True)**
    * **引用字段中的引号是否双写**
3. **escapechar (str, 默认为 None)**
    * **用于转义的字符**
4. **decimal (str, 默认为 '.')**
    * **小数点的字符表示**
    * **例如: `decimal=','` 用于欧洲格式**

示例，用字典构造一个 DataFrame 对象，然后直接导出 csv 文件：

```python
import pandas as pd

d = {'学号': [1, 2, 3],
     '姓名': ['张三', '李四', '王五'],
     '语文': [99, 88, 77],
     '数学': [44, 55, 55],
     '英语': [88, 55, 66]}

df = pd.DataFrame(d)
print(df)
# 默认导出有行索引，有表头
df.to_csv('out/student.csv')
# 去掉行索引
df.to_csv('out/student2.csv', index=False)
# 去掉表头
df.to_csv('out/student3.csv', index=False, header=False)
# 指定要导出的列
df.to_csv('out/student4.csv', index=False, columns=['姓名', '语文'])

#======输出======
   学号  姓名  语文  数学  英语
0   1  张三  99  44  88
1   2  李四  88  55  55
2   3  王五  77  55  66
```

![](data-reading-and-exporting-img/image-20261016130532177.png)

### 导出Excel文件

将DataFrame导出为Excel格式也很方便，使用DataFrame.to_excel方法即可。要想把DataFrame对象导出，首先要指定一个文件名，这个文件名必须以.xlsx或.xls为扩展名，生成的文件标签名也可以用 sheet_name 指定。

to_excel()方法参数如下:

```python
def to_excel(
    self,
    excel_writer: FilePath | WriteExcelBuffer | ExcelWriter,
    *,
    sheet_name: str = "Sheet1",
    na_rep: str = "",
    float_format: str | None = None,
    columns: Sequence[Hashable] | None = None,
    header: Sequence[Hashable] | bool = True,
    index: bool = True,
    index_label: IndexLabel | None = None,
    startrow: int = 0,
    startcol: int = 0,
    engine: Literal["openpyxl", "xlsxwriter"] | None = None,
    merge_cells: bool = True,
    inf_rep: str = "inf",
    freeze_panes: tuple[int, int] | None = None,
    storage_options: StorageOptions | None = None,
    engine_kwargs: dict[str, Any] | None = None,
    autofilter: bool = False,
)
```

有个sheet_name标签名称参数，默认值是"Sheet1"，其他参数使用和csv基本一致。

示例：

```python
import pandas as pd

d = {'学号': [1, 2, 3],
     '姓名': ['张三', '李四', '王五'],
     '语文': [99, 88, 77],
     '数学': [44, 55, 55],
     '英语': [88, 55, 66]}

df = pd.DataFrame(d)
print(df)
df.to_excel('out/student.xlsx', sheet_name='学生成绩', index=False)

#======输出======
   学号  姓名  语文  数学  英语
0   1  张三  99  44  88
1   2  李四  88  55  55
2   3  王五  77  55  66
```

![](data-reading-and-exporting-img/image-20261016131157325.png){width=400}

### 导出sql到数据库

将DataFrame中的数据保存到数据库的对应表中，pandas2提供了to_sql()方法，我们看下to_sql()方法的参数：

```python
def to_sql(
    self,
    name: str,
    con,
    schema: str | None = None,
    if_exists: Literal["fail", "replace", "append"] = "fail",
    index: bool_t = True,
    index_label: IndexLabel | None = None,
    chunksize: int | None = None,
    dtype: DtypeArg | None = None,
    method: Literal["multi"] | callable | None = None,
)
```

`to_sql()` 是 pandas 中用于将 DataFrame 写入 SQL 数据库的方法，支持多种关系型数据库。以下是该方法的详细参数说明：

**基本参数**

1. **name** (str)
   * 目标数据库表名
   * 如果表已存在，行为取决于 if_exists 参数
2. **con** (sqlalchemy.engine.Engine or sqlite3.Connection)
   * 数据库连接对象
   * 通常使用 SQLAlchemy 引擎创建
3. **schema** (str, 可选)
   * 数据库 schema 名称
   * 默认为 None，使用数据库默认 schema
4. **if_exists** (str, 默认为 'fail')
   * 表已存在时的处理方式:
     * 'fail': 抛出 ValueError (默认)
     * 'replace': 删除原表后重建
     * 'append': 向现有表追加数据

**写入控制参数**

1. **index** (bool, 默认为 True)
   * 是否将 DataFrame 的索引作为单独列写入
2. **index_label** (str or sequence, 可选)
   * 索引列的列名
   * 如果有多级索引，可传入序列
3. **chunksize** (int, 可选)
   * 分批写入的行数
   * 大数据集时使用可减少内存消耗
4. **dtype** (dict, 可选)
   * 指定列的数据类型
   * 格式: `{'column_name': sqlalchemy.types.Type}`
   * 例如: `{'price': sqlalchemy.types.Float}`

**类型推断与性能**

1. **method** (str or callable, 可选)
   * 控制 SQL 插入方式:
     * None: 标准 SQL INSERT 语句
     * 'multi': 单语句多行插入
     * callable: 自定义插入函数
   * 大数据量时 'multi' 可提高性能
2. **keys** (sequence, 可选)
   * 当 method='multi' 时，指定要插入的列

**其他参数**

1. **fail_on_extra_columns** (bool, 默认为 False)
   * 如果为 True，当 DataFrame 包含表中不存在的列时会失败
2. **alter_schema** (bool, 默认为 False)
   * 如果为 True，尝试修改表结构以匹配 DataFrame

下面是一个导出sql示例：

```python
import pandas as pd
from sqlalchemy import create_engine

d = {'学号': [1, 2, 3],
     '姓名': ['张三', '李四', '王五'],
     '语文': [99, 88, 77],
     '数学': [44, 55, 55],
     '英语': [88, 55, 66]}

df = pd.DataFrame(d)
print(df)
# 创建数据库引擎
engine = create_engine('mysql+pymysql://root:root@localhost:13306/db_pandas')
df.to_sql('t_student', engine)
# 设置索引列名为id
df.to_sql('t_student2', engine, index_label='id')

#======输出======
   学号  姓名  语文  数学  英语
0   1  张三  99  44  88
1   2  李四  88  55  55
2   3  王五  77  55  66

```

运行后，自动建表，以及自动插入数据：

![](data-reading-and-exporting-img/image-20261016132428167.png)