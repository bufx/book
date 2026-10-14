# 🧾 简单工厂模式（Simple Factory Pattern）

## ✅ 定义

>   **由一个工厂类，根据传入参数，决定创建哪个产品类的实例。**

🧠 它把"选择创建哪个类"的逻辑放到了一个工厂方法里，一般用 `if` 或 `switch` 控制。

## 📌 为什么不在 23 种设计模式里面

因为 GoF（设计模式作者） 认为：

-   **"工厂方法"才是正统的"面向对象式创建模式"**：
    -   利用了**继承**和**多态**
    -   满足"开闭原则"：添加新产品，不修改旧代码

-   **而简单工厂**：

    -   是一种更"过程化"、"集中判断"的方式

    -   使用 `if/switch` 创建对象，不具备"开闭原则"的扩展性

---

## 🧾 举个支付例子（通俗易懂）

假设你在开发一个收银台系统，用户可以选择不同的支付方式：

-   微信支付（WeChatPay）
-   支付宝支付（AliPay）
-   银联支付（UnionPay）

你不会每次都 `new 微信支付()`、`new 支付宝()`，你会说：

👉「我要用支付宝支付！」

系统内部会根据你的选择，自动安排调用具体支付类。

## 👨‍💻 Java 代码实现

### 🧩 第一步：定义支付接口（抽象产品）

```java
public interface IPay {
    void pay(double amount);
}
```

### 🧩 第二步：实现具体支付方式（具体产品类）

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

### 🏭 第三步：定义简单支付工厂类

```java
public class SimplePayFactory {
    public static IPay createPay(String type) {
        if ("wechat".equalsIgnoreCase(type)) {
            return new WeChatPay();
        } else if ("alipay".equalsIgnoreCase(type)) {
            return new AliPay();
        } else if ("unionpay".equalsIgnoreCase(type)) {
            return new UnionPay();
        } else {
            throw new IllegalArgumentException("不支持的支付类型: " + type);
        }
    }
}
```

------

### 🧪 第四步：客户端使用：

```java
public class PayClient {
    public static void main(String[] args) {
        IPay pay1 = SimplePayFactory.createPay("wechat");
        pay1.pay(99.0); // 输出：使用微信支付：99.0 元

        IPay pay2 = SimplePayFactory.createPay("alipay");
        pay2.pay(199.0); // 输出：使用支付宝支付：199.0 元
    }
}
```

------

## 📌 类图结构（文字描述）

```markdown
         ┌────────────────────────┐
         │   SimplePayFactory                     │  <─── 工厂类，集中管理对象创建
         └─────────┬──────────────┘
                          │
    ┌────────────▼──────────────────────—──┐
    │                     createPay(String type)                    │  <─── 通过参数选择对象
    └─────┬────────────┬───────────────────┐
               │                    │                               │
┌────────▼───┐   ┌─────▼────────┐   ┌───────────────┐
│  WeChatPay         │   │  AliPay               │   │  UnionPay                │  <─── 具体产品（实现 IPay）
└────────────┘   └──────────────┘   └───────────────┘
           ▲                             ▲                         ▲
           │                             │                         │
      ┌──┴─────────────────┴────────────────┐
      │                       IPay 接口                              │  <─── 抽象产品
      └─────────────────────────────────────┘
                      ▲
                      │
          ┌──────┴─────┐
          │   Client           │  <─── 使用者：传入参数，得到产品
          └────────────┘
```



## 🔍 什么时候用简单工厂？

| 使用场景                             | 说明                       |
| ------------------------------------ | -------------------------- |
| 产品数量少                           | 简单明了，不需要多个工厂类 |
| 对扩展要求不高（变化不频繁）         | 比如内部业务逻辑，工具类   |
| 想隐藏复杂创建逻辑给一个统一入口使用 | 统一创建入口，调用方便     |
