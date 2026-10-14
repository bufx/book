# 执行DDL语句

pymysql对操作mysql `DDL(Data Definition Language)` 数据库模式定义语言，提供了很好的支持。

连接MySQL数据库后，可以使用`cursor()`方法创建一个游标对象。游标对象用于执行MySQL语句并返回结果。

## 基础使用

示例：建表DDL

注意点：

- 指定操作的数据库有两种方式
- 游标不用显示关闭，con关闭的时候也会关闭游标

```python
"""
    执行DDL语句-创建表
"""
from pymysql import Connection

con = None

try:
    # 创建数据库连接
    con = Connection(
        host="localhost",  # 地址
        port=13306,  # 端口
        user="root",  # 账号
        password="root",  # 密码
        database="db_pymysql" # 指定操作的数据库 也可以下面19行这样指定
    )

    # 选择要操作的数据库
    # con.select_db("db_pymysql")

    # 创建游标对象
    cursor = con.cursor()

    # 定义建表sql语句
    sql = """
        CREATE TABLE `t_student` (
          `id` int(11) NOT NULL AUTO_INCREMENT,
          `name` varchar(10) DEFAULT NULL,
          `age` int(11) DEFAULT NULL,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8
    """

    # 使用游标对象执行sql
    cursor.execute(sql)

    # 关闭游标对象 可省略 因为con关闭的时候也会关闭游标
    # cursor.close()

except Exception as e:
    print("异常：", e)
finally:
    if con:
        # 关闭连接
        con.close()
```

## 其他操作

常见sql语句

```sql
# 对表中的字段进行增，删，改的操作：
alter table 表名 add/drop/modify/change [column] .......

# 向表中添加字段: 
alter table 表名 add [column] 字段名 字段类型;
ALTER TABLE stu ADD COLUMN age INT;

# 删除表中的字段：
alter table 表名 drop [column] 字段名;
ALTER TABLE stu DROP age;

# 修改字段的名字：
alter table 表名 change [column] 旧字段名 新字段名 字段类型;
ALTER TABLE stu CHANGE COLUMN sname s2name VARCHAR(20);

# 修改字段的类型：
alter table 表名 modify [column] 字段名 字段类型;
ALTER TABLE stu MODIFY id VARCHAR(20);

# 修改表的名字：
alter table 旧表名 rename to 新表名;
ALTER TABLE stu4 RENAME TO stu5;
```

示例：修改表

```python
"""
    执行DDL语句-修改表
"""
from pymysql import Connection

con = None

try:
    # 创建数据库连接
    con = Connection(
        host="localhost",  # 地址
        port=13306,  # 端口
        user="root",  # 账号
        password="root",  # 密码
        database="db_pymysql" # 指定操作的数据库 也可以下面19行这样指定
    )

    # 选择要操作的数据库
    # con.select_db("db_pymysql")

    # 创建游标对象
    cursor = con.cursor()

    # 定义一个sql语句
    # sql = "ALTER TABLE t_student ADD COLUMN sex VARCHAR(2)" # 增加字段
    sql = "ALTER TABLE t_student MODIFY name VARCHAR(12)" # 修改字段

    # 使用游标对象执行sql
    cursor.execute(sql)

    # 关闭游标对象 可省略 因为con关闭的时候也会关闭游标
    # cursor.close()

except Exception as e:
    print("异常：", e)
finally:
    if con:
        # 关闭连接
        con.close()
```

