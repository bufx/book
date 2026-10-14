# 🧬 原型模式（Prototype Pattern）

## ✅ 定义

>   用原型实例指定要创建的对象类型，然后通过**复制这个原型**来创建新对象。

🧠 它的核心就是：

-   **不用 new**，而是**通过 clone()** 快速复制现有对象。
-   适用于**构造成本高**或**重复结构的对象**。

## 🧃 举个生活例子（通俗易懂）

你在用画图工具，画了一个红色圆，设置好了：

-   半径 100
-   颜色红色
-   黑色边框

你非常满意，想复制一份出来，换个大小继续用。

你不会重新画，而是：

👉「复制粘贴，然后改一下半径就好！」

这就是原型模式的真实写照：

>   **复制（clone）一个已有的对象原型，再按需改动即可。**

------

## 👨‍💻 Java 代码实现

------

### 🧩 第一步：定义原型接口

```java
public interface Shape extends Cloneable {
    // 克隆自身的方法
    Shape clone();

    // 图形的行为，例如画图
    void draw();
}
```

>   `Cloneable` 是一个**标记接口**，你必须实现它，Java 才允许你合法地使用 `Object.clone()` 方法。否则就会抛出 `CloneNotSupportedException`。

------

### 🧩 第二步：实现具体原型类（圆形）

```java
public class Circle implements Shape {
    private int radius;
    private String color;
    private String border;

    // 构造方法
    public Circle(int radius, String color, String border) {
        this.radius = radius;
        this.color = color;
        this.border = border;
    }

    @Override
    public void draw() {
        System.out.println("🎨 画一个" + color + "的圆，半径：" + radius + "，边框：" + border);
    }

    public void setRadius(int radius) {
        this.radius = radius;
    }

    @Override
    public Circle clone() {
        try {
            // 使用 Object 的浅拷贝
            return (Circle) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException("克隆失败", e);
        }
    }
}
```

------

### 🧪 第三步：客户端使用

```java
public class Main {
    public static void main(String[] args) {
        // 🎯 创建原型图形
        Circle original = new Circle(100, "红色", "黑色边框");
        original.draw();

        // ✂️ 克隆一份副本，修改一下半径
        Circle clone = original.clone();
        clone.setRadius(150);
        clone.draw();
    }
}
```

------

### 💡 输出结果：

```
🎨 画一个红色的圆，半径：100，边框：黑色边框
🎨 画一个红色的圆，半径：150，边框：黑色边框
```

------

## 📌 类图结构（文字描述）

```markdown
             ┌──────────────┐
             │   Shape               │  <─── 原型接口（定义 clone 方法）
             └──────▲───────┘
                         │
             ┌──────┴───────┐
             │   Circle              │  <─── 实际的可复制对象（原型）
             └──────▲───────┘
                         │
             ┌──────┴───────┐
             │   Client              │  <─── 使用 clone() 复制对象
             └──────────────┘
```

------

## 🎯 小结：

| 原型模式好处       | 对应解释                                         |
| ------------------ | ------------------------------------------------ |
| 🧠 避免重复创建逻辑 | 不需要 new 和 set 一大堆属性                     |
| ⚡ 性能更高         | 对象复杂时，复制比重新构建效率高                 |
| 🎯 更好地保持一致性 | 所有副本来自一个原型，统一配置，无需担心遗漏字段 |

------

## 📦 典型应用场景

-   需要频繁创建结构相似对象（如图形、订单、配置模板）
-   对象构造非常复杂，代价高（如加载配置、读取文件等）
-   缓存场景中复用已有对象模板进行修改（Spring Bean 原型）

------

## 🧠 总结一句话

>   原型模式让你通过**复制（clone）一个对象**，而不是**重新 new 出一个**，用来**快速得到相似对象**，简单、高效、统一。
