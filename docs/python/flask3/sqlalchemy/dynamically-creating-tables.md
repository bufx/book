# 动态创建数据库表

## 数据库模型

**用来映射到数据库表的Python类通常被称为数据库模型( model )。**

一个数据库模型类对应数据库中的 一个表。定义模型即使用Python类定义表模式，并声明映射关系。

**所有的模型类都需要继承Flask- SQLAIchemy提供的db.Model基类。**

SQLAlchemy常用的字段类型：

| 字段        | 说明                                        |
| :---------- | :------------------------------------------ |
| Integer     | 整数                                        |
| String      | 字符串，可选参数length可以用来设置最大长度  |
| Text        | 较长的Unicode文本                           |
| Date        | 日期，存储Python的 datetime.date对象        |
| Time        | 时间，存储Python的datetime.time对象         |
| DateTime    | 时间和日期,存储Python 的datetime对象        |
| Interval    | 时间间隔,存储Python的datetime.timedelta对象 |
| Float       | 浮点数                                      |
| Boolean     | 布尔值                                      |
| PickleType  | 存储Pickle列化的Python对象                  |
| LargeBinary | 存储任意二进制数据                          |

常用的SQLAlchemy字段参数：

| 参数名        | 说明                                             |
| :------------ | :----------------------------------------------- |
| primary_key   | 如果设为True，该字段为主键                       |
| unique        | 如果设为True，该字段不允许出现重复值             |
| index         | 如果设为True，为该字段创建索引，以提高查询效率   |
| nullable      | 确定字段值可否为空,值为True或False，默认值为True |
| default       | 为字段设置默认值                                 |
| autoincrement | 自增，默认False                                  |

示例：

student.py下新建GradeModel年级模型:

```python
# 创建年级数据库模型
class GradeModel(db.Model):
    '''
    年级模型
    '''
    __tablename__ = 't_grade'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True) # 主键id
    name = db.Column(db.String(50), nullable=False) # 年级名称
    remart = db.Column(db.Text) # 备注
```

## 动态创建数据库表

### 解决循环依赖问题

前面我们定义了模型，我们可以通过sqlalchemy对象提供的create_all()方法来映射和动态创建数据库表。

因为我们用到了模块化蓝图blueprint，这个sqlalchemy对象会在app.py和蓝图模块之间互相调用，导致循环依赖问题。

所以我们的解决方案是单独把sqlalchemy对象放扩展文件下，然后app.py和各个蓝图模块分别单独调用。

**具体实现方案如下:** 

1. 先在项目目录下新建exts.py扩展python文件。

```python
# flask-sqlalchemy
from flask_sqlalchemy import SQLAlchemy

# 创建SQLAlchemy对象
db = SQLAlchemy()
```

2. app.py里面引入exts里的db对象

```python
# from flask_sqlalchemy import SQLAlchemy
from exts import db
```

3. 然后通过init_app方法初始化sqlalchemy

```python
# 创建SQLAlchemy对象
# db = SQLAlchemy(app)
db.init_app(app)
```

4. student.py里也换成exts里的db

```python
# from app import db
from exts import db
```

5. 最后我们app.py里调用db的create_all()方法创建数据库表

```python
# 动态创建数据库表
with app.app_context():
    # 根据模型创建表
    db.create_all()

#======输出======
2026-09-19 14:17:12,921 INFO sqlalchemy.engine.Engine SELECT DATABASE()
2026-09-19 14:17:12,921 INFO sqlalchemy.engine.Engine [raw sql] {}
2026-09-19 14:17:12,924 INFO sqlalchemy.engine.Engine SELECT @@sql_mode
2026-09-19 14:17:12,924 INFO sqlalchemy.engine.Engine [raw sql] {}
2026-09-19 14:17:12,926 INFO sqlalchemy.engine.Engine SELECT @@lower_case_table_names
2026-09-19 14:17:12,926 INFO sqlalchemy.engine.Engine [raw sql] {}
2026-09-19 14:17:12,931 INFO sqlalchemy.engine.Engine BEGIN (implicit)
2026-09-19 14:17:12,931 INFO sqlalchemy.engine.Engine DESCRIBE `db_flask`.`t_grade`
2026-09-19 14:17:12,931 INFO sqlalchemy.engine.Engine [raw sql] {}
2026-09-19 14:17:12,939 INFO sqlalchemy.engine.Engine 
CREATE TABLE t_grade (
	id INTEGER NOT NULL AUTO_INCREMENT, 
	name VARCHAR(50) NOT NULL, 
	remart TEXT, 
	PRIMARY KEY (id)
)


2026-09-19 14:17:12,939 INFO sqlalchemy.engine.Engine [no key 0.00017s] {}
2026-09-19 14:17:12,993 INFO sqlalchemy.engine.Engine COMMIT
```

