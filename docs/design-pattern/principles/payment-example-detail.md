# 设计模式-02-设计原则-支付功能实战举例

>   该实战用到了：**开闭原则 + 依赖倒置原则 + 策略模式 + 工厂模式**

## ❓问题：既然用接口去支付，那么如何知道用户使用支付宝或者微信支付呢，从哪里来判断？

这个问题问得非常好！你已经触碰到了**"依赖倒置 + 策略模式 + 工厂模式"结合使用**的核心。

>   ✅ **接口是为了代码解耦，但支付方式还是要根据用户选择动态决定的**。

------

## 📌 回答核心：

虽然我们写的是：

```java
IPay pay = new Alipay(); // 或 WechatPay()
```

但用户到底是用支付宝还是微信，这个选择不是在代码里写死的，而是：

-   用户在页面上选了一个"支付方式"
-   后端根据这个参数，**动态创建对应的支付对象（策略）**

------

## ✅ 实战例子（模拟用户动态选择支付方式）

### 假设你有这样一个接口：

```java
public interface IPay {
    void pay();
}
```

### 支付策略类：

```java
public class Alipay implements IPay {
    public void pay() {
        System.out.println("使用支付宝支付");
    }
}

public class WechatPay implements IPay {
    public void pay() {
        System.out.println("使用微信支付");
    }
}
```

------

## 🏭 加入简单的"工厂类"负责**根据用户选择创建对象**

```java
public class PayFactory {
    public static IPay getPay(String type) {
        if ("alipay".equalsIgnoreCase(type)) {
            return new Alipay();
        } else if ("wechat".equalsIgnoreCase(type)) {
            return new WechatPay();
        }
        throw new IllegalArgumentException("不支持的支付方式: " + type);
    }
}
```

------

## 👇 后端控制器这样写：

```java
public class OrderService {
    public void processPay(String payType) {
        IPay pay = PayFactory.getPay(payType); // 根据用户选择创建
        pay.pay(); // 执行策略
    }
}
```

------

## ✅ 模拟运行：

```java
new OrderService().processPay("wechat"); // 输出：使用微信支付
new OrderService().processPay("alipay"); // 输出：使用支付宝支付
```

------

## 🧠 总结关键逻辑

| 角色                 | 说明                                 |
| -------------------- | ------------------------------------ |
| `IPay`               | 接口，定义支付动作（依赖倒置原则）   |
| `Alipay / WechatPay` | 实现类，真正的业务逻辑               |
| `PayFactory`         | 简单工厂，用于根据字符串返回对应对象 |
| `OrderService`       | 调用者，面向接口编程，不关心具体实现 |



------

## 🔥 进阶（可选）：

你还可以用：

-   **Spring Bean 动态注入**（用 `@Component` + Map 注入策略）
-   **策略注册器**（每种支付注册到 Map 中）
-   **配置中心**/数据库参数/接口参数来控制用户选择

## ❓继续提问：你在工厂类创建对象的时候 还是有if else 呀，不违反开闭原则吗？

对！你又问到关键点了：

>   **在 `PayFactory` 中用 `if-else` 判断来创建对象，确实违反了开闭原则。**

虽然这已经比在业务类里直接 `new` 好很多了（通过工厂隔离了对象创建逻辑），但它还是写死了判断逻辑，不利于扩展。

------

## 👇 那么问题来了：**如何改造 PayFactory，让它符合开闭原则？**

我们希望做到：

✅ 新增一种支付方式时
 ❌ 不改原来的 `if-else` 代码
 ✅ 只增加一个新类，就能自动生效

------

## ✅ 解决方案：**注册机制 + Map 缓存策略对象**（结合策略模式 + 工厂 + Spring 的自动注入）

------

### 📌 思路：

-   所有支付类实现 `IPay`
-   启动时自动注册每个支付策略
-   根据字符串（如 `"wechat"`）从 Map 中获取，不用 `if-else`

------

### ✅ 示例代码（使用 Map + 注册机制）：

#### 1️⃣ IPay 接口

```java
public interface IPay {
    String getType(); // 返回类型：alipay、wechat
    void pay();
}
```

------

#### 2️⃣ 支付策略类实现

```java
public class Alipay implements IPay {
    public String getType() { return "alipay"; }
    public void pay() { System.out.println("使用支付宝支付"); }
}

public class WechatPay implements IPay {
    public String getType() { return "wechat"; }
    public void pay() { System.out.println("使用微信支付"); }
}
```

------

#### 3️⃣ 支付工厂：用 Map 存策略对象

