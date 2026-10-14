# SpringBoot中的注入

**SpringBoot中提供了两种注入方式：`注入基本属性`,`对象注入`**

<!--more-->

### 基本属性注入

1. 首先要注入的属性上添加 `@Value`

   ```java
   package com.buubiu.controller;
   
   import java.util.Date;
   import java.util.List;
   import java.util.Map;
   import org.springframework.beans.factory.annotation.Value;
   import org.springframework.web.bind.annotation.GetMapping;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RestController;
   
   /**
    * @author buubiu
    **/
   @RestController
   @RequestMapping("hello")
   public class HelloController {
   
   	@Value("${name}")
   	private String name;
   
   	@Value("${server.port}")
   	private int port;
   
   	@Value("${bir}")
   	private Date bir;
   	
   	@Value("${strs}")
   	private String[] strs;
   
   	@Value("${lists}")
   	private List<String> lists;
   
   	@Value("#{${maps}}")
   	private Map<String, String> maps;
   
   	@GetMapping("hello")
   	public String hello() {
   		System.out.println("hello springboot");
   		System.out.println("name = " + name);
   		System.out.println("port = " + port);
   		System.out.println("bir = " + bir);
   		for (String str : strs) {
   			System.out.println("str = " + str);
   		}
   		lists.forEach(list-> System.out.println("list = " + list));
   		maps.forEach((k,v)-> System.out.println("k = " + k + " v = " + v));
   		return "hello springboot";
   	}
   }
   
   ```

2. 其次要修改配置文件 `application.properties`

   ```properties
   name=buubiu
   bir=2020/12/12 12:12:12
   strs=aa,bb,cc,dd
   lists=buubiu1,buubiu2,buubiu3
   maps={'aa':'buubiu','bb':'buubiu2','cc':'buubiu3'}
   ```

---

### 对象方式注入

1. 在对象类上加上注解`@Configuration或@Component 和 @ConfigurationProperties`

   - `User.java`

     ```java
     package com.buubiu.entity;
     
     import org.springframework.boot.context.properties.ConfigurationProperties;
     import org.springframework.stereotype.Component;
     
     /**
      * @author buubiu
      **/
     @Configuration
     @ConfigurationProperties(prefix = "user")
     public class User {
     
     	private String id;
     	private Integer age;
         ...
     }
     ```

   - `HelloController.java`

     ```java
     package com.buubiu.controller;
     
     import com.buubiu.entity.User;
     import org.springframework.beans.factory.annotation.Autowired;
     import org.springframework.web.bind.annotation.GetMapping;
     import org.springframework.web.bind.annotation.RequestMapping;
     import org.springframework.web.bind.annotation.RestController;
     
     /**
      * @author buubiu
      **/
     @RestController
     @RequestMapping("hello")
     public class HelloController {
     
     	@Autowired
     	private User user;
     
     	@GetMapping("hello")
     	public String hello() {
     		System.out.println("hello springboot");
     		System.out.println("user = " + user);
     		return "hello springboot";
     	}
     }
     
     ```

   - `application.properties`

     ```properties
     user.id=111
     user.age=22
     ```

2. 如若想在配置文件中有提示，可以添加下面依赖

   ```xml
   <!--构建元数据-->
   <dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-configuration-processor</artifactId>
   <optional>true</optional>
   </dependency>
   ```
