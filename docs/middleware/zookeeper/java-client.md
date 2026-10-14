# Zookeeper的Java客户端操作

Java客户端操作zk非常简单，只需要引入zkclient依赖就可以了，然后编写代码，不过一般项目中不需要我们原生操作zk，一些框架都自带了对zk的操作。

----

## 引入依赖

```xml
<!--junit-->
<dependency>
  <groupId>junit</groupId>
  <artifactId>junit</artifactId>
  <version>4.13</version>
  <scope>provided</scope>
</dependency>

<!--引入zkclient依赖--> 
<dependency>
  <groupId>com.101tec</groupId>
  <artifactId>zkclient</artifactId>
  <version>0.10</version>
</dependency>
```

----

## 编写测试类

### 初始化客户端对象

```java
package com.buubiu.test;

import org.I0Itec.zkclient.ZkClient;
import org.I0Itec.zkclient.serialize.SerializableSerializer;
import org.junit.After;
import org.junit.Before;

/**
 * @author buubiu
 **/
public class TestZKClient {

	private ZkClient zkClient;

	/**
	 * 初始化客户端对象
	 */
	@Before
	public void before() {
		/**
		 * 参数1：zkserver服务器的ip地址和端口号
		 * 参数2：会话超时时间 毫秒
		 * 参数3：连接超时时间 毫秒
		 * 参数4：序列化方式 我们创建的对象是怎么样的方式存储在zk中的，一般采用zk提供的jdk的方式 new SerializableSerializer()
		 */
		zkClient = new ZkClient("192.168.91.4:2181", 60000 * 30, 60000, new SerializableSerializer());
	}

	/**
	 * 释放资源
	 */
	@After
	public void after() {
		zkClient.close();
	}
}

```

----

### 创建zk节点

```java
package com.buubiu.test;

import org.I0Itec.zkclient.ZkClient;
import org.I0Itec.zkclient.serialize.SerializableSerializer;
import org.apache.zookeeper.CreateMode;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 * @author buubiu
 **/
public class TestZKClient {

	private ZkClient zkClient;

	/**
	 * 初始化客户端对象
	 */
	@Before
	public void before() {
		/**
		 * 参数1：zkserver服务器的ip地址和端口号
		 * 参数2：会话超时时间 毫秒
		 * 参数3：连接超时时间 毫秒
		 * 参数4：序列化方式 我们创建的对象是怎么样的方式存储在zk中的，一般采用zk提供的jdk的方式 new SerializableSerializer()
		 */
		zkClient = new ZkClient("192.168.91.4:2181", 60000 * 30, 60000, new SerializableSerializer());
	}

	/**
	 * 释放资源
	 */
	@After
	public void after() throws InterruptedException {
		Thread.sleep(5000);
		zkClient.close();
	}

	/**
	 * 在zk创建节点
	 */
	@Test
	public void testCreateNode() {
		//1.持久节点
		zkClient.create("/node", "q_buubiu", CreateMode.PERSISTENT);
		//2.持久顺序节点
		zkClient.create("/node/qs_node", "qs_buubiu", CreateMode.PERSISTENT_SEQUENTIAL);
		//3.临时节点
		zkClient.create("/node/e_node", "e_buubiu", CreateMode.EPHEMERAL);
		//4.临时顺序节点
		zkClient.create("/node/es_node", "es_buubiu", CreateMode.EPHEMERAL_SEQUENTIAL);
	}
}

```

```sh
[zk: localhost:2181(CONNECTED) 22] ls /
[node, zookeeper]
[zk: localhost:2181(CONNECTED) 23] ls /node
[e_node, es_node0000000002, qs_node0000000000]
[zk: localhost:2181(CONNECTED) 24] ls /node
[qs_node0000000000]
[zk: localhost:2181(CONNECTED) 25]
```

----

### 删除zk节点

