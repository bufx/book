# 🔑 设计原则

## 🚀 什么是设计原则？

设计原则就像是 **写好代码的"潜规则"或"习惯"**，是你写程序时脑子里要时刻记住的准则。

这些原则不是强制的，但如果你违背它，代码可能会：

- 很难扩展

- 一改就崩

- 到处耦合（缠在一起）

- 谁也看不懂

---

## ✅ 一、单一职责原则（SRP）

Single Responsibility Principle

### 📖 含义：一个类/方法，只做一件事。

就像你请一个人做事，他只能干一件事情，不要让他又修电脑、又炒菜、还带孩子。

### 🧠 举例：

```java
class UserService {
    public void registerUser() { }     // 注册用户
    public void sendEmail() { }        // ❌ 发邮件？
}
```

这就错了！UserService 应该**只管用户业务**，发邮件应该放到 `EmailService` 去。

---

## ✅ 二、开闭原则（OCP）

Open Closed Principle

### 📖 含义：对扩展开放，对修改关闭。

也就是说，当有新需求时，应该**增加代码而不是改老代码**，不然容易出 bug。

### 🧠 举例：

你做了一个支付功能，原来只支持微信，后来要支持支付宝、银行卡：

**❌ 错误写法：改老代码增加 if-else**

```java
if ("wechat".equals(payType)) {
   // ...
} else if ("alipay".equals(payType)) {
   // ...
}
```

**✅ 正确写法：新增一个支付策略类，不改老代码**

```java
interface PayStrategy { void pay(); }
class WeChatPay implements PayStrategy { public void pay() { ... } }
class AlipayPay implements PayStrategy { public void pay() { ... } }
```

---

## ✅ 三、里氏替换原则（LSP）

Liskov Substitution Principle

### 📖 含义：子类必须能替换父类，且行为不出问题。

### 🧠 举例：

你写了一个`Bird`类有个`fly()`方法，后来你写了`Penguin extends Bird`，但企鹅不能飞！

这是错误设计，企鹅 **不应该继承会飞的鸟类**。否则如果代码中用到了 `Bird.fly()`，企鹅对象就会出问题。

> ✅ 解决：拆分接口，把会飞的鸟放到 `FlyingBird` 类中。

### ❌ 错误案例：

```java
class Bird {
    public void fly() { System.out.println("我会飞"); }
}
class Penguin extends Bird {
    public void fly() { throw new UnsupportedOperationException(); }
}
```

企鹅不会飞，但继承了鸟类的 `fly()`，这违反了里氏替换：你以为是鸟，结果崩了。

### ✅ 正确做法：

拆分类层级，不要让不会飞的类继承飞行鸟类。

```java
interface Bird { void layEggs(); }
interface FlyingBird extends Bird { void fly(); }
```

---

## ✅ 四、依赖倒置原则（DIP）

Dependency Inversion Principle

### 📖 含义：高层代码不要依赖底层实现，要依赖接口（抽象）。

也就是说，不要直接 new 实现类，要用接口去约定行为。

### 🧠 举例：

**❌ 错误写法：**

```java
class OrderService {
    private Alipay alipay = new Alipay();
}
```

这就死死绑定了支付宝。将来换微信支付，全系统都得改！

**✅ 正确写法：**

```java
interface IPay { void pay(); }
class Alipay implements IPay { ... }

class OrderService {
    private IPay pay;
    public OrderService(IPay pay) { this.pay = pay; }
}
```

引出了支付功能的实战例子：

既然用接口去支付，那么如何知道用户使用支付宝或者微信支付呢，从哪里来判断？

---

## ✅ 五、接口隔离原则（ISP）

Interface Segregation Principle

### 📖 含义：接口不要太大，只暴露"需要"的方法。

### 🧠 举例：

**❌ 错误接口：**

```java
interface Animal {
    void run();
    void swim();
    void fly();
}
```

让猪也实现 `fly()`？太离谱了！

**✅ 正确接口：**

```java
interface Runnable { void run(); }
interface Flyable { void fly(); }
interface Swimmable { void swim(); }
```

---

## ✅ 六、迪米特法则（LOD）

Law of Demeter

### 📛 命名背景：

又叫"最少知识原则(Least Knowledge Principle，LKP)"，1987 年提出。Demeter 是一个项目名。这个原则强调：对象之间**不要知道太多别人的信息**，以避免耦合。

### 📖 含义：只和你认识的对象打交道，不要深层次访问别人的对象。

也就是说，一个对象应该只与它"直接的朋友"通信，**避免链式调用或内部暴露**。

### 🧠 举例：

**❌ 错误写法：**

```java
school.getTeacher().getStudent().getName() // 多层访问
```

你只认识 `school`，就去找 `teacher` 的 `student`，这样代码耦合太深，改动一个地方就全挂。

**✅ 正确写法：**

```java
school.getStudentName()  // 让 School 内部去封装实现细节
```

让 School 提供你需要的信息，不暴露内部结构。

---

## ✅ 七、组合/聚合复用原则（CARP）

Composite/Aggregate Reuse Principle

### 📖 含义：优先使用**组合**（"有一个"），而不是**继承**（"是一个"）。

继承太强，子类太容易被牵连。该原则强调：**优先使用对象组合，而不是类继承**。

继承是一种强耦合的方式，尽量通过**组合已有类**来实现功能，而不是继承。

### 🧠 举例：

**❌ 错误写法：**

```java
class ElectricCar extends Car {
    // 如果 Car 改了，ElectricCar 就挂了
}
```

**✅ 正确写法：**

```java
class ElectricCar {
    private Car car;
    // 组合 Car 的行为，而不是继承它
}
```

------

## 🧠 总结口诀（记忆辅助）：

| 原则名     | 口诀                   |
| ---------- | ---------------------- |
| 单一职责   | 一类一事，不要多管闲事 |
| 开闭原则   | 增加功能，不动旧代码   |
| 里氏替换   | 子类能替代，父类不出事 |
| 依赖倒置   | 面向接口，不 new 实现  |
| 接口隔离   | 接口要小，不要大杂烩   |
| 迪米特法则 | 不串门，封装好边界     |
| 组合复用   | 多组合，少继承         |
