# Spring 框架的注解式开发

### 注解（`Annotation`）式开发

- **定义：通过Spring框架提供的一系列**`相关注解`完成项目中快速开发
- **注解：Annotation 是Java中一种特殊类，类似于interface**
- **使用：`@注解类名(属性=参数)`**



### Spring中注解



`前置条件：必须在工厂配置文件中完成注解扫描`

```xml
<context:componet-scan base-package="com.buubiu" />
```

#### 创建对象相关注解

 `@Componet`注解（通用组件创建注解或者最顶层的父注解）

- 作用：用来负责创建对象（相当于	`<bean id="" class="" />` ）

- 修饰范围：只能用在类上

- **注意：默认使用这个注解在工厂中创建的对象的唯一标识为 `类名首字母小写`，比如UserDAOImpl==>userDAOImpl**

- `value`属性作用：用来指定创建的对象在工厂中唯一标识 `推荐：如果存在实现接口，则设置为接口首字母小写；若不存在，则默认`

  - 注意：若参数只有一个时，可以省略 value，比如：@Component("userDAO")等价于@Component(value = "userDAO")

  ---

  接下来讲的注解都是 子类注解，具有父类注解的一切特性，都是用来创建组件对象的

- `@Repository`

  - 作用：一般用来创建DAO组件中的注解
  - 注意：由于使用Spring+Mybatis整合时，在spring.xml配置文件中已经批量注入了，所以在DAO层我们一般不使用注解。

- `@Service`

  - 作用：一般用来创建Service中组件的注解

- `@Controller`

  - 作用：一般用来创建Action中组件的注解

#### 控制对象在工厂中创建次数

1. 配置文件修改

   ```xml
   <bean class="" id="" scope="singleton|prototype"/>
   ```

2. 注解如何控制

   `@Scope`

   - 作用：用来指定对象的创建次数，默认单例
   - 修饰范围：只能加在类上
   - `value`属性：**singleton(单例，默认)和prototype(多例)**
     - **注意：在管理struts的action时必须加入@Scope注解，值必须为prototype**

#### 属性注入的相关注解

​	有两种

1. Spring框架提供的 `@Autowired` [推荐]

   **注意：默认根据类型进行注入**

1. JavaEE中本身提供的  `@Resource`

   **注意：默认根据名称注入，名称找不到时自动根据类型注入**

- 作用：用来完成成员变量的赋值（注入）操作
- 修饰范围：用在类中的成员变量，或者是类中成员变量的SET方法上
- **注意：使用注解进行注入时，日后注入的成员变量可以不再提供SET方法，Spring底层通过反射给处理过了**

#### 控制事务注解

`@Transactional`

- 作用：用来给类中方法加入事务控制，简化配置文件中的两段配置

  1. 事务环绕通知及事务细粒度控制

     ```xml
     <!--基于事务管理器创建环绕通知对象并配置事务细粒度控制-->
     <tx:advice id="txAdvice" transaction-manager="transactionManager">
       <tx:attributes>
         <tx:method name="save*"/>
         <tx:method name="update*"/>
         <tx:method name="delete*"/>
         <tx:method name="find*" propagation="SUPPORTS"/>
       </tx:attributes>
     </tx:advice>
     ```

  2. 简化事务切面配置

     ```xml
     <!--配置切面-->
     <aop:config>
       <aop:pointcut id="pc" expression="execution(* com.buubiu.service.*ServiceImpl.*(..))"/>
       <aop:advisor advice-ref="txAdvice" pointcut-ref="pc"/>
     </aop:config>
     ```

- 修饰范围：类、方法上，并且 **局部优先原则**
  - 加在类上：代表类中所有方法都加入事务控制
  - 加在方法上：代表当前方法加入事务控制
  - 类和方法同时存在：方法优先

- **使用要求：如果想要让`@Transactional`这个注解生效，必须在配置文件中加入如下配置：**

  ```xml
    <!--开启注解式事务生效-->
    <tx:annotation-driven transaction-manager="transactionManager"/>
  ```

  

- 注解属性：
  - propagation	用来控制传播属性
  - isolation  用来控制隔离级别
  - rollbackFor  用来设置什么异常回滚
  - noRollbackFor  用来设置什么异常不回滚
  - readOnly  用来设置事务读写性
  - timeout  用来设置超时性