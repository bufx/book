import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Book",
  titleTemplate: 'bufx',
  description: "Programmer books",
  head: [['link', { rel: 'icon', href: '/images/favicon.ico' }]],
  base: '/book',
  // 当设置为 true 时，VitePress 将从 URL 中删除 .html 后缀。
  // cleanUrls: true,
  // 当设置为 true 时，VitePress 不会因为死链而导致构建失败。
  ignoreDeadLinks: true,
  // 是否使用 Git 获取每个页面的最后更新时间戳。
  // lastUpdated: true,
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),

    sidebar: sidebar(),

    socialLinks: socialLinks(),

    outline: {
      level: 'deep'
    },
    // outlineTitle: '目录',
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present bufx  Powered by <a href="https://vitepress.vuejs.org/">VitePress</a>'
    },
    // editLink: {
    //   pattern: 'https://github.com/bufx/vitepress/edit/main/book_jvm/:path',
    //   text: 'Edit this page on GitHub'
    // },
    // lastUpdated: {
    //   text: 'Updated at',
    //   formatOptions: {
    //     dateStyle: 'full',
    //     timeStyle: 'medium'
    //   }
    // },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    search: {
      provider: 'local'
    }
  }
})

function nav() {
  return [
    { text: '首页', link: '/' },
    {
      text: 'Java',
      items: [
        { text: 'JVM 虚拟机', link: 'java/jvm/introduction' },
        { text: 'Java 基础', link: '/java/basics/introduction' },
        { text: 'Spring 生态', link: 'java/spring/basics/introduction' }
      ]
    },
    {
      text: 'Python',
      items: [
        { text: 'Python 基础', link: '/python/basics/introduction' },
        { text: 'PyMySQL', link: '/python/pymysql/introduction-and-installation' },
        { text: 'Flask3', link: '/python/flask3/introduction' },
        { text: 'FastAPI', link: '/python/fastapi/introduction' }
      ]
    },
    {
      text: '前端',
      items: [
        { text: 'TypeScript', link: '/frontend/typescript/introduction' },
        { text: 'ES6', link: '/frontend/es6/introduction' }
      ]
    },
    {
      text: '移动端',
      items: [
        { text: '微信小程序', link: '/mobile/wechat-miniprogram/framework/introduction' },
        { text: 'uni-app', link: '/mobile/uni-app/introduction' }
      ]
    },
    {
      text: '存储与中间件',
      items: [
        { text: '数据库(Oracle / LDAP)', link: '/database/oracle-tablespace-and-user' },
        { text: 'Zookeeper', link: '/middleware/zookeeper/introduction' },
        { text: 'ElasticSearch 6', link: '/middleware/elasticsearch/v6/introduction' },
        { text: 'ElasticSearch 7', link: '/middleware/elasticsearch/v7/advanced-settings' },
        { text: 'Seata 分布式事务', link: '/middleware/seata/introduction' },
        { text: 'SkyWalking APM', link: '/middleware/apm/skywalking-upgrade-7-to-8' },
        { text: 'WebLogic', link: '/middleware/weblogic/install-patch' }
      ]
    },
    {
      text: '云原生与运维',
      items: [
        { text: 'Docker', link: '/devops/docker/introduction' },
        { text: 'Kubernetes 基础', link: '/devops/k8s/basics/01-introduction' },
        { text: 'Kubernetes 快速上手', link: '/devops/k8s/tutorials/introduction' },
        { text: 'Kubernetes 深入', link: '/devops/k8s/advanced/concepts' },
        { text: 'Jenkins', link: '/devops/jenkins/introduction' },
        { text: 'Grafana 告警', link: '/devops/grafana/01-create-simple-alert' },
        { text: 'Linux', link: '/devops/linux/redhat8-init' },
        { text: '操作系统', link: '/devops/os/centos7-hostname' }
      ]
    },
    {
      text: '基础与工具',
      items: [
        {
          text: '计算机基础',
          items: [
            { text: '算法概述', link: '/algorithm/overview/introduction' },
            { text: '十大排序算法', link: '/algorithm/sort/bubble-sort' },
            { text: '数据结构', link: '/algorithm/data-structure/introduction' },
            { text: '设计模式', link: '/design-pattern/principles/design-principles' }
          ]
        },
        {
          text: '构建与工具',
          items: [
            { text: 'Gradle / Groovy', link: '/tools/build/gradle-introduction' },
            { text: 'Git 操作', link: '/tools/misc/git-operations' },
            { text: 'Swagger', link: '/tools/misc/swagger-introduction' },
            { text: 'JWT 认证', link: '/tools/misc/microservice-jwt-auth' }
          ]
        }
      ]
    }
  ]
}

function sidebar() {
  return {
      '/python/': { base: '/python/', items: sidebarPython() },
      '/java/': { base: '/java/', items: sidebarJava() },
      '/algorithm/': { base: '/algorithm/', items: sidebarAlgorithm() },
      '/design-pattern/': { base: '/design-pattern/', items: sidebarDesignPattern() },
      '/database/': { base: '/database/', items: sidebarDatabase() },
      '/middleware/': { base: '/middleware/', items: sidebarMiddleware() },
      '/devops/': { base: '/devops/', items: sidebarDevops() },
      '/frontend/': { base: '/frontend/', items: sidebarFrontend() },
      '/mobile/': { base: '/mobile/', items: sidebarMobile() },
      '/tools/': { base: '/tools/', items: sidebarTools() }
    }
}

