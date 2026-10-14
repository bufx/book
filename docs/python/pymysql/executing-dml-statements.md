# 执行DML语句

MySQL 数据库模块同样**可以使用游标的execute()方法执行DML(Data Manipulation Language, 数据操纵语言)的 insert、update、delete语句**，对数据库进行插入、修改和删除数据操作。

## 执行select查询操作

```python
"""
    执行select查询操作
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
        database="db_pymysql" # 指定操作的数据库
    )

    # 创建游标对象
    cursor = con.cursor()

    # 使用游标对象执行sql
    cursor.execute("select * from t_student")

    # 获取查询的所有结果
    result = cursor.fetchall()
    print(type(result), result)
    for row in result:
        print(row)

except Exception as e:
    print("异常：", e)
finally:
    if con:
        # 关闭连接
        con.close()

#======输出======
<class 'tuple'> ((1, '张三', 11, '男'), (2, '李四', 16, '女'), (3, '王五', 22, '男'))
(1, '张三', 11, '男')
(2, '李四', 16, '女')
(3, '王五', 22, '男')
```

## 执行insert插入操作

执行修改操作，需要**通过Connection对象调用commit()方法确认提交，或者构造方法里面autocommit设置True自动提交**

```python
"""
    执行insert插入操作
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
        database="db_pymysql", # 指定操作的数据库
        autocommit=True # 设置自动提交，也可以主动提交见29行
    )

    # 创建游标对象
    cursor = con.cursor()

    # 使用游标对象执行sql
    cursor.execute("insert into t_student values (null, '赵六', 13, '男')")

    # 获取主键
    print(f"主键id={con.insert_id()}")

    # 确认提交 可以在Connection构造方法里面设置自动提交
    # con.commit()

except Exception as e:
    print("异常：", e)
finally:
    if con:
        # 关闭连接
        con.close()

#======输出======
主键id=4
```

## 执行update更新操作

执行update操作，同前面的insert操作

```python
"""
    执行update更新操作
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
        database="db_pymysql", # 指定操作的数据库
        autocommit=True # 设置自动提交
    )

    # 创建游标对象
    cursor = con.cursor()

    # 使用游标对象执行sql
    cursor.execute("update t_student set age = 11 where id = 4")

except Exception as e:
    print("异常：", e)
finally:
    if con:
        # 关闭连接
        con.close()
```

## 执行delete删除操作

执行delete操作，同前面的update操作

```python
"""
    执行delete删除操作
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
        database="db_pymysql", # 指定操作的数据库
        autocommit=True # 设置自动提交
    )

    # 创建游标对象
    cursor = con.cursor()

    # 使用游标对象执行sql
    cursor.execute("delete from t_student where id = 4")

except Exception as e:
    print("异常：", e)
finally:
    if con:
        # 关闭连接
        con.close()
```