```java
package com.buubiu.test;

import org.I0Itec.zkclient.ZkClient;
import org.I0Itec.zkclient.serialize.SerializableSerializer;
import org.apache.zookeeper.CreateMode;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 * @author buubiu
 **/
public class TestZKClient {

	private ZkClient zkClient;

	/**
	 * 初始化客户端对象
	 */
	@Before
	public void before() {
		/**
		 * 参数1：zkserver服务器的ip地址和端口号
		 * 参数2：会话超时时间 毫秒
		 * 参数3：连接超时时间 毫秒
		 * 参数4：序列化方式 我们创建的对象是怎么样的方式存储在zk中的，一般采用zk提供的jdk的方式 new SerializableSerializer()
		 */
		zkClient = new ZkClient("192.168.91.4:2181", 60000 * 30, 60000, new SerializableSerializer());
	}

	/**
	 * 释放资源
	 */
	@After
	public void after() throws InterruptedException {
		//Thread.sleep(5000);
		zkClient.close();
	}

	/**
	 * 删除zk节点
	 */
	@Test
	public void testDeleteNode() {
		//删除没有子节点的节点  返回值：是否删除成功
		//boolean delete = zkClient.delete("/node");
		//System.out.println(delete);

		//递归删除节点信息  返回值：是否删除成功
		boolean recursive = zkClient.deleteRecursive("/node");
		System.out.println(recursive);
	}
}
/**
true

true
**/
```

----

### 查询当前节点下的所有子节点

```java
package com.buubiu.test;

import java.util.List;
import org.I0Itec.zkclient.ZkClient;
import org.I0Itec.zkclient.serialize.SerializableSerializer;
import org.apache.zookeeper.CreateMode;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 * @author buubiu
 **/
public class TestZKClient {

	private ZkClient zkClient;

	/**
	 * 初始化客户端对象
	 */
	@Before
	public void before() {
		/**
		 * 参数1：zkserver服务器的ip地址和端口号
		 * 参数2：会话超时时间 毫秒
		 * 参数3：连接超时时间 毫秒
		 * 参数4：序列化方式 我们创建的对象是怎么样的方式存储在zk中的，一般采用zk提供的jdk的方式 new SerializableSerializer()
		 */
		zkClient = new ZkClient("192.168.91.4:2181", 60000 * 30, 60000, new SerializableSerializer());
	}

	/**
	 * 释放资源
	 */
	@After
	public void after() throws InterruptedException {
		//Thread.sleep(5000);
		zkClient.close();
	}

	/**
	 * 查询当前节点下的所有子节点
	 */
	@Test
	public void testFindNodes() {
		//获取指定路径的节点信息 返回值：当前节点下的所有子节点信息
		List<String> children = zkClient.getChildren("/");
		for (String child : children) {
			System.out.println(child);
		}
	}
}
/**
node4
node
node2
node3
zookeeper
node1
**/
```

----

### 查看某个节点数据

**注意：通过Java客户端操作需要保证节点存储的数据和获取节点时的数据序列化方式必须一致**

```java
package com.buubiu.test;

import java.util.List;
import org.I0Itec.zkclient.ZkClient;
import org.I0Itec.zkclient.serialize.SerializableSerializer;
import org.apache.zookeeper.CreateMode;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 * @author buubiu
 **/
public class TestZKClient {

	private ZkClient zkClient;

	/**
	 * 初始化客户端对象
	 */
	@Before
	public void before() {
		/**
		 * 参数1：zkserver服务器的ip地址和端口号
		 * 参数2：会话超时时间 毫秒
		 * 参数3：连接超时时间 毫秒
		 * 参数4：序列化方式 我们创建的对象是怎么样的方式存储在zk中的，一般采用zk提供的jdk的方式 new SerializableSerializer()
		 */
		zkClient = new ZkClient("192.168.91.4:2181", 60000 * 30, 60000, new SerializableSerializer());
	}

	/**
	 * 释放资源
	 */
	@After
	public void after() throws InterruptedException {
		//Thread.sleep(5000);
		zkClient.close();
	}

	/**
	 * 查看某个节点数据
	 */
	@Test
	public void testFindNodeData() {
		Object readData = zkClient.readData("/node");
		System.out.println(readData);
	}
}
/**
q_buubiu
**/
```

----

### 查看节点状态信息

