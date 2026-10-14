# ES6 Reflect 与 Proxy

## 概述

Proxy 与 Reflect 是 ES6 为了操作对象引入的 API 。

Proxy 可以对目标对象的读取、函数调用等操作进行拦截，然后进行操作处理。它不直接操作对象，而是像代理模式，通过对象的代理对象进行操作，在进行这些操作时，可以添加一些需要的额外操作。

Reflect 可以用于获取目标对象的行为，它与 Object 类似，但是更易读，为操作对象提供了一种更优雅的方式。它的方法与 Proxy 是对应的。

------

## Proxy

### 基本用法

一个 Proxy 对象由两个部分组成： target 、 handler 。在通过 Proxy 构造函数生成实例对象时，需要提供这两个参数。 target 即目标对象， handler 是一个对象，声明了代理 target 的指定行为。

```js
let target = {
    name: 'Tom',
    age: 24
}
let handler = {
    get: function(target, key) {
        console.log('getting '+key);
        return target[key]; // 不是target.key
    },
    set: function(target, key, value) {
        console.log('setting '+key);
        target[key] = value;
    }
}
let proxy = new Proxy(target, handler)
proxy.name     // 实际执行 handler.get
proxy.age = 25 // 实际执行 handler.set
// getting name
// setting age
// 25
 
// target 可以为空对象
let targetEpt = {}
let proxyEpt = new Proxy(targetEpt, handler)
// 调用 get 方法，此时目标对象为空，没有 name 属性
proxyEpt.name // getting name
// 调用 set 方法，向目标对象中添加了 name 属性
proxyEpt.name = 'Tom'
// setting name
// "Tom"
// 再次调用 get ，此时已经存在 name 属性
proxyEpt.name
// getting name
// "Tom"
 
// 通过构造函数新建实例时其实是对目标对象进行了浅拷贝，因此目标对象与代理对象会互相
// 影响
targetEpt
// {name: "Tom"}
 
// handler 对象也可以为空，相当于不设置拦截操作，直接访问目标对象
let targetEmpty = {}
let proxyEmpty = new Proxy(targetEmpty,{})
proxyEmpty.name = "Tom"
targetEmpty // {name: "Tom"}
```

### 实例方法

#### get(target, propKey, receiver)

```js
get(target, propKey, receiver)
```

1. 用于 target 对象上 propKey 的读取操作。

```js
let exam ={
    name: "Tom",
    age: 24
}
let proxy = new Proxy(exam, {
  get(target, propKey, receiver) {
    console.log('Getting ' + propKey);
    return target[propKey];
  }
})
proxy.name 
// Getting name
// "Tom"
```

2. get() 方法可以继承。

```js
let proxy = new Proxy({}, {
  get(target, propKey, receiver) {
      // 实现私有属性读取保护
      if(propKey[0] === '_'){
          throw new Erro(`Invalid attempt to get private     "${propKey}"`);
      }
      console.log('Getting ' + propKey);
      return target[propKey];
  }
});
 
let obj = Object.create(proxy);
obj.name
// Getting name
```

#### set(target, propKey, value, receiver)

```js
set(target, propKey, value, receiver)
```

用于拦截 target 对象上的 propKey 的赋值操作。如果目标对象自身的某个属性，不可写且不可配置，那么set方法将不起作用。

```js
let validator = {
    set: function(obj, prop, value) {
        if (prop === 'age') {
            if (!Number.isInteger(value)) {
                throw new TypeError('The age is not an integer');
            }
            if (value > 200) {
                throw new RangeError('The age seems invalid');
            }
        }
        // 对于满足条件的 age 属性以及其他属性，直接保存
        obj[prop] = value;
    }
};
let proxy= new Proxy({}, validator)
proxy.age = 100;
proxy.age           // 100
proxy.age = 'oppps' // 报错
proxy.age = 300     // 报错
```

第四个参数 receiver 表示原始操作行为所在对象，一般是 Proxy 实例本身。

```js
const handler = {
    set: function(obj, prop, value, receiver) {
        obj[prop] = receiver;
    }
};
const proxy = new Proxy({}, handler);
proxy.name= 'Tom';
proxy.name=== proxy // true
 
const exam = {}
Object.setPrototypeOf(exam, proxy)
exam.name = "Tom"
exam.name === exam // true
```

**注意，严格模式下，set代理如果没有返回true，就会报错。**

#### apply(target, ctx, args)

```js
apply(target, ctx, args)
```

