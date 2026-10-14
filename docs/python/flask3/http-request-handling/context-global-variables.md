# 上下文全局变量

## 介绍

flask3提供了`session`,`g`和`current_app`上下文全局变量来方便我们操作访问数据。 

session、g和current_app比较：

| 特性                 | session                                            | g (全局上下文)                              | current_app (应用上下文)                                     |
| -------------------- | -------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------ |
| 用途                 | 存储和跟踪用户特定数据                             | 在请求处理期间共享数据                      | 在应用上下文中访问应用配置和对象                             |
| 存储位置             | 默认情况下存储在客户端cookie中，但可配置为其他地方 | 存储在应用上下文中的全局变量                | 存储在应用上下文中的全局变量                                 |
| 配置                 | 可以配置会话存储方式和密钥                         | 不涉及配置，存储在应用上下文中              | 不涉及配置，存储在应用上下文中                               |
| 线程安全性           | 是                                                 | 是                                          | 是                                                           |
| 用于哪些情况         | 用户身份验证、购物车、用户偏好设置、用户活动记录等 | 在请求处理函数之外的地方访问请求 相关的数据 | 在应用初始化之前或应用上下文之 外访问应用配置和对象          |
| 存储和获取数据的方法 | 使用 session 对象的方法，如`session['key']`        | 直接通过 g 对象的属性，如` g.key`           | 使用 current_app 对象的属性和方法，如`current_app.config['key']` |
| 生命周期             | 可以配置会话的过期时间和永久性                     | 与请求处理期间的生命周期相同                | 与应用的生命周期相同                                         |
| 示例                 | 实现用户登录和购物车功能                           | 在请求处理函数之外的地方共享数据 库连接     | 访问应用配置和对象的示例                                     |

## current_app

### 概念

current_app是Flask中的一个全局变量，代表当前运行的Flask应用实例。这个全局变量的存在使得在应用程序的各个部分都能够访问应用配置和其他应用特定的对象，而不需要显式传递应用实例。

### 作用

current_app的主要作用是让您能够在应用程序的不同部分中访问应用实例，以便获取应用配置、数据 库连接和其他应用范围的对象。它简化了在不同模块之间共享应用上下文的过程，使得代码更加模块化和可维护。

### 使用

要使用current_app，首先需要导入flask模块并从中引用它，比如在app里面添加：

```python
# 在应用上下文中使用current_app
with app.app_context():
    # 配置DEBUG模式
    app.config['DEBUG'] = True

    # 访问应用的配置
    debug_model = current_app.config['DEBUG']
    print(f"DEBUG模式：{debug_model}")

#======启动时输出======
DEBUG模式：True
```

user.py里获取这个应用配置

```python
@user_bp.route('/list')
def list():
    # 访问应用的配置
    debug_model = current_app.config['DEBUG']
    print(f"DEBUG模式：{debug_model}")
    return '用户列表'
```

student.py里获取这个应用配置

```python
@student_bp.route('/list')
def list():
    # 访问应用的配置
    debug_model = current_app.config['DEBUG']
    print(f"DEBUG模式：{debug_model}")
    return '学生列表'
```



### 注意点

在Flask中，应用上下文是一个特定的环境，用于在请求处理期间存储和传递应用程序范围的数据。它允许在不同函数之间共享状态和数据，而不需要使用全局变量。

current_app是应用上下文的一部分，它允许您在应用程序的任何地方访问应用实例。应用上下文的创建和销毁是由Flask自动管理的。

**current_app只能在处于应用上下文中时才可用。它通常在请求处理期间可用，因此在视图函数中使用它是安全的。但是在应用初始化之前或应用上下文之外，使用current_app可能会导致异常。**

## g

### 概念

在Flask中，g是一个特殊的全局变量，用于存储在请求处理期间共享的数据。它允许您在不同的请求处理函数之间共享状态和数据，而不需要使用全局变量或显式传递参数。

### 作用

g的主要作用是在不同的请求处理函数之间传递数据，以便在同一请求处理期间的不同函数之间共享状态。

### 使用

app.py主模块里设置一个全局变量

```python
# 使用g设置全局变量
@app.before_request
def set_g_name():
    g.username = '王五'
```

user.py里获取全局变量

```python
@user_bp.route('/list')
def list():
    # 访问应用的配置
    debug_model = current_app.config['DEBUG']
    print(f"DEBUG模式：{debug_model}")

    # 获取g全局变量
    print(g.get('username'))
    return '用户列表'
```

student.py里获取全局变量

```python
@student_bp.route('/list')
def list():
    # 访问应用的配置
    debug_model = current_app.config['DEBUG']
    print(f"DEBUG模式：{debug_model}")
    
    # 获取g全局变量
    print(g.get('username'))
    return '学生列表'
```

