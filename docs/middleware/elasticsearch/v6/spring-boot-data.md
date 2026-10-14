# SpringBoot Data操作ElasticSearch

##  引入依赖

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
</dependency>
```

##  配置es客户端

- spring-data(2~3.x版本配置)  

```yml
spring:
  data:
    elasticsearch:
      cluster-nodes: 127.0.0.1:9300
```

- spring-data(新版本推荐配置)  RestHighLevelClient  rest客户端     ElasticSearchRespositoy接口

```java
/**
 * @author buubiu
 **/
@Configuration
public class ElasticSearchRestClientConfig extends AbstractElasticsearchConfiguration {

	//这个client用来替换transportClient(9300)对象
	@Override
	@Bean
	public RestHighLevelClient elasticsearchClient() {
		//定义客户端配置对象 RestClient 9200
		final ClientConfiguration clientConfiguration = ClientConfiguration.builder()
			.connectedTo("127.0.0.1:9200")
			.build();
		//通过RestClients对象创建
		return RestClients.create(clientConfiguration).rest();
	}
}
```

##  RestHighLevelClient进行操作索引记录

###  删除记录

```java
@Autowired
private RestHighLevelClient restHighLevelClient;

@Test
public void testDelete() throws IOException {

   //参数1：索引 参数2：类型 参数3：删除id
   DeleteRequest deleteRequest = new DeleteRequest("buubiu", "user", "Ulqak3YBZ23tdxk-f2fE");
   DeleteResponse deleteResponse = restHighLevelClient
      .delete(deleteRequest, RequestOptions.DEFAULT);
   System.out.println("deleteResponse.status() = " + deleteResponse.status());
}
```

###  添加记录

```java
@Test
public void testAddIndex() throws IOException {
   IndexRequest indexRequest = new IndexRequest("buubiu", "user", "12");
   indexRequest.source("{\"name\":\"小张\",\"age\":22}", XContentType.JSON);
   IndexResponse indexResponse = restHighLevelClient.index(indexRequest, RequestOptions.DEFAULT);
   System.out.println("indexResponse.status() = " + indexResponse.status());
}
```

###  查询记录

```java
@Test
public void testSearch() throws IOException {
  SearchRequest searchRequest = new SearchRequest("buubiu");
  //搜索构建对象
  SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
  searchSourceBuilder.query(QueryBuilders.matchAllQuery())//执行查询条件
    .from(0)//起始条数
    .size(20)//每页展示记录数
    .postFilter(QueryBuilders.matchAllQuery())//过滤条件
    .sort("age", SortOrder.DESC)//排序
    .highlighter(new HighlightBuilder().field("*").requireFieldMatch(false));//高亮
  //创建搜索请求
  searchRequest.types("user").source(searchSourceBuilder);

  SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);

  System.out.println(
    "符合条件的文档总数 = " + searchResponse.getHits().getTotalHits());
  System.out.println(
    "符合条件的文档最大得分 = " + searchResponse.getHits().getMaxScore());
  SearchHit[] hits = searchResponse.getHits().getHits();
  for (SearchHit hit : hits) {
    System.out.println("hit = " + hit);
  }
}
```

###  更新记录

```java
@Test
public void testUpdate() throws IOException {
   UpdateRequest updateRequest = new UpdateRequest("buubiu","user","12");
   updateRequest.doc("{\"name\":\"里斯\",\"age\":33}",XContentType.JSON);
   UpdateResponse updateResponse = restHighLevelClient.update(updateRequest, RequestOptions.DEFAULT);
   System.out.println("updateResponse.status() = " + updateResponse.status());
}
```

###  批量操作记录

```java
@Test
public void testBulk() throws IOException {
   BulkRequest bulkRequest = new BulkRequest();

   //添加
   IndexRequest indexRequest = new IndexRequest("buubiu", "user", "11");
   indexRequest.source("{\"name\":\"王武\",\"age\":33}", XContentType.JSON);
   bulkRequest.add(indexRequest);
   //删除
   DeleteRequest deleteRequest = new DeleteRequest("buubiu", "user", "12");
   bulkRequest.add(deleteRequest);
   //修改
   UpdateRequest updateRequest = new UpdateRequest("buubiu", "user", "11");
   updateRequest.doc("{\"name\":\"王无\",\"age\":55}",XContentType.JSON);
   bulkRequest.add(updateRequest);
   BulkResponse bulkItemResponses = restHighLevelClient.bulk(bulkRequest, RequestOptions.DEFAULT);
   BulkItemResponse[] items = bulkItemResponses.getItems();
   for (BulkItemResponse item : items) {
      System.out.println("item.status() = " + item.status());
   }
}
```

###  高亮查询

```java
//高亮查询
@Test
public void testSearchQueryHighlight() throws IOException, ParseException {

  //创建搜索请求
  SearchRequest searchRequest = new SearchRequest("buubiu");

  //创建搜索对象
  SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
  searchSourceBuilder.query(QueryBuilders.termQuery("content", "日本"))//设置条件
    .sort("age", SortOrder.DESC)//排序
    .from(0)//起始条数（当前页-1）*size 的值
    .size(20)//每页展示条数
    .highlighter(new HighlightBuilder().field("*").requireFieldMatch(false).preTags("<span style='color:red'>").postTags("</span>"));

  searchRequest.types("user").source(searchSourceBuilder);
  SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
  SearchHit[] searchHits = searchResponse.getHits().getHits();

  List<User> users = new ArrayList<>();
  for (SearchHit searchHit : searchHits) {
    //原始文档
    Map<String, Object> sourceAsMap = searchHit.getSourceAsMap();
    User user = new User();
    user.setId(searchHit.getId());
    user.setAge(Integer.parseInt(sourceAsMap.get("age").toString()));
    user.setBir(new SimpleDateFormat("yyyy-MM-dd").parse(sourceAsMap.get("bir").toString()));
    user.setContent(sourceAsMap.get("content").toString());
    user.setAddress(sourceAsMap.get("address").toString());

    //高亮字段
    Map<String, HighlightField> highlightFields = searchHit.getHighlightFields();
    if (highlightFields.containsKey("content")) {
      user.setContent(highlightFields.get("content").fragments()[0].toString());
    }
    if (highlightFields.containsKey("name")) {
      user.setName(highlightFields.get("name").fragments()[0].toString());
    }
    if (highlightFields.containsKey("address")) {
      user.setAddress(highlightFields.get("address").fragments()[0].toString());
    }

    //放入集合
    users.add(user);
  }
  users.forEach(user -> System.out.println("user = " + user));
}
```

##  Repository操作索引记录

###  创建记录对应的实体类

```java
/**
 * @author buubiu
 **/
