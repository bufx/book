# 🏗️ 抽象工厂模式（Abstract Factory Pattern）

## ✅ 定义

>   **提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们具体的类。**

🧠 换句话说：

-   如果你有多个"产品"，它们属于**同一个产品族**
-   你希望通过一个"工厂"一次性创建这一整组产品
-   并且这些产品之间可以相互配合使用

这时候就需要：**抽象工厂模式**

## 🧾 举个支付系统的例子（产品族）

你现在开发一个支付平台，支持多种支付渠道，每种渠道不仅要有：

-   `支付功能`（IPay）
-   还要有 `退款功能`（IRefund）

它们必须成对出现，不允许混搭。

比如：

-   使用微信支付 → 必须配合微信退款
-   使用支付宝支付 → 必须配合支付宝退款

于是我们有两个产品族接口：

| 产品     | 接口名  | 实现类（举例）          |
| -------- | ------- | ----------------------- |
| 支付功能 | IPay    | WeChatPay、AliPay       |
| 退款功能 | IRefund | WeChatRefund、AliRefund |

你希望调用时只要一句话：

```java
PayFactory factory = new WeChatFactory();
factory.createPay().pay(100);
factory.createRefund().refund(100);
```

------

## 👨‍💻 Java 代码实现（抽象工厂模式）

### 🧩 第一步：定义两个产品接口（抽象产品）

```java
public interface IPay {
    void pay(double amount);
}

public interface IRefund {
    void refund(double amount);
}
```

------

### 🧩 第二步：实现具体产品（微信和支付宝）

```java
public class WeChatPay implements IPay {
    public void pay(double amount) {
        System.out.println("微信支付：" + amount + " 元");
    }
}

public class WeChatRefund implements IRefund {
    public void refund(double amount) {
        System.out.println("微信退款：" + amount + " 元");
    }
}

public class AliPay implements IPay {
    public void pay(double amount) {
        System.out.println("支付宝支付：" + amount + " 元");
    }
}

public class AliRefund implements IRefund {
    public void refund(double amount) {
        System.out.println("支付宝退款：" + amount + " 元");
    }
}
```

------

### 🏭 第三步：定义抽象工厂接口（创建产品族）

```java
public interface PayFactory {
    IPay createPay();
    IRefund createRefund();
}
```

------

### 🏭 第四步：具体工厂（每种渠道对应一个工厂）

```java
public class WeChatFactory implements PayFactory {
    public IPay createPay() {
        return new WeChatPay();
    }

    public IRefund createRefund() {
        return new WeChatRefund();
    }
}

public class AliFactory implements PayFactory {
    public IPay createPay() {
        return new AliPay();
    }

    public IRefund createRefund() {
        return new AliRefund();
    }
}
```

------

### 🧪 第五步：客户端使用

```java
public class PayClient {
    public static void main(String[] args) {
        PayFactory factory = new WeChatFactory();
        factory.createPay().pay(88.0);
        factory.createRefund().refund(88.0);

        factory = new AliFactory();
        factory.createPay().pay(199.0);
        factory.createRefund().refund(199.0);
    }
}
```

------

## 📌 类图结构（文字描述）

```markdown
           ┌──────────────────┐
           │    PayFactory 接口           │  <─── 抽象工厂（定义多个创建方法）
           └───┬─────────┬────┘
                  │              │
 ┌─────────▼───┐  ┌───▼──────────┐
 │ WeChatFactory       │   │ AliPayFactory         │  <─── 具体工厂
 └──────┬──────┘  └──┬───────────┘
             │                  │
    ┌────▼──────┐   ┌──▼────────┐
    │ createPay()      │   │ createRefund()   │  <─── 一组产品方法
    └──────┬────┘   └──────┬────┘
               │                        │
      ┌─────▼─────┐         ┌─▼──────┐
      │    IPay 接口      │         │  IRefund 接口│
      └─────▲─────┘         └─────▲──┘
                │                             │
   ┌───────▼─────┐             ┌──▼───────┐
   │  WeChatPay           │             │  WeChatRefund  │  <─── 具体产品
   └─────────────┘             └──────────┘

                                 ▲
                                 │
                  ┌────────┴─────┐
                  │  Client                │  <─── 使用者选择具体工厂，一次性创建一组产品
                  └──────────────┘

```

------

## ✅ 总结一句话：

>   抽象工厂模式用于**创建"产品族"**，即多个相关产品组成的一组，客户端只需选择哪个"工厂"，就能一次获得对应的整组产品，互相配合使用。

------

## 🧠 抽象工厂适用场景：

| 适用情境                           | 示例                           |
| ---------------------------------- | ------------------------------ |
| 多个产品需要一起使用，组合成产品族 | 支付 + 退款、UI按钮 + 输入框   |
| 产品族切换频繁                     | 国际版 vs 国内版组件           |
| 客户端不关心产品创建的细节         | 统一通过工厂创建、屏蔽实现差异 |

------

## ✅ 三个工厂模式 对比总结：

| 维度       | 简单工厂模式 `Simple Factory`    | 工厂方法模式 `Factory Method` | 抽象工厂模式 `Abstract Factory`        |
| ---------- | -------------------------------- | ----------------------------- | -------------------------------------- |
| ✅ 核心思想 | 一个工厂类，根据参数创建不同产品 | 每种产品对应一个工厂类        | 一个工厂创建一**组相关产品**（产品族） |
| 🧠 面向设计 | 面向"对象选择"（用 if/switch）   | 面向"子类扩展"                | 面向"产品族"的整体创建                 |
| 📦 产品结构 | 一个产品等级结构                 | 一个产品等级结构              | 多个产品等级结构组成产品族             |
| 🏗 工厂数量 | 1 个                             | 每个产品一个工厂类            | 每个产品族一个工厂类                   |
| ➕ 扩展方式 | 改 `if/switch`                   | 添加新工厂类，实现接口        | 添加新产品族工厂，实现所有抽象方法     |
| ❌ 缺点     | 不符合开闭原则                   | 工厂类增多，结构复杂          | 扩展新的产品等级结构困难               |
| ✅ 优点     | 简单、集中、易用                 | 满足开闭原则、结构清晰        | 统一创建产品族、产品之间一致性强       |
| 🔍 使用场景 | 产品少，变化少                   | 产品经常扩展                  | 多个产品组合必须一起工作               |

## 📌 支付场景举例对比：

| 模式     | 创建方法调用                                           | 支持内容                  |
| -------- | ------------------------------------------------------ | ------------------------- |
| 简单工厂 | `SimplePayFactory.create("wechat")`                    | 只能创建 `IPay`           |
| 工厂方法 | `new WeChatPayFactory().createPay()`                   | 每个支付方式一个工厂      |
| 抽象工厂 | `new WeChatFactory().createPay()` 和 `.createRefund()` | 创建一个支付+退款产品组合 |
