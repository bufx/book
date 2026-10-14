# 🔗 责任链模式（Chain of Responsibility Pattern）

------

## ✅ 定义

>   将多个处理器组成一条链，**每个处理器决定是否处理请求**，如果不能处理则传给下一个。

🧠 通俗理解：

-   就像办事流程，一层一层审批；
-   谁能处理就谁处理，**不用管是谁发起的**；
-   如果处理不了，就 **甩锅** 给下一个人！

------

## 🛫 举个生活例子：请假审批流程

一个员工请假：

-   ≤ 3 天 → 主管审批

-   4~7 天 → 经理审批

-   \> 7 天 → 总经理审批

你只管提交申请，不需要指定谁批。
 他们之间形成了一个审批 **链**，逐个传下去，直到有能处理的人为止。

------

## 👨‍💻 Java 实现：请假审批责任链

------

### 🧩 第一步：定义抽象处理者（Handler）

```java
// 抽象处理者：定义统一接口，并持有下一个处理者
public abstract class LeaveHandler {
    protected LeaveHandler next; // 下一个审批人

    public void setNext(LeaveHandler next) {
        this.next = next;
    }

    public abstract void handleRequest(int leaveDays);
}
```

------

### 🧩 第二步：具体处理者（不同审批层级）

#### Supervisor.java

```java
// 主管审批
public class Supervisor extends LeaveHandler {
    @Override
    public void handleRequest(int leaveDays) {
        if (leaveDays <= 3) {
            System.out.println("✅ 主管批准请假 " + leaveDays + " 天");
        } else if (next != null) {
            next.handleRequest(leaveDays);
        }
    }
}
```

#### Manager.java

```java
// 经理审批
public class Manager extends LeaveHandler {
    @Override
    public void handleRequest(int leaveDays) {
        if (leaveDays <= 7) {
            System.out.println("✅ 经理批准请假 " + leaveDays + " 天");
        } else if (next != null) {
            next.handleRequest(leaveDays);
        }
    }
}
```

#### Director.java

```java
// 总经理审批
public class Director extends LeaveHandler {
    @Override
    public void handleRequest(int leaveDays) {
        if (leaveDays > 7) {
            System.out.println("✅ 总经理批准请假 " + leaveDays + " 天");
        } else if (next != null) {
            next.handleRequest(leaveDays);
        }
    }
}
```

------

### 🧪 第三步：客户端测试（Main.java）

```java
public class Main {
    public static void main(String[] args) {
        // 组装责任链：主管 → 经理 → 总经理
        LeaveHandler supervisor = new Supervisor();
        LeaveHandler manager = new Manager();
        LeaveHandler director = new Director();

        supervisor.setNext(manager);
        manager.setNext(director);

        // 发起请假请求
        supervisor.handleRequest(2);  // 主管处理
        supervisor.handleRequest(5);  // 经理处理
        supervisor.handleRequest(10); // 总经理处理
    }
}
```

------

### 💡 输出结果：

```
✅ 主管批准请假 2 天
✅ 经理批准请假 5 天
✅ 总经理批准请假 10 天
```

------

## 🧭 类图结构（文字版）

```markdown
                 Client
                    │
                    ▼
             ┌────────────┐
             │LeaveHandler        │   ← 抽象处理者（定义接口、持有 next）
             └──────┬─────┘
                         │
   ┌────────────┴────────────┐
   │                    │                    │
Supervisor            Manager               Director  ← 具体处理者

Client 只需要把请求交给链头即可，链条内部自行传递。
```

------

## 🧠 总结一句话

>   责任链模式让请求的发送者和接收者解耦，**请求沿着链传递，直到被处理**，流程清晰、职责单一！

------

## 🧰 应用场景举例

| 场景                | 描述                                                    |
| ------------------- | ------------------------------------------------------- |
| 审批流程系统        | OA办公、请假、报销、订单审核等，逐层处理                |
| Java Servlet 过滤器 | 多个过滤器组成 FilterChain，按顺序处理请求/响应内容     |
| Spring Security     | 多个认证处理器构成安全责任链，逐一尝试认证用户          |
| 日志系统            | 日志按等级传递给各级处理器，debug → info → warn → error |
| 客户服务系统        | 客服机器人 → 一线客服 → 二线客服 → 技术支持             |

------

## ✅ 总结小卡片

| 模式名   | 责任链模式 Chain of Responsibility           |
| -------- | -------------------------------------------- |
| 用途     | 处理请求链式传递，谁能处理谁来处理           |
| 优点     | 解耦请求发送者与处理者；支持动态组合链条     |
| 缺点     | 链过长影响性能，调试不易；可能无人处理请求   |
| 核心思想 | 链式传递处理请求，形成职责链                 |
| 常见场景 | OA审批、过滤器链、日志系统、认证授权、安全链 |
