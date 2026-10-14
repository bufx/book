# Spring 中处理事务两种方式

## 编程式事务处理

**定义：通过在业务层中注入事务管理器对象，然后通过编码的方式进行事务控制**

**缺点：**

- 代码冗余
- 不够通用
- 不便于维护

```java
//创建事务配置对象
TransactionDefinition transactionDefinition = new DefaultTransactionDefinition();
//获取事务状态
TransactionStatus status = platformTransactionManager.getTransaction(transactionDefinition);
....
platformTransactionManager.commit(status);
platformTransactionManager.rollback(status);
```



## 声明式事务处理 （推荐）

**定义：通过利用AOP切面编程进行事务控制，并对事物属性在配置文件中完成细粒度配置**

**好处：**

- 通用
- 减少代码冗余
- 更加专注于业务逻辑开发
- 无需重复编码

1. spring 框架提供 `tx:advice`标签

   **作用：**

   - 可以根据事务管理器创建一个基于事务的`环绕通知`对象

   - `tx:advice`标签可以对事务进行细粒度控制

   **语法：**

   ```xml
   <tx:advice id="transactionAdvice(创建出来通知对象在工厂中的唯一标识)" transaction-manager="事务管理器是谁">
   		<!--事务细粒度配置-->
       <tx:attributes>
         <tx:method name="save*(需要做事务处理的方法名，支持通配符)"/>
         <tx:method name="delete*"/>
         <tx:method name="update*"/>
       </tx:attributes>
   </tx:advice>
   ```

   

2. 配置切面

   **语法：**

   ```xml
   <aop:config>
     <aop:pointcut id="pc" expression="within(com.buubiu.service.*ServiceImpl)"/>
     <aop:advisor advice-ref="transactionAdvice" pointcut-ref="pc"/>
   </aop:config>
   ```

   