function sidebarPython() {
  return [
    {
      text: 'Python 基础',
      collapsed: true,
      items: [
        { text: '概述', link: 'basics/introduction' },
        {
          text: '变量与简单类型',
          collapsed: true,
          items: [
            { text: '变量', link: 'basics/variables-and-simple-types/variables' },
            { text: '运算符', link: 'basics/variables-and-simple-types/operators' },
            { text: '字符串', link: 'basics/variables-and-simple-types/strings' }
          ]
        },
        {
          text: '流程控制',
          collapsed: true,
          items: [
            { text: 'if条件分支结构', link: 'basics/flow-control/if-else' },
            { text: 'while循环结构', link: 'basics/flow-control/while-loop' },
            { text: 'for循环结构', link: 'basics/flow-control/for-loop' },
            { text: '循环控制continue和break', link: 'basics/flow-control/continue-and-break' }
          ]
        },
        {
          text: '函数',
          collapsed: true,
          items: [
            { text: '函数的定义', link: 'basics/functions/function-definition' },
            { text: '函数的参数', link: 'basics/functions/function-parameters' },
            { text: '函数的返回值', link: 'basics/functions/function-return-values' },
            { text: '函数的说明文档', link: 'basics/functions/function-docs' },
            { text: '变量作用域', link: 'basics/functions/variable-scope' },
            { text: '递归函数', link: 'basics/functions/recursive-functions' }
          ]
        },
        {
          text: '容器',
          collapsed: true,
          items: [
            { text: '列表list', link: 'basics/containers/list' },
            { text: '元组tuple', link: 'basics/containers/tuple' },
            { text: '字符串str', link: 'basics/containers/str' },
            { text: '容器序列切片', link: 'basics/containers/slicing' },
            { text: '集合set', link: 'basics/containers/set' },
            { text: '字典dict', link: 'basics/containers/dict' }
          ]
        },
        { text: '函数进阶', link: 'basics/advanced-functions' },
        {
          text: '类和对象',
          collapsed: true,
          items: [
            { text: '初识Python类和对象', link: 'basics/classes-and-objects/classes-and-objects' },
            { text: '类的成员方法', link: 'basics/classes-and-objects/class-member-methods' },
            { text: '类的构造方法', link: 'basics/classes-and-objects/class-constructor' },
            { text: '魔法方法', link: 'basics/classes-and-objects/magic-methods' },
            { text: '隐藏和封装', link: 'basics/classes-and-objects/encapsulation' },
            { text: '类的继承', link: 'basics/classes-and-objects/class-inheritance' },
            { text: '类的多态', link: 'basics/classes-and-objects/class-polymorphism' },
            { text: 'Python的动态性', link: 'basics/classes-and-objects/python-dynamic' },
            { text: '枚举类', link: 'basics/classes-and-objects/enum-class' }
          ]
        },
        {
          text: '异常处理',
          collapsed: true,
          items: [
            { text: '异常的概念', link: 'basics/exception-handling/exceptions' },
            { text: '异常捕获与处理', link: 'basics/exception-handling/exception-handling' },
            { text: '使用raise引发异常', link: 'basics/exception-handling/raise-exception' },
            { text: '自定义异常类', link: 'basics/exception-handling/custom-exception-class' },
            { text: '异常的传递性', link: 'basics/exception-handling/exception-propagation' }
          ]
        },
        {
          text: '模块与包',
          collapsed: true,
          items: [
            { text: '模块的概念和基本使用', link: 'basics/modules-and-packages/modules' },
            { text: '自定义模块', link: 'basics/modules-and-packages/custom-modules' },
            { text: 'Python包', link: 'basics/modules-and-packages/packages' },
            { text: '安装Python第三方库', link: 'basics/modules-and-packages/install-third-party-libraries' }
          ]
        },
        { text: '类型注解', link: 'basics/type-annotations' },
        {
          text: '文件IO操作',
          collapsed: true,
          items: [
            { text: '文件读取操作', link: 'basics/file-io/file-reading' },
            { text: '文件写入和追加操作', link: 'basics/file-io/file-writing-and-appending' }

          ]
        },
        { text: '多线程编程', link: 'basics/multithreading' }
      ]
    },
    {
      text: 'PyMySQL',
      collapsed: true,
      items: [
        { text: '简介以及安装', link: 'pymysql/introduction-and-installation' },
        { text: '创建数据库连接', link: 'pymysql/creating-database-connection' },
        { text: '执行DDL语句', link: 'pymysql/executing-ddl-statements' },
        { text: '执行DML语句', link: 'pymysql/executing-dml-statements' },
        { text: '调用存储过程', link: 'pymysql/calling-stored-procedures' }
      ]
    },
    {
      text: 'Flask3',
      collapsed: true,
      items: [
        { text: '初识Flask3', link: 'flask3/introduction' },
        {
          text: 'Http请求处理',
          collapsed: true,
          items: [
            { text: 'request请求对象与url传参', link: 'flask3/http-request-handling/request-and-url-parameters' },
            { text: 'post请求与参数获取', link: 'flask3/http-request-handling/post-request-and-parameter-retrieval' },
            { text: 'request请求钩子', link: 'flask3/http-request-handling/request-hooks' },
            { text: 'http响应状态码', link: 'flask3/http-request-handling/http-response-status-codes' },
            { text: 'redirect重定向', link: 'flask3/http-request-handling/redirect' },
            { text: 'response响应格式', link: 'flask3/http-request-handling/response-format' },
            { text: '客户端状态信息Cookie', link: 'flask3/http-request-handling/cookie' },
            { text: '模块化blueprint配置', link: 'flask3/http-request-handling/blueprint-configuration' },
            { text: '上下文全局变量', link: 'flask3/http-request-handling/context-global-variables' }
          ]
        },
        {
          text: 'Jinja2模板引擎',
          collapsed: true,
          items: [
            { text: '模板基本使用', link: 'flask3/jinja2-template-engine/basic-usage' },
            { text: '模板访问对象', link: 'flask3/jinja2-template-engine/accessing-objects' },
            { text: '模板条件和循环控制语句', link: 'flask3/jinja2-template-engine/conditional-and-loop-control-statements' },
            { text: '模板过滤器使用', link: 'flask3/jinja2-template-engine/using-filters' },
            { text: '模板加载静态文件', link: 'flask3/jinja2-template-engine/loading-static-files' },
            { text: '模板继承和include标签使用', link: 'flask3/jinja2-template-engine/inheritance-and-include-tags' }
          ]
        },
        {
          text: '表单处理WTForms',
          collapsed: true,
          items: [
            { text: '概述', link: 'flask3/wtforms/introduction' },
            { text: '定义表单类', link: 'flask3/wtforms/defining-form-classes' },
            { text: '渲染表单与获取表单数据', link: 'flask3/wtforms/rendering-and-retrieving-form-data' },
            { text: '表单里添加标签属性和样式', link: 'flask3/wtforms/adding-label-attributes-and-styles' },
            { text: '表单验证', link: 'flask3/wtforms/form-validation' }
          ]
        },
        {
          text: 'SQLAlchemy数据库与模型',
          collapsed: true,
          items: [
            { text: '简介与安装', link: 'flask3/sqlalchemy/introduction-and-installation' },
            { text: '连接Mysql数据库', link: 'flask3/sqlalchemy/connecting-to-mysql-database' },
            { text: '动态创建数据库表', link: 'flask3/sqlalchemy/dynamically-creating-tables' },
            { text: '单表增删查改数据操作', link: 'flask3/sqlalchemy/single-table-crud-operations' },
            { text: '关联表增删查改数据操作', link: 'flask3/sqlalchemy/associated-table-crud-operations' },
            { text: '数据迁移migrate', link: 'flask3/sqlalchemy/migrate' }
          ]
        }
      ]
    },
    {
      text: 'FastAPI',
      collapsed: true,
      items: [
        { text: 'FastAPI简介', link: 'fastapi/introduction' },
        { text: '编写HelloWorld项目', link: 'fastapi/hello-world' },
        { text: '自动生成交互式API文档', link: 'fastapi/interactive-api-documentation' },
        { text: '路由与参数', link: 'fastapi/routing-and-parameters' },
        { text: '参数校验', link: 'fastapi/parameter-validation' },
        { text: 'Cookie&Header参数获取', link: 'fastapi/cookie-and-header-parameters' },
        { text: 'form表单与文件上传', link: 'fastapi/form-and-file-upload' },
        { text: '响应类型', link: 'fastapi/response-types' },
        { text: '响应模型', link: 'fastapi/response-models' },
        { text: '异常错误处理', link: 'fastapi/exception-handling' },
        { text: '中间件', link: 'fastapi/middleware' },
        { text: '依赖注入', link: 'fastapi/dependency-injection' },
        { text: '集成SQLAlchemyORM', link: 'fastapi/integrating-sqlalchemy-orm' }
      ]
    }
  ]
}

