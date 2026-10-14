# SpringMVC概述

### SpringMVC 的由来和诞生



- 由来：基于Spring框架基础之上开发的一个全新的框架 `SpringMVC`

- **作用：SpringMVC 是web开发时的控制器框架，用来替换现有项目中Struts2或者servlet控制器框架**

- 目的：为了使现有项目中使用Spring框架在MVC架构中存在自己的位置，因此开发了一个 SpringMVC 框架

- `MVC概念：` 编程步骤，三层编程

  | 关键字 | 释义             | 组成                   | 技术                          |
  | :----: | :--------------- | :--------------------- | :---------------------------- |
  |   M    | model模型        | service + dao + entity | JDBC\|Mybatis                 |
  |   V    | view视图         | webapp 页面            | jsp\|html                     |
  |   C    | Controller控制器 | action                 | servlet\|Struts2\|`SpringMVC` |

<!--more-->

### SpringMVC引言

SpringMVC 是典型的MVC框架，是控制器框架，它是在Spring基础之上进行二次开发，用来替换原有项目中Servlet或者Struts2框架

### 为什么是SpringMVC（优势）

- Spring框架流行程度非常之高
- SpringMVC 运行效率高于 Struts2的运行效率，体现在：Struts2必须是多例创建action，但是SpringMVC默认单例创建action，最大原因是：SpringMVC将成员变量转换为了局部变量，局部变量用完就没了，而成员变量在同一个对象中是共享的。
- SpringMVC 推荐使用注解式，其注解式开发更高效更灵活
