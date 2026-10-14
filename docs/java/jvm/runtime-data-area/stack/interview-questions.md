# JVM-运行时数据区-虚拟机栈-相关面试题

## 第一题

举例栈溢出的情况？（StackOverFlowError）

- 通过设置 `-Xss` 设置栈的大小后，当超出这个次数，就会报 SOF（StackOverFlowError）
- 设置动态时，超出整个物理内存的话，就是报 OOM（OutofMemoryError）

<!--more-->

## 第二题

调整栈大小，就能保证不出现溢出吗？

- 不能，原因同上，只能保证SOF出现的几率小

## 第三题

分配的栈内存越大越好吗？

- 不是的，只是避免出现内存溢出的出现的较早。

## 第四题

垃圾回收是否会涉及到虚拟机栈？

- 不涉及

  | 位置                                        | 是否有内存溢出Error | 垃圾回收是否存在GC |
  | ------------------------------------------- | ------------------- | ------------------ |
  | PC计数器                                    | 无                  | 不存在             |
  | 虚拟机栈                                    | 有，SOF，OOM        | 不存在             |
  | 本地方法栈(在HotSpot的实现中和虚拟机栈一样) | 有，SOF，OOM        | 不存在             |
  | 堆                                          | 有，OOM             | 存在               |
  | 方法区                                      | 有                  | 存在               |

## 第五题

方法中定义的局部变量是否线程安全？

**如果对象是在内部产生，并在内部消亡，没有返回到外部，那么它就是线程安全的，反之则是线程不安全的。**

具体问题具体分析

1. 如果只有一个线程才可以操作此数据，则必是线程安全的。
2. 如果有多个线程操作此数据，则此数据是共享数据。如果不考虑同步机制的话，会存在线程安全问题。

例如：

```JAVA
/**
 * 面试题：
 * 方法中定义的局部变量是否线程安全？具体情况具体分析
 *
 *   何为线程安全？
 *      如果只有一个线程才可以操作此数据，则必是线程安全的。
 *      如果有多个线程操作此数据，则此数据是共享数据。如果不考虑同步机制的话，会存在线程安全问题。
 */
public class StringBuilderTest {

    int num = 10;

    //s1的声明方式是线程安全的（只在方法内部用了）
    public static void method1(){
        //StringBuilder:线程不安全
        StringBuilder s1 = new StringBuilder();
        s1.append("a");
        s1.append("b");
        //...
    }
    //sBuilder的操作过程：是线程不安全的（作为参数传进来，可能被其它线程操作）
    public static void method2(StringBuilder sBuilder){
        sBuilder.append("a");
        sBuilder.append("b");
        //...
    }
    //s1的操作：是线程不安全的（有返回值，可能被其它线程操作）
    public static StringBuilder method3(){
        StringBuilder s1 = new StringBuilder();
        s1.append("a");
        s1.append("b");
        return s1;
    }
    //s1的操作：是线程安全的（s1自己消亡了，最后返回的只是s1.toString的一个新对象）
    public static String method4(){
        StringBuilder s1 = new StringBuilder();
        s1.append("a");
        s1.append("b");
        return s1.toString();
    }

    public static void main(String[] args) {
        StringBuilder s = new StringBuilder();


        new Thread(() -> {
            s.append("a");
            s.append("b");
        }).start();

        method2(s);

    }

}

```