```java
public class PayFactory {
    private static final Map<String, IPay> strategyMap = new HashMap<>();

    // 注册所有策略（可以在系统启动时注册）
    public static void register(IPay strategy) {
        strategyMap.put(strategy.getType(), strategy);
    }

    public static IPay getPay(String type) {
        IPay strategy = strategyMap.get(type);
        if (strategy == null) {
            throw new IllegalArgumentException("不支持的支付类型: " + type);
        }
        return strategy;
    }
}
```

------

#### 4️⃣ 启动时注册（模拟 Spring 启动）

```java
public class AppInit {
    public static void init() {
        PayFactory.register(new Alipay());
        PayFactory.register(new WechatPay());
    }
}
```

------

#### 5️⃣ 使用方式：

```java
public class OrderService {
    public void processPay(String payType) {
        IPay pay = PayFactory.getPay(payType);
        pay.pay();
    }
}
```

------

## ✅ 好处总结

| 优化点             | 原来             | 现在                          |
| ------------------ | ---------------- | ----------------------------- |
| 添加支付方式       | 需要改 `if-else` | **不需要改，只新增类 + 注册** |
| 是否符合开闭原则   | ❌ 否             | ✅ 是                          |
| 可测试性           | 差               | 高                            |
| Spring中是否易集成 | 一般             | ✅ 可自动注入、@Component 扫描 |

------

## 🔥 想进一步自动注册？Spring 里可以这样做：

使用 `@Component` + `ApplicationContextAware` 自动注册所有实现类，**完全不改代码就能扩展支付方式**。

## ❓继续提问：用SpringBoot来实现一下？

下面是一个**基于 Spring Boot 的完整"支付策略 + 自动注册 + 工厂"架构实战**，完全符合**开闭原则 + 依赖倒置原则 + 策略模式 + 工厂模式**，可运行可扩展。

------

## 🧩 项目结构预览（最简核心版）

```shell
src/
├── PayApplication.java
├── pay/
│   ├── IPay.java                // 接口
│   ├── impl/
│   │   ├── Alipay.java          // 支付宝实现
│   │   └── WechatPay.java       // 微信实现
│   ├── PayFactory.java          // 策略工厂
│   └── OrderService.java        // 模拟调用者
```

------

## ✅ 1. 定义统一接口 `IPay`

```java
package pay;

public interface IPay {
    String getType(); // 唯一标识，如 "alipay"
    void pay();       // 执行支付
}
```

------

## ✅ 2. 编写两个策略实现类（支付宝、微信）

```java
package pay.impl;

import org.springframework.stereotype.Component;
import pay.IPay;

@Component
public class Alipay implements IPay {
    public String getType() { return "alipay"; }
    public void pay() {
        System.out.println("【Alipay】正在支付...");
    }
}
package pay.impl;

import org.springframework.stereotype.Component;
import pay.IPay;

@Component
public class WechatPay implements IPay {
    public String getType() { return "wechat"; }
    public void pay() {
        System.out.println("【WeChat】正在支付...");
    }
}
```

------

## ✅ 3. 自动注册工厂类 `PayFactory`

```java
package pay;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class PayFactory {

    @Autowired
    private List<IPay> strategies; // Spring 会自动注入所有实现类

    private static final Map<String, IPay> strategyMap = new HashMap<>();

    @PostConstruct
    public void init() {
        for (IPay strategy : strategies) {
            strategyMap.put(strategy.getType(), strategy);
        }
        System.out.println("【PayFactory 初始化完成】注册策略有：" + strategyMap.keySet());
    }

    public static IPay getStrategy(String type) {
        IPay strategy = strategyMap.get(type);
        if (strategy == null) {
            throw new IllegalArgumentException("不支持的支付方式: " + type);
        }
        return strategy;
    }
}
```

------

## ✅ 4. 模拟业务调用 `OrderService`

```java
package pay;

import org.springframework.stereotype.Service;

@Service
public class OrderService {

    public void doPay(String payType) {
        IPay pay = PayFactory.getStrategy(payType);
        pay.pay();
    }
}
```

------

## ✅ 5. 启动类 `PayApplication`

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import pay.OrderService;

@SpringBootApplication
public class PayApplication implements CommandLineRunner {

    @Autowired
    private OrderService orderService;

    public static void main(String[] args) {
        SpringApplication.run(PayApplication.class, args);
    }

    @Override
    public void run(String... args) {
        orderService.doPay("alipay");
        orderService.doPay("wechat");
    }
}
```

------

## 🧪 运行输出结果：

```shell
【PayFactory 初始化完成】注册策略有：[alipay, wechat]
【Alipay】正在支付...
【WeChat】正在支付...
```

------

## ✅ 扩展新支付方式？

只需：

1.  新增一个 `@Component` 的类，实现 `IPay`
2.  实现 `getType()` 和 `pay()` 方法
3.  无需修改任何老代码！

这就是完美的 **开闭原则实践**。
