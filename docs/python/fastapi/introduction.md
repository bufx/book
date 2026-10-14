# FastAPI简介

## 介绍

**FastAPI是一个现代、高性能的Python Web框架，专为构建API而设计。**它基于标准的Python类型提示(Type Hints)构建，自2018年底由Sebastián Ramírez(塞巴斯蒂安·拉米雷斯)发布以来，已成为 Python生态中发展最快的框架之一。

FastAPI的官方网站是:https://fastapi.tiangolo.com

## 优点

FastAPI的核心设计目标是解决传统框架(如Flask、Django)在**异步支持、开发效率和性能**上的痛点。

其主要优势体现在以下几个方面:

*   **高性能 (High Performance):** FastAPI的性能与**NodeJS和Go**等语言编写的框架相当，是Python中最快的框架之一。这得益于其底层基于Starlette (ASGI框架) 和 Pydantic (数据验证库)。在TechEmpower的基准测试中，其性能远超Flask和Django。
*   **极速开发 (Fast to Code):** 官方估计，使用FastAPI开发功能的速度能提升约200%到300%。这主要归功于其高度依赖类型提示的特性，减少了大量样板代码。
*   **更少错误 (Fewer Bugs):** 借助类型提示和Pydantic的自动数据验证，FastAPI能减少约40% 由开发者引起的人为错误。
*   **自动生成文档 (Automatic Documentation):** 这是FastAPI最受欢迎的特性之一。它基于OpenAPI标准，能自动为你的API生成交互式文档。文档支持 Swagger UI 和 ReDoc 两种界面，你可以在浏览器中直接调用和测试API。
*   **强大的依赖注入系统 (Dependency Injection):** FastAPI包含一个极其易用但功能强大的依赖注入系统。依赖项本身也可以有依赖项，形成一个层次结构或依赖图，这一切都由框架自动处理，这有助于保持代码的模块化和可测试性。
*   **内置安全功能 (Security):** 内置了对**OAuth2、JWT (JSON Web Tokens)** 等安全认证机制的支持。

## 核心架构

FastAPI的强大并非凭空而来，它巧妙地站在了巨人的肩膀上:

- `Starlette`：一个轻量级的**ASGI(异步服务器网关接口)** 框架，为FastAPI提供了强大的异步Web工具支持。
- `Pydantic`：一个数据验证和设置管理的库，它利用Python类型提示进行数据验证、序列化和反序列化。

## 适用场景

凭借其高性能和开发效率，FastAPI特别适合以下场景：

- 构建**高并发API服务**，例如支付网关、实时数据推送服务。
- 作为**微服务架构**中的核心组件。
- 为**机器学习模型**提供高性能的API服务接口。
- 开发需要**WebSocket**实时通信的应用。

## FastAPI和Flask,Django的对比

| 对比维度       | FastAPI                                                      | Flask                                                 | Django                                                       |
| :------------- | :----------------------------------------------------------- | :---------------------------------------------------- | :----------------------------------------------------------- |
| **框架类型**   | 现代异步 Web 框架（偏向 API 开发）                           | 微框架（Micro-framework）                             | 全能型（Batteries-included）全栈框架                         |
| **底层协议**   | **ASGI**（原生异步非阻塞）                                   | **WSGI**（同步阻塞，异步需额外借助 Quart 等）         | **WSGI**（主流），现已部分支持 ASGI（Django 3.1+）           |
| **性能/速度**  | **极高**（Node.js/Go 级别）                                  | 中等                                                  | 相对较低（受限于同步架构和庞大的内置组件）                   |
| **数据验证**   | **原生支持**（基于 Pydantic，自动校验、序列化）              | 需借助第三方库（如 Marshmallow、Pydantic）            | 通过 Forms 或 DRF（Django REST Framework）序列化器           |
| **ORM/数据库** | 无内置 ORM，需自行集成（SQLAlchemy 等）                      | 无内置 ORM，需自行集成（SQLAlchemy 等）               | **内置强大 ORM**（自带迁移、关联查询、聚合等）               |
| **API 文档**   | **自动生成**（内置 Swagger UI 和 ReDoc，开箱即用）           | 需手动配置或使用扩展（如 Flasgger）                   | 核心无，需借助 DRF 的 drf-yasg 或 Spectacular 生成           |
| **后台管理**   | 无，需自行开发或集成（如 SQLAlchemy Admin）                  | 无，需自行开发（如 Flask-Admin）                      | **内置 Admin 后台**（增删改查开箱即用，功能极强）            |
| **模板引擎**   | 无（推荐作为纯后端 API 使用，可集成 Jinja2）                 | 内置 Jinja2（渲染 HTML 页面非常方便）                 | 内置 Django Template（功能完善，自带标签/过滤器）            |
| **依赖注入**   | **原生支持**（Dependency Injection 机制优雅）                | 需手动实现或借助扩展                                  | 无原生概念，需手动解耦或借助第三方库                         |
| **学习曲线**   | **中等**（需熟悉 Python 类型提示和异步基础）                 | **低**（路由和视图简单直观，2小时入门）               | **较高**（概念极多：MTV、中间件、信号、Form、Admin 等）      |
| **项目结构**   | 高度自由，开发者自行设计                                     | 高度自由，非常灵活                                    | **强约束**（约定大于配置，目录和命名规范严格）               |
| **生态与扩展** | 较新但增长迅猛，生态围绕异步库（HTTPX、SQLAlchemy Async）    | 生态极其丰富，历经时间考验，扩展极多                  | 生态极其丰富，“万物皆可插”，三方库/中间件海量                |
| **适用场景**   | **高并发 API 服务**、微服务架构、实时聊天/流式响应、前后端分离项目 | **小型项目**、简单 Web 页面、快速原型验证、轻量级 API | **大型企业级 Web 应用**、内容管理系统（CMS）、电商后台、自带后台管理需求的快速开发 |