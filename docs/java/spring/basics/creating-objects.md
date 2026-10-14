# Spring 创建简单和复杂对象

## 通过工厂创建简单对象

### 简单对象

**定义：** `可以直接通过new关键字创建的对象 统一称为简单对象`

### 工厂创建简单对象

**语法：** 

```xml
<bean id="" class="xxx" [scope="singleton|prototype"]>
```

## 通过工厂创建复杂对象

### 复杂对象

**定义**：`不能直接通过new关键字进行创建的对象`

​	例如：接口类型（Connection）

​					抽象类型（Calendar MessageDisgest..)

### 工厂创建复杂对象

**步骤：**

1. 要自定义一个类，并且实现FactoryBean\<T\>这个接口

**语法：**

对象名FactoryBean	implements 	FactoryBean<Calendar|Connection|复杂对象>{

}

```java
package factorybean;

import java.util.Calendar;
import org.springframework.beans.factory.FactoryBean;

/**
 * 用来在工厂中创建复杂对象
 * @author buubiu
 **/
public class CalendarFactoryBean implements FactoryBean<Calendar> {

	//用书书写复杂对象的创建方式
	/*Calendar instance = Calendar.getInstance();*/
	@Override
	public Calendar getObject() throws Exception {
		return Calendar.getInstance();
	}

	//指定创建的复杂对象的类型
	@Override
	public Class<?> getObjectType() {
		return Calendar.class;
	}

	//用来指定创建的对象模式 true：单例  false：多例
	@Override
	public boolean isSingleton() {
		return true;
	}
}

```

2. 通过工厂配置创建的复杂对象

```xml
<!--通过factorybean创建复杂对象-->
  <bean class="factorybean.CalendarFactoryBean" id="calendar"/>
```

