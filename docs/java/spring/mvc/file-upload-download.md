# SpringMVC中文件上传和下载

### 定义

上传：指的是用户将自己本地计算机中文件通过网络的形式上传到系统所在服务器上的过程，这个过程称之为文件上传。

下载：指的是用户通过网络的形式将服务器上的文件下载到自己本地计算机上的过程，称之为下载

<!--more-->

---

### SpringMVC中如何开发文件上传

1. 在系统中开发一个可以进行上传文件的上传页面，包含一个form表单，在表单中开发一个可以选择本地计算机文件的入口

2. form表单要求

   1. form的**method提交方式必须是post**
   2. 修改form的**enctype**
      - application/x-www.form-urlencoded 代表 文本 提交
      - multipart/form-data 代表 二进制 提交

   ```html
   <form action="${pageContext.request.contextPath}/file/upload" method="post" enctype="multipart/form-data">
     <input type="file" name="img"/>
     <input type="submit" value="上传文件">
   </form>
   ```

   3. 开发controller 在控制器方法中使用 `MultipartFile` 进行文件的接收

   4. 在SpringMVC配置文件中加入文件上传解析器配置

      ```xml
      <!--配置文件上传解析器
            id:必须指定为 multipartResolver
        -->
        <bean class="org.springframework.web.multipart.commons.CommonsMultipartResolver"
          id="multipartResolver"/>
      ```

      **要求：文件上传解析器必须存在id，且 id必须为multipartResolver**

   5. 引入文件上传的相关依赖

      ```xml
      <dependency>
        <groupId>commons-fileupload</groupId>
        <artifactId>commons-fileupload</artifactId>
        <version>1.4</version>
      </dependency>
      ```

### 如何修改文件上传时文件的原始名称

1. 分隔符

   ```java
   String fileName = "name.aa.txt";
   //1.分隔符
   String[] split = fileName.split("\\.");
   System.out.println(split[split.length-1]);
   
   ------结果----
   txt
   ```

2. 字符串拆分

   ```java
   String fileName = "name.aa.txt";
   
   //2.字符串拆分
   int i = fileName.lastIndexOf(".");
   System.out.println(fileName.substring(i));
   
   ------结果----
   .txt
   ```

3. 工具类

   ```java
   String fileName = "name.aa.txt";
   
   //3.工具类 common-fileupload
   String extension = FilenameUtils.getExtension(fileName);
   System.out.println(extension);
   
   ------结果----
   txt
   ```

   
### 将用户上传的文件放入当天日期目录中

   ```java
   //1.生成当天日期目录
   LocalDate now = LocalDate.now();
   int year = now.getYear();
   int month = now.getMonthValue();
   int day = now.getDayOfMonth();
   String path = year+"/"+month+"/"+day;
   File dateDir = new File(realPath, path);
   if (!dateDir.exists()) {
     dateDir.mkdir();
   }
   //2.将文件上传到upload对应路径
	 // MultipartFile img;
   img.transferTo(new File(dateDir, fileName));
   ```

### springmvc中解决文件上传大小的限制

**注意：在SpringMVC中默认不限制上传文件的大小；而在struts2中默认上传文件最大不超过2M**

```xml
<bean class="org.springframework.web.multipart.commons.CommonsMultipartResolver"
      id="multipartResolver">
  <!--注入文件上传下载大小限制  单位：字节 2M=2097152字节  默认：没有限制-->
  <property name="maxUploadSize" value="2097152"/>
</bean>
```

### SpringMVC中开发文件下载

事例代码：

```java

/**
	 * 用来处理文件下载 请求响应输出流
	 * @param fileName
	 * @param request
	 * @param response
	 * @throws IOException
*/
@RequestMapping("down")
public void download(String openStyle,String fileName, HttpServletRequest request,
                     HttpServletResponse response) throws IOException {

  openStyle = openStyle == null ? "inline" : "attachment";

  System.out.println("下载的文件名：" + fileName);
  //1.根据下载相对目录获取下载目录在服务器部署之后的绝对目录
  String realPath = request.getSession().getServletContext().getRealPath("/down");
  //2.通过文件输入流读取文件
  FileInputStream is = new FileInputStream(new File(realPath, fileName));

  //3.获取响应输出流
  // 3.1 设置字符编码
  response.setContentType("text/plain;charset=UTF-8");
  //3.2 设置为附件下载而不是在线打开
  //默认是  inline-在线打开；attachment--附件下载
  response.setHeader("content-disposition", openStyle+";fileName=" + fileName + URLEncoder.encode(fileName,"UTF-8"));
  //4 处理下载流复制
  ServletOutputStream os = response.getOutputStream();

  //工具类写法//操作流的用IOUtils  操作文件用FileUtils
  IOUtils.copy(is, os);
  IOUtils.closeQuietly(is);
  IOUtils.closeQuietly(os);
  //传统写法
  /*		int len;
		byte[] b = new byte[1024];
		while (true) {
			len = is.read(b);
			if (len == -1) {
				break;
			}
			os.write(b, 0,len);
		}
		//释放资源
		is.close();
		os.close();*/
}
```
