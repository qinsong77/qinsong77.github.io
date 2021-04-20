---
title: 打包原理和Module federation
---


### chunk 和 module

module：每一个源码 js 文件其实都可以看成一个 module

chunk：每一个打包落地的 js 文件其实都是一个 chunk，每个 chunk 都包含很多 module

默认的 chunk 数量实际上是由你的入口文件的 js 数量决定的，但是如果你配置动态加载或者提取公共包的话，也会生成新的 chunk。

### 打包代码解读

demo
```javascript
src
---main.js
---moduleA.js
---moduleB.js
 
/**
* moduleA.js
*/
export default function testA() {
    console.log('this is A');
}
 
/**
* main.js
*/
import testA from './moduleA';
 
testA();
 
import('./moduleB').then(module => {
 
});
```
入口 js 是 main.js，里面就是直接引入 moduleA.js，然后动态引入 moduleB.js，那么最终生成的文件就是两个 chunk，分别是:

1. main.js 和 moduleA.js 组成的 bundle.js
2. `moduleB.js` 组成的 0.bundle.js
在webpack底层是用 `mainTemplate` 和 `chunkTemplate` 分别渲染出来的

import 变成了什么样?

整个 main.js 的代码打包后是下面这样的

```javascript
(function (module, __webpack_exports__, __webpack_require__) {
 
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony import */
    var _moduleA__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*!        ./moduleA */ "./src/moduleA.js");
 
    Object(_moduleA__WEBPACK_IMPORTED_MODULE_0__["default"])();
 
    __webpack_require__.e( /*! import() */ 0).then(__webpack_require__.bind(null, /*! ./moduleB             */ "./src/moduleB.js")).then(module => {
 
    });
 
})
```
可以看到，直接 `import moduleA` 最后会变成 `webpack_require`，而这个函数是 webpack 打包后的一个核心函数，就是解决依赖引入的。

**webpack_require的实现**
```javascript
function __webpack_require__(moduleId) {
    // Check if module is in cache
    // 先检查模块是否已经加载过了，如果加载过了直接返回
    if (installedModules[moduleId]) {
        return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    // 如果一个import的模块是第一次加载，那之前必然没有加载过，就会去执行加载过程
    var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
    };
    // Execute the module function
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    // Flag the module as loaded
    module.l = true;
    // Return the exports of the module
    return module.exports;
}
```
化一下它的实现，其实很简单，就是每次 require，先去缓存的 installedModules 这个缓存 map 里面看是否加载过了，如果没有加载过，那就从 modules 这个所有模块的 map 里去加载。

**modules 从哪里来的**

把 bundle.js 生成的 js 再简化一下：

```javascript
(function (modules) {})({
    "./src/main.js": (function (module, __webpack_exports__, __webpack_require__) {}),
    "./src/moduleA.js": (function (module, __webpack_exports__, __webpack_require__) {})
});
```
所以可以看到，这其实是个立即执行函数，modules 就是函数的入参，具体值就是包含的所有 module，到此，一个 chunk 是如何加载的，以及 chunk 如何包含 module就很清楚了。

#### 动态引入

上面的 chunk 就是一个 js 文件，所以维护了自己的局部 modules，然后自己使用没啥问题，但是动态引入我们知道是会生成一个新的 js 文件的，那这个新的 js 文件 0.bundle.js 里面是不是也有自己的 modules 呢？那 bundle.js 如何知道 0.bundle.js 里面的 modules 呢？

动态 import 的代码
```javascript
__webpack_require__.e( /*! import() */ 0)
  .then(__webpack_require__.bind(null, /*! ./moduleB  */ "./src/moduleB.js"))
  .then(module => {
 
});
```
从代码看，实际上就是外面套了一层 webpck_require.e，然后这是一个 promise，在 then 里面再去执行 webpack_require。
实际上 webpck_require.e 就是去加载 chunk 的 js 文件 0.bundle.js。

等到加载回来后它认为bundle.js 里面的 modules 就一定会有了 0.bundle.js 包含的那些 modules，这是如何做到的呢？

```javascript
(window["webpackJsonp"] = window["webpackJsonp"] || []).push(
    [
        [0],
        {
            "./src/moduleB.js": (function (module, __webpack_exports__, __webpack_require__) {})
        }
    ]
);
```
只是向一个全局数组里面 push 了自己的模块 id 以及对应的 modules。那看起来魔法的核心应该是在 bundle.js 里面了，事实的确也是如此。

```javascript
var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
jsonpArray.push = webpackJsonpCallback;
jsonpArray = jsonpArray.slice();
for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
var parentJsonpFunction = oldJsonpFunction;
```
劫持了 push 函数
