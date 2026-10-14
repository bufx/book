# JVM-运行时数据区-方法区(Method Area)-方法区的演进细节

## 概述

- 首先明确：只有Hotspot才有永久代。

  BEA JRockit、IBMJ9等来说，是不存在永久代的概念的。原则上如何实现方法区属于虚拟机实现细节，不受《Java虚拟机规范》管束，并不要求统一

- Hotspot中方法区的变化：

  | 版本         | 说明                                                         |
  | ------------ | :----------------------------------------------------------- |
  | JDK1.6及以前 | 有永久代（permanent generation），字符串常量池(StringTable)和静态变量存储在永久代上 |
  | JDK1.7       | 有永久代，但已经逐步 “去永久代”，字符串常量池(StringTable)和静态变量移动保存在堆中 |
  | JDK1.8       | 无永久代，类型信息，字段，方法，常量保存在本地内存的元空间，但字符串常量池(StringTable)和静态变量仍然在堆中。 |

<!--more-->

![](evolution-details-img/method-area-evolution.png)

## 永久代为什么要被元空间替换

官方文档：https://openjdk.org/jeps/122

- 随着Java8的到来，HotSpot VM中再也见不到永久代了。但是这并不意味着类的元数据信息也消失了。这些数据被移到了一个**与堆不相连的本地内存区域，这个区域叫做元空间（Metaspace）。**
- 由于类的元数据分配在本地内存中，元空间的最大可分配空间就是系统可用内存空间。

所以被替换的`原因`有：

1. 为永久代设置空间大小是很难确定的。

   在某些场景下，如果动态加载类过多，容易产生Perm区的OOM。比如某个实际Web工程中，因为功能点比较多，在运行过程中，要不断动态加载很多类，经常出现致命错误。`Exception in thread 'dubbo client x.x connector' java.lang.OutOfMemoryError:PermGen space`而元空间和永久代之间最大的区别在于：元空间并不在虚拟机中，而是使用本地内存。 因此，默认情况下，元空间的大小仅受本地内存限制。

2. 对永久代进行调优是很困难的。

   - 方法区的垃圾收集主要回收两部分内容：**常量池中废弃的常量和不再用的类型**

   - 方法区的垃圾回收主要是 Full GC，但是Full GC 既浪费时间并且发生的条件还很多，所以我们要减少 Full GC的发生。

## 字符串常量池(StringTable)为什么要调整到堆中

JDK7中将StringTable放到了堆空间中。

因为永久代的回收效率很低，在Full GC的时候才会执行永久代的垃圾回收，而Full GC是老年代的空间不足、永久代不足时才会触发。

这就导致StringTable回收效率不高，而我们开发中会有大量的字符串被创建，回收效率低，导致永久代内存不足。放到堆里，能及时回收内存。

## 静态变量存储

从《Java虚拟机规范》所定义的概念模型来看，所有Class相关的信息都应该存放在方法区之中，但方法区该如何实现，《Java虚拟机规范》并未做出规定，这就成了一件允许不同虚拟机自己灵活把握的事情。**JDK7及其以后版本的HotSpot虚拟机选择把静态变量与类型在Java语言一端的映射Class对象存放在一起，存储于Java堆之中，从下面的代码也可以验证这一点。**

代码并配置虚拟机参数：

```java
/**
 * jdk7：
 * -Xms200m -Xmx200m -XX:PermSize=300m -XX:MaxPermSize=300m -XX:+PrintGCDetails
 * jdk 8：
 * -Xms200m -Xmx200m -XX:MetaspaceSize=300m -XX:MaxMetaspaceSize=300m -XX:+PrintGCDetails
 */
public class StaticFieldTest {
    private static byte[] arr = new byte[1024 * 1024 * 100];//100MB

    public static void main(String[] args) {
        System.out.println(StaticFieldTest.arr);
    }
}
```

结论：
 * 静态引用对应的对象实体(也就是这个new byte[1024 * 1024 * 100])始终都存在堆空间，
 * 只是那个变量(相当于arr变量名)在JDK6,JDK7,JDK8存放位置中有所变化
