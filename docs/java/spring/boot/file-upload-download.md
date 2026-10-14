# SpringBoot中文件上传和下载

### 定义

上传：指的是用户将自己本地计算机中文件通过网络的形式上传到系统所在服务器上的过程，这个过程称之为文件上传。

下载：指的是用户通过网络的形式将服务器上的文件下载到自己本地计算机上的过程，称之为下载

<!--more-->

---

### 文件上传

1. 配置`application.properties`

   ```properties
   spring.resources.static-locations=classpath:/templates/,classpath:/static/,uploadfile:${uploadfile.dir}
   
   #配置上传文件大小限制(默认是10MB)
   #用来控制文件上传大小的限制
   spring.servlet.multipart.max-file-size=20MB
   #用来指定服务端最大文件大小
   spring.servlet.multipart.max-request-size=20MB
   
   #配置本地的附件存储路径
   uploadfile.dir=/Users/buubiu/uploadfile/
   ```

   

2. 开发上传页面html

   ```html
    <form action="/springboot/file/upload" method="post" enctype="multipart/form-data">
       <input type="file" name="fileName" />
       <input type="submit" value="上传文件" />
     </form>
   ```

   **注意：**

   - 表单提交方式必须是post

   - 表单的enctype属性必须为multipart/form-data

   - 后台接受变量名字要与文件选择name属性一致

3. 开发控制器

   ```java
   @Value("${uploadfile.dir}")
   private String uploadfile;
   
   @PostMapping("upload")
   public String upload(MultipartFile fileName, HttpServletRequest request) throws IOException {
     //文件上传
     System.out.println("文件名：" + fileName.getOriginalFilename());
     System.out.println("文件类型：" + fileName.getContentType());
     System.out.println("文件大小：" + fileName.getSize());
   
     //生成当天日期目录
     LocalDate now = LocalDate.now();
     int year = now.getYear();
     int monthValue = now.getMonthValue();
     int dayOfMonth = now.getDayOfMonth();
     String datePath = year+"/"+monthValue+"/"+dayOfMonth;
   
     //处理文件上传
     File dir = new File(uploadfile+datePath);
     if (!dir.exists()) {
       dir.mkdirs();
     }
     //修改文件名
     String currentTime= LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
     String newFileNamePrefix = currentTime + UUID.randomUUID().toString();
   
     String extension = FilenameUtils.getExtension(fileName.getOriginalFilename());
     fileName.transferTo(new File(dir, newFileNamePrefix + "."+extension));
     return "redirect:/upload.html";
   }
   ```

---

### 文件下载

1. 开发页面

   ```html
   <a href="/springboot_07/file/down?fileName=jquery-3.5.1.min.js">jquery-3.5.1.min.js</a>
   ```

2. 开发控制器

   ```java
   @Value("${uploadfile.dir}")
   private String uploadfile;
   //文件下载
   @GetMapping("down")
   public void down(String openStyle, String fileName, HttpServletResponse response) throws IOException {
   
     openStyle = openStyle == null ? "attachment" : "inline";
   
     //读取文件
     File file = new File(uploadfile, fileName);
     //读取文件输入流
     FileInputStream is = new FileInputStream(file);
     //获取响应输出流
     response.setContentType("text/plain;charset=UTF-8");
     response.setHeader("content-disposition",
                        openStyle + ";fileName=" + URLEncoder.encode(fileName, "UTF-8"));
     ServletOutputStream os = response.getOutputStream();
     //文件拷贝
     IOUtils.copy(is, os);
     //关闭资源
     IOUtils.closeQuietly(is);
     IOUtils.closeQuietly(os);
   }
   ```

   

