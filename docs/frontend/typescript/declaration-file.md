# TypeScript 声明文件

TypeScript 作为 JavaScript 的超集，在开发过程中不可避免要引用其他第三方的 JavaScript 的库。虽然通过直接引用可以调用库的类和方法，但是却无法使用TypeScript 诸如类型检查等特性功能。为了解决这个问题，需要将这些库里的函数和方法体去掉后只保留导出类型声明，而产生了一个描述 JavaScript 库和模块信息的声明文件。通过引用这个声明文件，就可以借用 TypeScript 的各种特性来使用库文件了。

假如我们想使用第三方库，比如 jQuery，我们通常这样获取一个 id 是 foo 的元素：

```js
$('#foo');
// 或
jQuery('#foo');
```

但是在 TypeScript 中，我们并不知道 $ 或 jQuery 是什么东西：

```typescript
jQuery('#foo');

// index.ts(1,1): error TS2304: Cannot find name 'jQuery'.
```

这时，我们需要使用 declare 关键字来定义它的类型，帮助 TypeScript 判断我们传入的参数类型对不对：

```typescript
declare var jQuery: (selector: string) => any;

jQuery('#foo');
```

declare 定义的类型只会用于编译时的检查，编译结果中会被删除。

上例的编译结果是：

```js
jQuery('#foo');
```

----

## 声明文件

声明文件以 **`.d.ts`** 为后缀，例如：

```sh
buubiu.d.ts
```

声明文件或模块的语法格式如下：

```typescript
declare module Module_Name {
}
```

TypeScript 引入声明文件语法格式：

```typescript
/// <reference path = "buubiu.d.ts" />
```

当然，很多流行的第三方库的声明文件不需要我们定义了，比如 jQuery 已经有人帮我们定义好了：[jQuery in DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/jquery/index.d.ts)。

----

## 实例

以下定义一个第三方库来演示：

```typescript CalcThirdPartyJsLib.js
var Buubiu;  
(function(Buubiu) {
    var Calc = (function () { 
        function Calc() { 
        } 
    })
    Calc.prototype.doSum = function (limit) {
        var sum = 0; 
 
        for (var i = 0; i <= limit; i++) { 
            sum = sum + i; 
        }
        return sum; 
    }
    Buubiu.Calc = Calc; 
    return Calc; 
})(Buubiu || (Buubiu = {})); 
var test = new Buubiu.Calc();
```

如果我们想在 TypeScript 中引用上面的代码，则需要设置声明文件 Calc.d.ts，代码如下：

```typescript Calc.d.ts
declare module Buubiu { 
   export class Calc { 
      doSum(limit:number) : number; 
   }
}
```

声明文件不包含实现，它只是类型声明，把声明文件加入到 TypeScript 中：

```typescript CalcTest.ts
/// <reference path = "Calc.d.ts" /> 
var obj = new Buubiu.Calc(); 
console.log(obj.doSum(10));
```

使用 tsc 命令来编译以上代码文件：

```sh
$ tsc CalcTest.ts
```

编译以上代码得到如下 JavaScript 代码：

```js CalcTest.js
/// <reference path = "Calc.d.ts" /> 
var obj = new Runoob.Calc();
console.log(obj.doSum(10));
```

最后我们编写一个 buubiu.html 文件，引入 CalcTest.js 文件及第三方库 CalcThirdPartyJsLib.js：

```html index.html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>TypeScript教程(buubiu.com)</title>
<script src = "CalcThirdPartyJsLib.js"></script> 
<script src = "CalcTest.js"></script> 
</head>
<body>
    <h1>声明文件测试</h1>
    <p>测试一下。</p>
</body>
</html>
```

浏览器打开该文件输出结果如下：

![](declaration-file-img/declaration-file-example.png)
