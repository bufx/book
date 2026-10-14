# 类型注解

**类型注解:** 在代码中涉及数据交互的地方，提供数据类型的注解(显式说明) 

**主要功能:**

- 帮助第三方IDE工具(如pycharm)对代码进行类型推断，协助做代码提示
- 帮助开发者自身对变量进行类型注释

## 变量的类型注解

语法：**在变量后面加上 : 类型**

示例：
```python
"""
    变量的类型注解
"""
import random

# 基础数据-类型注解
name: str = "张三"
age: int = 10
b: bool = False

# 类对象-类型注解
class Person:
    pass
lisi: Person = Person()

# 基础容器-类型注解
my_list: list = [1, 2, 3, 4]
my_tuple: tuple = (1, "python", False)
my_dict: dict = {"python": 2.22, "java": 3.2}

# 容器类型元素-类型注解
my_list2: list[int] = [1, 2, 3, 4]
my_tuple2: tuple[int, str, bool] = (1, "python", False)
my_dict2: dict[str, float] = {"python": 2.22, "java": 3.2}

# 在注释中进行类型注解
r1 = random.randint(1, 10) # type: int
```

## 函数方法的类型注解

语法：

- 形参注解：在参数后面添加`def 函数方法名(形参: 类型,...形参: 类型) `
- 返回值注解：在函数后面加 `def 函数方法名(形参: 类型,...形参: 类型) -> 返回值类型:`

```python
"""
    函数方法的类型注解
    形参注解
        def add(x: int, y: int):
            return x + y
    返回值注解
        def 函数方法名(形参: 类型,...形参: 类型) -> 返回值类型:
            pass
"""
def add(x: int, y: int) -> int:
    return x + y

print(add(1, 2))
```



## Union联合类型注解

我们可以通过Union联合类型注解，来实现多类型注解

语法：`Union[类型1,类型2,...类型n]`

```python
"""
    Union联合类型注解
"""
from typing import Union

my_list2: list[int] = [1, 2, 3, 4]
my_dict2: dict[str, float] = {"python": 2.22, "java": 3.2}

my_list3: list[Union[int, str, float, bool]] = [1, "python", 2.2, True] # 注解多种元素类型
my_dict3: dict[str, Union[str, int]] = {"k1": "python", "k2": 22} # 注解多种元素类型
```

