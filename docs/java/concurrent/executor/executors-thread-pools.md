# 并发编程-Executors类创建四种常见线程池

Java里面线程池的顶级接口是Executor，Executor并不是一个线程池，而只是一个执行线程的工具。真正的线程池接口是ExecutorService。

## 线程池架构

![](executors-thread-pools-img/executors-thread-pools-overview.jpeg)

比较重要的几个类：

| 类/接口                     | 描述                                                         |
| --------------------------- | ------------------------------------------------------------ |
| ExecutorService             | 真正的线程池接口                                             |
| ScheduledExecutorService    | 和Timer/TimerTask类似，解决那些需要任务重复执行的问题        |
| ThreadPoolExecutor          | ExecutorService的默认实现                                    |
| ScheduledThreadPoolExecutor | 继承ThreadPoolExecutor的ScheduledExecutorService接口实现，周期性任务调度的类实现 |

要配置一个线程池是比较复杂的，尤其是对于线程池的原理不是很清楚的情况下，很有可能配置的线程池不是较优的，因此在Executors类里面提供了一些静态工厂，生成一些常用的线程池。

Java通过**Executors工厂类提供四种线程池**，分别为：

1. **newCachedThreadPool** ：创建一个可缓存线程池，如果线程池长度超过处理需要，可灵活回收空闲线程，若无可回收，否则新建线程。（线程最大并发数不可控制）
2. **newFixedThreadPool**：创建一个固定大小的线程池，可控制线程最大并发数，超出的线程会在队列中等待。
3. **newScheduledThreadPool** ： 创建一个定时线程池，支持定时及周期性任务执行。
4. **newSingleThreadExecutor** ：创建一个单线程化的线程池，它只会用唯一的工作线程来执行任务，保证所有任务按照指定顺序(FIFO, LIFO, 优先级)执行。

我们先创建一个统一的线程任务，方便测试四种线程池

```java
public class MyRunnable implements Runnable {

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + " is running...");
    }

}
```

## newSingleThreadExecutor

```java
public class SingleThreadExecutorTest {

    public static void main(String[] args) {
        ExecutorService executorService = Executors.newSingleThreadExecutor();
        MyRunnable myRunnable = new MyRunnable();
        for (int i = 0; i < 5; i++) {
            executorService.execute(myRunnable);
        }

        System.out.println("线程任务开始执行");
        executorService.shutdown();
    }

}
```

输出结果

```java
线程任务开始执行
pool-1-thread-1 is running...
pool-1-thread-1 is running...
pool-1-thread-1 is running...
pool-1-thread-1 is running...
pool-1-thread-1 is running...
```

底层实现

```java
/**
 * 核心线程池大小=1
 * 最大线程池大小为1
 * 线程过期时间为0ms
 * LinkedBlockingQueue作为工作队列
 */
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()));
}
```

从参数可以看出来，SingleThreadExecutor 相当于特殊的 FixedThreadPool，它的执行流程如下：

1. 线程池中没有线程时，新建一个线程执行任务
2. 有一个线程以后，将任务加入阻塞队列，不停的加
3. 唯一的这一个线程不停地去队列里取任务执行

**SingleThreadExecutor 用于串行执行任务的场景，每个任务必须按顺序执行，不需要并发执行**。

## newFixedThreadPool

```java
public class FixedThreadPoolTest {

    public static void main(String[] args) {
        ExecutorService executorService = Executors.newFixedThreadPool(2);
        MyRunnable myRunnable = new MyRunnable();
        for (int i = 0; i < 5; i++) {
            executorService.execute(myRunnable);
        }

        System.out.println("线程任务开始执行");
        executorService.shutdown();
    }

}
```

输出结果

```java
线程任务开始执行
pool-1-thread-1 is running...
pool-1-thread-1 is running...
pool-1-thread-2 is running...
pool-1-thread-1 is running...
pool-1-thread-2 is running...
```

底层实现

```java
/**
 * 核心线程池大小=传入参数
 * 最大线程池大小为传入参数
 * 线程过期时间为0ms
 * LinkedBlockingQueue作为工作队列
 */
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue<Runnable>());
}
```

可以看到，FixedThreadPool 的核心线程数和最大线程数都是指定值，也就是说当线程池中的线程数超过核心线程数后，任务都会被放到阻塞队列中。

此外 keepAliveTime 为 0，也就是多余的空余线程会被立即终止（由于这里没有多余线程，这个参数也没什么意义了）。

而这里选用的阻塞队列是 LinkedBlockingQueue，使用的是默认容量 Integer.MAX_VALUE，相当于没有上限。

因此这个线程池执行任务的流程如下：

1. 线程数少于核心线程数，也就是设置的线程数时，新建线程执行任务
2. 线程数等于核心线程数后，将任务加入阻塞队列
3. 由于队列容量非常大，可以一直加
4. 执行完任务的线程反复去队列中取任务执行

**FixedThreadPool 用于负载比较重的服务器，为了资源的合理利用，需要限制当前线程数量**。

## newCachedThreadPool

```java
public class CachedThreadPoolTest {

    public static void main(String[] args) {
        ExecutorService executorService = Executors.newCachedThreadPool();
        MyRunnable myRunnable = new MyRunnable();
        for (int i = 0; i < 5; i++) {
            executorService.execute(myRunnable);
        }

        System.out.println("线程任务开始执行");
        executorService.shutdown();
    }

}
```

