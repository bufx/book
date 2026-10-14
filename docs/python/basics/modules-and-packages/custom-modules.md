# 自定义模块

Python中已经有很多的内置模块，以及也有很多的第三方优秀模块，我们直接导入使用即可。 当然我们有时候也需要自己定义一些自定义模块，来实现我们项目的功能。

## 基础使用

案例:
先定义string_util.py，判断字符串是否空的工具方法

```python string_util.py
"""
    字符串工具
"""
def isEmpty(s: str):
    """
        判断字符串是否为空
    :param s: 传入的字符串参数
    :return: 如果是空，则返回True，否则返回False
    """
    if not s:
        return True
    elif len(s.strip()) == 0:
        return True
    else:
        return False
```

再新建一个test.py

示例一：通过`import`导入

```python test.py
import string_util

print(string_util.isEmpty(None))
print(string_util.isEmpty(""))
print(string_util.isEmpty("  "))
print(string_util.isEmpty("  2 "))

#======输出======
True
True
True
False
```

示例二：通过`from`导入

```python test.py
# import string_util
#
# print(string_util.isEmpty(None))
# print(string_util.isEmpty(""))
# print(string_util.isEmpty("  "))
# print(string_util.isEmpty("  2 "))

from string_util import isEmpty

print(isEmpty(None))
print(isEmpty(""))
print(isEmpty("  "))
print(isEmpty("  3 "))

#======输出======
True
True
True
False
```



## 测试代码不暴露

### 引入

如果我们在string_util.py里加一个测试代码

```python
"""
    字符串工具
"""
def isEmpty(s: str):
    """
        判断字符串是否为空
    :param s: 传入的字符串参数
    :return: 如果是空，则返回True，否则返回False
    """
    if not s:
        return True
    elif len(s.strip()) == 0:
        return True
    else:
        return False

print("测试结果：", isEmpty(None))
```

我们再运行test.py

```python
# import string_util
#
# print(string_util.isEmpty(None))
# print(string_util.isEmpty(""))
# print(string_util.isEmpty("  "))
# print(string_util.isEmpty("  2 "))

from string_util import isEmpty

print(isEmpty(None))
print(isEmpty(""))
print(isEmpty("  "))
print(isEmpty("  3 "))

#======输出======
测试结果： True
True
True
True
False
```

### 通过\__name__实现

经过测试，当我们` from string_util import isEmpty`导入模块的时候，可执行代码也是会一起导入进来 的，并且执行。

但是我们不喜欢测试代码被执行。

此时可借助于所有模块内置的`__name__`变量进行区分：

- 如果直接使用python命令来运行一个模块，`__name__`变量的值为`__main__`
- 如果该模块被导入其他程序中，`__name__`变量的值就是模块名。

1. 当执行string_util.py时：

```python
"""
    字符串工具
"""
def isEmpty(s: str):
    """
        判断字符串是否为空
    :param s: 传入的字符串参数
    :return: 如果是空，则返回True，否则返回False
    """
    if not s:
        return True
    elif len(s.strip()) == 0:
        return True
    else:
        return False

print(__name__)

print("测试结果：", isEmpty(None))

#======输出======
__main__
测试结果： True
```

2. 当执行test.py时：

```python
# import string_util
#
# print(string_util.isEmpty(None))
# print(string_util.isEmpty(""))
# print(string_util.isEmpty("  "))
# print(string_util.isEmpty("  2 "))

from string_util import isEmpty

print(isEmpty(None))
print(isEmpty(""))
print(isEmpty("  "))
print(isEmpty("  3 "))

#======输出======
string_util
测试结果： True
True
True
True
False
```

因此，如果希望测试函数只 有在使用 python命令直接运行时才执行，则可在调用测试函数时增加判断：只有当`__name__`属性为`__main__`时才调用测试函数。

```python
"""
    字符串工具
"""
def isEmpty(s: str):
    """
        判断字符串是否为空
    :param s: 传入的字符串参数
    :return: 如果是空，则返回True，否则返回False
    """
    if not s:
        return True
    elif len(s.strip()) == 0:
        return True
    else:
        return False

# print(__name__)

if __name__ == "__main__":
    print("测试结果：", isEmpty(None))
```

运行test.py：

