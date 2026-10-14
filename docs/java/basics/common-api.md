# Java基础知识-基础语法-常用API

## String 相关

**字符型常量和字符串常量的区别**

1. 形式上: 字符常量是`单引号`引起的一个字符 字符串常量是`双引号`引起的若干个字符
2. 含义上: 字符常量相当于一个`整形值`(ASCII 值),可以参加表达式运算 字符串常量代表一个`地址值`(该字符串在内存中存放位置)
3. 占内存大小 字符常量只占一个字节 字符串常量占若干个字节(至少一个字符结束标志)

---

**什么是字符串常量池？**

字符串常量池位于`堆内存`中，专门用来存储字符串常量，可以提高内存的使用率，避免开辟多块空间存储相同的字符串，在创建字符串时 JVM 会首先检查字符串常量池，如果该字符串已经存在池中，则返回它的引用，如果不存在，则实例化一个字符串放到池中，并返回其引用。

---

**String 是最基本的数据类型吗**

不是。Java 中的基本数据类型只有 `8` 个 ：`byte、short、int、long、float、double、char、boolean`；**除了基本类型（primitive type），剩下的都是引用类型（referencetype）**，Java 5 以后引入的**枚举类型也算是一种比较特殊的引用类型。**

这是很基础的东西，但是很多初学者却容易忽视，Java 的 8 种基本数据类型中不包括 String，基本数据类型中用来描述文本数据的是 char，但是它只能表示单个字符，比如 ‘a’,‘好’ 之类的，如果要描述一段文本，就需要用多个 char 类型的变量，也就是一个 char 类型数组，比如“你好” 就是长度为 2 的数组 char[] chars = {‘你’,‘好’};

但是使用数组过于麻烦，所以就有了 String，**String 底层就是一个 char 类型的数组**，只是使用的时候开发者不需要直接操作底层数组，用更加简便的方式即可完成对字符串的使用。

---

**String 有哪些特性**

- **不变性：** String 是只读字符串，是一个典型的 immutable 对象，对它进行任何操作，其实都是创建一个新的对象，再把引用指向该对象。不变模式的主要作用在于当一个对象需要被多线程共享并频繁访问时，可以保证数据的一致性。

* **常量池优化：** String 对象创建之后，会在字符串常量池中进行缓存，如果下次创建同样的对象时，会直接返回缓存的引用。

- **final：** 使用 final 来定义 String 类，表示 String 类不能被继承，提高了系统的安全性。

---

**String 为什么是不可变的吗？**

简单来说就是 String 类利用了 final 修饰的 char 类型数组存储字符，源码如下图所以：

```java
/** The value is used for character storage. */
private final char value[];
```

---

**String 真的是不可变的吗？**

我觉得如果别人问这个问题的话，回答不可变就可以了。 下面只是给大家看两个有代表性的例子：

**1) String 不可变但不代表引用不可以变**

```java
String str = "Hello";
str = str + " World";
System.out.println("str=" + str);
```

结果：

```java
str=Hello World
```

解析：

实际上，原来 String 的内容是不变的，只是 str 由原来指向"Hello"的内存地址转为指向"Hello World"的内存地址而已，也就是说多开辟了一块内存区域给"Hello World"字符串。

**2) 通过反射是可以修改所谓的“不可变”对象**

```java
// 创建字符串"Hello World"， 并赋给引用s
String s = "Hello World";

System.out.println("s = " + s); // Hello World

// 获取String类中的value字段
Field valueFieldOfString = String.class.getDeclaredField("value");

// 改变value属性的访问权限
valueFieldOfString.setAccessible(true);

// 获取s对象上的value属性的值
char[] value = (char[]) valueFieldOfString.get(s);

// 改变value所引用的数组中的第5个字符
value[5] = '_';

System.out.println("s = " + s); // Hello_World
```

结果：

```java
s = Hello World
s = Hello_World
```

解析：

用反射可以访问私有成员， 然后反射出 String 对象中的 value 属性， 进而改变通过获得的 value 引用改变数组的结构。但是一般我们不会这么做，这里只是简单提一下有这个东西。

---

**是否可以继承 String 类**

String 类是 final 类，不可以被继承。

---

**String str="i"与 String str=new String(“i”)一样吗？**

不一样，因为内存的分配方式不一样。String str="i"的方式，java 虚拟机会将其分配到`常量池`中；而 String str=new String(“i”) 则会被分到`堆内存`中。

---

**String s = new String(“xyz”);创建了几个字符串对象**

两个对象，一个是静态区的"xyz"，一个是用 new 创建在堆上的对象。

```java
String str1 = "hello"; //str1指向静态区
String str2 = new String("hello");  //str2指向堆上的对象
String str3 = "hello";
String str4 = new String("hello");
System.out.println(str1.equals(str2)); //true
System.out.println(str2.equals(str4)); //true
System.out.println(str1 == str3); //true
System.out.println(str1 == str2); //false
System.out.println(str2 == str4); //false
System.out.println(str2 == "hello"); //false
str2 = str1;
System.out.println(str2 == "hello"); //true
```

---

