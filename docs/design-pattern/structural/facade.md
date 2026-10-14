# 🏠 外观模式（Facade Pattern）

------

## ✅ 定义

>   为子系统中的一组接口提供一个**统一的高层接口**，让外部调用更简单。
>    外观模式定义了一个**"外观类"**，对外只暴露简化接口，内部细节都隐藏。

🧠 通俗理解：

-   系统内部结构太复杂，子系统太多；
-   客户端不想知道那么多细节；
-   那就定义一个"统一入口"类，让外部只管跟它打交道；
-   **"让复杂看起来简单"！**

## 🧃 举个生活例子：点外卖

你点外卖时：

-   不需要自己去下厨 🍳
-   不需要自己去送餐 🛵
-   不需要自己结账 💵

你只需要：

👉 打开"外卖 App"（比如 美团 / 饿了么），一键下单 ✅

这背后其实涉及多个子系统（做饭、配送、支付），但你只感知到一个统一入口 —— **外观接口（App）**。

------

## 👨‍💻 Java 实现：点外卖系统

------

### 🧩 第一步：定义多个子系统（做饭、送餐、支付）

```java
public class KitchenService {
    public void prepareMeal() {
        System.out.println("👨‍🍳 厨房：正在准备餐食...");
    }
}

public class DeliveryService {
    public void deliverMeal() {
        System.out.println("🛵 配送：骑手正在派送...");
    }
}

public class PaymentService {
    public void processPayment() {
        System.out.println("💳 支付：已完成线上支付...");
    }
}
```

------

### 🧩 第二步：定义外观类（统一对外接口）

```java
public class FoodOrderFacade {
    private KitchenService kitchen;
    private DeliveryService delivery;
    private PaymentService payment;

    public FoodOrderFacade() {
        this.kitchen = new KitchenService();
        this.delivery = new DeliveryService();
        this.payment = new PaymentService();
    }

    public void orderFood() {
        System.out.println("📱 用户点击下单按钮");
        payment.processPayment();
        kitchen.prepareMeal();
        delivery.deliverMeal();
        System.out.println("✅ 外卖已完成");
    }
}
```

------

### 🧪 第三步：客户端只使用外观接口

```java
public class Main {
    public static void main(String[] args) {
        FoodOrderFacade facade = new FoodOrderFacade();
        facade.orderFood(); // 一键下单，背后处理全部交给外观类
    }
}
```

------

### 💡 输出结果：

```
📱 用户点击下单按钮  
💳 支付：已完成线上支付...  
👨‍🍳 厨房：正在准备餐食...  
🛵 配送：骑手正在派送...  
✅ 外卖已完成
```

------

## 📌 类图结构（文字版）

```markdown
                ┌────────────────┐
                │ FoodOrderFacade           │  <─── 外观类（提供简化接口）
                └──────┬─────────┘
                            │ 组合（has-a）
     ┌─────────────┼─────────────┐
     │            				 	│            			 		│
KitchenService  			DeliveryService  			PaymentService  <─── 子系统类（复杂细节）
                   				 ▲
                   ┌────┴────┐
                   │  Client       │  <── 客户端直接调用外观，不关心子系统
                   └─────────┘
```

------

## 🧠 总结一句话

>   外观模式就是封装多个复杂子系统，暴露一个**统一的简单接口**，**对外简洁，对内解耦**。

------

## 🧰 应用场景举例

| 场景                       | 描述                                                         |
| -------------------------- | ------------------------------------------------------------ |
| Controller → Service → Dao | Controller 不直接和多个 Service/Dao 打交道，而通过外观统一封装 |
| Spring 中的 JdbcTemplate   | 内部封装了 Connection、PreparedStatement、事务等             |
| 微信支付 SDK               | 对外只提供一个 pay() 方法，内部封装验签、路由、请求          |
| 门面型工具类               | 比如 `FileUtils.copy()` 背后涉及 IO 流、异常处理等           |

------

## ✅ 总结小卡片

| 模式名   | 外观模式 Facade Pattern                        |
| -------- | ---------------------------------------------- |
| 用途     | 统一子系统接口，简化对外访问                   |
| 优点     | 降低耦合、屏蔽细节、简化调用                   |
| 关键角色 | 外观类（Facade）、子系统类、客户端             |
| 常见场景 | SDK 封装、统一服务入口、工具类封装、系统集成等 |
