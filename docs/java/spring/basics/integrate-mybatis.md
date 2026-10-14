# Spring 整合 Mybatis 思路分析（SM 整合）

## 引入相关依赖

spring&nbsp;&nbsp;&nbsp;&nbsp;mybatis&nbsp;&nbsp;&nbsp;&nbsp;mysql&nbsp;&nbsp;&nbsp;&nbsp;mybatis-spring&nbsp;&nbsp; druid......

## 如何整合？

`Spring`是**项目管理框架** 主要是用来负责项目中`组件对象的创建、使用、销毁` **`--对象创建`**

`Mybatis`是**持久层框架** 主要是用来简化原始jdbc技术`对数据库访问操作` **`--操作数据库`**

**<u>整合思路：通过Spring框架接管Mybatis框架中核心对象的创建</u>**

## Mybatis框架中核心对象是谁？

- `SqlSessionFactory` 

  Mybatis中核心对象，读取 `Mybatis-Config.xml`[数据源配置和mapper文件配置]

## SM整合（Spring整合mybatis框架）

**<u>整合思路：通过Spring框架接管Mybatis中核心的`SqlSessionFactory`对象的创建</u>**

1. Spring如何管理 SqlSessionFactory 对象的创建

> 简单对象：`<bean id="" class=""/>`
>
> 复杂对象(接口和抽象类等)：`类 implement FactoryBean<创建的对象>{}`

SqlSessionFactory：通过查看源码得知它是一个接口类型的复杂对象。

普通如何创建：

```java
InputStream inputStream = Resources.getResourceAsStream("mybatis-config.xml");
sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
```

复杂对象如何创建：

```java
package factorybean;

import java.io.InputStream;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.springframework.beans.factory.FactoryBean;

/**
 * 自定义创建SqlSessionFactory
 * @author buubiu
 **/
public class SqlSessionFactoryBean implements FactoryBean<SqlSessionFactory> {

	@Override
	public SqlSessionFactory getObject() throws Exception {
		InputStream inputStream = Resources.getResourceAsStream("mybatis-config.xml");
		SqlSessionFactory build = new SqlSessionFactoryBuilder().build(inputStream);
		return build;
	}

	@Override
	public Class<?> getObjectType() {
		return SqlSessionFactory.class;
	}

	@Override
	public boolean isSingleton() {
		return true;
	}
}

```

2. 工厂管理 SqlSessionFactory

```xml
<bean class="buubiu.sqlSessionFactoryBean" id="sqlSessionFactory" />
```

3. 工厂获取

```java
SqlSessionFactory sqlSessionFactory = (SqlSessionFactory) context
			.getBean("sqlSessionFactory");
SqlSession sqlSession = sqlSessionFactory.openSession();
```



## Mybatis官方提供jar包

`mybatis-spring.jar` 封装了 SqlSessionFactory 对象的创建，即我们刚刚创建的 `SqlSessionFactoryBean`

所以，在工厂管理时，直接引用jar包里面的`SqlSessionFactoryBean`

```xml
<bean class="org.mybatis.spring.SqlSessionFactoryBean" id="sqlSessionFactory"/>
```

**注意：官方提供的 SqlSessionFactoryBean 不能再使用mybatis-config.xml**



## 创建数据源对象（driud  c3p0 dbcp）

1. 引入依赖

```xml
  <!--druid-->
  <dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.23</version>
  </dependency>
```



2. 创建数据源对象

```xml
 <!--创建数据源对象 druid c3p0 dbcp-->
  <bean class="com.alibaba.druid.pool.DruidDataSource" id="druidDataSource">
    <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
    <property name="url" value="jdbc:mysql://localhost:3306/mybatis"/>
    <property name="username" value="root"/>
    <property name="password" value="root"/>
  </bean>
```



3. 工厂获取

```java
SqlSessionFactory sqlSessionFactory = (SqlSessionFactory) context
			.getBean("sqlSessionFactory");
SqlSession sqlSession = sqlSessionFactory.openSession();
```