```java
package com.buubiu.test;

import java.util.List;
import org.I0Itec.zkclient.ZkClient;
import org.I0Itec.zkclient.serialize.SerializableSerializer;
import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.data.Stat;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 * @author buubiu
 **/
public class TestZKClient {

	private ZkClient zkClient;

	/**
	 * 初始化客户端对象
	 */
	@Before
	public void before() {
		/**
		 * 参数1：zkserver服务器的ip地址和端口号
		 * 参数2：会话超时时间 毫秒
		 * 参数3：连接超时时间 毫秒
		 * 参数4：序列化方式 我们创建的对象是怎么样的方式存储在zk中的，一般采用zk提供的jdk的方式 new SerializableSerializer()
		 */
		zkClient = new ZkClient("192.168.91.4:2181", 60000 * 30, 60000, new SerializableSerializer());
	}

	/**
	 * 释放资源
	 */
	@After
	public void after() throws InterruptedException {
		//Thread.sleep(5000);
		zkClient.close();
	}

	/**
	 * 查看节点数据和状态信息
	 */
	@Test
	public void testFindNodeDataAndStat() {
		Stat stat = new Stat();
		Object readData = zkClient.readData("/node", stat);
		System.out.println(readData);
		System.out.println(stat);
		System.out.println(stat.getAversion());
		System.out.println(stat.getCtime());
		System.out.println(stat.getCzxid());
	}
}

/**
q_buubiu
62,62,1618705866499,1618705866499,0,5,0,0,15,1,66

0
1618705866499
62
**/
```

----

### 修改节点信息

**注意：必须修改通过Java客户端创建的节点，通过命令行创建的节点无法修改成功**

```java
package com.buubiu.test;

import com.buubiu.entity.User;
import java.util.Date;
import java.util.List;
import org.I0Itec.zkclient.ZkClient;
import org.I0Itec.zkclient.serialize.SerializableSerializer;
import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.data.Stat;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 * @author buubiu
 **/
public class TestZKClient {

	private ZkClient zkClient;

	/**
	 * 初始化客户端对象
	 */
	@Before
	public void before() {
		/**
		 * 参数1：zkserver服务器的ip地址和端口号
		 * 参数2：会话超时时间 毫秒
		 * 参数3：连接超时时间 毫秒
		 * 参数4：序列化方式 我们创建的对象是怎么样的方式存储在zk中的，一般采用zk提供的jdk的方式 new SerializableSerializer()
		 */
		zkClient = new ZkClient("192.168.91.4:2181", 60000 * 30, 60000, new SerializableSerializer());
	}

	/**
	 * 释放资源
	 */
	@After
	public void after() throws InterruptedException {
		//Thread.sleep(5000);
		zkClient.close();
	}

	/**
	 * 修改节点信息
	 * 注意：必须修改通过Java客户端创建的节点，通过命令行创建的节点无法修改成功
	 */
	@Test
	public void testWriteData() {
		User user = new User();
		user.setId(1);
		user.setName("buubiu");
		user.setAge(22);
		user.setBir(new Date());
		zkClient.writeData("/node", user);

		User readData = zkClient.readData("/node");
		System.out.println(readData.toString());
	}
}
/**
User{id=1, name='buubiu', age=22, bir=Sun Apr 18 00:49:29 CST 2021}
**/
```

----

### 监听节点数据变化

注意：

1.  Java客户端监听跟命令行监听不一样，Java客户端是一直监听着
2. Java程序必须一直运行着才能监听到
  3. 必须通过Java代码进行修改节点数据才能被监听到，通过命令行修改是无法监听的

