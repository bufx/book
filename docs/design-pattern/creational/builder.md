# 🧱 建造者模式（Builder Pattern）

## ✅ 定义

>   建造者模式就是把「**怎么一步步做一件复杂的东西**」这件事，**单独提出来管理**。
>
>   **将一个复杂对象的构建过程与它的表示分离，使得同样的构建过程可以创建不同的表示。**

🧠 换句话说：

-   如果一个对象的**创建过程非常复杂**（多步骤、步骤有顺序）
-   并且这个对象的不同版本只是在构建参数或步骤上有差异
-   那么就适合使用**建造者模式**

它让你可以：

-   同一个流程 → 做出不同风格的成品
-   不用记步骤，构造过程被封装好了！

## 🍔 举个通俗例子：做汉堡！

你是麦当劳点餐员，要做很多汉堡，但每种汉堡做法都类似：

```
👉 第一步：放面包
👉 第二步：放肉
👉 第三步：加酱料
```

不同汉堡：

-   **牛肉汉堡** → 牛肉 + 番茄酱
-   **鸡腿堡** → 鸡腿 + 辣酱

你不自己做，而是交给不同"汉堡工人"去做，这些工人就是"Builder"。

你只负责安排：**做法顺序**（这叫 `Director`）。

------

## 👨‍💻 Java 代码一步步来

------

### 🧩 第一步：定义产品类（汉堡）

```java
public class Burger {
    String bun;
    String meat;
    String sauce;

    public void show() {
        System.out.println("🍔 汉堡配方：");
        System.out.println("面包：" + bun);
        System.out.println("肉类：" + meat);
        System.out.println("酱料：" + sauce);
    }
}
```

这是你最终要造出来的产品。

------

### 🧩 第二步：定义建造者接口（做汉堡步骤）

```java
public interface BurgerBuilder {
    void buildBun();      // 放面包
    void buildMeat();     // 放肉
    void buildSauce();    // 加酱
    Burger getBurger();   // 最终产品
}
```

------

### 🧱 第三步：具体建造者（牛肉汉堡、鸡腿堡）

```java
public class BeefBurgerBuilder implements BurgerBuilder {
    private Burger burger = new Burger();

    public void buildBun() {
        burger.bun = "芝麻面包";
    }

    public void buildMeat() {
        burger.meat = "安格斯牛肉";
    }

    public void buildSauce() {
        burger.sauce = "番茄酱";
    }

    public Burger getBurger() {
        return burger;
    }
}

public class ChickenBurgerBuilder implements BurgerBuilder {
    private Burger burger = new Burger();

    public void buildBun() {
        burger.bun = "全麦面包";
    }

    public void buildMeat() {
        burger.meat = "香脆鸡排";
    }

    public void buildSauce() {
        burger.sauce = "辣酱";
    }

    public Burger getBurger() {
        return burger;
    }
}
```

每个 Builder 负责做一套不同的汉堡。

------

### 🧭 第四步：指挥者（安排步骤顺序）

```java
public class BurgerDirector {
    private BurgerBuilder builder;

    public BurgerDirector(BurgerBuilder builder) {
        this.builder = builder;
    }

    public Burger construct() {
        builder.buildBun();
        builder.buildMeat();
        builder.buildSauce();
        return builder.getBurger();
    }
}
```

你是店长（Director），负责安排建造流程，但不管怎么建。

------

### 🧪 第五步：客户端使用

```java
public class Main {
    public static void main(String[] args) {
        // 做一个牛肉汉堡
        BurgerBuilder beefBuilder = new BeefBurgerBuilder();
        BurgerDirector director = new BurgerDirector(beefBuilder);
        Burger beefBurger = director.construct();
        beefBurger.show();

        // 做一个鸡腿汉堡
        BurgerBuilder chickenBuilder = new ChickenBurgerBuilder();
        director = new BurgerDirector(chickenBuilder);
        Burger chickenBurger = director.construct();
        chickenBurger.show();
    }
}
```

输出：

```
🍔 汉堡配方：
面包：芝麻面包
肉类：安格斯牛肉
酱料：番茄酱

🍔 汉堡配方：
面包：全麦面包
肉类：香脆鸡排
酱料：辣酱
```

------

## 📌 类图结构

```
         ┌─────────────┐
         │    BurgerDirector   │  <─── 指挥者：负责安排构建步骤
         └──────┬──────┘
                     │
      ┌────────▼────┐
      │   BurgerBuilder 接口 │  <─── 抽象构建者：定义建造步骤
      └───────▲─────┘
                   │
 ┌──────────┴────┐
 │ BeefBurgerBuilder       │  <─── 具体建造者
 │ ChickenBurgerBuilder    │
 └──────────┬────┘
                   │
        ┌──────▼─────┐
        │   Burger           │  <─── 最终产品
        └────────────┘

                  ▲
                  │
         ┌────┴────┐
         │ Client        │  <─── 使用者选择 Builder + Director 得到产品
         └─────────┘

```

------

## ✅ 总结一句话

>   建造者模式是：**指挥者定流程，建造者干活，产品类不管过程**
>    最终你就能：**换 Builder，得不同成品，但流程都一样！**

------

## 🧠 用在哪些地方？

-   创建复杂对象（多个属性、参数）
-   多步骤流程构建对象
-   需要避免构造函数过长的情况
