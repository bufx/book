# Spring AOP 切入点的表达式

> 作用：主要是用来决定项目中哪些组件中哪些地方需要加入通知
> 语法结构：expression="切入点表达式"

## execution 切入点表达式

> 方法级别的切入点表达式
> 控制粒度：方法级别    效率低

### 完整语法

- execution(访问权限修饰符 返回值 包名.类名.方法名(参数类型))

- execution(返回值 包名.类名.方法名（参数类型))

  `	*` 表示任意多个字符

  **注意：尽可能精准切入 避免不必要的切入**

1.  .execution(* com.buubiu.service.\*.*(..))

   ​    包：	com.buubiu.service

   ​    类：	任意类

    方法：	任意方法

    参数：	任意参数

    返回值：任意返回值类型

2.  .execution(String com.buubiu.service.\*ServiceImpl.*(..))

   ​    包：	com.buubiu.service

   ​    类：	以ServiceImpl结尾的类

    方法：	任意方法

    参数：	任意参数

    返回值：返回值必须是String类型的相关方法

3.  .execution(String com.buubiu.service.\*Service\*.*(String))

   ​    包：	com.buubiu.service

   ​    类：	类名中包含Service关键字的类

    方法：	任意方法

    参数：	参数只有一个并且是String类型

    返回值：返回值必须是String类型的相关方法

4. .execution(* com.buubiu.service..\*.*(..))   `比较常用`

   ​    包：	com.buubiu.service及这个包中的子包的子包

   ​    类：	任意类

    方法：	任意方法

    参数：	任意参数

    返回值：任意返回值类型

5. .execution(* com.buubiu.service.\*ServiceImpl.\*(..))   `比较常用`

   ​    包：	com.buubiu.service

   ​    类：	以ServiceImpl结尾的类

    方法：	任意方法

    参数：	任意参数

    返回值：任意返回值类型

6. .execution(\* \*.\*(..))  `全部方法 避免使用这种方式`  

   ​    包：	项目中任意包

   ​    类：	任意类

    方法：	任意方法

    参数：	任意参数

    返回值：任意返回值类型



## within 切入点表达式

> 类级别的切入点表达式
>
> 控制粒度：类级别  效率高

### 完整语法

- within(包.类名)

  `	*` 表示任意多个字符

1. within(com.buubiu.service.*ServiceImpl)

   ​	包：	com.buubiu.service

   ​    类：	以ServiceImpl结尾的类