```java
package com.buubiu.test;

import com.buubiu.entity.User;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import org.I0Itec.zkclient.IZkDataListener;
import org.I0Itec.zkclient.ZkClient;
import org.I0Itec.zkclient.serialize.SerializableSerializer;
import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.data.Stat;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 * @author buubiu
 **/
public class TestZKClient {

	private ZkClient zkClient;

	/**
	 * 初始化客户端对象
	 */
	@Before
	public void before() {
		/**
		 * 参数1：zkserver服务器的ip地址和端口号
		 * 参数2：会话超时时间 毫秒
		 * 参数3：连接超时时间 毫秒
		 * 参数4：序列化方式 我们创建的对象是怎么样的方式存储在zk中的，一般采用zk提供的jdk的方式 new SerializableSerializer()
		 */
		zkClient = new ZkClient("192.168.91.4:2181", 60000 * 30, 60000, new SerializableSerializer());
	}

	/**
	 * 释放资源
	 */
	@After
	public void after() throws InterruptedException {
		//Thread.sleep(5000);
		zkClient.close();
	}

	/**
	 * 监听节点数据变化
	 * 注意：1. Java客户端监听跟命令行监听不一样，Java客户端是一直监听着
	 * 2. Java程序必须一直运行着才能监听到
	 * 3. 必须通过Java代码进行修改节点数据才能被监听到，通过命令行修改是无法监听的
	 */
	@Test
	public void testWatchDataChange() throws IOException {
		zkClient.subscribeDataChanges("/node", new IZkDataListener() {
			//当前节点数据变化时触发这个方法
			public void handleDataChange(String dataPath, Object data) throws Exception {
				System.out.println("节点数据被修改了：");
				System.out.println("当前节点路径：" + dataPath);
				System.out.println("当前节点变化后数据：" + data);
			}
			//当前节点删除数据时，触发这个方法
			public void handleDataDeleted(String dataPath) throws Exception {
				System.out.println("节点数据被删除了：");
				System.out.println("当前节点路径：" + dataPath);
			}
		});
		//阻塞客户端
		System.in.read();
	}
}
/**
节点数据被修改了：
当前节点路径：/node
当前节点变化后数据：User{id=1, name='buubiu', age=22, bir=Sun Apr 18 23:14:59 CST 2021}

节点数据被删除了：
当前节点路径：/node
**/
```

----

###  监听节点目录的变化

注意：

1. Java客户端监听跟命令行监听不一样，Java客户端是一直监听着
2. Java程序必须一直运行着才能监听到
3. 监听目录既可以监听通过Java客户端操作，也可以监听通过命令行的操作

```java
package com.buubiu.test;

import com.buubiu.entity.User;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import org.I0Itec.zkclient.IZkChildListener;
import org.I0Itec.zkclient.IZkDataListener;
import org.I0Itec.zkclient.ZkClient;
import org.I0Itec.zkclient.serialize.SerializableSerializer;
import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.data.Stat;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 * @author buubiu
 **/
public class TestZKClient {

	private ZkClient zkClient;

	/**
	 * 初始化客户端对象
	 */
	@Before
	public void before() {
		/**
		 * 参数1：zkserver服务器的ip地址和端口号
		 * 参数2：会话超时时间 毫秒
		 * 参数3：连接超时时间 毫秒
		 * 参数4：序列化方式 我们创建的对象是怎么样的方式存储在zk中的，一般采用zk提供的jdk的方式 new SerializableSerializer()
		 */
		zkClient = new ZkClient("192.168.91.4:2181", 60000 * 30, 60000, new SerializableSerializer());
	}

	/**
	 * 释放资源
	 */
	@After
	public void after() throws InterruptedException {
		//Thread.sleep(5000);
		zkClient.close();
	}

	/**
	 * 监听节点目录的变化
	 * 注意：1. Java客户端监听跟命令行监听不一样，Java客户端是一直监听着
	 * 2. Java程序必须一直运行着才能监听到
	 * 3.监听目录既可以监听通过Java客户端操作，也可以监听通过命令行的操作
	 */
	@Test
	public void testOnNodesChange() throws IOException {
		zkClient.subscribeChildChanges("/node", new IZkChildListener() {
			//当节点目录发生变化时调用这个方法
			//参数1：父节点路径
			//参数2：父节点中的所有子节点名称
			public void handleChildChange(String parentPath, List<String> currentChilds)
				throws Exception {
				System.out.println("父节点路径：" + parentPath);
				System.out.println("发生变更后，所有子节点的路径：");
				for (String currentChild : currentChilds) {
					System.out.println(currentChild);
				}
			}
		});
		//阻塞客户端
		System.in.read();
	}
}
/**
父节点路径：/node
发生变更后，所有子节点的路径：
qs_node0000000003
qs_node0000000000
node1
qs_node0000000006
**/
```
