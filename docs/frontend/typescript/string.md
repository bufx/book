# TypeScript String（字符串）

String 对象用于处理文本（字符串）。

**语法**

```typescript
var txt = new String("string");
//或者更简单方式：
var txt = "string";
```

----

## String 对象属性

### constructor

描述：对创建该对象的函数的引用。

**实例**

```typescript
var str = new String( "This is string" ); 
console.log("str.constructor is:" + str.constructor)
```

输出结果为：

```typescript
str.constructor is:function String() { [native code] }
```

### length

描述：返回字符串的长度。

**实例**

```typescript
var uname = new String("Hello World") 
console.log("Length "+uname.length)  // 输出 11
```

### prototype

描述：允许您向对象添加属性和方法。

**实例**

```typescript
function employee(id:number,name:string) { 
    this.id = id 
    this.name = name 
 } 
 var emp = new employee(123,"admin") 
 employee.prototype.email="admin@buubiu.com" // 添加属性 email
 console.log("员工号: "+emp.id) 
 console.log("员工姓名: "+emp.name) 
 console.log("员工邮箱: "+emp.email)
```

----

## String 对象方法

### charAt()

描述：返回在指定位置的字符。

**实例**

```typescript
var str = new String("BUUBIU"); 
console.log("str.charAt(0) 为:" + str.charAt(0)); // B
console.log("str.charAt(1) 为:" + str.charAt(1)); // U 
console.log("str.charAt(2) 为:" + str.charAt(2)); // U 
console.log("str.charAt(3) 为:" + str.charAt(3)); // B 
console.log("str.charAt(4) 为:" + str.charAt(4)); // I 
console.log("str.charAt(5) 为:" + str.charAt(5)); // U
```

### charCodeAt()

描述：返回在指定的位置的字符的 Unicode 编码。

**实例**

```typescript
var str = new String("BUUBIU"); 
console.log("str.charCodeAt(0) 为:" + str.charCodeAt(0)); // 66
console.log("str.charCodeAt(1) 为:" + str.charCodeAt(1)); // 85 
console.log("str.charCodeAt(2) 为:" + str.charCodeAt(2)); // 85 
console.log("str.charCodeAt(3) 为:" + str.charCodeAt(3)); // 66 
console.log("str.charCodeAt(4) 为:" + str.charCodeAt(4)); // 73
console.log("str.charCodeAt(5) 为:" + str.charCodeAt(5)); // 85
```

### concat()

描述：连接两个或更多字符串，并返回新的字符串。

**实例**

```typescript
var str1 = new String( "BUUBIU" ); 
var str2 = new String( "GOOGLE" ); 
var str3 = str1.concat( str2 ); 
console.log("str1 + str2 : "+str3) // BUUBIUGOOGLE
```

### indexOf()

描述：返回某个指定的字符串值在字符串中首次出现的位置。

**实例**

```typescript
var str1 = new String( "BUUBIU" ); 

var index = str1.indexOf( "BI" ); 
console.log("查找的字符串位置 :" + index );  // 3
```

### lastIndexOf()

描述：从后向前搜索字符串，并从起始位置（0）开始计算返回字符串最后出现的位置。

**实例**

```typescript
var str1 = new String( "This is string one and again string" ); 
var index = str1.lastIndexOf( "string" );
console.log("lastIndexOf 查找到的最后字符串位置 :" + index ); // 29
    
index = str1.lastIndexOf( "one" ); 
console.log("lastIndexOf 查找到的最后字符串位置 :" + index ); // 15
```

### localeCompare()

描述：用本地特定的顺序来比较两个字符串。

**实例**

```typescript
var str1 = new String( "This is beautiful string" );
  
var index = str1.localeCompare( "This is beautiful string");  

console.log("localeCompare first :" + index );  // 0
```

### match()

描述：查找找到一个或多个正则表达式的匹配。

**实例**

```typescript
var str="The rain in SPAIN stays mainly in the plain"; 
var n=str.match(/ain/g);  // ain,ain,ain
```

### replace()

描述：替换与正则表达式匹配的子串

**实例**

```typescript
var re = /(\w+)\s(\w+)/; 
var str = "zara ali"; 
var newstr = str.replace(re, "$2, $1"); 
console.log(newstr); // ali, zara
```

### search()

描述：检索与正则表达式相匹配的值

**实例**

```typescript
var re = /apples/gi; 
var str = "Apples are round, and apples are juicy.";
if (str.search(re) == -1 ) { 
   console.log("Does not contain Apples" ); 
} else { 
   console.log("Contains Apples" ); 
} 
```

### slice()

描述：提取字符串的片断，并在新的字符串中返回被提取的部分。

### split()

描述：把字符串分割为子字符串数组。

**实例**

```typescript
var str = "Apples are round, and apples are juicy."; 
var splitted = str.split(" ", 3); 
console.log(splitted)  // [ 'Apples', 'are', 'round,' ]
```

### substr()

描述：从起始索引号提取字符串中指定数目的字符。

### substring()

描述：提取字符串中两个指定的索引号之间的字符。

**实例**

```typescript
var str = "BUUBIU GOOGLE TAOBAO FACEBOOK"; 
console.log("(1,2): "    + str.substring(1,2));   // U
console.log("(0,10): "   + str.substring(0, 10)); // BUUBIU GOO
console.log("(5): "      + str.substring(5));     // B GOOGLE TAOBAO FACEBOOK
```

### toLocaleLowerCase()

描述：根据主机的语言环境把字符串转换为小写，只有几种语言（如土耳其语）具有地方特有的大小写映射。

**实例**

```typescript
var str = "Buubiu Google"; 
console.log(str.toLocaleLowerCase( ));  // buubiu google
```

### toLocaleUpperCase()

描述：据主机的语言环境把字符串转换为大写，只有几种语言（如土耳其语）具有地方特有的大小写映射。

**实例**

```typescript
var str = "Buubiu Google"; 
console.log(str.toLocaleUpperCase( ));  // BUUBIU GOOGLE
```

### toLowerCase()

描述：把字符串转换为小写。

**实例**

```typescript
var str = "Buubiu Google"; 
console.log(str.toLowerCase( ));  // buubiu google
```

### toUpperCase()

描述：把字符串转换为大写。

**实例**

```typescript
var str = "Buubiu Google"; 
console.log(str.toUpperCase( ));  // BUUBIU GOOGLE
```

### toString()

描述：返回字符串。

**实例**

```typescript
var str = "Buubiu"; 
console.log(str.toString( )); // Buubiu
```

### valueOf()

描述：返回指定字符串对象的原始值。

**实例**

```typescript
var str = new String("Buubiu"); 
console.log(str.valueOf( ));  // Buubiu
```
