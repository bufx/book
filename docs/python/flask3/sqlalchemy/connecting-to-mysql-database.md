# 连接Mysql数据库

## 基础使用

app.py下，我们先配置数据库连接，然后写一个简单sql测试。

连接配置，包括用户名，密码，主机地址，端口以及数据库

```python [app.py]
# app.py
# 配置数据库连接
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost:13306/db_flask?charset=utf8'

# 创建SQLAlchemy对象
db = SQLAlchemy(app)
# 打开连接执行sql
with app.app_context():
    with db.engine.connect() as conn:
        rs = conn.execute(text('select 1'))
        print(rs.fetchone())

#======输出======
(1,)
```

## 数据库配置

实际开发，像这些数据库配置，我们都单独写到配置文件里面去：

新建一个config.py

```python
# config.py
# 数据库登录用户名
USERNAME = "root"

# 数据库登录密码
PASSWORD = "root"

# 数据库服务器地址，若为远程服务器填写对应的IP地址，这里是示例地址
HOST = "localhost"

# 数据库连接端口号，MySQL默认常用端口是3306
PORT = "13306"

# 要访问的数据库名称
DATABASE = "db_flask"

# 创建统一资源标识符（URI），用于指定数据库连接的详细信息
# SQLALCHEMY_DATABASE_URI 的格式为：数据库类型 + 驱动://{登录名}:{密码}@{IP地址}:{端口号}/{数据库名}?charset={编码格式}
DB_URI = f'mysql+pymysql://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}?charset=utf8'

# SQLALCHEMY_DATABASE_URI 配置项，设置数据库的连接URI，让SQLAlchemy知道如何连接数据库
SQLALCHEMY_DATABASE_URI = DB_URI

# SQLALCHEMY_TRACK_MODIFICATIONS配置项，用于控制是否动态追踪对象修改情况
# 若设置为True，会追踪对象修改，但会消耗额外资源，默认不设置时会有告警提示，这里设为True开启追踪
SQLALCHEMY_TRACK_MODIFICATIONS = True

# SQLALCHEMY_ECHO配置项，用于设置是否在查询时显示原始的SQL语句
# 设为False表示不显示原始SQL语句，设为True则会在控制台等地方输出实际执行的SQL语句，方便调试查看
SQLALCHEMY_ECHO = True
```

app.py里面读取配置文件

```python
# 配置数据库连接
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost:13306/db_flask?charset=utf8'
# 读取配置文件
app.config.from_object('config')

#======输出======
2026-09-19 11:31:34,773 INFO sqlalchemy.engine.Engine SELECT DATABASE()
2026-09-19 11:31:34,773 INFO sqlalchemy.engine.Engine [raw sql] {}
2026-09-19 11:31:34,777 INFO sqlalchemy.engine.Engine SELECT @@sql_mode
2026-09-19 11:31:34,777 INFO sqlalchemy.engine.Engine [raw sql] {}
2026-09-19 11:31:34,779 INFO sqlalchemy.engine.Engine SELECT @@lower_case_table_names
2026-09-19 11:31:34,779 INFO sqlalchemy.engine.Engine [raw sql] {}
2026-09-19 11:31:34,783 INFO sqlalchemy.engine.Engine BEGIN (implicit)
2026-09-19 11:31:34,784 INFO sqlalchemy.engine.Engine select 1
2026-09-19 11:31:34,784 INFO sqlalchemy.engine.Engine [generated in 0.00035s] {}
(1,)
2026-09-19 11:31:34,785 INFO sqlalchemy.engine.Engine ROLLBACK
```