用于拦截函数的调用、call 和 reply 操作。target 表示目标对象，ctx 表示目标对象上下文，args 表示目标对象的参数数组。

```js
function sub(a, b){
    return a - b;
}
let handler = {
    apply: function(target, ctx, args){
        console.log('handle apply');
        return Reflect.apply(...arguments);
    }
}
let proxy = new Proxy(sub, handler)
proxy(2, 1) 
// handle apply
// 1
```

#### has(target, propKey)

```js
has(target, propKey)
```

用于拦截 HasProperty 操作，即在判断 target 对象是否存在 propKey 属性时，会被这个方法拦截。此方法不判断一个属性是对象自身的属性，还是继承的属性。

```js
let  handler = {
    has: function(target, propKey){
        console.log("handle has");
        return propKey in target;
    }
}
let exam = {name: "Tom"}
let proxy = new Proxy(exam, handler)
'name' in proxy
// handle has
// true
```

**注意：此方法不拦截 for ... in 循环。**

#### construct(target, args)

```js
construct(target, args)
```

用于拦截 new 命令。返回值必须为对象。

```js
let handler = {
    construct: function (target, args, newTarget) {
        console.log('handle construct')
        return Reflect.construct(target, args, newTarget)  
    }
}
class Exam { 
    constructor (name) {  
        this.name = name 
    }
}
let ExamProxy = new Proxy(Exam, handler)
let proxyObj = new ExamProxy('Tom')
console.log(proxyObj)
// handle construct
// exam {name: "Tom"}
```

#### deleteProperty(target, propKey)

```js
deleteProperty(target, propKey)
```

用于拦截 delete 操作，如果这个方法抛出错误或者返回 false ，propKey 属性就无法被 delete 命令删除。

#### defineProperty(target, propKey, propDesc)

```js
defineProperty(target, propKey, propDesc)
```

用于拦截 Object.definePro若目标对象不可扩展，增加目标对象上不存在的属性会报错；若属性不可写或不可配置，则不能改变这些属性。

```js
let handler = {
    defineProperty: function(target, propKey, propDesc){
        console.log("handle defineProperty");
        return true;
    }
}
let target = {}
let proxy = new Proxy(target, handler)
proxy.name = "Tom"
// handle defineProperty
target
// {name: "Tom"}
 
// defineProperty 返回值为false，添加属性操作无效
let handler1 = {
    defineProperty: function(target, propKey, propDesc){
        console.log("handle defineProperty");
        return false;
    }
}
let target1 = {}
let proxy1 = new Proxy(target1, handler1)
proxy1.name = "Jerry"
target1
// {}
```

#### getOwnPropertyDescriptor(target, propKey)

**erty 操作**

```js
getOwnPropertyDescriptor(target, propKey)
```

用于拦截 Object.getOwnPropertyD() 返回值为属性描述对象或者 undefined 。

```js
let handler = {
    getOwnPropertyDescriptor: function(target, propKey){
        return Object.getOwnPropertyDescriptor(target, propKey);
    }
}
let target = {name: "Tom"}
let proxy = new Proxy(target, handler)
Object.getOwnPropertyDescriptor(proxy, 'name')
// {value: "Tom", writable: true, enumerable: true, configurable: 
// true}
```

#### getPrototypeOf(target)

**ptor 属性**

```js
getPrototypeOf(target)
```

主要用于拦截获取对象原型的操作。包括以下操作：

```js
- Object.prototype._proto_
- Object.prototype.isPrototypeOf()
- Object.getPrototypeOf()
- Reflect.getPrototypeOf()
- instanceof
```

```js
let exam = {}
let proxy = new Proxy({},{
    getPrototypeOf: function(target){
        return exam;
    }
})
Object.getPrototypeOf(proxy) // {}
```

注意，返回值必须是对象或者 null ，否则报错。另外，如果目标对象不可扩展（non-extensible），getPrototypeOf 方法必须返回目标对象的原型对象。

```js
let proxy = new Proxy({},{
    getPrototypeOf: function(target){
        return true;
    }
})
Object.getPrototypeOf(proxy)
// TypeError: 'getPrototypeOf' on proxy: trap returned neither object // nor null
```

#### isExtensible(target)

用于拦截 Object.isExtensible 操作。

该方法只能返回布尔值，否则返回值会被自动转为布尔值。

```js
let proxy = new Proxy({},{
    isExtensible:function(target){
        return true;
    }
})
Object.isExtensible(proxy) // true
```

注意：它的返回值必须与目标对象的isExtensible属性保持一致，否则会抛出错误。
