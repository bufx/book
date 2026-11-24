# 使用LangChain调用大语言模型

此种方式主要封装的是 OpenAI 的**旧版 Completions API**（文本补全接口）。需要特别说明的是：**该接口目前已基本不可用**——目前绝大多数第三方大模型（如 DeepSeek、千帆、通义千问）提供的"OpenAI 兼容"接口，兼容的都是**聊天接口**（`/v1/chat/completions`），而非旧版补全接口。因此，下文示例中的 `OpenAI` 类仅作历史说明，实际开发中请一律改用 `ChatOpenAI`、`ChatOllama` 等 Chat 系列类。

## 安装库

我们首先来安装下核心库LangChain

```sh
pip install langchain -i https://pypi.tuna.tsinghua.edu.cn/simple  --trusted-host pypi.tuna.tsinghua.edu.cn
```

主要职责：提供构建AI应用的**链、代理、检索策略**等“认知架构”，是框架的“大脑”和“骨架。

## 调用OpenAI

安装库

```sh
pip install langchain-openai -i https://pypi.tuna.tsinghua.edu.cn/simple  --trusted-host pypi.tuna.tsinghua.edu.cn
```

示例代码：

```python
from langchain_openai import OpenAI

# 创建模型
model = OpenAI(
    model="qwen4-max",
    api_key="sk-ws-HxxxxxxQno", # type: ignore[arg-type]
    base_url='https://dashscope.aliyuncs.com/compatible-mode/v1'
)

# 调用模型
result = model.invoke(input("你是谁？"))
print(result)
```

## 调用Ollama

安装库

```sh
pip install langchain-ollama -i https://pypi.tuna.tsinghua.edu.cn/simple  --trusted-host pypi.tuna.tsinghua.edu.cn
```

我们使用LangChain来调用Ollama本地大模型

```python
from langchain_ollama import OllamaLLM

# 创建模型
model = OllamaLLM(model="qwen:0.5b")

# 调用模型
result = model.invoke(input("你是谁？"))
print(result)
```

## 设置流式输出

前面我们使用invoke是完整输出形式，当返回数据量大的时候，会有延迟，显示效果也不好，我们企业级开发，肯定是一段一段的像流水一样的输出形式。

在LangChain中，我们使用stream()方法，来实现流式输出。

实现代码：

```python
from langchain_openai import OpenAI

# 创建模型
model = OpenAI(
    model="qwen4-max",
    api_key="sk-ws-xxxxxxx", # type: ignore[arg-type]
    base_url='https://dashscope.aliyuncs.com/compatible-mode/v1'
)

# 调用模型
result = model.stream(input("你是谁？"))

for chunk in result:
    print(chunk, end="", flush=True)
```

运行返回的就是一段一段的流式输出了。

同样，如果我们使用本地ollama里的大模型，代码也改下：

```python
from langchain_ollama import OllamaLLM

# 创建模型
model = OllamaLLM(model="qwen:0.5b")

# 调用模型
result = model.stream(input("你是谁？"))

for chunk in result:
    print(chunk, end="", flush=True)

```

运行也是流式效果

