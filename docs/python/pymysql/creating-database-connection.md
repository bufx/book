# 创建数据库连接

通过**pymysql的Connection**类创建数据库连接，用完一定要关闭连接。

示例一：
```python
"""
    创建数据库连接
"""
from pymysql import Connection

# 创建数据库连接
con = Connection(
    host = "localhost", # 地址
    port = 13306, # 端口
    user = "root", # 账号
    password = "root" # 密码
)

print(type(con))
print(con.get_host_info())
print(con.get_server_info())

# 关闭连接
con.close()

#======输出======
<class 'pymysql.connections.Connection'>
socket localhost:13306
8.4.11
```



这样写可能会出现异常，需要加上` try except finally`

```python
"""
    创建数据库连接-改进版
"""
from pymysql import Connection

con = None

try:
    # 创建数据库连接
    con = Connection(
        host="localhost",  # 地址
        port=13306,  # 端口
        user="root",  # 账号
        password="root"  # 密码
    )

    print(type(con))
    print(con.get_host_info())
    print(con.get_server_info())
except Exception as e:
    print("异常：", e)
finally:
    if con:
        # 关闭连接
        con.close()

#======输出======
<class 'pymysql.connections.Connection'>
socket localhost:13306
8.4.11
```



