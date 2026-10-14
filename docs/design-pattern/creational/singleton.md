# 🧠 单例模式（Singleton Pattern）

##✅ 定义：

>   **确保一个类在整个程序中只有一个实例，并且提供一个访问它的全局方式。**

------

##📦 为什么需要单例？

你不希望在程序中反复创建这些东西：

-   日志记录器（Logger） → 只有一个负责写日志
-   配置管理器（Config） → 程序读取全局唯一配置
-   数据库连接池 → 只有一份，避免资源浪费

🎯 **单例的目标是节省资源，统一管理，避免重复创建。**

------

##🛠 单例的核心要点

| 关键点               | 说明                                       |
| -------------------- | ------------------------------------------ |
| **私有构造方法**     | 不允许外部直接 `new` 创建实例              |
| **类中保存一个实例** | 使用静态变量 `private static` 存储唯一对象 |
| **提供全局访问方法** | `public static getInstance()` 来访问实例   |
| **线程安全（可选）** | 多线程访问时不能创建多个实例（后面细讲）   |

------

##🍳 单例的几种写法（懒汉 / 饿汉）

------

###🥱 1. 懒汉式（Lazy）

>   "用的时候再创建"，节省资源。**但要注意线程安全问题！**

####👇 基本实现（非线程安全 ❌）：

```java
public class LazySingleton {
    private static LazySingleton instance;

    private LazySingleton() {}  // 构造私有

    public static LazySingleton getInstance() {
        if (instance == null) {
            instance = new LazySingleton(); // 第一次调用才创建
        }
        return instance;
    }
}
```

####❌ 问题：

在多线程下，多个线程同时判断 `instance == null`，就可能会创建出多个对象（不是真正的单例）！

------

###✅ 改进版：**懒汉式 + 线程安全（synchronized）**

```java
public class LazySingleton {
    private static LazySingleton instance;

    private LazySingleton() {}

    public static synchronized LazySingleton getInstance() {
        if (instance == null) {
            instance = new LazySingleton(); // 安全了，但性能低
        }
        return instance;
    }
}
```

✅ 优点：线程安全
 ❌ 缺点：每次调用都要加锁，性能差

------

###✅ 终极优化：**懒汉式 + 双重检查锁（DCL）**

```java
public class LazySingleton {
    private static volatile LazySingleton instance;

    private LazySingleton() {}

    public static LazySingleton getInstance() {
        if (instance == null) {              // 第一次判断（快）
            synchronized (LazySingleton.class) {
                if (instance == null) {      // 第二次判断（安全）
                    instance = new LazySingleton();
                }
            }
        }
        return instance;
    }
}
```

####🚀 为什么要 **双重检查锁（DCL）+ volatile**？

| 问题                    | 解释                                               |
| ----------------------- | -------------------------------------------------- |
| 两次 if 判断            | 避免每次都加锁，提高性能（第一次不为空就直接返回） |
| synchronized 块中再判断 | 避免两个线程同时进入导致重复创建                   |
| volatile 修饰变量       | 防止 CPU 重排序，确保对象初始化完成                |

------

###🍚 2. 饿汉式（Eager）

>   一开始就创建好了，不管你用不用！

```java
public class EagerSingleton {
    private static final EagerSingleton instance = new EagerSingleton();

    private EagerSingleton() {}

    public static EagerSingleton getInstance() {
        return instance;
    }
}
```

✅ 优点：简单、线程安全
 ❌ 缺点：启动时就创建，占用内存（不一定用得到）

------

###🧩 3. 静态内部类（推荐）

>   结合了懒加载 + 线程安全的优点

```java
public class StaticInnerSingleton {
    private StaticInnerSingleton() {}

    private static class Holder {
        static final StaticInnerSingleton instance = new StaticInnerSingleton();
    }

    public static StaticInnerSingleton getInstance() {
        return Holder.instance;
    }
}
```

🧠 JVM 类加载机制：

-   只有在第一次调用 `getInstance()` 时，`Holder` 类才会被加载
-   加载类的过程是线程安全的

------

###🧱 4. 枚举单例（最强写法）

>   Java 中最推荐的方式（防止反射、序列化攻击）

```java
public enum EnumSingleton {
    INSTANCE;

    public void doSomething() {
        System.out.println("操作中");
    }
}
```

调用方式：

```java
EnumSingleton.INSTANCE.doSomething();
```

✅ 优点：

-   天然线程安全
-   防止反射
-   防止反序列化破坏单例

------

##🔍 总结对比

| 实现方式               | 是否懒加载 | 是否线程安全 | 是否推荐    |
| ---------------------- | ---------- | ------------ | ----------- |
| 懒汉式（普通）         | ✅          | ❌            | ❌           |
| 懒汉式（synchronized） | ✅          | ✅            | ⚠️（性能差） |
| 双重检查锁（DCL）      | ✅          | ✅            | ✅           |
| 饿汉式                 | ❌          | ✅            | ✅（简单）   |
| 静态内部类             | ✅          | ✅            | ✅✅（优雅）  |
| 枚举方式               | ❌          | ✅            | ✅✅✅（最佳） |

------

##📌 类图结构（文字描述）

```markdown
         ┌───────────────┐
         │   Singleton             │  <─── 唯一实例（构造函数私有）
         └──────▲────────┘
                     │ 静态调用
         ┌──────┴────────┐
         │    getInstance()        │
         └───────────────┘
                     ▲
                     │
         ┌──────┴──────┐
         │   Client             │  <─── 使用者：获取并使用单例
         └─────────────┘
```



