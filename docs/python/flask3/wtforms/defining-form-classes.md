# 定义表单类

我们定义表单类，**继承FlaskForm**。一个表单由若干个输入字段组成，这些字段分别用表单类的类属性来表示(字段即Field，你可以简单理解为表单内的输入框、按钮等部件)。

常用的WTForms表单字段:

好的，这是这张图片内容的 Markdown 表格：

| 字段类              | 说明                                        | 对应的HTML                                    |
| :------------------ | :------------------------------------------ | :-------------------------------------------- |
| BooleanField        | 复选框，值会被处理为True或False             | `<input type="checkbox">`                     |
| DateField           | 文本字段，值会被处理为datetime.date对象     | `<input type="text">`                         |
| DateTimeField       | 文本字段，值会被处理为datetime.datetime对象 | `<input type="text">`                         |
| FileField           | 文件上传字段                                | `<input type="file">`                         |
| FloatField          | 浮点数字段，值会被处理为浮点型              | `<input type="text">`                         |
| IntegerField        | 整数字段,值会被处理为整型                   | `<input type="text">`                         |
| RadioField          | 一组单选按钮                                | `<input type="radio">`                        |
| SelectField         | 下拉列表                                    | `<select><option></option></select>`          |
| SelectMultipleField | 多选下拉列表                                | `<select multiple><option></option></select>` |
| SubmitField         | 提交按钮                                    | `<input type="submit">`                       |
| StringField         | 文本字段                                    | `<input type="text">`                         |
| HiddenField         | 隐藏文本字段                                | `<input type="hidden">`                       |
| PasswordField       | 密码文本字段                                | `<input type="password">`                     |
| TextAreaField       | 多行文本字段                                | `<textarea></textarea>`                       |

常用表单字段类属性:

| 参数       | 说明                                                         |
| :--------- | :----------------------------------------------------------- |
| label      | 字段标签`<label>`的值，也就是渲染后显示在输入字段前的文字    |
| render_kw  | 一个字典，用来设置对应的HTML `<input>`标签的属性，比如传入`{'placeholder': '请输入搜索关键字'}`，渲染后的HTML代码会将`<input>`标签的placeholder属性设为`请输入搜索关键字` |
| validators | 一个列表，包含一系列验证器，会在表单提交后被逐一调用验证表单数据 |
| default    | 字符串或可调用对象，用来为表单字段设置默认值                 |

示例：

```python
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField

# 登录类
class LoginForm(FlaskForm):
    username = StringField('用户名')
    password = PasswordField('密码')
    remember = BooleanField('记住我')
    submit = SubmitField('登录')
```

