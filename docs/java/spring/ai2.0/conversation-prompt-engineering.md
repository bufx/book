# 对话与提示词工程

## 核心概念总览

Spring AI 2.0 提供了统一、易用的对话与提示词工程 API，核心组件包括：

|        组件        |      作用      |                           关键特性                           |
| :----------------: | :------------: | :----------------------------------------------------------: |
|    **Message**     |  封装对话内容  | 支持**SYSTEM**、**USER**、**ASSISTANT**、**TOOL**四种类型 |
|     **Prompt**     |  模型输入容器  |                  包含消息列表和模型配置选项                  |
| **PromptTemplate** | 提示词模板引擎 |        支持变量替换、外部文件加载、自定义分隔符        |
|   **ChatClient**   | 对话 API 入口  |         流畅链式调用，简化提示词构建与响应处理         |
|   **ChatModel**    |  底层模型接口  |   统一抽象不同大模型（OpenAI、Anthropic、Ollama 等）   |

## 核心知识点详解

### 消息类型（Message Type）

Spring AI 定义了四种标准消息类型，用于构建结构化对话：

- **SYSTEM**：设定 AI 角色、行为准则和能力边界（如 "你是一位 Java 开发专家，只回答编程相关问题"）
- **USER**：用户输入的问题或指令
- **ASSISTANT**：AI 的历史回复（用于多轮对话上下文）
- **TOOL**：工具调用的结果（如函数执行返回值）

### 提示词工程基础原则

**有效提示词应包含三要素：**

- **角色设定**：明确 AI 身份和能力范围
- **上下文信息**：提供必要背景知识
- **清晰指令**：明确任务目标和输出格式

**提示词优化技巧：**

- 使用**分隔符**（如 ```、\---）区分不同内容块
- 设定**输出格式**（如 JSON、Markdown）
- 控制**模型参数**（temperature：0~1，越低越确定；maxTokens：最大输出长度）Spring

### 提示词模板（PromptTemplate）

解决硬编码提示词的复用性和维护性问题，支持：

- 变量替换（使用`{}`占位符）
- 外部文件加载（从 resources 读取模板）
- 自定义渲染器（如修改分隔符为`<>`）
- 系统提示词模板（SystemPromptTemplate）专门用于角色设定

### ChatClient 流畅 API

Spring AI 2.0 推荐使用 ChatClient 进行对话开发，特点：

- 链式调用，代码简洁
- 内置提示词构建器
- 支持流式响应（`Flux<String>`）
- 统一处理不同模型的响应格式Spring

## 具体应用实例

### PromptTemplate提示词模版

我们如果不用提示词模版，很多时候写代码是这样的：

```java
// 不用模板：手写相同的逻辑，重复且难以维护
@GetMapping("/chat/java") 
public String java() { return chatClient.prompt().user("介绍下Java").call().content(); }

@GetMapping("/chat/python") 
public String python() { return chatClient.prompt().user("介绍下Python").call().content(); }
```

我们现在用提示词模版简化系统设计：

```java
/**
 * 使用模块：一套代码对应所有场景
 *
 * @param topic 介绍的主题
 * @return 流式响应的内容
 */
@GetMapping(value = "/ai/openai/promptTemplate/flux", produces = "text/html;charset=UTF-8")
public Flux<String> openAiChatFluxTemplate(String topic) {
    PromptTemplate promptTemplate = new PromptTemplate("介绍下{topic}");
    Prompt prompt = promptTemplate.create(Map.of("topic", topic));
    return openAiChatClient.prompt(prompt)
        .stream()
        .content();
}
```

使用 `ChatClient` 的流式 API 可以最快速地组装提示词

```java
/**
 * 使用流式的 API 可以最快速的组装提示词
 * @param topic 介绍的主题
 * @return 流式响应的内容
 */
@GetMapping(value = "/ai/openai/promptTemplate/flux/withBuilderCode", produces = "text/html;charset=UTF-8")
public Flux<String> openAiChatFluxWithBuilderCode(String topic) {
    return openAiChatClient.prompt() // 创建 Prompt 对象，用于构建聊天请求
        .system("你是一个专业的书评助手") // 设置系统提示词
        .user(u -> u.text("请给我推荐三本关于{topic}的书籍，只需要返回书籍的名称").param("topic", topic)) // 设置用户输入
        .stream() // 流式响应输出
        .content(); // 获取模型回复的内容
}
```

### 系统提示词工程 

通过 `defaultSystem` 构建"专家角色"，将其作为 AI 的"行动纲领"，确保所有对话都有统一的行为准则。

我们先在 ChatClientConfig 配置类里加一个 ChatClient 实例：

```java
/**
 * 配置 带有系统提示词的 OpenAI ChatClient
 * @param model OpenAI 模型
 * @return ChatAI ChatClient 实例，用于与模型进行对话，包含系统提示词
 */
@Bean
public ChatClient openAiChatClientWithSystemPrompt(OpenAiChatModel model) {
    // System Prompt 工程：清晰定义AI的角色、任务、约束与输出格式
    String systemPrompt = """
        你是一个资深的 Java 技术顾问。
        禁止回答任何非技术类问题，例如天气或娱乐八卦。
        代码示例必须符合 Java 17+ 规范。
        回答需要符合以下格式：首先一句话概括问题的核心，然后提供代码示例，最后补充注意事项。
        如果自己不确定，可以说"关于这个问题，我目前没有确切的信息"，禁止编造内容。
        """;
    return ChatClient
        .builder(model) // 创建 ChatClient 对象，以及设置模型为 model
        .defaultSystem(systemPrompt)
        .defaultAdvisors(new SimpleLoggerAdvisor()) // 添加一个内置日志 Advisor
        .build(); // 构建 ChatClient 对象
}
```

接下来，MyAiChatController 里加下 openAiChatClientWithSystemPrompt 实例，以及定义一个新接口方法：

```java
private final ChatClient openAiChatClientWithSystemPrompt;

/**
 * 使用 带有系统提示词的 ChatClient 处理与 OpenAI 模型交互的请求
 *
 * @param userInput 用户输入
 * @return 流式响应的内容
 */
@GetMapping(value = "/ai/openai/flux/withChatClientSystemPrompt", produces = "text/html;charset=UTF-8")
public Flux<String> openAiChatFluxWithChatClientSystemPrompt(String userInput) {
    return openAiChatClientWithSystemPrompt.prompt() // 创建 Prompt 对象，用于构建聊天请求
        .user(userInput) // 设置用户输入
        .stream() // 流式响应输出
        .content(); // 获取模型回复的内容
}
```

