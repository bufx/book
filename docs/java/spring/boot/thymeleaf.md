# SpringBoot-thymeleaf基本语法

**在使用时必须在页面中加入下面命名空间：**

```html
<html lang="en" xmlns:th="http://www.thymeleaf.org">
```

<!--more-->

### 展示单个数据

1. 在controller设置数据

   ```java
   model.addAttribute("name", "buubiu中文");
   model.addAttribute("link","<a href=''>buubiu</a>");
   ```

2. 获取数据

   ```html
   <span th:text="${name}" /><br>
   <span th:utext="${link}" /> <br>
   <input type="text" th:value="${name}">
   ```

3. **总结：**

   - 使用` th:text="${属性名}"`  获取对应数据,获取数据时会将对应标签中数据清空,因此最好是空标签
   - 使用` th:utext="${属性名}"` 获取对应的数据,可以将数据中html先解析在渲染到页面
   - 使用` th:value="${属性名}"` 获取数据直接作为表单元素value属性

----

### 展示对象数据

1. 在controller设置数据

   ```java
   User user = new User("111", "buubiu名字", 22, new Date());
   model.addAttribute("user", user);
   ```

2. 获取数据

   ```html
   <h1>展示对象数据</h1>
   <ul>
     <li>id:<span th:text="${user.id}" /> </li>
     <li>name:<span th:text="${user.name}" /> </li>
     <li>age:<span th:text="${user.age}" /> </li>
     <li>bir:<span th:text="${#dates.format(user.bir,'yyyy-MM-dd')}" /> </li>
   </ul>
   ```

---

### 展示条件数据

1. 获取数据

   ```html
   <h1>展示条件数据(如果年龄小于等于22显示名字)</h1>
   <span th:if="${user.age le 22}" th:text="${user.name}" />
   ```

2. **运算符**

   ```json
   gt：great than（大于）>
   ge：great equal（大于等于）>=
   eq：equal（等于）==
   lt：less than（小于）<
   le：less equal（小于等于）<=
   ne：not equal（不等于）!=
   ```

---

### 展示集合（多条）数据

1. 在controller添加数据

   ```java
   User user2 = new User("222", "buubiu2名字", 23, new Date());
   User user3 = new User("333", "buubiu3名字", 24, new Date());
   List<User> users = Arrays.asList(user, user2, user3);
   model.addAttribute("users", users);
   ```

2. 获取数据

   **直接遍历集合，并且设置状态**

   ```html 
   <h1>展示集合（多条）数据</h1>
   <ul th:each="user,userStat:${users}">
     <li>
       当前遍历是否是第一个：<span th:text="${userStat.first}"/>
       当前遍历的次数：<span th:text="${userStat.count}"/>
       当前遍历的索引：<span th:text="${userStat.index}"/>
       当前遍历是否是偶数：<span th:text="${userStat.even}"/>
       当前遍历是否是奇数：<span th:text="${userStat.odd}"/>
     </li>
     <li>id:<span th:text="${user.id}"/></li>
     <li>name:<span th:text="${user.name}"/></li>
     <li>age:<span th:text="${user.age}"/></li>
     <li>bir:<span th:text="${#dates.format(user.bir,'yyyy年MM月dd日')}"/></li>
   </ul>
   ```

---

### 页面引入静态资源

**使用 `thymeleaf`模版项目中静态资源默认放在 `resources`路径的 `static`目录中**

1. 添加静态资源文件

   ```shell
   |--resources
     |--static
       |--css
         |--index.css
       |--js
         |--jquery-3.5.1.min.js
       |--img
   ```

2. 页面中引入

   **`@：`代表当前项目的路径**

   ```html
   <link rel="stylesheet" th:href="@{/css/index.css}">
   <script th:src="@{/js/jquery-3.5.1.min.js}"></script>
   ```

---

### 展示超链接

1. 开发控制器

   ```java
   @GetMapping("delete")
   @ResponseBody
   public String delete(String id, String name) {
     return id+"删除成功"+name;
   }
   ```

2. 页面配置

   **`@:`代表当前项目路径**

   **`():`代表URL拼接参数**

   ```html 
   <h1>测试超链接</h1>
   <a th:href="@{/user/delete(id='11',name='buubiu')}">删除</a>
   ```

