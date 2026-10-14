# Java基础知识-基础语法-反射

## 什么是反射机制？

`JAVA` 反射机制是在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意一个方法和属性；这种动态获取的信息以及动态调用对象的方法的功能称为 `java` 语言的反射机制。

静态编译和动态编译

- **静态编译：** 在编译时确定类型，绑定对象
- **动态编译：** 运行时确定类型，绑定对象

---

## 反射机制优缺点

- **优点：** 运行期类型的判断，动态加载类，提高代码灵活度。
- **缺点：** 性能瓶颈：反射相当于一系列解释操作，通知 `JVM` 要做的事情，性能比直接的 `java` 代码要慢很多。

---

## 反射机制的应用场景有哪些？

反射是框架设计的灵魂。

在我们平时的项目开发过程中，基本上很少会直接使用到反射机制，但这不能说明反射机制没有用，实际上有很多设计、开发都与反射机制有关，例如模块化的开发，通过反射去调用对应的字节码；动态代理设计模式也采用了反射机制，还有我们日常使用的 `Spring／Hibernate` 等框架也大量使用到了反射机制。

举例：

1. 我们在使用 `JDBC` 连接数据库时使用 `Class.forName()`通过反射加载数据库的驱动程序；
2. `Spring` 框架也用到很多反射机制，最经典的就是 `xml` 的配置模式。
   `Spring` 通过 `XML` 配置模式装载 `Bean` 的过程：
   1. 将程序内所有 `XML` 或 `Properties` 配置文件加载入内存中;
   2. `Java` 类里面解析 `xml` 或 `properties` 里面的内容，得到对应实体类的字节码字符串以及相关的属性信息;
   3. 使用反射机制，根据这个字符串获得某个类的 `Class` 实例;
   4. 动态配置实例的属性

---

## Java 获取反射的三种方法

1. 通过 `new` 对象实现反射机制 
2. 通过路径实现反射机制 
3. 通过类名实现反射机制

```java
public class Student {
    private int id;
    String name;
    protected boolean sex;
    public float score;
}
```

```java
public class Get {
    //获取反射机制三种方式
    public static void main(String[] args) throws ClassNotFoundException {
        //方式一(通过建立对象)
        Student stu = new Student();
        Class classobj1 = stu.getClass();
        System.out.println(classobj1.getName());
        //方式二（所在通过路径-相对路径）
        Class classobj2 = Class.forName("fanshe.Student");
        System.out.println(classobj2.getName());
        //方式三（通过类名）
        Class classobj3 = Student.class;
        System.out.println(classobj3.getName());
    }
}
```

参考：https://blog.csdn.net/ThinkWon
