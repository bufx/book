# 🌳 组合模式（Composite Pattern）

------

## ✅ 定义

>   将对象组合成树形结构以表示"部分-整体"的层次结构。
>    组合模式使得**客户端可以统一处理单个对象和组合对象**。

🧠 通俗理解：

-   有些对象是单个（叶子节点），有些对象是由多个组成的（容器节点）；
-   你希望对"单个" 和 "一组"使用**相同的接口**去操作；
-   就像文件夹和文件都可以统一做"删除/重命名/显示"等操作一样！

## 🧃 举个生活例子：文件系统（文件 & 文件夹）

在操作系统里：

-   文件（File）是单个对象，不能再包含别的东西；
-   文件夹（Folder）可以包含文件或文件夹（递归结构）；

你对它们做操作时，都是：

✅ 右键 → 删除 / 重命名 / 打开

👉 **组合模式允许你对"部分"和"整体"用相同的逻辑处理**！

------

## 👨‍💻 Java 实现：文件系统结构

------

### 🧩 第一步：定义统一的接口（抽象组件）

```java
// 文件系统节点（统一接口）
public interface FileSystemNode {
    void display(String indent);
}
```

------

### 🧩 第二步：叶子节点（文件）

```java
// 文件（Leaf）
public class FileNode implements FileSystemNode {
    private String name;

    public FileNode(String name) {
        this.name = name;
    }

    @Override
    public void display(String indent) {
        System.out.println(indent + "📄 文件：" + name);
    }
}
```

------

### 🧩 第三步：组合节点（文件夹）

```java
import java.util.ArrayList;
import java.util.List;

// 文件夹（Composite）
public class FolderNode implements FileSystemNode {
    private String name;
    private List<FileSystemNode> children = new ArrayList<>();

    public FolderNode(String name) {
        this.name = name;
    }

    public void add(FileSystemNode node) {
        children.add(node);
    }

    @Override
    public void display(String indent) {
        System.out.println(indent + "📁 文件夹：" + name);
        for (FileSystemNode node : children) {
            node.display(indent + "    ");
        }
    }
}
```

------

### 🧪 第四步：客户端使用（创建文件夹树）

```java
public class Main {
    public static void main(String[] args) {
        // 构建文件系统结构
        FolderNode root = new FolderNode("根目录");

        FileNode file1 = new FileNode("README.md");
        FileNode file2 = new FileNode("LICENSE");

        FolderNode src = new FolderNode("src");
        src.add(new FileNode("Main.java"));
        src.add(new FileNode("Utils.java"));

        FolderNode docs = new FolderNode("docs");
        docs.add(new FileNode("设计文档.pdf"));

        root.add(file1);
        root.add(file2);
        root.add(src);
        root.add(docs);

        // 展示结构
        root.display("");
    }
}
```

------

### 💡 输出结果：

```
📁 文件夹：根目录
    📄 文件：README.md
    📄 文件：LICENSE
    📁 文件夹：src
        📄 文件：Main.java
        📄 文件：Utils.java
    📁 文件夹：docs
        📄 文件：设计文档.pdf
```

------

## 📌 类图结构（文字版）

```markdown
      ┌────────────────────┐
      │  FileSystemNode                 │  <─── 抽象组件（Component）
      └────────▲───────────┘
                     │
 ┌───────────┴────────────┐
 │                                        │
FileNode                              FolderNode
(Leaf)                               (Composite)
                                         ▲
                                       has-a
                                         │
                                多个 FileSystemNode
```

------

## 🧠 总结一句话

>   组合模式让你可以**统一处理"单个对象" 和 "对象集合"**，像处理一棵树一样递归操作。

------

## 🧰 应用场景举例（非常常见）

| 场景                     | 描述                                               |
| ------------------------ | -------------------------------------------------- |
| 文件系统结构             | 文件 & 文件夹统一操作                              |
| 页面组件（Button/Text）  | 所有 UI 组件都实现一个接口，容器组件可以嵌套子组件 |
| 公司组织结构（员工层级） | 员工 / 部门 都实现同一个接口，形成树状结构         |
| XML/HTML 节点解析        | 标签、文本节点、属性节点等都统一操作               |

------

## ✅ 总结小卡片

| 模式名   | 组合模式 Composite Pattern                             |
| -------- | ------------------------------------------------------ |
| 用途     | 将对象组合成树状结构，对"单个"与"整体"统一处理         |
| 优点     | 结构灵活，递归遍历，调用统一，符合开放封闭原则         |
| 关键角色 | Component（接口）、Leaf（叶子）、Composite（组合节点） |
| 常见场景 | 文件系统、页面结构、组织架构、UI 树、解析器等          |
