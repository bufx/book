# 并发编程-前言

整个系列文章为**Java并发专题**，一是自己的兴趣，二是，这部分在实际理解上很有难度，另外在面试过程中也是经常被问到。所以在学习过程中，记录了Java并发相关的基础知识，一是自己对知识能够建立体系，同时也希望有幸能够对其他人有用。
### 基础知识

1.1 [并发编程的优缺点](https://www.buubiu.com/2020/09/05/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-%E4%BC%98%E7%BC%BA%E7%82%B9/)

知识点：（1）为什么要用到并发？（优点）；（2）并发编程的缺点；（3）易混淆的概念

1.2 [线程的状态和基本操作](https://www.buubiu.com/2020/09/08/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-%E7%BA%BF%E7%A8%8B%E7%9A%84%E7%8A%B6%E6%80%81%E5%92%8C%E5%9F%BA%E6%9C%AC%E6%93%8D%E4%BD%9C/)

知识点：（1）如何新建线程；（2）线程状态的转换；（3）线程的基本操作；（4）线程的优先级； （5）线程和进程的区别；（6）守护线程Daemon；（7）线程的死锁

### 并发理论（JMM）

2.1 [java内存模型以及happens-before规则](https://www.buubiu.com/2020/09/04/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-Java%E5%86%85%E5%AD%98%E6%A8%A1%E5%9E%8B%E4%BB%A5%E5%8F%8Ahappens-before/)

知识点：（1）JMM内存结构；（2）重排序；（3）happens-before规则

### 并发关键字

3.1 [让你彻底理解Synchronized](https://www.buubiu.com/2020/09/05/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-%E5%85%B3%E9%94%AE%E5%AD%97-synchronized/)

知识点：（1）如何使用synchronized；（2）monitor机制；（3）synchronized的happens-before关系；（4）synchronized的内存语义；（5）锁优化；（6）锁升级策略

3.2 [让你彻底理解volatile](https://www.buubiu.com/2020/09/07/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-%E5%85%B3%E9%94%AE%E5%AD%97-volatile/)

知识点：（1）实现原理；（2）happens-before的关系推导；（3）内存语义；（4）内存语义的实现

3.3 [你以为你真的了解final吗？](https://www.buubiu.com/2020/09/07/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-%E5%85%B3%E9%94%AE%E5%AD%97-final/)

知识点：（1）如何使用；（2）final的重排序规则；（3）final实现原理；（4）final引用不能从构造函数中“溢出”（this逃逸）

3.4 [三大性质总结：原子性，有序性，可见性](https://www.buubiu.com/2020/09/09/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-%E4%B8%89%E5%A4%A7%E6%80%A7%E8%B4%A8%E6%80%BB%E7%BB%93/)

知识点：（1）原子性：synchronized；（2）可见性：synchronized，volatile；（3）有序性：synchronized，volatile

### Lock体系

4.1 [初识Lock与AbstractQueuedSynchronizer(AQS)](https://www.buubiu.com/2020/09/09/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-%E5%88%9D%E8%AF%86Lock%E4%B8%8EAQS/)

知识点：（1）Lock和synchronized的比较；（2）AQS设计意图；（3）如何使用AQS实现自定义同步组件；（4）可重写的方法；（5）AQS提供的模板方法；

4.2 [深入理解AbstractQueuedSynchronizer(AQS)](https://www.buubiu.com/2020/09/13/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3AbstractQueuedSynchronizer-AQS/)

知识点：（1）AQS同步队列的数据结构；（2）独占式锁；（3）共享式锁；

4.3 [再一次理解ReentrantLock](https://www.buubiu.com/2020/09/13/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-ReentrantLock-%E9%87%8D%E5%85%A5%E9%94%81-%E4%BB%8B%E7%BB%8D/)

知识点：（1）重入锁的实现原理；（2）公平锁的实现原理；（3）非公平锁的实现原理；（4）公平锁和非公平锁的比较

4.4 [深入理解读写锁ReentrantReadWriteLock](https://www.buubiu.com/2020/09/13/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-ReentrantReadWriteLock-%E8%AF%BB%E5%86%99%E9%94%81-%E4%BB%8B%E7%BB%8D/)

知识点：（1）如何表示读写状态；（2）WriteLock的获取和释放；（3）ReadLock的获取和释放；（4）锁降级策略；（5）生成Condition等待队列；（6）应用场景

4.5 [详解Condition的await和signal等待/通知机制](https://www.buubiu.com/2020/09/13/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-Condition%E4%BB%8B%E7%BB%8D%E5%8F%8A%E5%85%B6%E7%AD%89%E5%BE%85%E9%80%9A%E7%9F%A5%E6%9C%BA%E5%88%B6/)

知识点：（1）与Object的wait/notify机制相比具有的特性；（2）与Object的wait/notify相对应的方法；（3）底层数据结构；（4）await实现原理；（5）signal/signalAll实现原理；（6）await和signal/signalAll的结合使用；

4.6 [LockSupport工具](https://www.buubiu.com/2020/09/13/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-LockSupport%E4%BB%8B%E7%BB%8D/)

知识点：（1）主要功能；（2）与synchronized阻塞唤醒相比具有的特色；

### 并发容器

5.1 [并发容器之ConcurrentHashMap(JDK 1.8版本)](https://www.buubiu.com/2020/09/13/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-ConcurrentHashMap-jdk1-8-%E4%BB%8B%E7%BB%8D/)

知识点：（1）关键属性；（2）重要内部类；（3）涉及到的CAS操作；（4）构造方法；（5）put执行流程；（6）get执行流程；（7）扩容机制；（8）用于统计size的方法的执行流程；（9）1.8版本的ConcurrentHashMap与之前版本的比较

5.2 [并发容器之CopyOnWriteArrayList](https://www.buubiu.com/2020/09/21/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-CopyOnWriteArrayList%E4%BB%8B%E7%BB%8D/)

知识点：（1）实现原理；（2）COW和ReentrantReadWriteLock的区别；（3）应用场景；（4）为什么具有弱一致性；（5）COW的缺点；

5.3 [并发容器之ConcurrentLinkedQueue](https://www.buubiu.com/2020/09/21/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-ConcurrentLinkedQueue%E4%BB%8B%E7%BB%8D/)

知识点：（1）实现原理；（2）数据结构；（3）核心方法；（4）HOPS延迟更新的设计意图

5.4 [并发容器之ThreadLocal](https://www.buubiu.com/2020/09/21/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-ThreadLocal%E4%BB%8B%E7%BB%8D/)

知识点：（1）实现原理；（2）set方法原理；（3）get方法原理；（4）remove方法原理；（5）ThreadLocalMap

5.5 [一篇文章，从源码深入详解ThreadLocal内存泄漏问题](https://www.buubiu.com/2020/09/21/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-%E8%AF%A6%E8%A7%A3threadLocal%E5%86%85%E5%AD%98%E6%B3%84%E6%BC%8F%E9%97%AE%E9%A2%98/)

知识点：（1）ThreadLocal内存泄漏原理；（2）ThreadLocal的最佳实践；（3）应用场景

5.6 [并发容器之BlockingQueue](https://www.buubiu.com/2020/09/23/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-BlockingQueue%E4%BB%8B%E7%BB%8D/)

知识点：（1）BlockingQueue的基本操作；（2）常用的BlockingQueue；

5.7 [并发容器之ArrayBlockingQueue和LinkedBlockingQueue实现原理详解](https://www.buubiu.com/2020/09/23/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-ArrayBlockingQueue%E4%B8%8ELinkedBlockingQueue%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86/)

### 线程池（Executor体系）

6.1 [线程池实现原理](https://www.buubiu.com/2020/09/23/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-%E7%BA%BF%E7%A8%8B%E6%B1%A0ThreadPoolExecutor%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86%E4%BB%8B%E7%BB%8D/)

知识点：（1）为什么要用到线程池？（2）执行流程；（3）构造器各个参数的意义；（4）如何关闭线程池；（5）如何配置线程池；

6.2 [Executors类创建四种常见线程池](https://www.buubiu.com/2020/09/23/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-Executors%E7%B1%BB%E5%88%9B%E5%BB%BA%E5%9B%9B%E7%A7%8D%E5%B8%B8%E8%A7%81%E7%BA%BF%E7%A8%8B%E6%B1%A0/)

知识点：（1）newSingleThreadExecutor；（2）newFixedThreadPool；（3）newCachedThreadPool；（4）newScheduledThreadPool；

6.3 [线程池之ScheduledThreadPoolExecutor](https://www.buubiu.com/2020/09/24/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-ScheduledThreadPoolExecutor%E4%BB%8B%E7%BB%8D/)

知识点：（1）类结构；（2）常用方法；（3）ScheduledFutureTask；（3）DelayedWorkQueue;

6.4 [FutureTask基本操作总结](https://www.buubiu.com/2020/09/24/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-FutureTask%E4%BB%8B%E7%BB%8D/)

知识点：（1）FutureTask的几种状态；（2）get方法；（3）cancel方法；（4）应用场景；（5）实现 Runnable接口

### 原子操作类

7.1 [Java中atomic包中的原子操作类总结](https://www.buubiu.com/2020/09/24/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-Java%E4%B8%ADatomic%E5%8C%85%E4%B8%AD%E7%9A%84%E5%8E%9F%E5%AD%90%E6%93%8D%E4%BD%9C%E7%B1%BB%E6%80%BB%E7%BB%93/)

知识点：（1）实现原理；（2）原子更新基本类型；（3）原子更新数组类型；（4）原子更新引用类型；（5）原子更新字段类型

### 并发工具

8.1 [并发编程-CountDownLatch与CyclicBarrier介绍](https://www.buubiu.com/2020/09/24/并发编程-CountDownLatch与CyclicBarrier介绍/)

知识点：（1）倒计时器CountDownLatch；（2）循环栅栏CyclicBarrier；（3）CountDownLatch与CyclicBarrier的比较

8.2 [并发编程-Semaphore与Exchanger介绍](https://www.buubiu.com/2020/09/24/并发编程-Semaphore与Exchanger介绍/)

知识点：（1）资源访问控制Semaphore；（2）数据交换Exchanger

### 并发实践

9.1 [并发编程-弄懂生产者和消费者问题](https://www.buubiu.com/2020/09/25/并发编程-弄懂生产者和消费者问题/)

<font color=gray size=2>参考：https://www.codercc.com/backend/basic/juc</font>

