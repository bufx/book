# SpringBoot中的war包部署

**由于SpringBoot默认是打成 `jar`包的，一旦使用`war`包部署注意：**

- `application.properties` 中配置`server.servlet.context-path、server.port` 失效
- 访问时使用打成war包的名字和外部自己tomcat端口号进行访问项目

<!--more-->

### 配置 `pom.xml`

1. 由于SpringBoot默认是打成 `jar`包的，所以首先要在 `pom.xml`中配置为 `war`包的答包方式

```xml
  <groupId>com.buubiu</groupId>
  <artifactId>springboot</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>war</packaging>
```

2. 由于SpringBoot内嵌了`tomcat`，并且我们打成`war`包肯定是在自己的tomcat中运行，所以就要排除内嵌的to mcat

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-tomcat</artifactId>
  <scope>provided</scope>   <!--去掉内嵌tomcat-->
</dependency>
```

3. 如果你的页面是`jsp`模版开发的，那么也需要去掉内嵌的tomcat解析jsp

```xml
<dependency>
  <groupId>org.apache.tomcat.embed</groupId>
  <artifactId>tomcat-embed-jasper</artifactId>
  <scope>provided</scope>  <!--去掉使用内嵌tomcat解析jsp-->
</dependency>
```

4. 在配置 `pom.xml`中指定入口类

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
      <!--使用热部署出现中文乱码解决方案-->
      <configuration>
        <fork>true</fork>
        <!--增加jvm参数-->
        <jvmArguments>-Dfile.encoding=UTF-8</jvmArguments>
        <!--指定入口类-->
        <mainClass>com.buubiu.SpringbootApplication</mainClass>
      </configuration>
    </plugin>
  </plugins>
</build>
```

### 修改入口类

修改入口类，让自己的tomcat知道我们的主入口在哪

- 继承 `SpringBootServletInitializer`类
- 覆盖`configure`方法

```java
package com.buubiu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class SpringbootApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(SpringbootApplication.class, args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(SpringbootApplication.class);
	}
}


```

