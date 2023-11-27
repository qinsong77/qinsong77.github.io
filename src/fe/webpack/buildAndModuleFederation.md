---
title: 打包原理和Module federation
---

- [webpack5 Module federation](http://www.alloyteam.com/2020/04/14338/)
- [最详细的Module Federation的实现原理讲解](https://juejin.cn/post/7151281452716392462)
### chunk 和 module

module：每一个源码 js 文件其实都可以看成一个 module

chunk：每一个打包落地的 js 文件其实都是一个 chunk，每个 chunk 都包含很多 module

默认的 chunk 数量实际上是由你的入口文件的 js 数量决定的，但是如果你配置动态加载或者提取公共包的话，也会生成新的 chunk。

### 打包代码解读

总结：模块引入会被打包成`webpack_require`函数引入模块并返回该模块，而`webpack_require`的实现，即每次require的时候，先去缓存的 `installedModules` 这个缓存 map 里面看是否加载过了，如果没有加载过，那就从` modules` 这个所有模块的 map 里去加载。
而整个bundle模块，就是个立即执行函数，`modules`就是函数的入参，具体值就是打包后的的所有 `module`。这种是一个chunk就是一个js文件，维护着自己局部的module,自己使用没有问题，对于动态引入的会生成一个新的 js 文件。

首先，动态 import 的代码会变成就是外面套了一层 `webpck_require.e`，然后这是一个 promise，在 then 里面再去执行 `webpack_require`的代码。实际上 `webpck_require.e` 就是去加载 chunk 的 js 文件，具体就是动态创建script
标签，脚本在完成时，resolve这个promise。

另一个重点是加载的chunk代码也做了相应的改装，代码是向一个全局数组里面 push 了自己的模块 id 以及对应的 modules。而在主文件bundle里，劫持了这个数组的push方法，作用是把模块加到自己的modules中。

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

### Module federation
Module federation allows a JavaScript application to dynamically run code from another bundle/build, on both client and server

允许运行时动态决定代码的引入和加载。

依赖前置，先去分析，然后生成配置文件，再去加载。

通过一个全局变量去搭建桥梁。

demo 
```
app1
---index.js 入口文件
---bootstrap.js 启动文件
---App.js react组件
 
app2
---index.js 入口文件
---bootstrap.js 启动文件
---App.js react组件
---Button.js react组件
```
这是文件结构，两个独立应用 app1 和 app2
```javascript
/** app1 **/
/**
* index.js
**/
import('./bootstrap');
 
/**
* bootstrap.js
**/
import('./bootstrap');
import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
 
ReactDOM.render(<App />, document.getElementById("root"));
 
/**
* App.js
**/
import('./bootstrap');
import React from "react";
 
import RemoteButton from 'app2/Button';
 
const App = () => (
  <div>
    <h1>Basic Host-Remote</h1>
    <h2>App 1</h2>
    <React.Suspense fallback="Loading Button">
      <RemoteButton />
    </React.Suspense>
  </div>
);
 
export default App;
```
app2的代码不需要关注，但在app中，`import RemoteButton from 'app2/Button';`，引入了app2的代码。即跨应用复用代码

####  Module federation 的配置
```javascript
/**
 * app1/webpack.config.ts
 */
{
    plugins: [
        new ModuleFederationPlugin({
            name: "app1",
            library: {
                type: "var",
                name: "app1"
            },
            remotes: {
                app2: "app2"
            },
            shared: ["react", "react-dom"]
        })
    ]
}
```
Module federation 的配置主要：
1. 用了远程模块 app2，它叫 app2
2. 用了共享模块，它叫 shared
remotes 和 shared 还是有一点区别的。

生成的 html 文件：
```html
<html>
  <head>
    <script src="app2/remoteEntry.js"></script>
  </head>
  <body>
    <div id="root"></div>
  <script src="app1/app1.js"></script><script src="app1/main.js"></script></body>
</html>
```
app1 打包生成的文件：
```
app1/index.html
app1/app1.js
app1/main.js
app1/react.js
app1/react-dom.js
app1/src_bootstrap.js
```
最终页面表现以及加载的 js：

![](./image/module_fun_html_load.png)

从上往下加载的 js 时序其实是很有讲究的，后面将会是解密的关键：
```
app2/remoteEntry.js
app1/app1.js
app1/main.js
app1/react.js
app1/react-dom.js
app2/src_button_js.js
app1/src_bootstrap.js
```
这里最需要关注的其实还是每个文件从哪里加载，在不去分析原理之前，看文件加载我们至少有这些结论：

1. remotes 的代码自己不打包，类似 external，例如 app2/button 就是加载 app2 打包的代码
2. shared 的代码自己是有打包的

### Module federation 的原理

 webpack 的文件模块核心，即使升级 5，也没有发生变化
 
 ![](./image/app1app2.png)
 
app1 和 app2 还是有自己的 modules，所以实现的关键就是两个 modules 如何同步，或者说如何注入

####  import 变成了什么
```javascript
// import源码
import RemoteButton from 'app2/Button';
 
// import打包代码 在app1/src_bootstrap.js里面
/* harmony import */
var app2_Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! app2/Button */ "?ad8d");
/* harmony import */
var app2_Button__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(app2_Button__WEBPACK_IMPORTED_MODULE_1__);
```
这段并没有什么特别。

注意看加载的 js 顺序：
```javascript
app2/remoteEntry.js
app1/app1.js
app1/main.js
app1/react.js
app1/react-dom.js
app2/src_button_js.js // app2的button竟然先加载了，比我们的自己启动文件还前面
app1/src_bootstrap.js
```
#### main.js 文件内容
```javascript
(() => { // webpackBootstrap
    var __webpack_modules__ = ({})
 
    var __webpack_module_cache__ = {};
 
    function __webpack_require__(moduleId) {
 
        if (__webpack_module_cache__[moduleId]) {
            return __webpack_module_cache__[moduleId].exports;
        }
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        return module.exports;
    }
    __webpack_require__.m = __webpack_modules__;
 
    __webpack_require__("./src/index.js");
})()
```
webpack_modules 内部的实现:

```javascript
var __webpack_modules__ = ({
 
    "./src/index.js": ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {
        __webpack_require__.e( /*! import() */ "src_bootstrap_js").then(__webpack_require__.bind(__webpack_require__, /*! ./bootstrap */ "./src/bootstrap.js"));
    }),
 
    "container-reference/app2": ((module) => {
        "use strict";
        module.exports = app2;
    }),
 
    "?8bfd": ((module, __unused_webpack_exports, __webpack_require__) => {
        "use strict";
        var external = __webpack_require__("container-reference/app2");
        module.exports = external;
    })
});
``` 
