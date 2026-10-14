# SpringBoot集成Mybatis

SpringBoot官方推荐了两种方式：

- 一个是在Java类上注解写sql
- 一个是配置mapper.xml(本次举例)

<!--more-->

### 引入依赖

`pom.xml`

```xml
<!--引入mybatis-springboot依赖-->
<dependency>
  <groupId>org.mybatis.spring.boot</groupId>
  <artifactId>mybatis-spring-boot-starter</artifactId>
  <version>2.1.3</version>
</dependency>
<!--引入mysql-->
<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
</dependency>
<!--引入druid依赖-->
<dependency>
  <groupId>com.alibaba</groupId>
  <artifactId>druid</artifactId>
  <version>1.1.23</version>
</dependency>
```

### 修改配置文件

`application.properties`

- 配置数据源

```properties
# 配置数据源
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/mybatis
spring.datasource.username=root
spring.datasource.password=root
```

- 配置mybatis配置

```properties
#mybatis配置
#指定mapper配置文件位置
mybatis.mapper-locations=classpath:/com/buubiu/mapper/*.xml
#指定起别名来的类
mybatis.type-aliases-package=com.buubiu.entity
```

### 编辑入口类

在入口类加注解 `@MapperScan('com.buubiu.dao')`

```java
package com.buubiu;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author buubiu
 **/
@SpringBootApplication
@MapperScan("com.buubiu.dao")
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}

```

### 开发控制类以及页面

```java
package com.buubiu.controller;

import com.buubiu.entity.User;
import com.buubiu.service.UserService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author buubiu
 **/
@Controller
@RequestMapping("user")
public class UserController {

	@Autowired
	private UserService userService;

	@GetMapping("findAll")
	public String findAll(Model model) {
		List<User> users = userService.findAll();
		model.addAttribute("users", users);
		return "showAll";
	}

	@GetMapping("save")
	public String save(User user) {
		userService.save(user);
		return "redirect:/user/findAll";
	}

}

```

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
  <meta charset="UTF-8">
  <title>ShowAll</title>
</head>
<body>
  <ul th:each="user,userState:${users}">
    <li><span th:text="${user.id}"></span></li>
    <li><span th:text="${user.name}"></span></li>
    <li><span th:text="${user.age}"></span></li>
    <li><span th:text="${#dates.format(user.bir,'yyyy-MM-dd')}"></span></li>
  </ul>
<h1><a th:href="@{/user/save(name='buubiu中间',age='33',bir='1997/09/10')}">添加用户</a> </h1>
</body>
</html>
```

