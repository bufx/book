# SpringMVC中数据传递机制

### 数据传递机制

下面列举`servlet、struts2、springmvc`控制器的数据传递机制：

<!--more-->

| 控制器    | 数据怎么存储                | 数据在页面如何获取 | 在页面中获取的数据该如何展示 |
| --------- | --------------------------- | ------------------ | ---------------------------- |
| Servlet   | request,session,application | EL表达式           | EL+JSTL标签                  |
| Struts2   | request,session,application | EL表达式           | EL+JSTL标签                  |
| SpringMVC | request,session,application | EL表达式           | EL+JSTL标签                  |

### 存数据具体使用哪种作用域

使用哪种作用域根跳转的方式有关系：

- 如果是`forward一次请求`：用 **request**作用或者`model`(SpringMVC 封装的，且只能用在forward，不能用在redirect)
- 如果是`redirect多次请求`：可以用 **session作用域、application作用域[不推荐]、问号[?]地址栏传递数据**

### 如何在SpringMVC控制器方法中获取request对象和response对象

**注意：直接将request、response对象作为控制器方法参数声明即可获取**

举例：

`AttrController.java`

```java
package com.buubiu.controller;

import com.buubiu.entity.User;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.ui.Model;

/**
 * 用来测试springmvc中数据传递机制
 * @author buubiu
 **/
@Controller
@RequestMapping("attr")
public class AttrController {

	/**
	 * 使用forward跳转页面数据传递
	 * 	1.传递零散类型数据
	 * 	2.传递对象类型数据
	 * 	3.传递集合类型数据
	 *
	 * 	Springmvc使用Model传递数据, 底层封装就是request对象并且只能用于forward
	 *
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("test")
	public String test(Model model, HttpServletRequest request, HttpServletResponse response) {
		//1.收集参数
		//2.调用业务方法

		//零散类型数据
		String name = "buubiu";

		//传递对象类型数据
		User user = new User("111", "buubiu", 33, new Date());

		//传递集合类型数据
		User user1 = new User("222", "buubiu2", 43, new Date());
		User user2 = new User("333", "buubiu333", 53, new Date());
		List<User> users = Arrays.asList(user, user1, user2);

//		request.setAttribute("username", name);
//		request.setAttribute("user",user);
//		request.setAttribute("users", users);

		model.addAttribute("username", name);
		model.addAttribute("user",user);
		model.addAttribute("users", users);

		//3.流程跳转
		return "attr";
	}

	/**
	 * 使用redirect跳转传递数据
	 * 	1.地址栏?拼接数据
	 * 	2.session对象
	 * @return
	 */
	@RequestMapping("test1")
	public String test1(HttpServletRequest request) throws UnsupportedEncodingException {
		//1.收集数据
		//2.调用业务
		String name = "buubiu中文";

		User user = new User("111", "buubiu", 33, new Date());
		request.getSession().setAttribute("user", user);
		//3.流程跳转
		return "redirect:/attr.jsp?name="+ URLEncoder.encode(name,"UTF-8");
	}
}

```

`attr.jsp`

```html
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page contentType="text/html; UTF-8" pageEncoding="utf-8" isELIgnored="false" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>测试数据传递</title>
</head>
<body>
    <h1>用来request测试数据传递</h1>

    <h3>获取request作用域数据：${requestScope.username}</h3>
    <h3>获取request作用域数据：${username}</h3>
    <hr color="red">
    <h3>id:${requestScope.user.id}</h3>
    <h3>name:${requestScope.user.name}</h3>
    <h3>age:${requestScope.user.age}</h3>
    <h3>bir:<fmt:formatDate value="${requestScope.user.bir}" pattern="yyyy-MM-dd HH:mm:ss"/>  </h3>
    <hr color="red">
    <c:forEach items="${requestScope.users}" var="user">
        id:${user.id}====name:${user.name}=====age:${user.age}=====<fmt:formatDate value="${user.bir}" pattern="yyyy-MM-dd HH:mm:ss"/><br>
    </c:forEach>

    <hr color="red"/>
    <h3>获取地址栏数据：${param.name}</h3>
    <h3>获取session作用域数据：</h3>
    <h3>id:${sessionScope.user.id}</h3>
    <h3>name:${sessionScope.user.name}</h3>
    <h3>age:${sessionScope.user.age}</h3>
    <h3>bir:<fmt:formatDate value="${sessionScope.user.bir}" pattern="yyyy-MM-dd HH:mm:ss"/></h3>
</body>
</html>
```