**如何将字符串反转？**

使用 `StringBuilder` 或者 `stringBuffer` 的 `reverse()` 方法。

示例代码：

```java
// StringBuffer reverse
StringBuffer stringBuffer = new StringBuffer();
stringBuffer. append("abcdefg");
System. out. println(stringBuffer. reverse()); // gfedcba
// StringBuilder reverse
StringBuilder stringBuilder = new StringBuilder();
stringBuilder. append("abcdefg");
System. out. println(stringBuilder. reverse()); // gfedcba
```

---

**数组有没有 length()方法？String 有没有 length()方法**

数组没有 length()方法 ，有 length 的属性。String 有 length()方法。JavaScript 中，获得字符串的长度是通过 length 属性得到的，这一点容易和 Java 混淆。

---

**String 类的常用方法都有那些？**

- indexOf()：返回指定字符的索引。
- charAt()：返回指定索引处的字符。
- replace()：字符串替换。
- trim()：去除字符串两端空白。
- split()：分割字符串，返回一个分割后的字符串数组。
- getBytes()：返回字符串的 byte 类型数组。
- length()：返回字符串长度。
- toLowerCase()：将字符串转成小写字母。
- toUpperCase()：将字符串转成大写字符。
- substring()：截取字符串。
- equals()：字符串比较。

---

**在使用 HashMap 的时候，用 String 做 key 有什么好处？**

HashMap 内部实现是通过 key 的 hashcode 来确定 value 的存储位置，因为字符串是不可变的，所以当创建字符串时，它的 hashcode 被缓存下来，不需要再次计算，所以相比于其他对象更快。

---

**String 和 StringBuffer、StringBuilder 的区别是什么？String 为什么是不可变的**

**可变性**

String 类中使用字符数组保存字符串，`private final char value[]`，所以 string 对象是不可变的。StringBuilder 与 StringBuffer 都继承自 AbstractStringBuilder 类，在 AbstractStringBuilder 中也是使用字符数组保存字符串，`char[] value`，这两种对象都是可变的。

**线程安全性**

`String` 中的对象是不可变的，也就可以理解为常量，`线程安全`。AbstractStringBuilder 是 StringBuilder 与 StringBuffer 的公共父类，定义了一些字符串的基本操作，如 `expandCapacity、append、insert、indexOf` 等公共方法。`StringBuffer` 对方法加了同步锁或者对调用的方法加了同步锁，所以是`线程安全的`。`StringBuilder` 并没有对方法进行加同步锁，所以是`非线程安全的`。

**性能**

每次对 String 类型进行改变的时候，都会生成一个新的 String 对象，然后将指针指向新的 String 对象。StringBuffer 每次都会对 StringBuffer 对象本身进行操作，而不是生成新的对象并改变对象引用。相同情况下使用 StirngBuilder 相比使用 StringBuffer 仅能获得 10%~15% 左右的性能提升，但却要冒多线程不安全的风险。

**对于三者使用的总结**

- 如果要操作少量的数据用 = `String`

- 单线程操作字符串缓冲区 下操作大量数据 = `StringBuilder`

- 多线程操作字符串缓冲区 下操作大量数据 = `StringBuffer`

---

## Date 相关

> 待补充

---

## 包装类相关

**自动装箱与拆箱**

- **装箱：** 将基本类型用它们对应的引用类型包装起来；

- **拆箱：** 将包装类型转换为基本数据类型；

---

**int 和 Integer 有什么区别**

Java 是一个近乎纯洁的面向对象编程语言，但是为了编程的方便还是引入了基本数据类型，但是为了能够将这些基本数据类型当成对象操作，Java 为每一个基本数据类型都引入了对应的包装类型（`wrapper class`），int 的包装类就是 Integer，从 Java 5 开始引入了自动装箱/拆箱机制，使得二者可以相互转换。

Java 为每个原始类型提供了包装类型：

**原始类型:** `boolean，char，byte，short，int，long，float，double`

**包装类型：**`Boolean，Character，Byte，Short，Integer，Long，Float，Double`

---

**Integer a= 127 与 Integer b = 127 相等吗**

对于对象引用类型：==比较的是对象的内存地址。
对于基本数据类型：==比较的是值。

如果整型字面量的值在`-128` 到 `127` 之间，那么自动装箱时不会 new 新的 Integer 对象，而是直接引用常量池中的 Integer 对象。

```java
public static void main(String[] args) {
    Integer a = new Integer(3);
    Integer b = 3;  // 将3自动装箱成Integer类型
    int c = 3;
    System.out.println(a == b); // false 两个引用没有引用同一对象
    System.out.println(a == c); // true a自动拆箱成int类型再和c比较
    System.out.println(b == c); // true

    Integer a1 = 128;
    Integer b1 = 128;
    System.out.println(a1 == b1); // false

    Integer a2 = 127;
    Integer b2 = 127;
    System.out.println(a2 == b2); // true
```

解析：

因为 a1、b1 超过范围，所以 a1==b1 的结果是 false

<font color=gray size=2>参考：https://blog.csdn.net/ThinkWon</font>
