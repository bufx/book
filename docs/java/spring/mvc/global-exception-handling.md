# SpringMVC全局异常处理

### 作用

**当控制器中某个方法在运行过程中突然发生运行时异常，为了增加用户体验对于用户不能出现类似500错误代码，应该给用户良好展示错误界面，全局异常处理就能更好解决这个问题**

---

<!--more-->

### 全局异常处理开发

1. 自定义类 实现接口 `HandlerExceptionResolver`

   ```java
   package com.buubiu.handlerexception;
   
   import com.buubiu.exceptions.UserNameNotFoundException;
   import javax.servlet.http.HttpServletRequest;
   import javax.servlet.http.HttpServletResponse;
   import org.springframework.web.servlet.HandlerExceptionResolver;
   import org.springframework.web.servlet.ModelAndView;
   
   /**
    * 自定以全局异常类
    * @author buubiu
    **/
   public class GlobalExceptionResolver implements HandlerExceptionResolver {
   
   	/**
   	 * 用来处理发生异常时的方法
   	 * @param request	当前请求对象
   	 * @param response	当前请求对应的响应对象
   	 * @param handler	当前请求的方法对象
   	 * @param ex		出现异常时展示视图和数据
   	 * @return
   	 */
   	@Override
   	public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response,
   		Object handler, Exception ex) {
   		System.out.println("进入全局异常处理器获取的异常信息为：" + ex.getMessage());
   		ModelAndView modelAndView = new ModelAndView();
   
   		//基于不同业务异常跳转到不同页面
   		if (ex instanceof UserNameNotFoundException) {
   			modelAndView.setViewName("redirect:/login.jsp");
   		} else {
   			modelAndView.setViewName("redirect:/error.jsp");
   		}
   		//modelandview 中 model 默认放入request作用域中，如果使用redirect跳转：model中数据会自动拼接到跳转url
   		modelAndView.addObject("msg", ex.getMessage());
   		return modelAndView;
   	}
   }
   ```

2. 在SpringMVC配置文件中配置全局异常处理类

   ```xml
   <!--配置全局异常处理类-->
   <bean class="com.buubiu.handlerexception.GlobalExceptionResolver"/>
   ```