function sidebarJava() {
  return [
    {
      text: 'JVM 虚拟机',
      collapsed: true,
      items: [
        { text: '整体介绍', link: '/jvm/introduction' },
        { text: '类加载子系统', link: '/jvm/class-loader/introduction' },
        {
          text: '运行时数据区',
          collapsed: true,
          items: [
            { text: '概述及线程', link: '/jvm/runtime-data-area/introduction' },
            { text: '程序计数器(PC寄存器)', link: '/jvm/runtime-data-area/pc-register' },
            {
              text: '虚拟机栈',
              collapsed: true,
              items: [
                { text: '虚拟机栈概述', link: '/jvm/runtime-data-area/stack/introduction' },
                { text: '局部变量表(Local Variable Array)', link: '/jvm/runtime-data-area/stack/local-variables' },
                { text: '操作数栈(Operand Stack)', link: '/jvm/runtime-data-area/stack/operand-stack' },
                { text: '动态链接(Dynamic Linking)', link: '/jvm/runtime-data-area/stack/dynamic-linking' },
                { text: '方法的调用', link: '/jvm/runtime-data-area/stack/method-invocation' },
                { text: '方法返回地址(Return Address)', link: '/jvm/runtime-data-area/stack/return-address' },
                { text: '一些附加信息', link: '/jvm/runtime-data-area/stack/additional-info' },
                { text: '相关面试题', link: '/jvm/runtime-data-area/stack/interview-questions' }
              ]
            },
            { text: '本地方法区', link: '/jvm/runtime-data-area/native-method/introduction' },
            { text: '本地方法栈', link: '/jvm/runtime-data-area/native-method/stack' },
            {
              text: '堆(Heap)',
              collapsed: true,
              items: [
                { text: '堆的核心概念', link: '/jvm/runtime-data-area/heap/core-concept' },
                { text: '设置堆内存大小和OOM', link: '/jvm/runtime-data-area/heap/memory-size-and-oom' },
                { text: '年轻代和老年代', link: '/jvm/runtime-data-area/heap/younggen-and-oldgen' },
                { text: '对象分配的过程', link: '/jvm/runtime-data-area/heap/object-allocation' },
                { text: '逃逸分析(Escape Analysis)', link: '/jvm/runtime-data-area/heap/escape-analysis' },
                { text: '逃逸分析-代码优化', link: '/jvm/runtime-data-area/heap/escape-analysis-optimization' }
              ]
            },
            {
              text: '方法区(Method Area)',
              collapsed: true,
              items: [
                { text: '概述', link: '/jvm/runtime-data-area/method-area/introduction' },
                { text: '设置方法区大小和OOM', link: '/jvm/runtime-data-area/method-area/memory-size-and-oom' },
                { text: '内部结构', link: '/jvm/runtime-data-area/method-area/interior-structure' },
                { text: '方法区的演进细节', link: '/jvm/runtime-data-area/method-area/evolution-details' },
                { text: '垃圾回收', link: '/jvm/runtime-data-area/method-area/garbage-collection' }
              ]
            },
            { text: '总结与面试题', link: '/jvm/runtime-data-area/summary-and-interview' },
            { text: '对象的实例化内存布局与访问定位', link: '/jvm/runtime-data-area/instantiated-memory-layout' },
            { text: '直接内存(JDK8及以上)', link: '/jvm/runtime-data-area/direct-memory' }
          ]
        },
        {
          text: '执行引擎',
          collapsed: true,
          items: [
            { text: '概述', link: '/jvm/execution-engine/introduction' },
            { text: 'Java代码编译和执行的过程', link: '/jvm/execution-engine/compile-and-execute' },
            { text: '机器码_指令_汇编语言', link: '/jvm/execution-engine/machine-code-and-assembly' },
            { text: '解释器和JIT编译器', link: '/jvm/execution-engine/interpreter-and-jit' },
            { text: 'JIT编译器深入理解', link: '/jvm/execution-engine/jit-in-depth' }
          ]
        },
        {
          text: '字符串常量池StringTable',
          collapsed: true,
          items: [
            { text: 'String的概述和基本操作', link: '/jvm/stringtable/introduction' },
            { text: '字符串的拼接操作', link: '/jvm/stringtable/concatenation' },
            { text: 'intern的使用以及StringTable的垃圾回收', link: '/jvm/stringtable/intern-and-gc' }
          ]
        },
        {
          text: '垃圾回收(GC)',
          collapsed: true,
          items: [
            {
              text: '概述',
              collapsed: true,
              items: [
                { text: '垃圾回收概述', link: '/jvm/gc/overview/introduction' },
                { text: 'finalization机制', link: '/jvm/gc/overview/finalization' },
                { text: 'GC-Roots溯源', link: '/jvm/gc/overview/gc-roots-profiling' }
              ]
            },
            {
              text: '相关算法',
              collapsed: true,
              items: [
                { text: '标记阶段算法', link: '/jvm/gc/algorithms/marking-algorithms' },
                { text: '清除阶段算法', link: '/jvm/gc/algorithms/collection-algorithms' },
                { text: '算法使用方式', link: '/jvm/gc/algorithms/algorithm-usage' }
              ]
            },
            {
              text: '相关概念',
              collapsed: true,
              items: [
                { text: 'System.gc()的理解', link: '/jvm/gc/concepts/system-gc' },
                { text: '内存溢出与内存泄漏', link: '/jvm/gc/concepts/oom-and-leak' },
                { text: 'Stop The World', link: '/jvm/gc/concepts/stop-the-world' },
                { text: '并行与并发', link: '/jvm/gc/concepts/parallel-and-concurrent' },
                { text: '安全点与安全区域', link: '/jvm/gc/concepts/safe-point-region' },
                { text: '再谈引用', link: '/jvm/gc/concepts/reference-types' }
              ]
            },
            {
              text: '垃圾回收器',
              collapsed: true,
              items: [
                { text: '概述与分类', link: '/jvm/gc/collectors/introduction' },
                { text: 'GC性能指标', link: '/jvm/gc/collectors/performance-metrics' },
                { text: '垃圾回收器概述', link: '/jvm/gc/collectors/overview' },
                { text: 'Serial回收器', link: '/jvm/gc/collectors/serial' },
                { text: 'ParNew回收器', link: '/jvm/gc/collectors/parnew' },
                { text: 'Parallel回收器', link: '/jvm/gc/collectors/parallel-scavenge' },
                { text: 'CMS回收器', link: '/jvm/gc/collectors/cms' },
                { text: 'G1回收器-概述', link: '/jvm/gc/collectors/g1-introduction' },
                { text: 'G1回收器-特点', link: '/jvm/gc/collectors/g1-features' },
                { text: 'G1回收器-调优', link: '/jvm/gc/collectors/g1-tuning' },
                { text: 'G1回收器-Region', link: '/jvm/gc/collectors/g1-region' },
                { text: 'G1回收器-回收环节', link: '/jvm/gc/collectors/g1-phases' },
                { text: 'G1回收器-GC过程', link: '/jvm/gc/collectors/g1-gc-process' },
                { text: '垃圾回收器总结', link: '/jvm/gc/collectors/summary' },
                { text: 'GC日志分析', link: '/jvm/gc/collectors/gc-log-analysis' },
                { text: '垃圾回收器新发展', link: '/jvm/gc/collectors/new-developments' }
              ]
            }
          ]
        },
        {
          text: 'Class文件结构',
          collapsed: true,
          items: [
            { text: '概述', link: '/jvm/class-file-structure/introduction' }
          ]
        }
      ]
    },
    {
      text: 'Java 基础',
      collapsed: true,
      items: [
        { text: 'Java 概述', link: '/basics/introduction' },
        { text: '数据类型', link: '/basics/data-types' },
        { text: '面向对象', link: '/basics/oop' },
        { text: '常用 API', link: '/basics/common-api' },
        { text: '反射', link: '/basics/reflection' },
        { text: 'IO 流', link: '/basics/io' },
        { text: '网络编程', link: '/basics/network' },
        {
          text: '集合容器',
          collapsed: true,
          items: [
            { text: '理论总结', link: '/collections/theory-summary' },
            { text: '问题总结', link: '/collections/questions-summary' }
          ]
        },
        {
          text: '并发编程',
          collapsed: true,
          items: [
            {
              text: '前言',
              collapsed: true,
              items: [
                { text: '专题前言', link: '/concurrent/overview/preface' },
                { text: '问题总结', link: '/concurrent/overview/questions-summary' }
              ]
            },
            {
              text: '基础知识',
              collapsed: true,
              items: [
                { text: '并发编程的优缺点', link: '/concurrent/basics/pros-and-cons' },
                { text: '线程的状态和基本操作', link: '/concurrent/basics/thread-state-and-operations' }
              ]
            },
            {
              text: '并发理论',
              collapsed: true,
              items: [
                { text: 'Java 内存模型以及 happens-before', link: '/concurrent/theory/jmm-and-happens-before' },
                { text: '重排序与数据依赖性', link: '/concurrent/theory/reordering-and-data-dependency' }
              ]
            },
            {
              text: '并发关键字',
              collapsed: true,
              items: [
                { text: 'synchronized', link: '/concurrent/keywords/synchronized' },
                { text: 'volatile', link: '/concurrent/keywords/volatile' },
                { text: 'final', link: '/concurrent/keywords/final' },
                { text: '三大性质总结', link: '/concurrent/keywords/three-properties' }
              ]
            },
            {
              text: 'Lock 体系',
              collapsed: true,
              items: [
                { text: '初识 Lock 与 AQS', link: '/concurrent/lock/lock-aqs-introduction' },
                { text: 'ReentrantLock(重入锁)', link: '/concurrent/lock/reentrant-lock' },
                { text: 'ReentrantReadWriteLock(读写锁)', link: '/concurrent/lock/reentrant-read-write-lock' },
                { text: 'Condition 及其等待通知机制', link: '/concurrent/lock/condition' },
                { text: 'LockSupport', link: '/concurrent/lock/lock-support' },
                { text: '深入理解 AbstractQueuedSynchronizer(AQS)', link: '/concurrent/lock/aqs-deep-dive' }
              ]
            },
            {
              text: '并发容器',
              collapsed: true,
              items: [
                { text: 'ThreadLocal', link: '/concurrent/container/thread-local' },
                { text: 'ThreadLocal 内存泄漏问题', link: '/concurrent/container/thread-local-memory-leak' },
                { text: 'BlockingQueue', link: '/concurrent/container/blocking-queue' },
                { text: 'ArrayBlockingQueue 与 LinkedBlockingQueue', link: '/concurrent/container/array-linked-blocking-queue' },
                { text: 'ConcurrentLinkedQueue', link: '/concurrent/container/concurrent-linked-queue' },
                { text: 'ConcurrentHashMap (JDK 1.8)', link: '/concurrent/container/concurrent-hash-map' },
                { text: 'CopyOnWriteArrayList', link: '/concurrent/container/copy-on-write-array-list' }
              ]
            },
            {
              text: 'Executor 体系',
              collapsed: true,
              items: [
                { text: 'ThreadPoolExecutor 实现原理', link: '/concurrent/executor/thread-pool-executor' },
                { text: 'Executors 创建四种常见线程池', link: '/concurrent/executor/executors-thread-pools' },
                { text: 'ScheduledThreadPoolExecutor', link: '/concurrent/executor/scheduled-thread-pool-executor' },
                { text: 'FutureTask', link: '/concurrent/executor/future-task' }
              ]
            },
            {
              text: '原子操作类',
              collapsed: true,
              items: [
                { text: 'Java atomic 包原子操作类总结', link: '/concurrent/atomic/atomic-package' }
              ]
            },
            {
              text: '并发工具',
              collapsed: true,
              items: [
                { text: 'CountDownLatch 与 CyclicBarrier', link: '/concurrent/tools/countdown-latch-and-cyclic-barrier' },
                { text: 'Semaphore 与 Exchanger', link: '/concurrent/tools/semaphore-and-exchanger' }
              ]
            },
            {
              text: '并发实践',
              collapsed: true,
              items: [
                { text: '生产者与消费者问题', link: '/concurrent/practice/producer-consumer' }
              ]
            }
          ]
        }
      ]
    },
    {
      text: 'Spring 生态',
      collapsed: true,
      items: [
        {
          text: 'Spring 基础',
          collapsed: true,
          items: [
            { text: 'Spring 概述', link: '/spring/basics/introduction' },
            { text: '控制反转(IOC)', link: '/spring/basics/ioc' },
            { text: '创建简单和复杂对象', link: '/spring/basics/creating-objects' },
            { text: 'AOP 切入点的表达式', link: '/spring/basics/aop-pointcut' },
            { text: '整合 Mybatis 思路分析', link: '/spring/basics/integrate-mybatis' },
            { text: '处理事务两种方式', link: '/spring/basics/transaction' },
            { text: '事务属性', link: '/spring/basics/transaction-attributes' },
            { text: '框架的注解式开发', link: '/spring/basics/annotation-development' }
          ]
        },
        {
          text: 'SpringMVC',
          collapsed: true,
          items: [
            { text: '概述', link: '/spring/mvc/introduction' },
            { text: '参数接收', link: '/spring/mvc/parameter-binding' },
            { text: '跳转方式', link: '/spring/mvc/view-navigation' },
            { text: '对 Ajax 的支持', link: '/spring/mvc/ajax-support' },
            { text: '数据传递机制', link: '/spring/mvc/data-passing' },
            { text: '请求参数中文乱码解决方案', link: '/spring/mvc/chinese-encoding' },
            { text: '文件上传和下载', link: '/spring/mvc/file-upload-download' },
            { text: '静态资源拦截问题', link: '/spring/mvc/static-resource-intercept' },
            { text: '拦截器', link: '/spring/mvc/interceptor' },
            { text: '全局异常处理', link: '/spring/mvc/global-exception-handling' }
          ]
        },
        {
          text: 'SpringBoot',
          collapsed: true,
          items: [
            { text: '编程概述', link: '/spring/boot/introduction' },
            { text: '配置热部署', link: '/spring/boot/devtools' },
            { text: '两种模版配置', link: '/spring/boot/template-config' },
            { text: '注入', link: '/spring/boot/injection' },
            { text: '创建对象的方式', link: '/spring/boot/creating-objects' },
            { text: '拦截器', link: '/spring/boot/interceptor' },
            { text: '切面编程', link: '/spring/boot/aop' },
            { text: 'thymeleaf 基本语法', link: '/spring/boot/thymeleaf' },
            { text: 'war 包部署', link: '/spring/boot/war-deployment' },
            { text: '文件上传和下载', link: '/spring/boot/file-upload-download' },
            { text: '集成 Mybatis', link: '/spring/boot/integrate-mybatis' }
          ]
        },
        {
          text: 'SpringCloud',
          collapsed: true,
          items: [
            { text: '微服务介绍', link: '/spring/cloud/microservices-intro' },
            { text: '服务注册中心介绍', link: '/spring/cloud/service-registry-intro' },
            { text: '服务间通信方式及 Ribbon 使用', link: '/spring/cloud/ribbon' },
            { text: '服务网关组件的使用', link: '/spring/cloud/service-gateway' },
            { text: 'SpringCloud 介绍及环境搭建', link: '/spring/cloud/springcloud-introduction' },
            { text: 'Eureka 基本使用', link: '/spring/cloud/eureka' },
            { text: 'Consul 基本使用', link: '/spring/cloud/consul' },
            { text: 'Consul 导入导出的使用', link: '/spring/cloud/consul-import-export' },
            { text: 'Hystrix 组件使用', link: '/spring/cloud/hystrix' },
            { text: 'Zuul 组件的使用', link: '/spring/cloud/zuul' },
            { text: 'Gateway 组件的使用', link: '/spring/cloud/gateway' },
            { text: 'Gateway 配置 HTTPS 证书', link: '/spring/cloud/gateway-https' },
            { text: 'Config 组件使用', link: '/spring/cloud/config' },
            { text: 'Bus 组件的使用', link: '/spring/cloud/bus' },
            { text: 'OpenFeign 组件的使用', link: '/spring/cloud/openfeign' }
          ]
        },
        {
          text: 'SpringCloud Alibaba',
          collapsed: true,
          items: [
            { text: '介绍及环境搭建', link: '/spring/cloud/alibaba-introduction' },
            { text: 'Nacos 使用', link: '/spring/cloud/alibaba-nacos' },
            { text: 'Sentinel 流量卫兵的使用', link: '/spring/cloud/alibaba-sentinel' }
          ]
        },
        {
          text: 'SpringSecurity',
          collapsed: true,
          items: [
            { text: '引入', link: '/spring/security/introduction' }
          ]
        },
        {
          text: 'Spring AI 2.0',
          collapsed: true,
          items: [
            { text: '概述', link: '/spring/ai2.0/introduction' },
            { text: 'HelloWorld搭建', link: '/spring/ai2.0/hello-world' },
            { text: 'Ollama 集成', link: '/spring/ai2.0/ollama-integration' },
            { text: 'Advisors 拦截器', link: '/spring/ai2.0/advisors' },
            { text: '对话与提示词工程', link: '/spring/ai2.0/conversation-prompt-engineering' },
            { text: '结构化输出', link: '/spring/ai2.0/structured-output' },
            { text: '会话记忆', link: '/spring/ai2.0/chat-memory' },
            { text: '工具调用', link: '/spring/ai2.0/tool-calling' },
            { text: '嵌入模型', link: '/spring/ai2.0/embedding-models' },
            { text: '向量数据库', link: '/spring/ai2.0/vector-databases' },
            { text: 'RAG检索增强生成' , link: '/spring/ai2.0/rag' },
            { text: 'MCP模型上下文协议', link: '/spring/ai2.0/mcp' },
            { text: '多模态支持', link: '/spring/ai2.0/multimodal-support' }
          ]
        },
        {
          text: 'LangChain4j',
          collapsed: true,
          items: [
            { text: '概述', link: '/spring/langchain4j/introduction' },
            { text: 'HelloWorld实现', link: '/spring/langchain4j/hello-world' },
            { text: '整合SpringBoot4', link: '/spring/langchain4j/springboot4-integration' },
            { text: 'Ai Service 使用', link: '/spring/langchain4j/ai-service' },
            { text: '流式响应输出', link: '/spring/langchain4j/streaming-response' },
            { text: '对话与提示词工程', link: '/spring/langchain4j/conversation-prompt-engineering' },
            { text: '结构化输出', link: '/spring/langchain4j/structured-output' },
            { text: '会话记忆', link: '/spring/langchain4j/chat-memory' },
            { text: '工具调用', link: '/spring/langchain4j/function-calling' },
            { text: '嵌入模型', link: '/spring/langchain4j/embedding-models' },
            { text: '向量数据库', link: '/spring/langchain4j/vector-databases' },
            { text: 'RAG检索增强生成' , link: '/spring/langchain4j/rag' },
            { text: 'MCP模型上下文协议', link: '/spring/langchain4j/mcp' },
            { text: '多模态支持', link: '/spring/langchain4j/multimodal-support' }
          ]
        }
      ]
    }
  ]
}

