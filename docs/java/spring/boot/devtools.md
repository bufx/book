# SpringBoot配置热部署

### 引言

为了进一步提高开发效率,springboot为我们提供了全局项目热部署,日后在开发过程中修改了部分代码以及相关配置文件后,不需要每次重启使修改生效,在项目中开启了springboot全局热部署之后只需要在修改之后等待几秒即可使修改生效。

<!--more-->

### 开启热部署

1. 引入依赖

   ```xml
   <!--springboot热部署-->
   <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-devtools</artifactId>
     <optional>true</optional>
   </dependency>
   ```

2. 配置开发工具支持热部署（eclipse不需要配置）

   IDEA操作如下：

   - 开启自动编译

     ```
     Preferences | Build, Execution, Deployment | Compiler -> 勾选上 Build project automatically 这个选项
     ```

   - 开启允许在运行过程中修改文件

     ```
     command + option + shift + /(win:ctrl + alt + shift + /) ---->选择1.Registry ---> 勾选 compiler.automake.allow.when.app.running 这个选项
     ```

3. 修改配置文件

   ```properties
   spring.thymeleaf.cache=false
   ```

4. 启动日志出现`restartedMain`代表生效

   ```sh
   2020-08-14 13:16:35.327  INFO 10014 --- [  restartedMain] com.buubiu.Application  
   2020-08-14 13:16:35.329  INFO 10014 --- [  restartedMain] com.buubiu.Application 
   2020-08-14 13:16:35.377  INFO 10014 --- [  restartedMain] .e.DevToolsPropertyDefaultsPostProcessor
   2020-08-14 13:16:35.378  INFO 10014 --- [  restartedMain] .e.DevToolsPropertyDefaultsPostProcessor 
   2020-08-14 13:16:36.495  INFO 10014 --- [  restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer 
   2020-08-14 13:16:36.505  INFO 10014 --- [  restartedMain] o.apache.catalina.core.StandardService   
   2020-08-14 13:16:36.505  INFO 10014 --- [  restartedMain] org.apache.catalina.core.StandardEngine   
   2020-08-14 13:16:36.578  INFO 10014 --- [  restartedMain] w.s.c.ServletWebServerApplicationContext 
   2020-08-14 13:16:37.099  INFO 10014 --- [  restartedMain] o.s.s.concurrent.ThreadPoolTaskExecutor  
   2020-08-14 13:16:37.343  INFO 10014 --- [  restartedMain] o.s.b.d.a.OptionalLiveReloadServer      
   2020-08-14 13:16:37.391  INFO 10014 --- [  restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer
   2020-08-14 13:16:37.403  INFO 10014 --- [  restartedMain] com.buubiu.Application  
   ```
