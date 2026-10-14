# 结构化输出

LangChain4j 的结构化输出功能，能将大语言模型（LLM）生成的 JSON 文本自动转换为 Java 对象，让 Java 开发者能像调用普通方法一样获取结果，无需手动处理 JSON 或使用特定 Prompt。

## 结构化输出的三种方式

LangChain4j 主要提供三种实现结构化输出的方式，它们在可靠性和使用场景上有所区别。

| 方式                      | 可靠性   | 原理与机制                                                   | 适用场景                                                     |
| :------------------------ | :------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **JSON Schema**           | ⭐ 最可靠 | 将 JSON Schema 作为API专用属性传递给支持的模型，约束力最强。 | 追求高精度、高可靠性，并使用了支持的模型（如 OpenAI、Azure OpenAI 等）。 |
| **JSON Mode + Prompting** | ⭐⭐ 中等  | 强制 LLM 输出 JSON，但仍需在 Prompt 中包含 Schema 说明。     | 模型部分支持 JSON 模式，可靠性要求不是首要时。               |
| **Prompting Only**        | ⭐ 最弱   | 仅通过 Prompt 要求 LLM 输出特定格式，无底层机制保障。        | 兼容性要求高，或作为不支持 JSON Schema 的模型的备选方案。    |

## 具体示例

第一步：定义数据模型

```java
package com.bufx.model;

import dev.langchain4j.model.output.structured.Description;
import java.util.List;

/**
 * @comment: 使用 Java 16+ 的 Record 特性，编译器会自动生成构造器、equals/hashCode等方法
 */
@Description("按主题推荐的书籍列表")
public record TopicBooks(
    @Description("用户指定的书籍主题，例如：Java 并发、Spring Boot") String topic,
    @Description("推荐书目列表，每项格式：书名 - 作者，推荐 3~5 本") List<String> books
) {}
```



第二步：定义AI Service接口

```java
package com.bufx.service;

import com.bufx.model.TopicBooks;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import dev.langchain4j.service.spring.AiService;
import dev.langchain4j.service.spring.AiServiceWiringMode;

/**
 * @comment: 图书助手
 */
@AiService(
    wiringMode = AiServiceWiringMode.EXPLICIT, // 手动指定接入模型 手动装配
    chatModel = "openAiChatModel" // 指定模型
)
public interface BookAssistantService {

    @SystemMessage("你是一位资深图书推荐专家，只推荐真实存在的经典书籍。")
    @UserMessage("请根据主题「{{topic}}」推荐相关书籍。")
    TopicBooks recommendBooks(@V("topic") String topic); 
}

```



第三步：定义MyBookChatController

```java
package com.bufx.controller;

import com.bufx.model.TopicBooks;
import com.bufx.service.BookAssistantService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/book")
public class MyBookChatController {

    private final BookAssistantService bookAssistantService;

    public MyBookChatController(BookAssistantService bookAssistantService) {
        this.bookAssistantService = bookAssistantService;
    }

    @RequestMapping("/recommend")
    public String recommend() {
        String topic="Java";
        TopicBooks topicBooks = bookAssistantService.recommendBooks(topic);
        System.out.println(topicBooks);
        return "ok";
    }
}

```



我们来测试下，浏览器输入：`http://localhost:8080/book/recommend`

运行输出：可以看到请求的时候，就约定大模型返回的json格式