function sidebarAlgorithm() {
  return [
    {
      text: '概述',
      collapsed: true,
      items: [
        { text: '算法概述', link: 'overview/introduction' }
      ]
    },
    {
      text: '十大排序算法',
      collapsed: true,
      items: [
        { text: '冒泡排序', link: 'sort/bubble-sort' },
        { text: '选择排序', link: 'sort/selection-sort' },
        { text: '插入排序', link: 'sort/insertion-sort' },
        { text: '希尔排序', link: 'sort/shell-sort' },
        { text: '快速排序', link: 'sort/quick-sort' },
        { text: '归并排序', link: 'sort/merge-sort' },
        { text: '堆排序', link: 'sort/heap-sort' },
        { text: '计数排序', link: 'sort/counting-sort' },
        { text: '桶排序', link: 'sort/bucket-sort' },
        { text: '基数排序', link: 'sort/radix-sort' }
      ]
    },
    {
      text: '数据结构',
      collapsed: true,
      items: [
        { text: '概述', link: 'data-structure/introduction' },
        { text: '数据结构总览', link: 'data-structure/overview' },
        { text: '线性与非线性结构', link: 'data-structure/linear-and-nonlinear' },
        { text: '稀疏数组和队列', link: 'data-structure/sparse-array-and-queue' },
        { text: '图说 B 树', link: 'data-structure/b-tree' },
        { text: '图说 B+ 树', link: 'data-structure/b-plus-tree' }
      ]
    }
  ]
}

