# 🎁 装饰器模式（Decorator Pattern）

## ✅ 定义

>   动态地为一个对象添加一些额外的职责，就像是"包了一层外壳"，而不影响原有类的结构。

🧠 通俗理解：

-   原始功能不能改，但我想**在不动原始代码的前提下添加功能**；
-   那就用"装饰器"包住它，增强功能；
-   **比继承更灵活，可组合性更强**！

## 🧃 举个生活例子：汉堡🍔加料

我们点了一个基础汉堡，但我想：

-   加个鸡蛋 🍳
-   加点生菜 🥬
-   加个培根 🥓

每加一样东西，价格和描述都变了。

👉 你不会去创建几十种"加料汉堡类"，而是用一层一层"装饰"的方式来增强：

>   基础汉堡 → 加鸡蛋 → 加生菜 → 加培根

这就像是一个**装饰链**，每一层都包上一层增强的逻辑。

------

## 👨‍💻 Java 实现：装饰汉堡

------

### 🧩 第一步：定义组件接口（所有汉堡都实现它）

```java
// 汉堡接口（Component）
public interface Hamburger {
    String getDescription();
    double getPrice();
}
```

------

### 🧩 第二步：具体组件（原味汉堡）

```java
// 原味汉堡（ConcreteComponent）
public class BasicHamburger implements Hamburger {
    @Override
    public String getDescription() {
        return "原味汉堡";
    }

    @Override
    public double getPrice() {
        return 10.0;
    }
}
```

------

### 🧩 第三步：装饰器抽象类

```java
// 抽象装饰器（Decorator）
public abstract class HamburgerDecorator implements Hamburger {
    protected Hamburger burger;

    public HamburgerDecorator(Hamburger burger) {
        this.burger = burger;
    }
}
```

------

### 🧩 第四步：具体装饰器（加鸡蛋、生菜、培根）

```java
// 加鸡蛋
public class EggDecorator extends HamburgerDecorator {
    public EggDecorator(Hamburger burger) {
        super(burger);
    }

    @Override
    public String getDescription() {
        return burger.getDescription() + " + 鸡蛋";
    }

    @Override
    public double getPrice() {
        return burger.getPrice() + 2.0;
    }
}

// 加生菜
public class LettuceDecorator extends HamburgerDecorator {
    public LettuceDecorator(Hamburger burger) {
        super(burger);
    }

    @Override
    public String getDescription() {
        return burger.getDescription() + " + 生菜";
    }

    @Override
    public double getPrice() {
        return burger.getPrice() + 1.5;
    }
}

// 加培根
public class BaconDecorator extends HamburgerDecorator {
    public BaconDecorator(Hamburger burger) {
        super(burger);
    }

    @Override
    public String getDescription() {
        return burger.getDescription() + " + 培根";
    }

    @Override
    public double getPrice() {
        return burger.getPrice() + 3.0;
    }
}
```

------

### 🧪 第五步：客户端使用（像叠积木一样装饰）

```java
public class Main {
    public static void main(String[] args) {
        Hamburger burger = new BasicHamburger(); // 原味汉堡
        burger = new EggDecorator(burger);       // 加鸡蛋
        burger = new LettuceDecorator(burger);   // 加生菜
        burger = new BaconDecorator(burger);     // 加培根

        System.out.println("点餐明细：" + burger.getDescription());
        System.out.println("总价：" + burger.getPrice() + " 元");
    }
}
```

------

### 💡 输出结果：

```
点餐明细：原味汉堡 + 鸡蛋 + 生菜 + 培根  
总价：16.5 元
```

------

## 📌 类图结构（文字版）

```markdown
        ┌──────────────┐
        │  Hamburger            │  <─── 接口（Component）
        └───────┬───────┘
                     │
      ┌────────┴────────┐
      │                            │
BasicHamburger            HamburgerDecorator <─── 抽象装饰器
                               ▲
              ┌─────────┴────────┐
              │               │             │
              Egg           Lettuce         Bacon  <── 具体装饰器（可组合）
```

------

## 🧠 总结一句话

>   装饰器模式是一种**增强功能不改类**的设计方式，靠"包裹"而不是继承，**支持无限叠加功能扩展**。

------

## 🧰 应用场景举例（非常常见）

| 场景                | 描述                                         |
| ------------------- | -------------------------------------------- |
| Java I/O 流（经典） | `BufferedInputStream` 装饰 `FileInputStream` |
| Spring AOP          | 其实本质就是给原对象加"增强逻辑"的一层层代理 |
| 权限控制 / 日志增强 | 控制器加一层权限验证、接口增强输出日志       |
| 商品 / 菜单价格附加 | 商品基础价格 + 优惠券 + 活动价格等多层逻辑   |

------

## ✅ 总结小卡片

| 模式名   | 装饰器模式 Decorator Pattern                                 |
| -------- | ------------------------------------------------------------ |
| 用途     | 不修改原类的前提下，动态叠加扩展功能                         |
| 优点     | 高度灵活、可组合、不影响原始类结构                           |
| 关键角色 | Component（接口）、ConcreteComponent、Decorator、ConcreteDecorator |
| 常见场景 | Java I/O、权限/日志增强、可叠加业务逻辑等                    |
