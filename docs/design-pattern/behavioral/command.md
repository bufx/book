# 🧾 命令模式（Command Pattern）

------

## ✅ 定义

>   将**请求封装成对象**，从而让你可以参数化客户端，**将请求排队、记录日志、支持撤销重做**等操作。

🧠 通俗理解：

你去快餐店点单 🍔：

-   你不是直接跟厨师说"做一个汉堡"
-   而是让服务员写下一个"点单"
-   这个"点单"就是**命令对象**
-   你（客户端） → 服务员（Invoker） → 厨师（Receiver）

------

## 🍔 举个例子：点单命令系统

你下了一个"牛肉汉堡"订单 → 服务员记下并传给厨房
 这个订单是一个"命令对象"，服务员不做菜、你也不做，**真正执行的是后厨**。

>   **命令对象封装了你想要的结果，但不告诉怎么做！职责彻底解耦！

------

## 👨‍💻 Java 实现：快餐点单命令系统

------

### 🧩 第一步：定义命令接口

```java
// 抽象命令接口：所有订单都需要实现这个方法
public interface OrderCommand {
    void execute(); // 执行点单
}
```

------

### 🧩 第二步：接收者（厨师类）

```java
// 接收者：厨师，真正做事的人
public class Chef {
    public void cookBurger() {
        System.out.println("🍔 厨师：正在制作汉堡");
    }

    public void cookFries() {
        System.out.println("🍟 厨师：正在炸薯条");
    }
}
```

------

### 🧩 第三步：具体命令类（不同点单）

```java
// 汉堡命令
public class BurgerOrder implements OrderCommand {
    private Chef chef;

    public BurgerOrder(Chef chef) {
        this.chef = chef;
    }

    @Override
    public void execute() {
        chef.cookBurger();
    }
}

// 薯条命令
public class FriesOrder implements OrderCommand {
    private Chef chef;

    public FriesOrder(Chef chef) {
        this.chef = chef;
    }

    @Override
    public void execute() {
        chef.cookFries();
    }
}
```

------

### 🧩 第四步：调用者（服务员）

```java
// 调用者：服务员，负责接单并传给厨房执行
public class Waiter {
    private List<OrderCommand> orders = new ArrayList<>();

    public void takeOrder(OrderCommand order) {
        orders.add(order);
        System.out.println("✅ 服务员：已接到一份订单");
    }

    public void sendOrdersToKitchen() {
        System.out.println("👨‍🍳 服务员：将订单发送给厨房执行");
        for (OrderCommand order : orders) {
            order.execute();
        }
        orders.clear();
    }
}
```

------

### 🧪 第五步：客户端使用（Main.java）

```java
public class Main {
    public static void main(String[] args) {
        Chef chef = new Chef(); // 接收者
        OrderCommand burger = new BurgerOrder(chef);
        OrderCommand fries = new FriesOrder(chef);

        Waiter waiter = new Waiter(); // 调用者

        waiter.takeOrder(burger);
        waiter.takeOrder(fries);

        // 模拟客户点单完后，服务员把订单送去厨房
        waiter.sendOrdersToKitchen();
    }
}
```

------

### 💡 输出结果：

```
✅ 服务员：已接到一份订单
✅ 服务员：已接到一份订单
👨‍🍳 服务员：将订单发送给厨房执行
🍔 厨师：正在制作汉堡
🍟 厨师：正在炸薯条
```

------

## 📌 类图结构（点餐系统）

```markdown
          ┌────────────────────┐
          │   OrderCommand                  │ ←────── 抽象命令接口
          └───────────▲────────┘
                              │
     ┌──────────────┴───────────────┐
     │                                                  │
BurgerOrder                                          FriesOrder   ← 具体命令类（封装了请求）

     ▲                                                  ▲
     │                                                  │
┌────────────┐                    ┌──────────┐
│   Waiter           │                    │   Chef          │
│（调用者）            │── 维护订单列表 ──▶│（接收者）        │← 实际干活
└────────────┘                    └──────────┘
```

------

## 🧠 总结一句话

>   命令模式把请求（点餐）对象化，让发起者（你）与执行者（厨师）彻底解耦，还可以**支持排队、撤销、记录、组合命令**！

------

## 🧰 应用场景举例（现实可见）

| 场景         | 描述                                                 |
| ------------ | ---------------------------------------------------- |
| 点餐系统     | 客户下单 → 服务员 → 厨房执行                         |
| GUI 菜单按钮 | 每个按钮绑定一个命令，点击后执行操作（撤销、复制等） |
| 事务补偿系统 | 每个步骤封装为命令，可自动重试或回滚                 |
| 宏命令       | 一次执行多个命令（批量操作）                         |
| 任务调度中心 | 把任务封装为命令，放入队列按需执行                   |

------

## ✅ 总结小卡片

| 模式名   | 命令模式 Command Pattern                               |
| -------- | ------------------------------------------------------ |
| 用途     | 封装请求为对象，解耦调用者与执行者，支持操作记录等     |
| 优点     | 解耦、可组合、可记录、可撤销                           |
| 缺点     | 命令类较多，代码量大                                   |
| 关键角色 | Command（命令）、Receiver（接收者）、Invoker（调用者） |
| 推荐例子 | 点餐系统 🍔（封装点单）                                 |
