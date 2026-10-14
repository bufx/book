# Groovy语言的基本入门

## 基本语法

### 输出语句

```groovy
//1.括号，分号可不写
//2.不区分单双引号
println("Hello Groovy");
println("Hello Gradle")
println "Hello Maven"
println 'Hello'

=============
Hello Groovy
Hello Gradle
Hello Maven
Hello
```

### 定义变量

```groovy
int a = 23
println a

def aa = 24
println aa

def s = 'hello'
println s

def k = 23.23
println k

def sex = true
println sex

println a.class
println aa.class
println s.class
println k.class
println sex.class

=============
23
24
hello
23.23
true
class java.lang.Integer
class java.lang.Integer
class java.lang.String
class java.math.BigDecimal
class java.lang.Boolean
```

**注意：**

- 在groovy语言中，可以定义任意java类型，也可以不指定类型，用def，由值类决定类型
- groovy语言中的基本类型（Java中的int,float,double,byte,char,long,short）和对象类型（String等），最终都是对象类型

### 定义方法

```groovy
//定义方法
def play(def str) {
    println str + ": hello maven"
}
//调用方法
play("Gradle is good")

==========
Gradle is good: hello maven
```

### 判断语句

```groovy
def plays(def b) {
    if (b) {
        println "hello world"
    } else {
        println "hello groovy"
    }
}
plays(true)

============
hello world
```

### list 和 map 集合

#### list

```groovy
//定义list
def lists = ['zhangsan', 'lisi', 'wangwu']

//根据下标获取集合元素
println lists[1]

//遍历集合
for (name in lists) {
    println name
}

==========
lisi
zhangsan
lisi
wangwu
```

#### map

```groovy
//定义map
def map = ['zhangsan': '张三', '李四': 'lisi', '王五': '王五']

//直接通过key获取map集合中的元素
println map.get("zhangsan")

//遍历map集合
for (entry in map) {
    println "key:" + entry.getKey() + "value:" + entry.getValue()
}

==========
张三
key:zhangsanvalue:张三
key:李四value:lisi
key:王五value:王五
```



## Groovy的闭包

`闭包`：就是Groovy中一段代码块，主要是用来作为参数在方法之间传递使用

### 基础闭包语法

```groovy
//闭包定义
def m1 = {
    println "hello Groovy"
}

//定义一个带有闭包参数的方法
def play(Closure closure) {
    closure()
}
//调用方法传递参数
play(m1)

==========
hello Groovy
```

### 定义带有参数的闭包

```groovy
//定义一个接收参数的闭包
def m2 = {
    v ->
        println "hello Groovy " + v
}
def m3 = {
    v,m,n ->
        println "hello Groovy " + v
        println "hello Groovy " + m
        println "hello Groovy " + n
}

//在方法中调用闭包传递参数
def play1(Closure closure) {
    closure("Java")
}
def play2(Closure closure) {
    closure("Py", "JS", "node")
}

//调用方法
play1(m2)
play2(m3)

===========
hello Groovy Java
hello Groovy Py
hello Groovy JS
hello Groovy node
```