##🧠 面试常问问题

###✅ 1. **单例为什么构造函数是 `private`？**

####🎯 目的是：

>   防止外部通过 `new` 创建多个实例，破坏单例。

####💡 如果是 public 构造方法：

```java
Singleton s1 = new Singleton();
Singleton s2 = new Singleton();  // ❌ 又一个新对象
```

这样就不是单例了。**必须通过 `getInstance()` 来控制创建逻辑**。

------

###✅ 2. **DCL（双重检查锁）为什么要用 `volatile`？**

####🎯 原因是：

>   防止指令重排序导致创建出"未初始化完成的对象"。

------

####👀 什么是指令重排序？

Java 创建对象分成 3 步：

```java
instance = new Singleton(); // 实际上是这三步：
1. 分配内存
2. 初始化对象（构造函数）
3. 把对象引用赋值给变量（instance）
```

但是 JVM 和 CPU 可能会 **把 2 和 3 重排序**：

```java
先把 instance 赋值 -> 还没真正初始化完成
```

此时另一个线程看到 `instance != null`，以为已经可以用了，其实是"半成品"。

------

####✅ 加上 `volatile` 的作用：

```java
private static volatile Singleton instance;
```

-   禁止指令重排序
-   保证内存可见性
-   真正确保 **"只创建一次，且完全初始化"**

------

###✅ 3. **懒汉式 vs 饿汉式 有什么区别？**

| 比较点       | 懒汉式                       | 饿汉式                      |
| ------------ | ---------------------------- | --------------------------- |
| 是否延迟加载 | ✅ 是（第一次用才创建）       | ❌ 否（类加载时立即创建）    |
| 是否线程安全 | ❌（普通版）✅（加锁/DCL）     | ✅ 安全（类加载时 JVM 保证） |
| 性能         | 🔸 第一次访问稍慢（加锁）     | 🔸 类加载慢，但访问快        |
| 是否推荐     | ✅ 推荐懒汉+DCL 或静态内部类  | ✅ 推荐饿汉（逻辑简单）      |
| 适合场景     | 对象创建成本高，不一定用得上 | 对象轻量，确定一定会使用    |

------

###✅ 4. **如何防止反射破坏单例？**

####✅ 先说：什么是反射？

Java 反射是一种功能，能让你**在运行时**访问类、方法、字段，甚至"偷偷 new 一个对象"，**即使构造函数是 private！**

------

####❌ 比如你写了一个单例：

```java
public class MySingleton {
    private static final MySingleton instance = new MySingleton();
    private MySingleton() {}  // 构造私有

    public static MySingleton getInstance() {
        return instance;
    }
}
```

看起来没人能 new 它对吧？

------

####🚨 但是反射可以这样干：

```java
Constructor<MySingleton> c = MySingleton.class.getDeclaredConstructor();
c.setAccessible(true); // 强行允许访问 private 构造
MySingleton s1 = c.newInstance();
MySingleton s2 = c.newInstance();
```

💣 你就成功创建了两个对象 `s1` 和 `s2`！单例模式破了！

------

####✅ 怎么防止？

#####✅ 方法1：在构造函数里判断：

```java
private static boolean created = false;

private MySingleton() {
    if (created) {
        throw new RuntimeException("别想用反射破坏我！");
    }
    created = true;
}
```

>   这样如果别人反射调用构造方法，也会抛异常 🚫
>
>   注意：要配合除了普通的懒汉式写法外，才能确保 `created` 线程安全。

------

#####✅ 方法2（最推荐）：用 `枚举` 实现单例（反射不支持枚举）

```java
public enum SingletonEnum {
    INSTANCE;

    public void doSomething() {
        System.out.println("操作中");
    }
}
```

反射根本 **不能访问 enum 的构造方法**，JVM 有专门的限制：

```java
Constructor<SingletonEnum> c = SingletonEnum.class.getDeclaredConstructor(); // 会抛异常！
```

✅ 所以反射不能破坏枚举单例，这是它最大优势之一。

------

###✅ 5. **如何防止反序列化破坏单例？**

####✅ 什么是反序列化？

Java 支持把一个对象写入磁盘（叫序列化），再读取回来变成一个新对象（叫反序列化）。

------

####❌ 比如这样写：

```java
ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("a.obj"));
out.writeObject(Singleton.getInstance());
out.close();

ObjectInputStream in = new ObjectInputStream(new FileInputStream("a.obj"));
Singleton s2 = (Singleton) in.readObject();
```

你以为读回来的是原来的单例吗？不是！💣 反序列化会自动调用 **无参构造器**，生成一个新对象！

------

####✅ 怎么防止反序列化破坏单例？

#####✅ 方法：定义 `readResolve()` 方法

```java
private Object readResolve() throws ObjectStreamException {
    return instance;
}
```

JVM 在反序列化时如果发现你写了这个方法，就会用你提供的对象（instance）而不是自己创建新对象。

------

#####✅ 更推荐：用枚举！

```java
EnumSingleton.INSTANCE
```

-   Java 的枚举天生是 **不可序列化破坏的**
-   枚举内部的反序列化机制是安全的

所以不用写 `readResolve()`，也不会出问题！