@Data
/**
 *  用在类上 作用：将User的对象映射成ES中的一条json格式文档
 *  	indexName：用来指定这个对象转为json文档存入哪个索引中 要求：ES服务器中之前不能存在此索引名
 *  	type	 ：用来指定在当前这个索引下面创建的类型名称
 */
@Document(indexName = "buubiu",type = "User")
public class User {

	@Id //用来将对象中id属性与文档中_id一一对应
	private String id;
	//用在属性上 代表mapping中一个属性 一个字段  type属性：用来指定字段类型 analyzer：指定分词器
	@Field(type = FieldType.Text,analyzer = "ik_max_word")
	private String name;
	@Field(type = FieldType.Integer)
	private Integer age;
	@Field(type = FieldType.Date)
	private Date bir;
	@Field(type = FieldType.Text,analyzer = "ik_max_word")
	private String content;
	@Field(type = FieldType.Text,analyzer = "ik_max_word")
	private String address;

}
```

###  创建实体类的接口类

```java
/**
 * @author buubiu
 * 自定义UserRespository
 **/
public interface UserRepository extends ElasticsearchRepository<User,String> {

}
```

###  在业务中操作索引

####  添加记录

```java
/**
 * @author buubiu
 **/
@SpringBootTest
public class TestUserRepository {

   @Autowired
   private UserRepository userRepository;

