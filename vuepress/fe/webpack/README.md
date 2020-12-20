---
title: Summary
---

### [Webpack面试题](https://juejin.cn/post/6844904094281236487)
### [从源码窥探Webpack4.x原理](https://juejin.cn/post/6844904046294204429)

### [webpack小书](https://www.timsrc.com/article/2/webpack-book)

### [Webpack揭秘](https://juejin.cn/post/6844903685407916039)

### Webpack中publicPath详解
> [文章](https://juejin.im/post/6844903601060446221)
>
### [由浅入深配置webpack4](https://juejin.im/post/6859888538004783118)

### [手写webpack核心原理](https://juejin.im/post/6854573217336541192)
### [体积减少80%！释放webpack tree-shaking的真正潜力](https://juejin.cn/post/6844903769646317576)
    

### [Vite 原理分析](https://juejin.cn/post/6881078539756503047)852


### [前端工程化](https://juejin.cn/post/6844904132512317453)

前端工程化可以分成四个方面来说，分别为模块化、组件化、规范化和自动化。

#### 模块化
模块化是指将一个文件拆分成多个相互依赖的文件，最后进行统一的打包和加载，这样能够很好的保证高效的多人协作。其中包含

- JS 模块化：CommonJS、AMD、CMD 以及 ES6 Module。
- CSS 模块化：Sass、Less、Stylus、BEM、CSS Modules 等。其中预处理器和 BEM 都会有的一个问题就是样式覆盖。而 CSS Modules 则是通过 JS 来管理依赖，最大化的结合了 JS 模块化和 CSS 生态，比如 Vue 中的 style scoped。
- 资源模块化：任何资源都能以模块的形式进行加载，目前大部分项目中的文件、CSS、图片等都能直接通过 JS 做统一的依赖关系处理。

#### 组件化
不同于模块化，模块化是对文件、对代码和资源拆分，而组件化则是对 UI 层面的拆分。
通常，我们会需要对页面进行拆分，将其拆分成一个一个的零件，然后分别去实现这一个个零件，最后再进行组装。
在我们的实际业务开发中，对于组件的拆分我们需要做不同程度的考量，其中主要包括细粒度和通用性这两块的考虑。
对于业务组件，你更多需要考量的是针对你负责业务线的一个适用度，即你设计的业务组件是否成为你当前业务的 “通用” 组件。
#### 规范化
正所谓无规矩不成方圆，一些好的规范则能很好的帮助我们对项目进行良好的开发管理。规范化指的是我们在工程开发初期以及开发期间制定的系列规范，其中又包含了

- 项目目录结构
- 编码规范：对于编码这块的约束，一般我们都会采用一些强制措施，比如 ESLint、StyleLint 等。
- 联调规范
- 文件命名规范
- 样式管理规范：目前流行的样式管理有 BEM、Sass、Less、Stylus、CSS Modules 等方式。
- git flow 工作流：其中包含分支命名规范、代码合并规范等。
- 定期 code review
- … 等等

#### 自动化
从最早先的 grunt、gulp 等，再到目前的 webpack、parcel。这些自动化工具在自动化合并、构建、打包都能为我们节省很多工作。而这些只是前端自动化其中的一部分，前端自动化还包含了持续集成、自动化测试等方方面面。


## core-js

### core-js介绍
其实core-js是我们能够使用新的API的最重要的包，然而一般情况它隐藏在webpack编译后的代码中，我们一般不会去查看，所以容易被遗忘，我们在webpack生成环境下，查看编译后的代码，可以看到例如includes就是从core-js导出到我们的代码去的。

![](./image/core_js.png)

#### core-js是什么
- **它是JavaScript标准库的polyfill**
- 它尽可能的进行模块化，让你能选择你需要的功能
- **它可以不污染全局空间**
- 它和babel高度集成，可以对core-js的引入进行最大程度的优化

### [core-js@3 特性概览](https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelpreset-env)
- 支持ECMAScript稳定功能，引入core-js@3冻结期间的新功能，比如flat

- 加入到ES2016-ES2019中的提案，现在已经被标记为稳定功能

- **更新了提案的实现，增加了proposals配置项，由于提案阶段不稳定，需要谨慎使用**

- **增加了对一些web标准的支持，比如URL 和 URLSearchParams**

- **现在支持原型方法，同时不污染原型****

- 删除了过时的特性

### core-js@3与babel
以前我们实现API的时候，会引入整个polyfill,其实polyfill只是包括了以下两个包

- `core-js`
- `regenerator-runtime`

`core-js@3`升级之后弃用了`@babel/polyfill`，以下是等价实现

```javascript
// babel.config.js
presets: [
  ["@babel/preset-env", {
    useBuiltIns: "entry", // or "usage"
    corejs: 3,
  }]
]

import "core-js/stable";
import "regenerator-runtime/runtime";
```

## 简述 webpack 工作流程

### 概念

**Entry**：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。指示 webpack 应该使用哪个模块，来作为构建其内部 `依赖图(dependency graph) `的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。
默认值是 `./src/index.js`，但你可以通过在` webpack configuration `中配置 entry 属性，来指定一个（或多个）不同的入口起点。

**Output**：输出结果，Output属性告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。主要输出文件的默认值是 `./dist/main.js`，其他生成文件默认放置在 `./dist `文件夹中。

**Loader**：模块转换器，用于把模块原内容按照需求转换成新内容，webpack 只能理解 JavaScript 和 JSON 文件，loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效 模块，以供应用程序使用，以及被添加到依赖图中。
在更高层面，在 webpack 的配置中，loader 有两个属性：1、`test` 属性，识别出哪些文件会被转换。2、`use` 属性，定义出在进行转换时，应该使用哪个 loader。
Loader 本质上就是一个函数，对接收到的内容进行转换，返回转换后的结果。

**Plugin**：扩展插件，loader 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。Plugin 就是在 Webpack 的生命周期中进行各种操作，从而达到使用者目的插件。

**mode**: 模式，通过选择 development, production 或 none 之中的一个，来设置 mode 参数，可以启用 webpack 内置在相应环境下的优化。其默认值为 production。

**Module**：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。

webpack 模块能以各种方式表达它们的依赖关系。下面是一些示例：

- ES2015 `import` 语句
- CommonJS `require()` 语句
- AMD `define` 和 `require` 语句
- css/sass/less 文件中的 `@import` 语句。
- stylesheet `url(...)` 或者 HTML `<img src=...> `文件中的图片链接。

**Chunk**：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。

`Chunk`是代码块的意思，Webpack在执行构建的时候，会把多个模块合并为一个文件，该文件就称为`Chunk`。

Webpack 会为每个生成的 `Chunk` 取一个名称，`Chunk` 的名称和 `Entry` 的配置有关：

 - 如果 `entry` 是一个 `string` 或 `array`，就只会生成一个 `Chunk`，这时 `Chunk `的名称是 `main`；
 - 如果 `entry` 是一个 `object`，就可能会出现多个 `Chunk`，这时 `Chunk `的名称是 `object` 键值对里键的名称。


### 构建过程
关于 webpack 的工作流程，简单来说可以概括为以下几步：

- （1）初始化参数

解析 Webpack 配置参数，合并 `Shell` 传入和 `webpack.config.js` 文件配置的参数，形成最后的配置结果。

- （2）开始编译

上一步得到的参数初始化 `compiler` 对象，注册所有配置的插件，插件监听 Webpack 构建生命周期的事件节点，做出相应的反应，执行对象的 run 方法开始执行编译。

- （3）确定入口

从配置文件（ `webpack.config.js` ）中指定的 `entry` 入口，开始解析文件构建 `AS`T 语法树，找出依赖，递归下去。

 - （4）编译模块

递归中根据`文件类型`和 `loade`r 配置，调用所有配置的 `loader` 对文件进行转换，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。

-  （5）完成模块编译并输出

递归完后，得到每个文件结果，包含每个模块以及他们之间的依赖关系，根据 `entry` 配置生成代码块 `chunk` 。

- （6）输出完成

输出所有的 chunk 到文件系统。

[简单实现](https://mp.weixin.qq.com/s/NblP7A604kByp7pfdjcS0g)

精简流程

1. 初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler。

2. 编译：从 Entry 发出，针对每个 Module 串行调用对应的 Loader 去翻译文件内容，再找到该 Module 依赖的 Module，递归地进行编译处理。

3. 输出：对编译后的 Module 组合成 Chunk，把 Chunk 转换成文件，输出到文件系统。

### 常用loader

- file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件，当引入的文件是 `.png`、`.txt `等时，可以通过 `file-loader` 解析项目中的 `url `引入。根据配置将文件拷贝到相应的路径，并修改打包后文件的引入路径，让它指向正确的文件。;

- url-loader：`url-loader` 封装了 `file-loader` 且可以不依赖于 `file-loader` 单独使用，并且可以配置 `limit`。对小于 limit 大小的图片转换成 `Base64`，大于 limit 的时候使用 file-loader 里的方法。

- source-map-loader：加载额外的 Source Map 文件，以方便断点调试;

- image-loader：加载并且压缩图片文件;

- babel-loader：把 ES6 转换成 ES5;

- css-loader：负责处理 `@import`、`url` 等语句。例如 i`mport css from 'file.css'`、`url(image.png)`支持模块化、压缩、文件导入等特性;

- style-loader：把 CSS 代码注入到 JavaScript 中，在 DOM 里插入一个 `<style>` 标签，并且将 CSS 写入这个标签内;

- postcss-loader：负责进一步处理 CSS 文件，比如添加浏览器前缀，压缩 CSS 等。
- less-loader：将 .less 文件内容转换成 CSS。
- sass-loader：将 .sass 文件内容转换成 CSS。

- eslint-loader：通过 ESLint 检查 JavaScript 代码;

### 常用plugin
- clean-webpack-plugin：打包前自动清理 dist 目录，防止文件残留。
- copy-webpack-plugin：将单个文件或者整个目录复制到构建目录
- mini-css-extract-plugin：将 CSS 抽离出来单独打包并且通过配置可以设置是否压缩。
- html-webpack-plugin：这个插件可以配置生成一个 HTML5 文件，其中 script 标签包含所有 Webpack 包。如果你设置多个入口点，你可以据此实现多页面应用打包。
- webpack-bundle-analyzer,打包分析插件

### 热更新

#### [轻松理解webpack热更新原理](https://mp.weixin.qq.com/s/2L9Y0pdwTTmd8U2kXHFlPA)
#### [了不起的 Webpack HMR 学习指南（含源码分析）](https://mp.weixin.qq.com/s?__biz=MjM5MDc4MzgxNA==&mid=2458455505&idx=1&sn=b6d5258393b5c41b77cdc78299e94697&chksm=b1c22df886b5a4eed560aa9aa95bc27d473d58ebabb501ec98c282bdbc8308e9951cea59a060&scene=178&cur_album_id=1556921519803596802#rd)

在 Webpack 的 webpack.config.js 中：
1. 配置 devServer 的 hot 为 true
2. 在 plugins 中增加 new webpack.HotModuleReplacementPlugin()
```javascript
// webpack.config.js
const webpack = require('webpack');
module.exports = {
  //....
  devServer: {
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // 热更新插件
  ]
}
```
并且在入口文件配置：
```javascript
if(module && module.hot) {
  module.hot.accept()
}
```

#### 热更新原理

`HMR`（Hot Module Replacement） 的核心就是客户端从服务端拉去更新后的文件，准确的说是 `chunk diff`（chunk 需要更新的部分）。
实际上 `webpack-dev-server（WDS）`与浏览器之间维护了一个` Websocket`，当本地资源发生变化时，`WDS` 会向浏览器推送更新，并带上构建时的 `hash`，让客户端与上一次资源进行对比。
客户端对比出差异后会向 `WDS` 发起` Ajax` 请求来获取更改内容（文件列表、hash），这样客户端就可以再借助这些信息继续向 `WDS` 发起 `jsonp` 请求获取该 `chunk` 的增量更新。
后续的部分（拿到增量更新之后如何处理？哪些状态该保留？哪些又需要更新？）由 `HotModulePlugin` 来完成，提供了相关 API 以供开发者针对自身场景进行处理，像 `react-hot-loader` 和 `vue-loader` 都是借助这些 API 实现 HMR。


### 3 种 hash

文件指纹是打包后输出的文件名的后缀，对应着 3 种 hash。

1. `hash `是跟整个项目的构建相关，只要项目里有文件更改，整个项目构建的 `hash` 值都会更改，并且全部文件都共用相同的 `hash` 值。（粒度: 整个项目）
2. `chunkhash `是根据不同的入口进行依赖文件解析，构建对应的 chunk（模块），生成对应的 hash 值。只有被修改的 chunk（模块）在重新构建之后才会生成新的 hash 值，不会影响其它的 chunk。（粒度:entry 的每个入口文件）
3. `contenthash` 是跟每个生成的文件有关，每个文件都有一个唯一的 hash 值。当要构建的文件内容发生改变时，就会生成新的 hash 值，且该文件的改变并不会影响和它同一个模块下的其它文件。（粒度: 每个文件的内容）
