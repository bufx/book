# SpringMVC中静态资源拦截问题

### 出现静态资源拦截问题的原因

由于在 web.xml中配置SpringMVC的核心servlet(`DispatherServlet`)时 url-pattern 配置为 "`/`"，因此会导致项目中所有 `/` 开头的请求，均被作为控制器请求处理，这样会导致项目中的静态资源被（css,js,img）拦截。

<!--more-->

### 解决方案

1. 把url-pattern的`/`改为 `*.action或者*.do` 

   使用这种方式后，访问路径结尾必须加入指定后缀 `url.action 或者 url.do`如下：

   ```http
   http://localhost:8080/springmvc/user/findAll.do
   ```

2. url-pattern 依然使用 `/`，在springmvc配置文件中加入如下配置：

   ```xml
   <mvc:default-servlet-handler/>
   <!--或者
   	mapping是映射的路径；
   	loctaion是实际资源的路径
   -->
   <mvc:resources mapping="/resource/**" location="js"/>
   ```
