# 🪶 享元模式（Flyweight Pattern）

------

## ✅ 定义

>   运用共享技术来有效支持大量细粒度对象的复用。
>    把系统中**重复出现的相同状态**抽取出来共享，**节省内存**。

🧠 通俗理解：

-   有些对象之间大部分状态是一样的；
-   我们不需要为每个对象都创建一份完整的副本；
-   可以**共享不变的部分**，只把变化的部分分离出来单独处理；
-   让"相似对象"飞起来 → **享元（Flyweight）**！

## 🧃 举个生活例子：汉字字体对象

你在 Word 中输入：

```
你 你 你 你 你 你 你 你
```

表面上有 8 个"你"字，但系统不会每次都创建一个新的"你"的字体对象。
 而是：

>   ✅ 所有"你"共享一个字体对象，只记录坐标、大小等外部信息。

这就是典型的享元思想：
 **共享内部状态，分离外部状态，降低内存占用！**

------

## 👨‍💻 Java 实现：棋盘上大量的棋子

------

### 🧩 第一步：定义享元对象（Flyweight）

```java
// 棋子接口（享元对象）
public interface ChessPiece {
    void display(Coordinate coordinate);
}
```

------

### 🧩 第二步：坐标类（外部状态，不共享）

```java
// 外部状态：坐标
public class Coordinate {
    private int x, y;
    public Coordinate(int x, int y) {
        this.x = x;
        this.y = y;
    }
    public String toString() {
        return "(" + x + "," + y + ")";
    }
}
```

------

### 🧩 第三步：具体享元对象（共享的内部状态）

```java
// 黑子（内部状态）
public class BlackChess implements ChessPiece {
    @Override
    public void display(Coordinate coordinate) {
        System.out.println("⚫ 黑子 位置：" + coordinate);
    }
}

// 白子（内部状态）
public class WhiteChess implements ChessPiece {
    @Override
    public void display(Coordinate coordinate) {
        System.out.println("⚪ 白子 位置：" + coordinate);
    }
}
```

------

### 🧩 第四步：享元工厂（管理共享对象）

```java
import java.util.HashMap;
import java.util.Map;

// 工厂：只创建共享对象一次
public class ChessFactory {
    private static final Map<String, ChessPiece> cache = new HashMap<>();

    public static ChessPiece getPiece(String color) {
        if (!cache.containsKey(color)) {
            if ("black".equals(color)) {
                cache.put(color, new BlackChess());
            } else if ("white".equals(color)) {
                cache.put(color, new WhiteChess());
            }
        }
        return cache.get(color);
    }
}
```

------

### 🧪 第五步：客户端使用（不同坐标，共享棋子对象）

```java
public class Main {
    public static void main(String[] args) {
        ChessPiece black1 = ChessFactory.getPiece("black");
        ChessPiece black2 = ChessFactory.getPiece("black");
        ChessPiece white = ChessFactory.getPiece("white");

        black1.display(new Coordinate(1, 2));
        black2.display(new Coordinate(2, 3));
        white.display(new Coordinate(4, 5));

        System.out.println("黑子对象是否同一个？ " + (black1 == black2));
    }
}
```

------

### 💡 输出结果：

```
⚫ 黑子 位置：(1,2)  
⚫ 黑子 位置：(2,3)  
⚪ 白子 位置：(4,5)  
黑子对象是否同一个？ true
```

------

## 📌 类图结构（文字版）

```markdown
            ┌──────────┐
            │  ChessPiece    │  <─── 抽象享元（Flyweight）
            └──────▲───┘
                        │
  ┌────────────┴─────────────┐
  │                         									 │
BlackChess               									 WhiteChess   <─── 具体享元（共享）
                       
              ▲
              │ 工厂返回共享对象
   ┌──────┴──┐
   │ ChessFactory │  <─── 享元工厂（Flyweight Factory）
   └─────────┘

    客户端传入：Coordinate（非共享的外部状态）
```

------

## 🧠 总结一句话

>   享元模式通过"**共享对象中可复用的部分**"，在需要创建大量类似对象时，**节省内存开销**！

------

## 🧰 应用场景举例（非常常见）

| 场景                  | 描述                                             |
| --------------------- | ------------------------------------------------ |
| 字体渲染              | 所有相同字体共享一个 `Font` 对象，节省内存       |
| 棋盘游戏 / 五子棋     | 相同颜色棋子共用同一个对象，坐标作为外部状态传入 |
| 网页图标复用          | 同一个图标多个地方复用，只改变位置、大小         |
| 数据库连接池 / 对象池 | 多个连接对象复用同一批资源对象，只替换执行逻辑   |
| String 常量池         | `"abc"` 其实是从常量池中复用的对象，不会重复创建 |

------

## ✅ 总结小卡片

| 模式名   | 享元模式 Flyweight Pattern                           |
| -------- | ---------------------------------------------------- |
| 用途     | 共享对象，减少内存，适用于大量重复对象               |
| 优点     | 极大减少内存开销，提高性能，尤其适合系统资源敏感场景 |
| 核心思想 | 分离内部状态（共享） vs 外部状态（变化）             |
| 关键角色 | Flyweight（享元）、FlyweightFactory、外部状态        |
| 常见场景 | 字体渲染、图标复用、五子棋、连接池、对象池、字符串池 |
