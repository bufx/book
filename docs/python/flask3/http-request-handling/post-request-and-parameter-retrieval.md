# post请求与参数获取

`@app.route` 装饰器默认只支持get请求。假如我们要让绑定的视图函数支持其他请求方式，我们可以在methods属性里配置下即可。

语法：

`@app.route('/login', methods=['GET', 'POST'])` 

我们通过一个登录模拟小示例来演示下post请求参数的获取。 

1. 先在templates下新建一个login.html登录模板

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>登录页面</title>
</head>
<body>
    <form action = "login" method="post">
        <table>
            <tr>
                <td>
                    用户名
                </td>
                <td>
                    <input type="text" name="username" />
                </td>
            </tr>
            <tr>
                <td>
                    密码
                </td>
                <td>
                    <input type="password" name="password" />
                </td>
            </tr>
            <tr>
                <td>
                    <button type="submit">登录</button>
                </td>
            </tr>
        </table>
    </form>
</body>
</html>
```

2. 再实现下 /login 路由绑定 login()视图方法。如果是get请求，则跳转模板login.html，如果是post请 求，则获取login.html模板里用户名和密码表单参数。

```python
# post请求与参数获取
@app.route('/login', methods=['GET', 'POST'])
def login():
    '''
    用户登录
    :return:
    '''
    print(request.method)
    if request.method == 'GET':
        return render_template('login.html')
    else:
        username = request.values.get('username')
        password = request.values.get('password')
        print(username, password)
        return 'ok'
```

