# SpringBoot的切面编程

### 概述

​	SpringBoot是对原有项目中Spring框架和SpringMVC框架的进一步封装，因此在SpringBoot中同样支持Spring框架的AOP切面编程，不过在SpringBoot中为了快速开发，仅需要注解就可以开发切面编程。

<!--more-->

---

### 使用

1. 引入依赖

```xml
    <!--引入aop依赖-->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-aop</artifactId>
    </dependency>
```

2. 自定义通知

```java
package com.buubiu.aspects;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

/**
 * @author buubiu
 **/
@Aspect
@Configuration
@Order(1)//切面的执行顺序，数字越小，优先级越高
public class MyAspect {

	//前置通知方法  在目标方法执行之前执行操作
	@Before("within(com.buubiu.service.*ServiceImpl)")
	public void before(JoinPoint joinPoint) {
		System.out.println("前置通知业务处理～～");
		System.out.println("目标方法名称：" + joinPoint.getSignature().getName());
		System.out.println("目标方法参数：" + joinPoint.getArgs());
		System.out.println("目标方法对象：" + joinPoint.getTarget());
	}

	//后置通知 在目标方法执行之后执行的操作
	@After("within(com.buubiu.service.*ServiceImpl)")
	public void after(JoinPoint joinPoint) {
		System.out.println("后置通知业务处理～～");
		System.out.println("目标方法名称：" + joinPoint.getSignature().getName());
		System.out.println("目标方法对象：" + joinPoint.getTarget());
	}

	//环绕通知
	//当目标方法执行时会先进入环绕通知，然后在环绕通知放行后继续执行目标方法；当目前方法执行后回到环绕通知
	@Around("execution(* com.buubiu.service.*ServiceImpl.*(..))")
	public Object around(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
		System.out.println("进入环绕通知～～");
		Object proceed = proceedingJoinPoint.proceed();//放行执行业务方法
		System.out.println("目标方法名称：" + proceedingJoinPoint.getSignature().getName());
		System.out.println("目标方法参数：" + proceedingJoinPoint.getArgs());
		System.out.println("目标方法对象：" + proceedingJoinPoint.getTarget());
		return proceed;
	}

}

```

3. 相关注解解释
   - `@Aspect: `用来类上,代表这个类是一个切面
   - `@Before:` 用在方法上代表这个方法是一个前置通知方法
   - `@After:`用在方法上代表这个方法是一个后置通知方法
   - `@Around:`用在方法上代表这个方法是一个环绕的方法
   - `@Order(1):`切面的执行顺序，数字越小，优先级越高