function sidebarDesignPattern() {
  return [
    {
      text: '设计原则',
      collapsed: true,
      items: [
        { text: '设计原则概述', link: 'principles/design-principles' },
        { text: '设计原则详解', link: 'principles/design-principles-detail' },
        { text: '支付功能实战举例', link: 'principles/payment-example' },
        { text: '支付功能实战举例(详)', link: 'principles/payment-example-detail' }
      ]
    },
    {
      text: '基础概念',
      collapsed: true,
      items: [
        { text: '设计模式概念', link: 'concepts/introduction' },
        { text: 'UML 类图', link: 'concepts/uml' }
      ]
    },
    {
      text: '创建型模式',
      collapsed: true,
      items: [
        { text: '单例模式', link: 'creational/singleton' },
        { text: '简单工厂模式', link: 'creational/simple-factory' },
        { text: '工厂方法模式', link: 'creational/factory-method' },
        { text: '抽象工厂模式', link: 'creational/abstract-factory' },
        { text: '建造者模式', link: 'creational/builder' },
        { text: '原型模式', link: 'creational/prototype' },
        { text: '创建型总结对比', link: 'creational/summary' }
      ]
    },
    {
      text: '结构型模式',
      collapsed: true,
      items: [
        { text: '适配器模式', link: 'structural/adapter' },
        { text: '桥接模式', link: 'structural/bridge' },
        { text: '装饰器模式', link: 'structural/decorator' },
        { text: '代理模式', link: 'structural/proxy' },
        { text: '外观模式', link: 'structural/facade' },
        { text: '组合模式', link: 'structural/composite' },
        { text: '享元模式', link: 'structural/flyweight' },
        { text: '结构型总结对比', link: 'structural/summary' }
      ]
    },
    {
      text: '行为型模式',
      collapsed: true,
      items: [
        { text: '责任链模式', link: 'behavioral/chain-of-responsibility' },
        { text: '命令模式', link: 'behavioral/command' }
      ]
    }
  ]
}

