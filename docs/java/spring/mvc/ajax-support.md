# SpringMVC对Ajax的支持

### 实现思路

1. 给按钮绑定一个单击事件
2. 在单击事件触发时发送异步请求
   - `$.ajax`
   - `$.get`
   - `$.post`
   - `$.getJSON`

<!--more-->

### springmvc 控制器将对应数据转为json

两种方式：

1. 使用fastjson等第三方工具包转换为json格式字符串

   ```java
   package com.buubiu.controller;
   
   import com.alibaba.fastjson.JSONObject;
   import com.buubiu.entity.User;
   import java.io.IOException;
   import java.util.ArrayList;
   import java.util.Date;
   import java.util.List;
   import java.util.UUID;
   import javax.servlet.http.HttpServletResponse;
   import org.springframework.stereotype.Controller;
   import org.springframework.web.bind.annotation.RequestMapping;
   
   /**
    * SpringMVC与Ajax集成
    * @author buubiu
    **/
   @Controller
   @RequestMapping("json")
   public class JsonController {
   
   	/**
   	 * 使用阿里fastjson转换为json
   	 * @param response
   	 * @throws IOException
   	 */
   	@RequestMapping("findAll")
   	public void findAll(HttpServletResponse response) throws IOException {
   		//收集数据
   		//调用业务
   		List<User> users = new ArrayList<>();
   
   		users.add(new User(UUID.randomUUID().toString(), "buubiu张三", 22, new Date()));
   		users.add(new User(UUID.randomUUID().toString(), "buubiu李四", 23, new Date()));
   		users.add(new User(UUID.randomUUID().toString(), "buubiu王五", 24, new Date()));
   
   		//fastjson
   		String s = JSONObject.toJSONStringWithDateFormat(users, "yyyy-MM-dd");
   		response.setContentType("application/json;charset=UTF-8");
   		response.getWriter().println(s);
   	}
   }
   
   ```

2. 使用SpringMVC提供的注解`@ResponseBody`

   - 作用范围：用在方法或者方法的返回值上
   - 作用：用来将方法的返回值自动转为json格式字符串并响应到前台
   - 底层使用：Jackson转换json

   **注意：别忘了引入jackson依赖**

   ```xml
   <dependency>
     <groupId>com.fasterxml.jackson.core</groupId>
     <artifactId>jackson-databind</artifactId>
     <version>2.11.2</version>
   </dependency>
   ```

   - 解决日期格式问题：

     在实体类的日期属性上加注解

     ```java
     @JsonFormat(pattern = "yyyy-MM-dd")
     private Date bir;
     ```

   ```java
   package com.buubiu.controller;
   
   import com.buubiu.entity.User;
   import java.util.ArrayList;
   import java.util.Date;
   import java.util.List;
   import java.util.UUID;
   import org.springframework.stereotype.Controller;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.ResponseBody;
   
   /**
    * SpringMVC与Ajax集成
    * @author buubiu
    **/
   @Controller
   @RequestMapping("json")
   public class JsonController {
   
   	/**
   	 * 使用SpringMVC提供的注解@ResponseBody
   	 * @return
   	 */
   	@RequestMapping("showAll")
   	public @ResponseBody List<User> showAll() {
   		//收集数据
   		//调用业务
   		List<User> users = new ArrayList<>();
   
   		users.add(new User(UUID.randomUUID().toString(), "buubiu张三", 22, new Date()));
   		users.add(new User(UUID.randomUUID().toString(), "buubiu李四", 23, new Date()));
   		users.add(new User(UUID.randomUUID().toString(), "buubiu王五", 24, new Date()));
   
   		return users;
   	}
   }
   
   ```
