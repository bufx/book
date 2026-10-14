# Spring Cloud Alibaba介绍及环境搭建

## 简介

官方：https://spring.io/projects/spring-cloud-alibaba

Spring Cloud Alibaba provides a one-stop solution for distributed application development. It contains all the components required to develop distributed applications, making it easy for you to develop your applications using Spring Cloud.

With Spring Cloud Alibaba, you only need to add some annotations and a small amount of configurations to connect Spring Cloud applications to the distributed solutions of Alibaba, and build a distributed application system with Alibaba middleware.

**翻译：**

阿里云为分布式应用开发提供了一站式解决方案。它包含了开发分布式应用程序所需的所有组件，使您可以轻松地使用springcloud开发应用程序。

有了阿里云，你只需要添加一些注解和少量的配置，就可以将Spring云应用连接到阿里的分布式解决方案上，用阿里中间件搭建一个分布式应用系统。

## 环境搭建

### 新建项目并引入依赖

```xml
<!--定义spring cloud alibaba版本-->
<spring.cloud.alibaba.version>2.2.3.RELEASE</spring.cloud.alibaba.version>

<!--全局引入springcloudalibaba下载依赖地址，并不会引入依赖-->
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.alibaba.cloud</groupId>
      <artifactId>spring-cloud-alibaba-dependencies</artifactId>
      <version>${spring.cloud.alibaba.version}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency></dependencies>
</dependencyManagement>
```

