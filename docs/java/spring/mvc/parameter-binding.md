# SpringMVC中的参数接收

## struts2框架中参数接收

- 语法：使用action中**成员变量接收请求参数**
- **要求：要求传递请求参数key与后台action中声明的成员变量名一致才能接收参数，同时成员变量必须提供GET和SET方法**

<!--more-->

## SpringMVC中参数接收

- 语法：使用控制器中方法形参列表接收客户端的请求参数
- **要求：要求传递参数key要与对应方法的形参变量名一致才能完成自动赋值**

---

### 零散类型参数接收

​	**保证请求参数中key与对应方法中声明的形参变量名一致即可**

例子：

```java
package com.buubiu.controller;

import java.util.Date;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 用来测试参数接收的controller
 * @author buubiu
 **/
@Controller
@RequestMapping("param")
public class ParamController {

	/**
	 * 用来测试零散类型参数接收
	 * 请求格式：
	 * http://localhost:8080/springmvc/param/test?name=buubiu&age=23&price=23.43&sex=false&bir=2019/12/12%2023:44:50
	 * 输出结果：
	 * name = buubiu
	 * age = 23
	 * price = 23.43
	 * sex = false
	 * bir = Thu Dec 12 23:44:50 CST 2019
	 *
	 * 	默认日期格式：yyyy/MM/dd HH:mm:ss
	 * @param name
	 * @param age
	 * @param price
	 * @param sex
	 * @param bir
	 * @return
	 */
	@RequestMapping("test")
	public String test(String name, Integer age, Double price, Boolean sex, Date bir) {
		System.out.println("name = " + name);
		System.out.println("age = " + age);
		System.out.println("price = " + price);
		System.out.println("sex = " + sex);
		System.out.println("bir = " + bir);
		return "index";
	}
}
```

---

### 对象类型参数接收

​		接收对象类型也是直接将要接收对象作为控制器方法参数声明

​		**注意：SpringMVC封装对象时直接根据传递参数key与对象中属性名一致自动封装对象**

```java
package com.buubiu.controller;

import com.buubiu.entity.User;
import java.util.Date;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 用来测试参数接收的controller
 * @author buubiu
 **/
@Controller
@RequestMapping("param")
public class ParamController {

	/**
	 * 用来测试对象类型的参数接收
	 * 接收对象类型也是直接将要接收对象作为控制器方法参数声明
	 * 注意：SpringMVC封装对象时直接根据传递参数key与对象中属性名一致自动封装对象
	 * 请求格式：
	 * URL：
	 *		http://localhost:8080/springmvc/param/test1?id=2222&name=buubiu&age=23&bir=2019/12/12%2023:44:50
	 * 输出结果：
	 *		user = User{id='2222', name='buubiu', age=23, bir=Thu Dec 12 23:44:50 CST 2019}
	 *		name = buubiu
	 * form：
	 *		input	name="id"
	 *		input	name="name"
	 *		input	name="age"
	 *		.....
	 * @param user
	 * @param name
	 * @return
	 */
	@RequestMapping("test1")
	public String test1(User user, String name) {
		System.out.println("user = " + user);
		System.out.println("name = " + name);
		return "index";
	}
}
```

---

### 数组或集合类型参数接收

