# Ai Service 使用

## 介绍

LangChain4j 的 **AI Service** 是它最核心、最推荐的高层 API：用**接口 + 注解**的方式定义 AI 能力，框架自动生成代理实现，把 LLM 调用、提示词管理、记忆、工具、RAG 等都封装好，像调用普通 Java 服务一样用 AI。

![](ai-service-img/image-20260817124451934.png)

## 普通实现-OpenAi

要使用Ai Service，首先pom.xml里要引入langchain4j核心依赖：

```xml
<dependency>
	<groupId>dev.langchain4j</groupId>
	<artifactId>langchain4j</artifactId>
	<version>1.19.0</version>
</dependency>
```

新建AssistantService接口：

```java
package com.bufx.service;

public interface AssistantService {

    String chat(String userMessage);
}

```

再新建AssistantConfig配置类，通过AiServices创建代理对象

```java
package com.bufx.config;

import com.bufx.service.AssistantService;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AssistantConfig {

    @Autowired
    private OpenAiChatModel openAiChatModel;

    @Bean
    public AssistantService assistantService() {
        AssistantService assistantService = AiServices.create(AssistantService.class, openAiChatModel);
        return assistantService;
    }
}

```



最后MyChatController里注入assistantService，以及创建chatWithOpenAiAndAiService方法

```java
private final AssistantService assistantService;

/**
 * 使用ai service 调用OpenAI的模型进行问答
 */
@GetMapping("/chat-with-openai-ai-service")
public String chatWithOpenAiAndAiService(String question) {
    return assistantService.chat(question);
}
```



启动项目，浏览器输出测试：`http://localhost:8080/chat-with-openai-ai-service?question=你是谁？`

![](ai-service-img/image-20260817125807082.png)

## 普通实现-Ollama

如果我们要换成ollama实现，只需要AssistantConfig里，注入ollamaChatModel，然后AiServices.create的模型参数，换成ollamaChatModel即可。

```java
package com.bufx.config;

import com.bufx.service.AssistantService;
import dev.langchain4j.model.ollama.OllamaChatModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AssistantConfig {

    @Autowired
    private OpenAiChatModel openAiChatModel;
    
    @Autowired
    private OllamaChatModel ollamaChatModel;

    @Bean
    public AssistantService assistantService() {
//        AssistantService assistantService = AiServices.create(AssistantService.class, openAiChatModel);
        AssistantService assistantService = AiServices.create(AssistantService.class, ollamaChatModel);
        return assistantService;
    }
}

```

## @AiService注解实现-OpenAi

其实前面这种方式我们一般开发的时候不用，比较麻烦。LangChain4j提供了更简单声明式@AiService注解方式。

首先pom.xml里加上 langchain4j-spring-boot4-starter 依赖

```xml
<dependency>
	<groupId>dev.langchain4j</groupId>
	<artifactId>langchain4j-spring-boot4-starter</artifactId>
	<version>1.19.0-beta29</version>
</dependency>
```



我们新建Assistant2Service接口

```java
package com.bufx.service;

import dev.langchain4j.service.spring.AiService;
import dev.langchain4j.service.spring.AiServiceWiringMode;

@AiService(
    wiringMode = AiServiceWiringMode.EXPLICIT, // 手动指定接入模型 手动装配
    chatModel = "openAiChatModel" // 指定模型
)
public interface Assistant2Service {

    String chat(String userMessage);
}

```



MyChatController里注入assistant2Service，以及实现chatWithOpenAiAndAiService2方法：

```java
private final Assistant2Service assistant2Service;

/**
 * 使用ai service 注解 调用OpenAI的模型进行问答
 */
@GetMapping("/chat-with-openai-ai-service-2")
public String chatWithOpenAiAndAiService2(String question) {
    return assistant2Service.chat(question);
}
```



浏览器输入测试：`http://localhost:8080/chat-with-openai-ai-service-2?question=你是谁？`

![](ai-service-img/image-20260817130631718.png)

## @AiService注解实现-Ollama

如果我们要换成ollama的话，就特别简单：

```java
package com.bufx.service;

import dev.langchain4j.service.spring.AiService;
import dev.langchain4j.service.spring.AiServiceWiringMode;

@AiService(
    wiringMode = AiServiceWiringMode.EXPLICIT, // 手动指定接入模型 手动装配
//    chatModel = "openAiChatModel" // 指定模型
    chatModel = "ollamaChatModel" // 指定模型
)
public interface Assistant2Service {

    String chat(String userMessage);
}

```