   //添加记录
   @Test
   public void testSave() {
      User user = new User();
      user.setId(UUID.randomUUID().toString());
      user.setName("张三");
      user.setBir(new Date());
      user.setAge(55);
      user.setAddress("日本");
      user.setContent("日本是个好地方！");
      userRepository.save(user);
   }
}
```

####  更新记录

```java
/**
 * @author buubiu
 **/
@SpringBootTest
public class TestUserRepository {

	@Autowired
	private UserRepository userRepository;

	//更新记录
	@Test
	public void testUpdate() {
		User user = new User();
		user.setId("73a2e5f1-824c-47ba-b4a5-bea4ee486eb8");
		user.setName("张三333");
		user.setBir(new Date());
		user.setAge(52);
		user.setAddress("日本3");
		user.setContent("日本是个好地方3！");
		userRepository.save(user);
	}
}
```

####  删除记录

```java
/**
 * @author buubiu
 **/
@SpringBootTest
public class TestUserRepository {

	@Autowired
	private UserRepository userRepository;

	//删除记录
	@Test
	public void testDelete() {
		userRepository.deleteById("73a2e5f1-824c-47ba-b4a5-bea4ee486eb8");
	}
}
```

####  删除所有

```java
/**
 * @author buubiu
 **/
@SpringBootTest
public class TestUserRepository {

   @Autowired
   private UserRepository userRepository;

   //删除所有
   @Test
   public void testDeleteAll() {
      userRepository.deleteAll();
   }
}
```

####  查询一条记录

```java
/**
 * @author buubiu
 **/
@SpringBootTest
public class TestUserRepository {

   @Autowired
   private UserRepository userRepository;

   //查询一条记录
   @Test
   public void testFindOne() {
      Optional<User> optionalUser = userRepository.findById("7989eff8-f461-4242-98e4-d223eb6d20c8");
      System.out.println("optionalUser.get() = " + optionalUser.get());
   }
}
```

####  查询所有

```java
/**
 * @author buubiu
 **/
@SpringBootTest
public class TestUserRepository {

   @Autowired
   private UserRepository userRepository;

   //查询所有 排序
    @Test
    public void testFindAll() {
      Iterable<User> all = userRepository.findAll(Sort.by(Sort.Order.asc("age")));
      all.forEach(user -> System.out.println("user = " + user));
    }
}
```

####  分页查询

```java
/**
 * @author buubiu
 **/
@SpringBootTest
public class TestUserRepository {

   @Autowired
   private UserRepository userRepository;

