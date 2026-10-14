# SpringMVC中的跳转方式

### 原始servlet技术中的跳转方式

- `forward`跳转
  - 定义：请求转发
  - 特点：服务器内部跳转，跳转之后地址不变，是一次跳转，跳转时可以使用request作用域传递数据
- `redirect`跳转
  - 定义：请求重定向
  - 特点：客户端跳转，跳转之后地址栏改变，是多次跳转，跳转过程不能使用request作用域传递数据

<!--more-->

### SpringMVC中的跳转方式

总体上也是 forward 和 redirect 两种，只是 SpringMVC做了更细致的划分：

1. Controller 到 JSP 页面的跳转

   - forward：默认就是forward跳转

     - 具体语法：

       ```java
       return "页面逻辑名";例如：return "index";
       ```

   - redirect：使用SpringMVC提供的关键字 `redirect:`

     - 具体语法：

       ```java
       return "redirect:视图全名";例如：return "redirect:/index.jsp";
       ```

     **注意：使用redirect跳转不会经过视图解析器，所以用redirect时要写jsp页面的全路径。**

2. Controller 到 Controller之间跳转（相同、不同控制器）

   - forward：使用SpringMVC提供的关键字 `forward:`

     - 具体语法：

       ```java
       return "forward:/跳转Controller类上@RequestMapping路径/跳转类中指定方法上@RequestMapping路径";例如：return "forward:/forwardAndRedirect/test";
       ```

   - redirect：使用SpringMVC提供的关键字 `redirect:`

     - 具体语法：

       ```java
       return "redirect:/跳转Controller类上@RequestMapping路径/跳转类中指定方法上@RequestMapping路径";例如：return "redirect:/forwardAndRedirect/test";
       ```

   - **总结：**

     ```java
     return "forward|redirect:/跳转Controller类上@RequestMapping路径/跳转类中指定方法上@RequestMapping路径";
     ```
