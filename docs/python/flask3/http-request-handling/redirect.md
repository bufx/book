# redirect重定向

前面我们学过渲染到模板页面，这个其实是一种内部的转发，浏览器地址栏地址没有变化。

如果我们想重定向到其他页面(浏览器地址栏地址变化)，我们可以使用Flask提供的redirect()函数。 

示例：重定向外部网页地址

```python
# redirect重定向到其他网址
@app.route('/redirect_python')
def redirect_python():
    return redirect('http://python.org')
```

如果重定向内部地址，可以用url_for方法

示例：
```python
# redirect重定向到内部地址，填写函数名
@app.route('/redirect-blog-list')
def redirect_blog_list():
    return redirect(url_for('blog_list'))
```

