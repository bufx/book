# 🕵️‍♂️ 代理模式（Proxy Pattern）

------

## ✅ 定义

>   为某个对象提供一个**代理对象**，由代理对象控制对原对象的访问。
>    可用于：控制访问、增强功能、延迟加载、安全控制等。

🧠 通俗理解：

-   你不想或不能直接访问一个对象；
-   所以你找了个"中间人"代理来代替你操作；
-   这个代理可以帮你加权限验证、日志记录、延迟处理等。

## 🧃 举个生活例子：明星经纪人

明星不可能接所有人的电话、谈所有的合作 —— 所以你得先联系**经纪人（代理）**。

-   你找经纪人谈价格（代理做中介）
-   经纪人可以在背后帮明星过滤垃圾请求（加权限、日志、限流）

经纪人就是明星的**代理人**，对外表现一样，内部可以**加料**。

------

## 👨‍💻 Java 实现：静态代理方式

我们从最经典的"静态代理"实现入手。

------

### 🧩 第一步：定义接口

```java
// 接口（Subject）
public interface Star {
    void bookShow();
}
```

------

### 🧩 第二步：真实对象（RealSubject）

```java
// 真正的明星
public class RealStar implements Star {
    @Override
    public void bookShow() {
        System.out.println("🎤 明星本人签约演出");
    }
}
```

------

### 🧩 第三步：代理类（Proxy）

```java
// 明星的经纪人
public class StarAgent implements Star {
    private RealStar realStar;

    public StarAgent(RealStar realStar) {
        this.realStar = realStar;
    }

    @Override
    public void bookShow() {
        System.out.println("📝 经纪人准备合同");
        System.out.println("💰 经纪人谈价格");
        realStar.bookShow(); // 委托给明星本人
        System.out.println("📦 经纪人安排交通住宿");
    }
}
```

------

### 🧪 第四步：客户端使用

```java
public class Main {
    public static void main(String[] args) {
        RealStar star = new RealStar();
        Star agent = new StarAgent(star);

        // 客户端只面对代理，代理控制访问
        agent.bookShow();
    }
}
```

------

### 💡 输出结果：

```
📝 经纪人准备合同
💰 经纪人谈价格
🎤 明星本人签约演出
📦 经纪人安排交通住宿
```

------

## 📌 类图结构（文字版）

```markdown
        ┌──────────────┐
        │    Star               │  <─── 接口（Subject）
        └──────┬───────┘
                    │
     ┌────────┴─────────┐
     │                              │
RealStar                        StarAgent     <── RealStar 是被代理对象，StarAgent 是代理
                                    ▲
                        ┌──────┴───────┐
                        │    Client             │  <── 客户端使用代理对象
```

------

## 🧠 总结一句话

>   代理模式就是创建一个**中间人对象**来控制/增强对某个对象的访问。

------

## 🧰 应用场景举例（非常实用）

| 场景                   | 描述                                                       |
| ---------------------- | ---------------------------------------------------------- |
| 权限控制               | 接口代理加权限判断（如 admin 才能操作）                    |
| 延迟加载（虚拟代理）   | 比如只在用户点击头像时才去加载大图                         |
| 远程调用（远程代理）   | RPC 框架中 Stub 就是客户端的代理，代替本地调用远程服务     |
| 日志审计               | 在调用服务前后记录日志                                     |
| Spring AOP（动态代理） | 就是动态生成代理类来织入横切逻辑，如事务、日志、安全校验等 |

------

## ✅ 总结小卡片

| 模式名   | 代理模式 Proxy Pattern                                      |
| -------- | ----------------------------------------------------------- |
| 用途     | 控制/增强对真实对象的访问，加入权限、日志、延迟加载等       |
| 类型     | 静态代理、动态代理、远程代理、虚拟代理、安全代理等          |
| 关键角色 | Subject（接口）、RealSubject（真实对象）、Proxy（代理对象） |
| 常见场景 | AOP、RPC Stub、延迟加载、权限控制、日志记录等               |

------

你现在可以选择：

1.  用支付场景讲代理（比如：支付接口加权限 / 日志）
2.  继续学习：动态代理实现（Java原生 & JDK Proxy）
3.  学下一个结构型设计模式（组合模式、外观模式等）

你说了算，我继续教 😄
