# SpringBoot中的拦截器

### 定义

拦截器（`Interceptor` ) 拦截、中断的意思，类似于 JavaWeb中的Filter，但不如Filter拦截的范围大。

### 作用

通过将控制器中的通用代码放在拦截器中执行，减少控制器中的代码冗余。

<!--more-->

### 拦截器的特点

1. 请求到达会经过拦截器，响应回来同样会经过拦截器
2. 拦截器只能拦截控制器相关请求，不能拦截jsp、静态资源相关请求
3. 拦截器可以中断请求轨迹

### 开发拦截器

1. 自定义类，并实现接口 `HanHandlerInterceptor`中的方法

```java
package com.buubiu.interceptors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

/**
 * 自定义拦截器
 * @author buubiu
 **/
public class MyInterceptor implements HandlerInterceptor {

	//请求流程：
	//1.请求经过拦截器会优先进入拦截器中preHandle方法执行
	//2.如果preHandle返回true，代表放行请求，如果返回false，中断请求
	//3.如果preHandle返回true，会执行当前请求对应的控制器方法
	//4.当前控制器方法执行结束之后，会返回拦截器中执行拦截器中的postHandle方法
	//5.postHandle方法执行之后响应请求，在响应请求完成后会执行afterCompletion方法

	//参数1：当前请求对象
	//参数2：当前请求对应响应对象
	//参数3：当前请求的控制器对应的方法对象
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
		Object handler) throws Exception {
		System.out.println("===========1==========");
		System.out.println("请求的方法：" + ((HandlerMethod) handler).getMethod().getName());
		return true;
	}

	//如果控制器方法执行失败或者异常时不执行该方法
	//参数1：当前请求对象
	//参数2：当前请求对应响应对象
	//参数3：当前请求的控制器对应的方法对象
	//参数4：当前请求控制器方法返回值（当前请求控制器方法返回的ModelAndView对象）
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
		ModelAndView modelAndView) throws Exception {
		System.out.println("===========3==========");
		System.out.println(modelAndView);

	}

	//无论控制器方法请求成功还是失败都会执行该方法
	//参数1：当前请求对象
	//参数2：当前请求对应响应对象
	//参数3：当前请求的控制器对应的方法对象
	//参数4：请求过程中出现异常时的异常
	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
		Object handler, Exception ex) throws Exception {
		System.out.println("===========4==========");
		if (ex != null) {
			System.out.println(ex.getMessage());
		}
	}
}

```

2. 配置拦截器，开发自定义配置类 并实现 `WebMvcConfigurer`接口

   **注意：在springboot2.x版本中自定义拦截器之后出现项目中静态资源 404情况,需要在自定义拦截器的配置中添加如下两种之一的配置**

   - 在方法 `addInterceptors` 中添加排除资源配置
   - 在方法`addResourceHandlers`中添加不经过拦截器的资源

```java
package com.buubiu.config;

import com.buubiu.interceptors.MyInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 *
 * @author buubiu
 **/
@Configuration
public class InterceptorConfig implements WebMvcConfigurer {

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new MyInterceptor())//添加拦截器
			.addPathPatterns("/hello/**")//添加拦截的请求路径
			.excludePathPatterns("/hello/word","classpath:/templates/")//添加排除哪些请求路径不经过拦截器
			.excludePathPatterns("classpath:/static/","classpath:/templates/");//排除静态资源
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/**")//代表以什么样的请求路径访问静态资源
			.addResourceLocations("classpath:/static/","classpath:/templates/");//添加静态资源不需要拦截
	}
}


```