- 数组

  - 接收数组：将要接收数组类型直接声明为方法的形参即可

  *** 注意：保证请求参数多个参数key与声明数组变量名一致，SpringMVC会自动放入同一个数组中**

  例子：

  ```java
  package com.buubiu.controller;
  
  import com.buubiu.entity.User;
  import java.util.Date;
  import org.springframework.stereotype.Controller;
  import org.springframework.web.bind.annotation.RequestMapping;
  
  /**
   * 用来测试参数接收的controller
   * @author buubiu
   **/
  @Controller
  @RequestMapping("param")
  public class ParamController {
  
  	/**
  	 * 用来测试数据类型参数接收
  	 * 接收数组：将要接收数组类型直接声明为方法的形参即可
  	 * 注意：保证请求参数多个参数key与声明数组变量名一致，SpringMVC会自动放入同一个数组中
  	 * 请求格式：
  	 * URL：
  	 *		http://localhost:8080/springmvc/param/test2？hobbys=kanshu&hobbys=chifan&hobbys=tiaowu
  	 * 输出结果：
  	 *		hobby = kanshu
  	 *		hobby = chifan
  	 *		hobby = tiaowu
  	 * 
  	 * form： checkbox
  	 * 		input	type="checkbox" name="hobbys" value="看书"
  	 * 		input	type="checkbox" name="hobbys" value="吃饭"
  	 * 		input	type="checkbox" name="hobbys" value="跳舞"
  	 * 		input	type="checkbox" name="hobbys" value="唱歌"
  	 * 		....
  	 *
  	 * @param hobbys
  	 * @return
  	 */
  	@RequestMapping("test2")
  	public String test2(String[] hobbys) {
  		for (String hobby : hobbys) {
  			System.out.println("hobby = " + hobby);
  		}
  		return "index";
  	}
  }
  
  ```

- 集合

  - **springmvc不能直接通过形参列表方式收集集合类型参数；**
  - **如果要接收集合类型的参数必须将集合放入对象中接收才可以，官方推荐放入vo对象中接收集合类型；**
  - **vo = value object 值对象**

  例子：

  ```java
  package com.buubiu.controller;
  
  import com.buubiu.entity.User;
  import com.buubiu.vo.CollectionVO;
  import java.util.Date;
  import org.springframework.stereotype.Controller;
  import org.springframework.web.bind.annotation.RequestMapping;
  
  /**
   * 用来测试参数接收的controller
   * @author buubiu
   **/
  @Controller
  @RequestMapping("param")
  public class ParamController {
  
  	/**
  	 * 用来测试集合类型参数接收
  	 * 	list  set  map
  	 * 	注意：
  	 * 		springmvc不能直接通过形参列表方式收集集合类型参数；
  	 * 		如果要接收集合类型的参数必须将集合放入对象中接收才可以，官方推荐放入vo对象中接收集合类型；
  	 * 		vo = value object 值对象
  	 * 请求格式：
  	 * 	 URL：
  	 * 		http://localhost:8080/springmvc/param/test3?lists=zhangsan&lists=lisi&lists=wangwu
  	 * 	 输出结果：
  	 * 	 ===========
  	 * 	str = zhangsan
  	 * 	str = lisi
  	 * 	str = wangwu
  	 * @param collectionVO
  	 * @return
  	 */
  	@RequestMapping("test3")
  	public String test3(CollectionVO collectionVO) {
  		System.out.println("===========");
  		collectionVO.getLists().forEach(str-> System.out.println("str = " + str));
  		return "index";
  	}
    /**
  	 * 用来测试集合类型参数接收
  	 * 	map
  	 * 	注意：
  	 * 		springmvc不能直接通过形参列表方式收集集合类型参数；
  	 * 		如果要接收集合类型的参数必须将集合放入对象中接收才可以，官方推荐放入vo对象中接收集合类型；
  	 * 		vo = value object 值对象
  	 * 请求格式：
  	 * 	 URL：
  	 * 		http://localhost:8080/springmvc_01/param/test4?maps['aaa']=zhangsan$maps['bbb']=lisi%maps['ccc']=wangwu
  	 * 	 输出结果：
  	 * 	 ===========
  	 * 	str = zhangsan
  	 * 	str = lisi
  	 * 	str = wangwu
  	 * @param collectionVO
  	 * @return
  	 */
  	@RequestMapping("test4")
  	public String test4(CollectionVO collectionVO) {
  		System.out.println("==========map===========");
  		collectionVO.getMaps().forEach((k,v)-> System.out.println("k = " + k+" v = " + v));
  		return "index";
  	}
  }
  ```
