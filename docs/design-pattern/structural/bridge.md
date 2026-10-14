# 🌉 桥接模式（Bridge Pattern）

## ✅ 定义

>   **将抽象与实现解耦**，使它们可以独立变化。

🧠 通俗理解：

-   有时候一个类存在两个**维度的变化**（比如：**支付类型** + **支付渠道**、或者 **图形类型** + **操作系统**）；
-   如果用继承，会导致类爆炸式增长；
-   那就用**桥接模式**，把"维度"拆成两个独立的层次结构，用组合关系连接起来，解耦！

## 🧃 举个例子（通俗易懂）

我们经常会遇到这种需求：

-   支付渠道：微信支付、支付宝、银联支付...
-   支付方式：扫码支付、刷脸支付、指纹支付、信用卡支付...

如果直接用继承来实现，你可能会这样建类：

```
WeChatQRPay、WeChatFacePay、AliQRPay、AliFacePay...
```

这就出现了**横向多个渠道 × 纵向多个方式 = 类爆炸💥**

👉 怎么办？

🧠 **用桥接模式，把"支付渠道" 和 "支付方式" 两个变化维度解耦，让它们自由组合！**

------

## 👨‍💻 Java 实现（支付桥接）

### 🧩 第一步：定义实现化接口（支付渠道）

```java
// 支付渠道接口（实现维度）
public interface IPaymentChannel {
    void transfer(String uid, double amount);
}
```

------

### 🧩 第二步：具体支付渠道实现（微信、支付宝）

```java
public class WeChatChannel implements IPaymentChannel {
    @Override
    public void transfer(String uid, double amount) {
        System.out.println("✅ 使用【微信渠道】完成转账：用户 " + uid + "，金额 " + amount);
    }
}

public class AliPayChannel implements IPaymentChannel {
    @Override
    public void transfer(String uid, double amount) {
        System.out.println("✅ 使用【支付宝渠道】完成转账：用户 " + uid + "，金额 " + amount);
    }
}
```

------

### 🧩 第三步：抽象支付方式（刷脸、二维码）

```java
// 支付方式（抽象维度）
public abstract class IPay {
    protected IPaymentChannel channel;

    public IPay(IPaymentChannel channel) {
        this.channel = channel;
    }

    public abstract void pay(String uid, double amount);
}
```

------

### 🧩 第四步：具体支付方式（刷脸、二维码）

```java
public class FacePay extends IPay {
    public FacePay(IPaymentChannel channel) {
        super(channel);
    }

    @Override
    public void pay(String uid, double amount) {
        System.out.println("🧠 使用刷脸方式发起支付");
        channel.transfer(uid, amount);
    }
}

public class QRCodePay extends IPay {
    public QRCodePay(IPaymentChannel channel) {
        super(channel);
    }

    @Override
    public void pay(String uid, double amount) {
        System.out.println("📷 使用二维码方式发起支付");
        channel.transfer(uid, amount);
    }
}
```

------

### 🧪 第五步：客户端测试

```java
public class Main {
    public static void main(String[] args) {
        // 微信 + 刷脸
        IPay pay1 = new FacePay(new WeChatChannel());
        pay1.pay("user123", 100.0);

        System.out.println("-------------------");

        // 支付宝 + 二维码
        IPay pay2 = new QRCodePay(new AliPayChannel());
        pay2.pay("user456", 88.88);
    }
}
```

------

### 💡 输出结果：

```
🧠 使用刷脸方式发起支付
✅ 使用【微信渠道】完成转账：用户 user123，金额 100.0
-------------------
📷 使用二维码方式发起支付
✅ 使用【支付宝渠道】完成转账：用户 user456，金额 88.88
```

------

## 📌 类图结构（支付版 Bridge）

```markdown
           ┌──────────────┐
           │    IPay               │  <─── 抽象（支付方式）
           └──────▲───────┘
                      │
     ┌─────────┴──────┐
     │                          │
 FacePay                      QRCodePay     <── 扩展抽象（不同方式）

           ┌───────────┐
           │ IPaymentChannel  │  <─── 实现（支付渠道）
           └───▲───────┘
                  │
     ┌────────────┴────┐
     │                            │
WeChatChannel             AliPayChannel   <── 具体实现（渠道）
```

------

## 🧠 总结一句话

>   桥接模式就是帮你**把两个不同维度拆开设计**，比如：支付方式 × 支付渠道，用组合连接，**避免类爆炸，支持自由组合**。

------

## 🧰 应用场景举例（现实中的支付系统）

| 变化维度A（抽象） | 变化维度B（实现） | 示例                                  |
| ----------------- | ----------------- | ------------------------------------- |
| 支付方式          | 支付渠道          | 刷脸支付 + 微信 / 指纹支付 + 银联     |
| 通知模板（业务）  | 发送方式（实现）  | 短信通知 + 阿里云 / 邮件通知 + 腾讯云 |
| 图形（圆形/矩形） | 渲染平台          | 圆形 + OpenGL / 矩形 + DirectX        |

------

## ✅ 总结小卡片

| 模式名   | 桥接模式 Bridge Pattern                              |
| -------- | ---------------------------------------------------- |
| 用途     | 将两个维度（抽象+实现）分离，解耦、灵活组合          |
| 优点     | 避免类爆炸、支持扩展、新方式/新渠道可独立添加        |
| 关键角色 | Abstraction（IPay）、Implementor（IPaymentChannel）  |
| 常见场景 | 支付系统、渲染系统、消息系统、日志系统、多渠道通知等 |
