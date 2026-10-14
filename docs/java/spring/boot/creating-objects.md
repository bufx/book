# SpringBoot中创建对象的方式

### 在Springboot中提供两种方式配置class

SpringBoot 支持 **开发自定义Java类** 和 **XML** 两种方式来配置对象

<!--more-->

#### 开发Java config 类，并加上注解 

- **`[推荐]`**

- 先开发自定义Java对象

- 注解有两种

  - `@Configuration`  **`[推荐]`**

    类似于@Component注解，如果有多个对象可以封装起来一起注解，需要`@Bean`配合使用

    ```java
    package com.buubiu.entity;
    
    import org.springframework.context.annotation.Configuration;
    
    /**
     * 单独配置到对象上
     * @author buubiu
     **/
    @Configuration
    public class User {
    
    	private String id;
    	private String name;
    }
    ```

    ```java
    package com.buubiu.configs;
    
    import com.buubiu.entity.Order;
    import com.buubiu.entity.User;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    
    /**
     * 多个bean 一起管理
     * @author buubiu
     **/
    @Configuration
    public class BeansConfig {
    
    	@Bean
    	public User getUser() {
    		return new User();
    	}
    
    	@Bean
    	public Order getOrder() {
    		return new Order();
    	}
    }
    
    ```

    **使用的时候，直接用注解 `@Autowird`**

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
    	public String hell() {
    		System.out.println("hello springboot");
    		System.out.println(user);
    		return "hello springboot";
    	}
    }
    
    ```

  - `@Import`

    **在哪个类中引用就导入一个配置类，表示把该对象导入进来**

    ```java
    package com.buubiu.controller;
    import com.buubiu.entity.User;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.context.annotation.Import;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;
    /**
       * @author buubiu
     **/
    @RestController
    @RequestMapping("hello")
    @Import(User.class)
    public class HelloController {
    
      @Autowired
      private User user;
    
      @GetMapping("hello")
      public String hell() {
        System.out.println("hello springboot");
        System.out.println(user);
        return "hello springboot";
      }
    }
    ```



#### XML方式 

- **`[了解]`**

- 在`resources`目录下创建 `spring.xml`配置文件

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
  
    <!--交给工厂管理-->
    <bean class="com.buubiu.entity.User" id="user"/>
  </beans>
  ```

- 在入口类加入 注解 `@ImportResource`

  ```java
  package com.buubiu;
  
  import org.springframework.boot.SpringApplication;
  import org.springframework.boot.autoconfigure.SpringBootApplication;
  import org.springframework.context.annotation.ImportResource;
  
  /**
   * @SpringBootApplication
   * 	组合注解：相当于@EnableAutoConfiguration 和 @ComponentScan
   *
   * @author buubiu
   **/
  @SpringBootApplication
  @ImportResource("spring.xml")
  public class Application {
  
  	public static void main(String[] args) {
  		SpringApplication.run(Application.class, args);
  	}
  }
  
  ```

  