function sidebarDatabase() {
  return [
    {
      text: 'Oracle',
      collapsed: true,
      items: [
        { text: '创建表空间和用户', link: 'oracle-tablespace-and-user' },
        { text: 'ACL 操作', link: 'oracle-acl' },
        { text: '数据库导入导出 cmd 命令', link: 'oracle-import-export' },
        { text: 'Windows 配置监听', link: 'oracle-windows-listener' },
        { text: '存储过程包(触发器同步用户到 LDAP)', link: 'oracle-procedure-ldap-sync' },
        { text: '存储过程执行 Java 加密 (v1)', link: 'oracle-java-encryption-v1' },
        { text: '存储过程执行 Java 加密 (v2)', link: 'oracle-java-encryption-v2' }
      ]
    },
    {
      text: 'LDAP',
      collapsed: true,
      items: [
        { text: 'OpenLDAP 创建只读用户', link: 'openldap-readonly-user' },
        { text: 'Windows Server 2012 安装 AD-LDAP', link: 'ldap/windows-ad-ldap' }
      ]
    }
  ]
}

function sidebarMiddleware() {
  return [
    {
      text: 'Zookeeper',
      collapsed: true,
      items: [
        { text: '简介', link: 'zookeeper/introduction' },
        { text: '安装', link: 'zookeeper/installation' },
        { text: '配置文件详解', link: 'zookeeper/configuration' },
        { text: '客户端基本命令', link: 'zookeeper/client-commands' },
        { text: 'Java 客户端操作', link: 'zookeeper/java-client' },
        { text: '节点监听机制 Watch', link: 'zookeeper/watch-mechanism' },
        { text: '集群', link: 'zookeeper/cluster' }
      ]
    },
    {
      text: 'ElasticSearch 6',
      collapsed: true,
      items: [
        { text: '介绍', link: 'elasticsearch/v6/introduction' },
        { text: '安装', link: 'elasticsearch/v6/installation' },
        { text: '基本概念', link: 'elasticsearch/v6/concepts' },
        { text: '集群', link: 'elasticsearch/v6/cluster' },
        { text: '高级检索', link: 'elasticsearch/v6/advanced-search' },
        { text: '过滤查询 Filter Query', link: 'elasticsearch/v6/filter-query' },
        { text: 'IK 分词器', link: 'elasticsearch/v6/ik-analyzer' },
        { text: 'Java 操作', link: 'elasticsearch/v6/java-client' },
        { text: 'Spring Boot Data 操作', link: 'elasticsearch/v6/spring-boot-data' }
      ]
    },
    {
      text: 'ElasticSearch 7',
      collapsed: true,
      items: [
        { text: '高级设置', link: 'elasticsearch/v7/advanced-settings' },
        { text: '索引模板', link: 'elasticsearch/v7/index-template' },
        { text: '集群添加节点证书', link: 'elasticsearch/v7/cluster-node-cert' },
        { text: 'Kibana 安装与基本操作', link: 'elasticsearch/v7/kibana' }
      ]
    },
    {
      text: 'Seata 分布式事务',
      collapsed: true,
      items: [
        { text: 'Seata 与事务简介', link: 'seata/introduction' },
        { text: '分布式事务常见解决方案', link: 'seata/distributed-transaction-solutions' },
        { text: 'Seata 原理详解', link: 'seata/principles' },
        { text: '分布式基础案例搭建', link: 'seata/distributed-base-setup' },
        { text: 'AT 模式', link: 'seata/at-mode' },
        { text: '事务分组', link: 'seata/transaction-grouping' },
        { text: '事务日志 MySQL 持久化配置', link: 'seata/mysql-persistence' },
        { text: '集成 Nacos 注册/配置中心', link: 'seata/nacos-integration' }
      ]
    },
    {
      text: 'SkyWalking APM',
      collapsed: true,
      items: [
        { text: '从 7.0 升级到 8.2.0 分析', link: 'apm/skywalking-upgrade-7-to-8' },
        { text: '系统拓扑图接口说明', link: 'apm/skywalking-topology-api' }
      ]
    },
    {
      text: 'WebLogic',
      collapsed: true,
      items: [
        { text: '安装补丁', link: 'weblogic/install-patch' }
      ]
    }
  ]
}