   //分页查询
   @Test
   public void testFindPage() {
      //PageRequest.of 参数1：当前页 0 1 2 参数2：每页多少数据
      Page<User> search = userRepository
         .search(QueryBuilders.matchAllQuery(), PageRequest.of(0, 20));
      search.forEach(user -> System.out.println("user = " + user));
   }
}
```

###  自定义查询

| Keyword               | Sample                                            | Elasticsearch Query String                                   |
| --------------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| `And`                 | `findByNameAndPrice`                              | `{"bool" : {"must" : [ {"field" : {"name" : "?"}}, {"field" : {"price" : "?"}} ]}}` |
| `Or`                  | `findByNameOrPrice`                               | `{"bool" : {"should" : [ {"field" : {"name" : "?"}}, {"field" : {"price" : "?"}} ]}}` |
| `Is`                  | `findByName`                                      | `{"bool" : {"must" : {"field" : {"name" : "?"}}}}`           |
| `Not`                 | `findByNameNot`                                   | `{"bool" : {"must_not" : {"field" : {"name" : "?"}}}}`       |
| `Between`             | `findByPriceBetween`                              | `{"bool" : {"must" : {"range" : {"price" : {"from" : ?,"to" : ?,"include_lower" : true,"include_upper" : true}}}}}` |
| `LessThanEqual`       | `findByPriceLessThan`                             | `{"bool" : {"must" : {"range" : {"price" : {"from" : null,"to" : ?,"include_lower" : true,"include_upper" : true}}}}}` |
| `GreaterThanEqual`    | `findByPriceGreaterThan`                          | `{"bool" : {"must" : {"range" : {"price" : {"from" : ?,"to" : null,"include_lower" : true,"include_upper" : true}}}}}` |
| `Before`              | `findByPriceBefore`                               | `{"bool" : {"must" : {"range" : {"price" : {"from" : null,"to" : ?,"include_lower" : true,"include_upper" : true}}}}}` |
| `After`               | `findByPriceAfter`                                | `{"bool" : {"must" : {"range" : {"price" : {"from" : ?,"to" : null,"include_lower" : true,"include_upper" : true}}}}}` |
| `Like`                | `findByNameLike`                                  | `{"bool" : {"must" : {"field" : {"name" : {"query" : "?*","analyze_wildcard" : true}}}}}` |
| `StartingWith`        | `findByNameStartingWith`                          | `{"bool" : {"must" : {"field" : {"name" : {"query" : "?*","analyze_wildcard" : true}}}}}` |
| `EndingWith`          | `findByNameEndingWith`                            | `{"bool" : {"must" : {"field" : {"name" : {"query" : "*?","analyze_wildcard" : true}}}}}` |
| `Contains/Containing` | `findByNameContaining`                            | `{"bool" : {"must" : {"field" : {"name" : {"query" : "**?**","analyze_wildcard" : true}}}}}` |
| `In`                  | `findByNameIn`<br>`(Collection<String>names)`     | `{"bool" : {"must" : {"bool" : {"should" : [ {"field" : {"name" : "?"}}, {"field" : {"name" : "?"}} ]}}}}` |
| `NotIn`               | `findByNameNotIn`<br/>`(Collection<String>names)` | `{"bool" : {"must_not" : {"bool" : {"should" : {"field" : {"name" : "?"}}}}}}` |
| `Near`                | `findByStoreNear`                                 | `Not Supported Yet !`                                        |
| `True`                | `findByAvailableTrue`                             | `{"bool" : {"must" : {"field" : {"available" : true}}}}`     |
| `False`               | `findByAvailableFalse`                            | `{"bool" : {"must" : {"field" : {"available" : false}}}}`    |
| `OrderBy`             | `findByAvailable`<br>`TrueOrderByNameDesc`        | `{"sort" : [{ "name" : {"order" : "desc"} }],"bool" : {"must" : {"field" : {"available" : true}}}}` |

####  编写实体类接口

```java
/**
 * @author buubiu
 * 自定义UserRespository
 **/
public interface UserRepository extends ElasticsearchRepository<User,String> {

   //根据姓名查询
   List<User> findByName(String name);

   //根据年龄查询
   List<User> findByAge(Integer age);

   //根据姓名和地址和年龄查询，后面可以and无数个字段
   List<User> findByNameAndAddressAndAge(String name, String address, Integer age);

   //根据姓名或年龄查询
   List<User> findByNameOrAge(String name, Integer age);

   //查询年龄大于等于8
   List<User> findByAgeGreaterThanEqual(Integer age);
}
```

####  在业务中操作索引

```java
/**
 * @author buubiu
 **/
@SpringBootTest
public class TestUserRepository {

   @Autowired
   private UserRepository userRepository;

   //自定义查询
   //根据姓名查询
   @Test
   public void testFindByName() {
      List<User> users = userRepository.findByName("张三");
      users.forEach(user -> System.out.println("user = " + user));
   }

   //自定义查询
   //根据年龄查询
   @Test
   public void testFindByAge() {
      List<User> users = userRepository.findByAge(55);
      users.forEach(user -> System.out.println("user = " + user));
   }

   //自定义查询
   //根据姓名和地址和年龄查询
   @Test
   public void testFindByNameAndAddressAndAge() {
      List<User> users = userRepository.findByNameAndAddressAndAge("张三","日本", 55);
      users.forEach(user -> System.out.println("user = " + user));
   }

   //自定义查询
   //根据姓名或年龄查询
   @Test
   public void testFindByNameOrAge() {
      List<User> users = userRepository.findByNameOrAge("张三",55);
      users.forEach(user -> System.out.println("user = " + user));
   }

   //自定义查询
   //查询年龄大于等于8
   @Test
   public void testFindByAgeGreaterThanEqual() {
      List<User> users = userRepository.findByAgeGreaterThanEqual(2);
      users.forEach(user -> System.out.println("user = " + user));
   }
}
```