```python
# import string_util
#
# print(string_util.isEmpty(None))
# print(string_util.isEmpty(""))
# print(string_util.isEmpty("  "))
# print(string_util.isEmpty("  2 "))

from string_util import isEmpty

print(isEmpty(None))
print(isEmpty(""))
print(isEmpty("  "))
print(isEmpty("  3 "))

#======输出======
True
True
True
False
```



## 部分方法不暴露

### 引入

如果我们在string_util.py里再加一个方法 isNotEmpty

```python
"""
    字符串工具
"""
def isEmpty(s: str):
    """
        判断字符串是否为空
    :param s: 传入的字符串参数
    :return: 如果是空，则返回True，否则返回False
    """
    if not s:
        return True
    elif len(s.strip()) == 0:
        return True
    else:
        return False

def isNotEmpty(s: str):
    """
        判断字符串是否不为空
    :param s: 传入的字符串参数
    :return: 如果不为空，这返回True，否则返回False
    """
    if s:
        if len(s.strip()) > 0:
            return True
        else:
            return False
    else:
        return True

# print(__name__)

if __name__ == "__main__":
    print("测试结果：", isEmpty(None))
```

我们在test.py里面尝试调用，发现可以调用，并可以执行：

```python
# import string_util
#
# print(string_util.isEmpty(None))
# print(string_util.isEmpty(""))
# print(string_util.isEmpty("  "))
# print(string_util.isEmpty("  2 "))

# from string_util import isEmpty
#
# print(isEmpty(None))
# print(isEmpty(""))
# print(isEmpty("  "))
# print(isEmpty("  3 "))

from string_util import *

print(isEmpty(None))
print(isEmpty(""))
print(isEmpty("  "))
print(isEmpty("  3 "))

print(isNotEmpty(" s "))

#======输出======
True
True
True
False
True
```



### 通过\__all__实现

我们现在想 isNotEmpty暂时不像被外部导入使用。

我们可以用`__all__`来指定所有可以被导入使用的成员。

- 默认`__all__`包含所有方法名，即为`__all__ = ["isEmpty", "isNotEmpty"]`
- 可以单独配置`__all__ = ["isEmpty"]`方法被暴露

```python
"""
    字符串工具
"""
__all__ = ["isEmpty"]

def isEmpty(s: str):
    """
        判断字符串是否为空
    :param s: 传入的字符串参数
    :return: 如果是空，则返回True，否则返回False
    """
    if not s:
        return True
    elif len(s.strip()) == 0:
        return True
    else:
        return False

def isNotEmpty(s: str):
    """
        判断字符串是否不为空
    :param s: 传入的字符串参数
    :return: 如果不为空，这返回True，否则返回False
    """
    if s:
        if len(s.strip()) > 0:
            return True
        else:
            return False
    else:
        return True

# print(__name__)

if __name__ == "__main__":
    print("测试结果：", isEmpty(None))
```

然后，test.py里面就无法引入了

```python
# import string_util
#
# print(string_util.isEmpty(None))
# print(string_util.isEmpty(""))
# print(string_util.isEmpty("  "))
# print(string_util.isEmpty("  2 "))

# from string_util import isEmpty
#
# print(isEmpty(None))
# print(isEmpty(""))
# print(isEmpty("  "))
# print(isEmpty("  3 "))

from string_util import *

print(isEmpty(None))
print(isEmpty(""))
print(isEmpty("  "))
print(isEmpty("  3 "))

print(isNotEmpty(" s "))

#======输出======
True
True
True
False
Traceback (most recent call last):
  File "test.py", line 22, in <module>
    print(isNotEmpty(" s "))
          ^^^^^^^^^^
NameError: name 'isNotEmpty' is not defined. Did you mean: 'isEmpty'?
```



注意点：

- 只能在通过 `from 模块名 import *`导入的时候才会生效
- 直接通过`import 模块名`导入，还是会导入进来

```python
# import string_util
#
# print(string_util.isEmpty(None))
# print(string_util.isEmpty(""))
# print(string_util.isEmpty("  "))
# print(string_util.isEmpty("  2 "))

# from string_util import isEmpty
#
# print(isEmpty(None))
# print(isEmpty(""))
# print(isEmpty("  "))
# print(isEmpty("  3 "))

# from string_util import *
#
# print(isEmpty(None))
# print(isEmpty(""))
# print(isEmpty("  "))
# print(isEmpty("  3 "))

# print(isNotEmpty(" s "))

import string_util

print(string_util.isNotEmpty(" s "))

#======输出======
True
```

