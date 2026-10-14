# 🔌 适配器模式（Adapter Pattern）

## ✅ 定义

>   将一个类的接口转换成客户端期望的另一个接口，使原本不兼容的类可以一起工作。

🧠 通俗地说：

-   有两个东西接口对不上，但功能类似；
-   用一个"适配器"在中间做转换，桥接它们；
-   **让"老接口"也能兼容"新系统"**。

## 🧃 举个生活例子（通俗易懂）

### 场景：插头插座转换

你去欧洲旅游，带了个国标插头的电吹风（中国用的两孔插头），但是欧洲的插座是三孔圆头的。

这时候你怎么办？

👉 你不会换吹风机，而是用一个"插头转换器"适配一下。

这个转换器就像一个 **Adapter**，把老接口"转换"成新接口。

------

## 👨‍💻 Java 代码实现

我们来模拟这个插头转换的过程。

------

### 🧩 第一步：定义目标接口（新接口，客户端期望使用的）

```java
// 新标准插头（目标接口）
public interface NewPlug {
    void connectToNewSocket(); // 插入新标准插座
}
```

------

### 🧩 第二步：已有类（老设备，接口不兼容）

```java
// 老的中国国标插头（现有类）
public class OldChinesePlug {
    public void connectToOldSocket() {
        System.out.println("✅ 老插头接入老插座（国标）");
    }
}
```

------

### 🧩 第三步：适配器类（桥接中间人）

```java
// 插头适配器，让老插头适配新插座
public class PlugAdapter implements NewPlug {
    private OldChinesePlug oldPlug;

    public PlugAdapter(OldChinesePlug oldPlug) {
        this.oldPlug = oldPlug;
    }

    @Override
    public void connectToNewSocket() {
        System.out.println("🔁 使用适配器：将老插头适配为新插头");
        oldPlug.connectToOldSocket();
    }
}
```

------

### 🧪 第四步：客户端使用

```java
public class Main {
    public static void main(String[] args) {
        // 老插头设备
        OldChinesePlug oldPlug = new OldChinesePlug();

        // 用适配器转成新接口
        NewPlug adapter = new PlugAdapter(oldPlug);

        // 当成"新接口"使用，实则内部还是老接口逻辑
        adapter.connectToNewSocket();
    }
}
```

------

### 💡 输出结果：

```
🔁 使用适配器：将老插头适配为新插头  
✅ 老插头接入老插座（国标）
```

------

## 📌 类图结构（文字版）

```markdown
             ┌──────────────┐
             │   NewPlug             │  <─── 目标接口（新标准）
             └──────▲───────┘
                         │ implements
             ┌──────┴───────┐
             │ PlugAdapter           │  <─── 适配器（中间人）
             └──────▲───────┘
                         │组合（has a）
             ┌──────┴────────┐
             │ OldChinesePlug          │  <─── 被适配类（老接口）
             └───────────────┘
                         ▲
             ┌──────┴───────┐
             │   Client              │  <─── 客户端只认新接口
             └──────────────┘
```

------

## 🧠 总结一句话

>   适配器模式就是"接口转换器"：让**老接口兼容新系统**，而不用修改原代码。

------

## 🧰 应用场景举例（非常实用）

| 场景                       | 描述                                                   |
| -------------------------- | ------------------------------------------------------ |
| 老系统接入新接口           | 你有个旧库接口，需要在新业务中使用                     |
| 第三方接口格式不同         | 微信支付回调、支付宝回调格式不一致时，用适配器统一处理 |
| Spring 中 `HandlerAdapter` | 就是一个经典适配器，用来适配不同 controller 处理方式   |
| 日志系统兼容不同日志框架   | 用适配器适配 slf4j、log4j、logback 等                  |

------

## ✅ 总结小卡片

| 模式名   | 适配器模式 Adapter Pattern                                 |
| -------- | ---------------------------------------------------------- |
| 用途     | 把一个接口转换成另一个接口，兼容新旧接口                   |
| 关键角色 | Target（目标接口）、Adaptee（被适配类）、Adapter（适配器） |
| 常见场景 | 老代码兼容新接口，三方接口统一，SDK 接入                   |