输出结果

```java
线程任务开始执行
pool-1-thread-1 is running...
pool-1-thread-4 is running...
pool-1-thread-2 is running...
pool-1-thread-5 is running...
pool-1-thread-3 is running...
```

底层实现

```java
/**
 *  核心线程池大小=0
 *  最大线程池大小为Integer.MAX_VALUE
 *  线程过期时间为60s
 *  使用SynchronousQueue作为工作队列
 */
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());
}
```

可以看到，CachedThreadPool 没有核心线程，非核心线程数无上限，也就是全部使用外包，但是每个外包空闲的时间只有 60 秒，超过后就会被回收。

CachedThreadPool 使用的队列是 SynchronousQueue，这个队列的作用就是传递任务，并不会保存。

因此当提交任务的速度大于处理任务的速度时，每次提交一个任务，就会创建一个线程。极端情况下会创建过多的线程，耗尽 CPU 和内存资源。

它的执行流程如下：

1. 没有核心线程，直接向 SynchronousQueue 中提交任务
2. 如果有空闲线程，就去取出任务执行；如果没有空闲线程，就新建一个
3. 执行完任务的线程有 60 秒生存时间，如果在这个时间内可以接到新任务，就可以继续活下去，否则就拜拜
4. 由于空闲 60 秒的线程会被终止，长时间保持空闲的 CachedThreadPool 不会占用任何资源。

**CachedThreadPool 用于并发执行大量短期的小任务，或者是负载较轻的服务器**。

## newScheduledThreadPool

```java
public class ScheduledThreadPoolTest {

    public static void main(String[] args) {
        ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(3);
        MyRunnable myRunnable = new MyRunnable();
        for (int i = 0; i < 5; i++) {
            // 参数1:目标对象,参数2:隔多长时间开始执行线程,参数3:执行周期,参数4:时间单位
            scheduledExecutorService.scheduleAtFixedRate(myRunnable, 1, 2, TimeUnit.SECONDS);
        }

        System.out.println("线程任务开始执行");
    }

}
```

输出结果

```java
线程任务开始执行
// 打印【线程任务开始执行】后1秒输出
pool-1-thread-1 is running...
pool-1-thread-2 is running...
pool-1-thread-1 is running...
pool-1-thread-3 is running...
pool-1-thread-2 is running...
// 2秒后输出
pool-1-thread-1 is running...
pool-1-thread-3 is running...
pool-1-thread-2 is running...
pool-1-thread-1 is running...
pool-1-thread-3 is running...
```

底层实现

```java
/**
 * 核心线程池大小=传入参数
 * 最大线程池大小为Integer.MAX_VALUE
 * 线程过期时间为0ms
 * DelayedWorkQueue作为工作队列
 */
public ScheduledThreadPoolExecutor(int corePoolSize) {
    super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS,
          new DelayedWorkQueue());
}
```

ScheduledThreadPoolExecutor 的执行流程如下：

1. 添加一个任务
2. 线程池中的线程从 DelayQueue 中取任务
3. 然后执行任务

具体执行任务的步骤也比较复杂：

1. 线程从 DelayQueue 中获取 time 大于等于当前时间的 ScheduledFutureTask
2. 执行完后修改这个 task 的 time 为下次被执行的时间
3. 然后再把这个 task 放回队列中

**ScheduledThreadPoolExecutor 用于需要多个后台线程执行周期任务，同时需要限制线程数量的场景**。

## Executors和ThreaPoolExecutor创建线程池的区别

Executors 各个方法的弊端：

1. newFixedThreadPool 和 newSingleThreadExecutor:
   主要问题是堆积的请求处理队列可能会耗费非常大的内存，甚至 OOM。
2. newCachedThreadPool 和 newScheduledThreadPool:
   主要问题是线程数最大数是 Integer.MAX_VALUE，可能会创建数量非常多的线程，甚至 OOM。

ThreaPoolExecutor

1. 创建线程池方式只有一种，就是走它的构造函数，参数自己指定

## 两种提交任务的方法

ExecutorService 提供了两种提交任务的方法：

- execute()：提交不需要返回值的任务
- submit()：提交需要返回值的任务

### execute

```java
void execute(Runnable command);
```

execute() 的参数是一个 Runnable，也没有返回值。因此提交后无法判断该任务是否被线程池执行成功。

```java
ExecutorService executor = Executors.newCachedThreadPool();
executor.execute(new Runnable() {
    @Override
    public void run() {
        //do something
    }
});
```

### submit

```java
<T> Future<T> submit(Callable<T> task);
<T> Future<T> submit(Runnable task, T result);
Future<?> submit(Runnable task);
```

submit() 有三种重载，参数可以是 Callable 也可以是 Runnable。

同时它会返回一个 Future 对象，通过它我们可以判断任务是否执行成功。

获得执行结果调用 Future.get() 方法，这个方法会阻塞当前线程直到任务完成。

提交一个 Callable 任务时，需要使用 FutureTask 包一层：

```java
FutureTask futureTask = new FutureTask(new Callable<String>() {    //创建 Callable 任务
    @Override
    public String call() throws Exception {
        String result = "";
        //do something
        return result;
    }
});
Future<?> submit = executor.submit(futureTask);    //提交到线程池
try {
    Object result = submit.get();    //获取结果
} catch (InterruptedException e) {
    e.printStackTrace();
} catch (ExecutionException e) {
    e.printStackTrace();
```