function sidebarDevops() {
  return [
    {
      text: 'Docker',
      collapsed: true,
      items: [
        { text: '基本概念', link: 'docker/introduction' },
        { text: '常用命令', link: 'docker/common-commands' },
        { text: '镜像原理', link: 'docker/image-principle' },
        { text: 'Dockerfile 使用', link: 'docker/dockerfile' },
        { text: 'Dockerfile 构建 SpringBoot', link: 'docker/dockerfile-spring-boot' },
        { text: '网络配置', link: 'docker/networking' },
        { text: '数据卷配置', link: 'docker/volumes' },
        { text: '安装常用服务', link: 'docker/install-common-services' },
        { text: '开启远程安全访问', link: 'docker/remote-secure-access' },
        { text: 'Docker Compose', link: 'docker/compose' },
        { text: 'Docker Machine', link: 'docker/machine' },
        { text: 'Docker Swarm', link: 'docker/swarm' },
        { text: 'Portainer 可视化', link: 'docker/portainer' },
        { text: '配置私有仓库 registry', link: 'docker/private-registry' },
        { text: 'Nexus3 介绍与安装', link: 'docker/nexus3-introduction' },
        { text: 'Nexus3 管理 Maven', link: 'docker/nexus3-maven' },
        { text: 'Nexus3 管理 Docker', link: 'docker/nexus3-docker' },
        { text: 'buildx 构建多平台镜像', link: 'docker/buildx-multiplatform' },
        { text: '解锁网易云音乐', link: 'docker/unlock-netease-music' }
      ]
    },
    {
      text: 'Kubernetes 基础',
      collapsed: true,
      items: [
        { text: '01 初识 Kubernetes', link: 'k8s/basics/01-introduction' },
        { text: '02 集群组件与架构', link: 'k8s/basics/02-architecture' },
        { text: '03 集群搭建', link: 'k8s/basics/03-cluster-setup' },
        { text: '04 Pod 介绍', link: 'k8s/basics/04-pod-introduction' },
        { text: '05 Pod 基本操作', link: 'k8s/basics/05-pod-operations' },
        { text: '06 Pod 标签', link: 'k8s/basics/06-pod-labels' },
        { text: '07 Pod 生命周期', link: 'k8s/basics/07-pod-lifecycle' },
        { text: '08 Container 生命周期', link: 'k8s/basics/08-container-lifecycle' },
        { text: '09 Container 重启策略', link: 'k8s/basics/09-container-restart-policy' }
      ]
    },
    {
      text: 'Kubernetes 快速上手',
      collapsed: true,
      items: [
        { text: 'K8s 简介', link: 'k8s/tutorials/introduction' },
        { text: '集群安装', link: 'k8s/tutorials/cluster-installation' },
        { text: '部署应用', link: 'k8s/tutorials/deploy-application' },
        { text: '命名空间', link: 'k8s/tutorials/namespace' },
        { text: 'Service', link: 'k8s/tutorials/service' },
        { text: 'Ingress', link: 'k8s/tutorials/ingress' },
        { text: 'ConfigMap 与 Secret', link: 'k8s/tutorials/configmap-and-secret' },
        { text: '数据持久化', link: 'k8s/tutorials/persistent-volume' },
        { text: 'StatefulSet', link: 'k8s/tutorials/statefulset' },
        { text: 'Helm', link: 'k8s/tutorials/helm' }
      ]
    },
    {
      text: 'Kubernetes 深入',
      collapsed: true,
      items: [
        { text: '基本概念', link: 'k8s/advanced/concepts' },
        { text: '架构设计', link: 'k8s/advanced/architecture' },
        { text: '部署 - kubeadm', link: 'k8s/advanced/deploy-kubeadm' },
        { text: '部署 - kubeadm 方式二', link: 'k8s/advanced/deploy-kubeadm-2' },
        { text: '部署 - Docker Desktop', link: 'k8s/advanced/deploy-docker-desktop' },
        { text: 'Dashboard 部署', link: 'k8s/advanced/dashboard' },
        { text: '部署 Pod', link: 'k8s/advanced/deploy-pod' },
        { text: '部署容器存储插件', link: 'k8s/advanced/storage-plugin' },
        { text: '深入理解 Pod', link: 'k8s/advanced/pod-deep-dive' },
        { text: 'Pod 实现原理与设计模式', link: 'k8s/advanced/pod-principle' },
        { text: '控制器(Controller)模型', link: 'k8s/advanced/controller-model' },
        { text: '深入理解 StatefulSet', link: 'k8s/advanced/statefulset-deep-dive' },
        { text: '深入理解 DaemonSet', link: 'k8s/advanced/daemonset-deep-dive' },
        { text: '搭建 MySQL 集群(非 Operator)', link: 'k8s/advanced/mysql-cluster' }
      ]
    },
    {
      text: 'Jenkins',
      collapsed: true,
      items: [
        { text: '介绍与安装', link: 'jenkins/introduction' },
        { text: 'Pipeline 使用', link: 'jenkins/pipeline' },
        { text: 'Pipeline 中使用 Docker', link: 'jenkins/pipeline-with-docker' },
        { text: '创建多分支 Pipeline', link: 'jenkins/multibranch-pipeline' }
      ]
    },
    {
      text: 'Grafana 告警',
      collapsed: true,
      items: [
        { text: '01 创建简单的告警', link: 'grafana/01-create-simple-alert' },
        { text: '02 配置通知策略', link: 'grafana/02-notification-policies' },
        { text: '03 分组告警通知', link: 'grafana/03-grouped-notification' },
        { text: '04 配置通知模板', link: 'grafana/04-notification-template' },
        { text: '05 基于动态标签的路由告警', link: 'grafana/05-dynamic-label-routing' },
        { text: '06 告警关联到可视化图表', link: 'grafana/06-link-alert-to-chart' }
      ]
    },
    {
      text: 'Linux',
      collapsed: true,
      items: [
        { text: 'RedHat 8.4 初始化', link: 'linux/redhat8-init' },
        { text: 'CentOS 下载 rpm 全量依赖包', link: 'linux/centos-download-rpm-deps' },
        { text: 'createrepo 自建仓库教程', link: 'linux/createrepo-tutorial' },
        { text: 'pushd 与 popd 用法', link: 'linux/pushd-popd' },
        { text: '搭建 Bitwarden', link: 'linux/setup-bitwarden' },
        { text: '部署博客', link: 'linux/deploy-blog' },
        { text: '微服务自动部署命令说明', link: 'linux/microservice-auto-deploy' }
      ]
    },
    {
      text: '操作系统',
      collapsed: true,
      items: [
        { text: 'CentOS 7 设置 hostname', link: 'os/centos7-hostname' },
        { text: 'CentOS 7 防火墙 firewalld-cmd', link: 'os/centos7-firewalld' },
        { text: '扩展 Linux 根目录大小', link: 'os/extend-root-disk' },
        { text: 'Mac Launchpad 图标配置', link: 'os/mac-launchpad-config' }
      ]
    }
  ]
}

