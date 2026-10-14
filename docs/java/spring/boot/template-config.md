# SpringBoot中两种模版配置

SpringBoot 中支持 `jsp` 和 `thymeleaf`

- 官方默认支持`thymeleaf`，并且也推荐使用
- 如果想支持 `jsp` 需要额外的配置

<!--more-->

### 集成JSP模版

1. 引入依赖

   ```xml
   <!--引入解析jsp页面的依赖-->
   <dependency>
     <groupId>org.apache.tomcat.embed</groupId>
     <artifactId>tomcat-embed-jasper</artifactId>
   </dependency>
   
   <!--jstl标准标签库-->
   <dependency>
     <groupId>jstl</groupId>
     <artifactId>jstl</artifactId>
     <version>1.2</version>
   </dependency>
   ```

2. 引入JSP运行插件

   ```xml
   <build>
     <finalName>springboot</finalName>
     <!--引入jsp运行插件-->
     <plugins>
       <plugin>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-maven-plugin</artifactId>
       </plugin>
     </plugins>
   </build>
   ```

3. 在配置文件 `application.properties`中配置视图解析器

   ```properties
   spring.mvc.view.prefix=/
   spring.mvc.view.suffix=.jsp
   ```

---

### 集成thymeleaf模版

> **Thymeleaf** is a modern server-side Java template engine for both web and standalone environments. --官网：https://www.thymeleaf.org

`Thymeleaf`是跟Velocity、FreeMarker类似的模板引擎，它可以完全替代JSP，相较与其他的模板引擎相比, Thymeleaf在有网络和无网络的环境下皆可运行，即它可以让美工在浏览器查看页面的静态效果，也可以让程序员在服务器查看带数据的动态页面效果。

1. 引入依赖

   ```xml
       <!--引入thymeleaf-->
       <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter-thymeleaf</artifactId>
       </dependency>
   ```

2. 添加配置 `application.properties`

   ```properties
   spring.thymeleaf.prefix=classpath:/templates/      #使用模板目录
   spring.thymeleaf.suffix=.html                      #使用模板后缀
   spring.thymeleaf.encoding=UTF-8                    #使用模板编码
   spring.thymeleaf.servlet.content-type=text/html    #使用模板响应类型
   ```

3. 开发控制器

   ```java
   package com.buubiu.controller;
   
   import org.springframework.stereotype.Controller;
   import org.springframework.web.bind.annotation.GetMapping;
   import org.springframework.web.bind.annotation.RequestMapping;
   
   /**
    * @author buubiu
    **/
   @Controller
   @RequestMapping("user")
   public class UserController {
   
   	@GetMapping("findAll")
   	public String findAll() {
   		System.out.println("查询所有");
   		return "index";//逻辑名  classpath:/templates/逻辑名.html
   	}
   }
   ```

4. 在 resources 目录中添加文件夹 `templates`，写的html都放在这里面即可

