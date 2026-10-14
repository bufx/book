# 调用存储过程

我们首先创建一个简单的存储过程

```sql
-- 两数相加
DELIMITER //
CREATE PROCEDURE test_add(m INT,n INT, OUT result INT)
BEGIN
SET result=m+n;
END; //
```

测试

```sql
SET @s=0;
CALL test_add(1,2,@s)
SELECT @s;
```

Pymysql调用存储过程实现：

```python
"""
    调用存储过程
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

    # 使用游标对象调用存储过程
    cursor.execute("CALL test_add(1,2,@s);")
    cursor.execute("SELECT @s;")
    result = cursor.fetchone()
    print(result)
    print(result[0])

except Exception as e:
    print("异常：", e)
finally:
    if con:
        # 关闭连接
        con.close()

#======输出======
(3,)
3
```

