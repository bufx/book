# SpringBoot编程概述

### 概述

> Spring Boot helps you to create stand-alone, production-grade Spring-based Applications that you can run. We take an opinionated view of the Spring platform and third-party libraries, so that you can get started with minimum fuss. Most Spring Boot applications need very little Spring configuration.

**springboot框架=SpringMVC+Spring**

<!--more-->

---

### 开发SpringBoot条件

- springboot 项目中必须在 `src/main/resources`中放入`application.yml`或者`application.properties`核心配置文件，并且名称必须为：`application`
- springboot 项目中必须在`src/main/java`中所有子包之外构建全局入口类，`xxxApplication.java`,并且入口类有且只有一个

---

### 第一个工程创建

1. 引入依赖

   ```xml
   <!--集成springboot父项目-->
   <parent>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-parent</artifactId>
     <version>2.3.2.RELEASE</version>
   </parent>
   <dependencies>
     <!--引入springboot的web支持-->
     <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-web</artifactId>
     </dependency>
   </dependencies>
   ```

2. 创建配置文件

   ```
   src/main/resources/application.yml
   ```

3. 开发入口类

   `Application.java`

   ```java
   package com.buubiu;
   
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
   import org.springframework.context.annotation.ComponentScan;
   
   /**
    * @author buubiu
    **/
   @EnableAutoConfiguration //作用：开启自动配置 初始化Spring环境和SpringMVC环境
   @ComponentScan //作用：用来扫描相关注解 扫描范围：默认当前入口所在的包及其子包
   public class Application {
   	public static void main(String[] args) {
   		//springApplication spring应用类 作用：用来启动Springboot应用
   		//参数1：传入入口类 类对象
   		//参数2：main函数的参数
   		SpringApplication.run(Application.class, args);
   	}
   
   }
   
   ```

   **说明：注解@SpringBootApplication 相当于@EnableAutoConfiguration 和 @ComponentScan 所以上面的代码也可以简化为：**

   ```java
   package com.buubiu;
   
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   
   /**
    * @SpringBootApplication
    * 	组合注解：相当于@EnableAutoConfiguration 和 @ComponentScan
    *
    * @author buubiu
    **/
   @SpringBootApplication
   public class Application {
   
   	public static void main(String[] args) {
   		SpringApplication.run(Application.class, args);
   	}
   
   }
   ```

   `HelloController.java`

   ```java
   package com.buubiu.controller;
   
   import org.springframework.web.bind.annotation.GetMapping;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RestController;
   
   /**
    * @author buubiu
    **/
   @RestController
   @RequestMapping("hello")
   public class HelloController {
   
   	@GetMapping("hello")
   	public String hell() {
   		System.out.println("hello springboot");
   		return "hello springboot";
   	}
   }
   
   ```

---

### springboot 相关注解说明

```java

/**
 * @EnableAutoConfiguration
 * 	作用：开启自动配置
 * 	修饰范围：只能用在类上
 * 	实际作用：根据pom.xml文件中引入的依赖自动判断，如在一个环境中引入了 spring-boot-starter-web
 * 			 会自动根据引入的这个依赖构建相关环境（springmvc环境和web容器环境）
 *
 * @ComponentScan
 * 	作用：用来开启注解扫描
 * 	扫描范围：只能用在类上 默认当前包以及当前包下的子包
 *
 * @RestController
 * 	作用：用来实例化当前对象为一个控制器对象，并将类上所有方法的返回值转为json，响应给浏览器
 * 		相当于 @Controller(实例化当前类为一个控制器对象)+@ResponseBody(用来将当前方法返回值转为json，响应给浏览器)
 * 	修饰范围：用在类上
 *
 * @RequestMapping
 * 	作用：用来加入访问路径
 * 	修饰范围：类（加入命名空间）和方法上（指定具体的路径）
 * 		@GetMapping
 * 			作用：限定请求方式只能是GET，并指定路径
 * 			修饰范围：一般用在方法上
 * 		@PostMapping @DeleteMapping @PutMapping 同上
 *
 * 	main 方法：
 * 		作用：通过标准Java入口方式委托给SpringApplication，并告知当前SpringBoot主应用类是谁，从而启动SpringBoot中tomcat容器
 * 		args：可以在启动时指定外部参数
 *
 * 	starters：启动器
 * 		spring-boot-starter-xxx starters是一组方便的依赖关系描述符
 * @author buubiu
 **/
```



