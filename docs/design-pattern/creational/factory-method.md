# 🏭 工厂方法模式（Factory Method Pattern）

## ✅ 定义

>   **定义一个用于创建对象的接口，让子类决定实例化哪一个类。**
>    工厂方法使一个类的实例化延迟到其子类。

🧠 换句话说：

-   父类定义创建产品的方法（通常是接口或抽象类中的 `create()` 方法）
-   子类根据需要重写这个方法，**决定创建哪个具体产品对象**

它让「创建」过程**从父类中剥离出来**，完全交给子类负责，从而实现：

-   🔄 扩展性更强
-   ✅ 满足开闭原则
-   🧩 面向接口编程

### ✅ 和简单工厂的对比理解：

| 模式         | 谁决定创建什么产品？        | 如何扩展新产品？                       |
| ------------ | --------------------------- | -------------------------------------- |
| 简单工厂模式 | 工厂类通过 `if/switch` 决定 | 修改工厂类，不符合开闭原则             |
| 工厂方法模式 | 子类工厂决定创建哪个产品    | 新建工厂类，无需改旧代码，符合开闭原则 |

------

## 🧾 举个支付例子（工厂方法版）

你现在要实现：

-   微信支付由 `WeChatPayFactory` 创建
-   支付宝支付由 `AliPayFactory` 创建
-   银联支付由 `UnionPayFactory` 创建

## 👨‍💻 Java 代码实现（用 IPay 接口）

### 🧩 第一步：定义支付接口（抽象产品）

```java
public interface IPay {
    void pay(double amount);
}
```

------

### 🧩 第二步：实现具体支付类

```java
public class WeChatPay implements IPay {
    public void pay(double amount) {
        System.out.println("使用微信支付：" + amount + " 元");
    }
}

public class AliPay implements IPay {
    public void pay(double amount) {
        System.out.println("使用支付宝支付：" + amount + " 元");
    }
}

public class UnionPay implements IPay {
    public void pay(double amount) {
        System.out.println("使用银联支付：" + amount + " 元");
    }
}
```

------

### 🧩 第三步：定义支付工厂接口（抽象工厂）

```java
public interface PayFactory {
    IPay createPay(); // 抽象的创建方法
}
```

### 🏭 第四步：实现具体工厂类

```java
public class WeChatPayFactory implements PayFactory {
    public IPay createPay() {
        return new WeChatPay();
    }
}

public class AliPayFactory implements PayFactory {
    public IPay createPay() {
        return new AliPay();
    }
}

public class UnionPayFactory implements PayFactory {
    public IPay createPay() {
        return new UnionPay();
    }
}
```



### 🧪 第五步：客户端调用

```java
public class PayClient {
    public static void main(String[] args) {
        PayFactory factory;

        factory = new WeChatPayFactory();
        IPay pay1 = factory.createPay();
        pay1.pay(100.0); // 输出：使用微信支付：100.0 元

        factory = new AliPayFactory();
        IPay pay2 = factory.createPay();
        pay2.pay(200.0); // 输出：使用支付宝支付：200.0 元
    }
}
```

------

## 📌 类图结构

```markdown
     ┌────────────────────┐
     │   PayFactory 接口               │  <─── 抽象工厂接口
     └───────▲────────────┘
                   │
       ┌──────┴─────────┐
       │ WeChatPayFactory          │
       │ AliPayFactory             │
       │ UnionPayFactory           │  <─── 具体工厂
       └──────┬─────────┘
                   │
             ┌───▼─────┐
             │  createPay()  │  <─── 工厂方法（创建 IPay 对象）
             └─────┬───┘
                       │
             ┌─────▼──────┐
             │    IPay 接口        │
             └────┬───────┘
                     │
         ┌──────▼───────┐
         │  WeChatPay            │
         │  AliPay               │
         │  UnionPay             │  <─── 具体产品
         └──────────────┘
                      ▲
                      │
              ┌────┴────┐
              │ Client        │  <─── 使用者：选择工厂类，调用 createPay()
              └─────────┘
```

------

## ✅ 工厂方法模式 vs 简单工厂模式 对比总结：

| 方面             | 简单工厂模式           | 工厂方法模式             |
| ---------------- | ---------------------- | ------------------------ |
| 工厂类数量       | 1 个集中工厂类         | 每个产品一个工厂类       |
| 扩展性           | ❌ 不好，新产品需改工厂 | ✅ 好，新产品只需新增工厂 |
| 是否符合开闭原则 | ❌ 违反                 | ✅ 满足                   |
| 产品选择方式     | if/switch 判断         | 多态创建，交给具体工厂   |
| 结构复杂度       | 简单，适合产品少的场景 | 略复杂，但更灵活、可维护 |

------

## ✅ 小结一句话：

>   工厂方法模式是将"创建产品"的责任交给子类（具体工厂），实现了解耦、易扩展、开闭原则的目标，是更标准的设计模式写法。
