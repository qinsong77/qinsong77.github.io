---
title: 学习视频总结
---

>说明：根据B站学习视频 ：[【2020新课程】Webpack从原理到实战完整版-深入浅出，简单易学，前端工程师必学经典内容！](https://www.bilibili.com/video/BV1a741197Hn)学习整理

本次学习到的内容：

webpack产生的背景
1. 理解前端的模块化、模块化演变的过程
2. 理解webpack打包的核心思路
3. webpack核心：loader
4. webpack核心：plugin
## 1 webpack是什么
一个现代JavaScript应用程序的静态模块打包器

1. 默认：只对js进行处理，其他类型文件需要配置loader或者插件进行处理。
2. 打包：将各个依赖文件进行梳理打包，形成一个JS依赖文件。

## 2 webpack产生的背景
首先，为什么打包？因为：

1. 各个依赖文件的关系难以梳理，耦合程度较高，代码难以维护。
2. 把所有依赖包都打包成为一个js文件（bundle.js）文件，会有效降低文件请求次数，一定程度提升性能。
3. 逻辑多、文件多，项目复杂度提高

然后，为什么要用webpack？因为：

1. webpack除提供上述功能外，还充当了“翻译官”的角色，例如将ES6翻译为低版本的语法，将less、sass翻译为css等功能。
2. 强大而灵活，plugin可插拔。
3. 其他

## 3 先理解下前端模块化
类似于一个公司由各个部门组成，一个工程也由各个模块组成，高内聚低耦合，各司其职。先理解一下概念：

### 3-1 作用域
定义：运行时变量、函数、对象可访问性

作用域决定了代码中变量和其他资源的可见性

1. 全局作用域：

```javascript
var a = 1;
window.a; // 1
global.a; // 1
```

2. 局部作用域：

```javascript
function a(){
 var v = 1;
}
window.v; // undefined
```
如果在传统js写法中，引入多个script，就很容易造成全局作用域冲突而导致不可预测的问题：
```html
<body>
    <script scr="./moduleA.js"></sciprt>
    <script scr="./moduleB.js"></sciprt>
    <script scr="./moduleC.js"></sciprt>
</body>
```
改进步骤一，使用变量作用域形成局部作用域：

```javascript
// 定义模块内的局部作用域，以moduleA为例
    var Susan = {
    	name: "susan",
        sex: "female",
        tell: function(){
        	console.log("im susan")
        }
    }
```
但是步骤一无法保证模块属性内部安全性，比如可能不小心改掉属性值，可以通过立即执行函数进行改写，形成闭包。

那么可以进行改进步骤二：

ps:

什么是立即执行函数？可以点击[这里](https://blog.csdn.net/qq_33457248/article/details/80773496)进行参考。
什么是自由变量？简单来说是跨作用域的变量，可以点击[这里](https://www.cnblogs.com/pssp/p/5206240.html)进行参考。（里面有一个句很好的知识点：创建这个函数的时候，这个函数的作用域就已经决定了，而是不是在调用的时候）
```javascript
// 定义模块内的闭包作用域（模块作用域），以moduleA为例
    var SusanModule = (function(){
        var Susan = {
        // 自由变量
    	name: "susan",
        // 自由变量
        sex: "female"
      }
    // 只允许访问tell方法，不能访问和修改其他属性
    return {
        tell: function(){
            console.log("im susan")
         }
      }
    }
)()
```
对于步骤二还有一种写法，推荐使用这种写法，也是早期模块实现的方法：
```javascript
// 定义模块内的闭包作用域（模块作用域），以moduleA为例
    (function(window){
    	var name = "susan"
        var sex = "female"
        function tell(){
        	console.log("im ", this.name)
        }
        window.susanModule = {tell}
    })(window)// window作为参数传给
```
调用验证：
```javascript
window.susanModule.tell(); //im susan
```
### 3-2 模块化的优点
- 模块化的封装
- 重用性
- 解除耦合
#### 3-3 模块化方案进化史
随着模块化优势体现，开发者更倾向于使用模块化协同开发项目，于是在发展过程中形成了很多规范：AMD、COMMONJS、ES6 MODULE

#### 3-3-1 AMD
Asynchronous Module Definition（异步模块定义）
目前很少使用
````javascript
// 求和模块
    define("getSum", ["math"], function(math){
    	return function (a,b){
        	log("sum:"+ math.sum(a, b))
        }
    })
````
#### 3-3-2 COMMONJS
2009年出的规范，原本是为服务端的规范，后来nodejs采用commonjs模块化规范
```javascript
// 通过require函数来引用
    const math = require("./math");

    // 通过exports将其导出
    exports.getSum = function(a,b){
    	return a + b;
    }
```
#### 3-3-3 ES6 MODULE
目前使用最多的便是这个
````javascript
// 通过import函数来引用
    import math from "./math";

    // 通过export将其导出
    export function sum(a, b){
    	return a + b;
    }
````
## 4 webpack的打包机制
根据import引入等关键字，将依赖文件打包成一个文件。

### 4-1 输出文件
输出文件的大体结构：
```javascript
(function(module) {
    	var installedModules = {};
        function __webpack_require__(moduleId){
        	// SOME CODE
        }
        // 。。。
        return __webpack_require__(0); // entry file
    })([ /* modules array */])
```
上述结构中的核心方法：
```javascript
function __webpack_require__(moduleId){
    // check if module is in cache
    if(installedModules[moduleId]){
        return installedModules[moduleId].exports;
    }
    // create a new module (and put into cache)
    var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
    };
    // exe the module func
    modules[moduleId].call{
        module.exports,
        module,
        module.exports,
        __webpack_require__
    };
    // flag the module as loaded
    module.l = true;
    // return the exxports of the module
    return module.exports;
}
```
### 4-2 webpack打包过程
1. 从入口文件开始，分析整个应用的依赖树
2. 将每个依赖模块包装起来，放到一个数组中等待调用
3. 实现模块加载的方法，并把它放到模块执行的环境中，确保模块间可以互相调用
4. 把执行入口文件的逻辑放在一个函数表达式中，并立即执行这个函数

## 5 npm
npm install过程
1. 寻找报版本信息文件(package.json)，依照它来进行安装
2. 查找package.json中的依赖，并检查项目中其他的版本信息文件
3. 如果发现了新包，就更新版本信息文件