```java
2026-08-17T21:17:28.420+08:00  INFO 12645 --- [02-langchain4j_springboot4] [nio-8080-exec-1] d.l.http.client.log.LoggingHttpClient    : HTTP request:
- method: POST
- url: https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
- headers: [Authorization: Beare...68], [Content-Type: application/json], [User-Agent: langchain4j-openai]
- body: {
  "model" : "qwen3.7-plus",
  "messages" : [ {
    "role" : "system",
    "content" : "你是一位资深图书推荐专家，只推荐真实存在的经典书籍。"
  }, {
    "role" : "user",
    "content" : "请根据主题「Java」推荐相关书籍。\nYou must answer strictly in the following JSON format: {\n\"topic\": (用户指定的书籍主题，例如：Java 并发、Spring Boot; type: string),\n\"books\": (推荐书目列表，每项格式：书名 - 作者，推荐 3~5 本; type: array of string)\n}"
  } ],
  "temperature" : 0.7,
  "stream" : false
}

2026-08-17T21:17:49.708+08:00  INFO 12645 --- [02-langchain4j_springboot4] [nio-8080-exec-1] d.l.http.client.log.LoggingHttpClient    : HTTP response:
- status code: 200
- headers: [content-type: application/json], [date: Mon, 17 Aug 2026 13:17:49 GMT], [req-arrive-time: 1786972650622], [req-cost-time: 19079], [resp-start-time: 1786972669701], [server: istio-envoy], [transfer-encoding: chunked], [vary: Origin,Access-Control-Request-Method,Access-Control-Request-Headers, Accept-Encoding], [x-dashscope-call-gateway: true], [x-dashscope-finished: true], [x-dashscope-timeout: 3600], [x-envoy-upstream-service-time: 19056], [x-request-id: 6529cfc9-02ae-9a11-9877-4dbe91edc0fa]
- body: {"model":"qwen3.7-plus","id":"chatcmpl-6529cfc9-02ae-9a11-9877-4dbe91edc0fa","choices":[{"message":{"content":"{\n  \"topic\": \"Java\",\n  \"books\": [\n    \"Effective Java - Joshua Bloch\",\n    \"Java核心技术 卷I - 凯·S.霍斯特曼\",\n    \"深入理解Java虚拟机 - 周志明\",\n    \"Java并发编程实战 - Brian Goetz\"\n  ]\n}","reasoning_content":"思考过程：1.  **分析请求**：\n    *   角色：资深图书推荐专家，只推荐真实存在的经典书籍。\n    *   主题：「Java」\n    *   输出格式：严格遵循提供的 JSON 格式。\n    *   JSON 结构：\n        *   `topic`: string (用户指定的主题，这里是 \"Java\")\n        *   `books`: array of string (推荐 3~5 本书，格式为 \"书名 - 作者\")\n    *   约束：严格 JSON 格式，无 Markdown，无解释。\n\n2.  **选择书籍 (Java 经典书籍)**：\n    *   《Effective Java》 - Joshua Bloch (Java 经典必读)\n    *   《Java 核心技术 卷 I》 - 凯·S·霍斯特曼 (Cay S. Horstmann) (Java 基础经典)\n    *   《深入理解Java虚拟机》 - 周志明 (国内 JVM 经典)\n    *   《Java并发编程实战》 - Brian Goetz 等 (Java 并发经典)\n    *   选 4 本即可，符合 3~5 本的要求。\n\n3.  **格式化书籍列表**：\n    *   \"Effective Java - Joshua Bloch\"\n    *   \"Java核心技术 卷I - 凯·S.霍斯特曼 (Cay S. Horstmann)\" -> 简化为 \"Java核心技术 卷I - 凯·S.霍斯特曼\" 或 \"Java核心技术 卷I - Cay S. Horstmann\"\n    *   \"深入理解Java虚拟机 - 周志明\"\n    *   \"Java并发编程实战 - Brian Goetz\"\n\n    调整书名和作者格式，使其更自然且准确：\n    1. \"Effective Java - Joshua Bloch\"\n    2. \"Java核心技术 卷I - Cay S. Horstmann\"\n    3. \"深入理解Java虚拟机 - 周志明\"\n    4. \"Java并发编程实战 - Brian Goetz\"\n\n4.  **构建 JSON**：\n    ```json\n    {\n      \"topic\": \"Java\",\n      \"books\": [\n        \"Effective Java - Joshua Bloch\",\n        \"Java核心技术 卷I - Cay S. Horstmann\",\n        \"深入理解Java虚拟机 - 周志明\",\n        \"Java并发编程实战 - Brian Goetz\"\n      ]\n    }\n    ```\n\n5.  **检查约束**：\n    *   严格 JSON 格式？是。\n    *   无 Markdown (```json)？是。\n    *   无解释？是。\n    *   `topic` 是 string？是。\n    *   `books` 是 array of string，3~5 本，格式 \"书名 - 作者\"？是 (4本)。\n    *   书籍真实存在且经典？是。\n\n6.  **最终输出生成**：直接输出 JSON 字符串。\n    {\n      \"topic\": \"Java\",\n      \"books\": [\n        \"Effective Java - Joshua Bloch\",\n        \"Java核心技术 卷I - Cay S. Horstmann\",\n        \"深入理解Java虚拟机 - 周志明\",\n        \"Java并发编程实战 - Brian Goetz\"\n      ]\n    }\n    注意：Cay S. Horstmann 也可以写中文译名，但英文更准确，或者写 \"Java核心技术 卷I - 凯·S.霍斯特曼\"。用 \"Java核心技术 卷I - 凯·S.霍斯特曼\" 更符合中文语境。\n    修改：\n    \"Effective Java - Joshua Bloch\"\n    \"Java核心技术 卷I - 凯·S.霍斯特曼\"\n    \"深入理解Java虚拟机 - 周志明\"\n    \"Java并发编程实战 - Brian Goetz\"\n\n    再检查一遍 JSON 格式，确保没有 markdown 标记。\n    {\"topic\": \"Java\", \"books\": [\"Effective Java - Joshua Bloch\", \"Java核心技术 卷I - 凯·S.霍斯特曼\", \"深入理解Java虚拟机 - 周志明\", \"Java并发编程实战 - Brian Goetz\"]}\n    完美。\n    等待，题目说 \"ONLY raw JSON. No markdown (```json), no explanations.\"\n    所以我直接输出大括号开头和结尾的内容。\n    检查字段名：topic, books。\n    检查类型：string, array of string。\n    检查数量：4本（在3~5之间）。\n    检查格式：\"书名 - 作者\"。\n    一切就绪。","role":"assistant"},"index":0,"finish_reason":"stop"}],"created":1786972650,"object":"chat.completion","usage":{"total_tokens":1201,"completion_tokens":1094,"prompt_tokens":107,"completion_tokens_details":{"reasoning_tokens":1017,"text_tokens":1094},"prompt_tokens_details":{"cached_tokens":0,"text_tokens":107}}}

TopicBooks[topic=Java, books=[Effective Java - Joshua Bloch, Java核心技术 卷I - 凯·S.霍斯特曼, 深入理解Java虚拟机 - 周志明, Java并发编程实战 - Brian Goetz]]

```

