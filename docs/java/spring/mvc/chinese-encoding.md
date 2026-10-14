# SpringMVC请求参数中文乱码解决方案

### GET 方式的请求出现乱码

- tomcat8.x版本之前 默认使用 `server.xml` 中 URIEncoding="iso-8895-1"，编码不是utf-8，所以出现了中文乱码
- tomcat8.x版本之后 默认使用`server.xml` 中 `URIEncoding="UTF-8" `所以没有出现中文乱码

<!--more-->

---

### POST方式的请求出现乱码

**说明：在SpringMVC中默认没有对post方式请求进行任何编码处理，所以直接接收post方式请求会出现中文乱码**

**解决方案：**

1. 自定义filter

   `CharacterEncodingFilter.java`

   ```java
   package com.buubiu.filter;
   
   import java.io.IOException;
   import javax.servlet.Filter;
   import javax.servlet.FilterChain;
   import javax.servlet.FilterConfig;
   import javax.servlet.ServletException;
   import javax.servlet.ServletRequest;
   import javax.servlet.ServletResponse;
   
   /**
    * 自定义编码filter
    * @author buubiu
    **/
   public class CharacterEncodingFilter implements Filter {
   
   	private String encoding;
   
   	@Override
   	public void init(FilterConfig filterConfig) throws ServletException {
   
   		this.encoding = filterConfig.getInitParameter("encoding");
   		System.out.println("this.encoding = " + this.encoding);
   	}
   
   	@Override
   	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
   		throws IOException, ServletException {
   		request.setCharacterEncoding(encoding);
   		response.setCharacterEncoding(encoding);
   		chain.doFilter(request, response);
   	}
   
   	@Override
   	public void destroy() {
   
   	}
   }
   
   ```
`web.xml`
   ```xml
   <!--配置自定义编码filter-->
     <filter>
       <filter-name>charter</filter-name>
       <filter-class>com.buubiu.filter.CharacterEncodingFilter</filter-class>
       <init-param>
         <param-name>encoding</param-name>
         <param-value>UTF-8</param-value>
       </init-param>
     </filter>
     <filter-mapping>
       <filter-name>charter</filter-name>
       <url-pattern>/*</url-pattern>
     </filter-mapping>
   ```

2. 使用SpringMVC提供号的编码filter

   `web.xml`

   ```xml
   <!--配置post请求方式中文乱码的Filter-->
     <filter>
       <filter-name>charset</filter-name>
       <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
       <init-param>
         <param-name>encoding</param-name>
         <param-value>UTF-8</param-value>
       </init-param>
     </filter>
     <filter-mapping>
       <filter-name>charset</filter-name>
       <url-pattern>/*</url-pattern>
     </filter-mapping>
   ```