function sidebarFrontend() {
  return [
    {
      text: 'TypeScript',
      collapsed: true,
      items: [
        { text: '简介', link: 'typescript/introduction' },
        { text: '安装', link: 'typescript/installation' },
        { text: '基础语法', link: 'typescript/syntax' },
        { text: '基础类型', link: 'typescript/basic-types' },
        { text: '变量声明', link: 'typescript/variable-declaration' },
        { text: '运算符', link: 'typescript/operators' },
        { text: '条件语句', link: 'typescript/conditional-statements' },
        { text: '循环', link: 'typescript/loops' },
        { text: '函数', link: 'typescript/functions' },
        { text: 'Number', link: 'typescript/number' },
        { text: 'String', link: 'typescript/string' },
        { text: 'Array', link: 'typescript/array' },
        { text: '元组', link: 'typescript/tuple' },
        { text: '联合类型', link: 'typescript/union-type' },
        { text: 'Map 对象', link: 'typescript/map' },
        { text: '对象', link: 'typescript/object' },
        { text: '接口', link: 'typescript/interface' },
        { text: '类', link: 'typescript/class' },
        { text: '命名空间', link: 'typescript/namespace' },
        { text: '模块', link: 'typescript/module' },
        { text: '声明文件', link: 'typescript/declaration-file' }
      ]
    },
    {
      text: 'ES6',
      collapsed: true,
      items: [
        { text: '简介', link: 'es6/introduction' },
        { text: '环境搭建', link: 'es6/setup' },
        { text: 'let 与 const', link: 'es6/let-and-const' },
        { text: '解构赋值', link: 'es6/destructuring' },
        { text: 'Symbol', link: 'es6/symbol' },
        { text: 'Map 与 Set', link: 'es6/map-and-set' },
        { text: 'Reflect 与 Proxy', link: 'es6/reflect-and-proxy' }
      ]
    }
  ]
}

function sidebarMobile() {
  return [
    {
      text: '微信小程序',
      collapsed: true,
      base: '/mobile/wechat-miniprogram/',
      items: [
        {
          text: '框架',
          collapsed: true,
          base: '/mobile/wechat-miniprogram/framework/',
          items: [
            { text: '框架介绍与目录结构', link: 'introduction' },
            { text: '配置', link: 'configuration' },
            { text: '应用和页面生命周期', link: 'lifecycle' },
            { text: '框架 API', link: 'api' },
            { text: 'WXML 教程', link: 'wxml' },
            { text: 'WXSS 教程', link: 'wxss' },
            { text: 'WXS 教程', link: 'wxs' },
            { text: '后端接入 Java 接口', link: 'backend-java-api' }
          ]
        },
        {
          text: '内置组件',
          collapsed: true,
          base: '/mobile/wechat-miniprogram/components/',
          items: [
            { text: '组件简单介绍', link: 'overview' },
            { text: '原生组件说明', link: 'native' },
            { text: '组件基础内容', link: 'basic' },
            { text: '视图容器组件', link: 'view-container' },
            { text: '表单组件', link: 'form' },
            { text: '导航组件', link: 'navigation' },
            { text: '媒体组件', link: 'media' },
            { text: '地图组件', link: 'map' },
            { text: '画布组件', link: 'canvas' },
            { text: '开放能力组件', link: 'open-ability' }
          ]
        },
        {
          text: '自定义组件',
          collapsed: true,
          base: '/mobile/wechat-miniprogram/custom-component/',
          items: [
            { text: '简单入门', link: 'introduction' },
            { text: 'Component 构造器', link: 'component-constructor' },
            { text: '组件生命周期', link: 'lifecycle' },
            { text: '模版与样式', link: 'template-and-style' },
            { text: '组件间通信与事件', link: 'communication-and-events' },
            { text: '组件间关系', link: 'component-relations' },
            { text: 'behaviors', link: 'behaviors' },
            { text: '数据监听', link: 'data-observer' },
            { text: '纯数据字段', link: 'pure-data-fields' },
            { text: '抽象节点', link: 'abstract-node' },
            { text: '占位组件', link: 'placeholder-component' },
            { text: '自定义组件扩展', link: 'extension' },
            { text: '性能统计信息', link: 'performance-stats' },
            { text: '单元测试', link: 'unit-test' },
            { text: '开发第三方组件', link: 'third-party' }
          ]
        }
      ]
    },
    {
      text: 'uni-app',
      collapsed: true,
      base: '/mobile/uni-app/',
      items: [
        { text: '简介与环境搭建', link: 'introduction' },
        { text: 'pages页面路由', link: 'pages' },
        { text: 'uni.scss内置全局样式变量', link: 'uni-scss' },
        { text: 'App.vue使用', link: 'app-vue' },
        { text: 'js与css语法', link: 'js-and-css' },
        { text: '组件api接口与模板', link: 'component-api-and-template' },
        { text: '与SpringBoot集成', link: 'springboot-integration' }
      ]
    }
  ]
}

function sidebarTools() {
  return [
    {
      text: 'Gradle / Groovy',
      collapsed: true,
      items: [
        { text: 'Gradle 介绍与安装', link: 'build/gradle-introduction' },
        { text: 'Gradle 与 IDEA 集成', link: 'build/gradle-idea-integration' },
        { text: 'Groovy 基础入门', link: 'build/groovy-basics' },
        { text: 'Groovy 仓库配置', link: 'build/groovy-repository' }
      ]
    },
    {
      text: '杂项工具',
      collapsed: true,
      items: [
        { text: 'Git 操作总结', link: 'misc/git-operations' },
        { text: 'Swagger 简介', link: 'misc/swagger-introduction' },
        { text: 'Hexo 升级步骤', link: 'misc/hexo-upgrade' },
        { text: 'Debian 9 开启 BBR', link: 'misc/debian9-bbr' },
        { text: 'CentOS rpm 依赖包', link: 'misc/centos-rpm-deps' },
        { text: 'Debian 9 安装 Shadowsocks', link: 'misc/debian9-shadowsocks' },
        { text: 'AWS 安装 Docker 和 SSR', link: 'misc/aws-docker-ssr' },
        { text: 'Linux 修改目录权限', link: 'misc/linux-permissions' },
        { text: 'Linux 管道符', link: 'misc/linux-pipe' },
        { text: 'Keytool 创建证书', link: 'misc/keytool-create-cert' },
        { text: 'OpenSSL 创建证书', link: 'misc/openssl-create-cert' },
        { text: '微服务 JWT 认证', link: 'misc/microservice-jwt-auth' },
        { text: '数据库文档辅助 SQL', link: 'misc/database-doc-sql' },
        { text: 'DataGrip SYSDBA 连接 Oracle', link: 'misc/datagrip-sysdba-oracle' }
      ]
    }
  ]
}

function socialLinks() {
  return [
    { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
  ]
}
