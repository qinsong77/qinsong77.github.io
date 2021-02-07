---
title: Summary
---

### [Webpack4打包机制原理解析](https://mp.weixin.qq.com/s?__biz=MzI0MzIyMDM5Ng==&mid=2649826040&idx=1&sn=d00485f9421520699740404f8ecf3302&chksm=f175e83bc602612d32a2568bfb74f4a9f762b058e9ba39d976c355ae916c27bca73c9fa3d65a&mpshare=1&scene=24&srcid=02066BpnifF3iTrMe5n3rtCi&sharer_sharetime=1612548111719&sharer_shareid=1958dfa2b35b63c7a7463d11712f39df#rd)

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
    

### [Vite 原理分析](https://juejin.cn/post/6881078539756503047)


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


## Babel

**Babel is a JavaScript compiler.**

Babel就是一个JavaScript编译器，babel编译分为三个阶段，**解析（parse），转换（transform），生成（generate）**。
Babel本身不支持转换，转换是通过一个个 plugin实现。

![](./image/babel.png)

[Babel介绍](https://mp.weixin.qq.com/s/1OyBkl5NnFO1q86L7GjQwg)

[Babel7](https://juejin.cn/post/6844904008679686152)

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

- **现在支持原型方法，同时不污染原型**

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
#### vue/cli3下.browserslistrc文件含义

browserslist是用来配置项目的目标浏览器和nodejs版本范围，也就是通常说的兼容哪些浏览器的版本。

- " >1%" :代表着全球超过1%人使用的浏览器
- “last 2 versions” : 表示所有浏览器兼容到最后两个版本
- “not ie <=8” :表示IE浏览器版本大于8（实则用npx browserslist 跑出来不包含IE9 ）
- “safari >=7”:表示safari浏览器版本大于等于7

```.browserslistrc
> 1%
last 2 versions
not dead
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

从配置文件（ `webpack.config.js` ）中指定的 `entry` 入口，开始解析文件构建 `AST` 语法树，找出依赖，递归下去。

 - （4）编译模块

递归中根据`文件类型`和 `loader` 配置，调用所有配置的 `loader` 对文件进行转换，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。

-  （5）完成模块编译并输出

递归完后，得到每个文件结果，包含每个模块以及他们之间的依赖关系，根据 `entry` 配置生成代码块 `chunk` 。

- （6）输出完成

输出所有的 chunk 到文件系统。

[简单实现](https://mp.weixin.qq.com/s/NblP7A604kByp7pfdjcS0g)

精简流程

1. 初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler。

2. 编译：从 Entry 发出，针对每个 Module 串行调用对应的 Loader 去翻译文件内容，再找到该 Module 依赖的 Module，递归地进行编译处理。

3. 输出：对编译后的 Module 组合成 Chunk，把 Chunk 转换成文件，输出到文件系统。

![](./image/webpack_progress.png)

### 打包过程

webpack的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

webpack的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

1. 初始化参
2. 开始编译 用上一步得到的参数初始`Compiler`对象，加载所有配置的插件，通过执行对象的`run`方法开始执行编译
3. 确定入口 根据配置中的 `Entry` 找出所有入口文件
4. 编译模块 从入口文件出发，调用所有配置的 `Loader` 对模块进行编译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
5. 完成模块编译 在经过第4步使用 `Loader` 翻译完所有模块后， 得到了每个模块被编译后的最终内容及它们之间的依赖关系
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk,再将每个 Chunk 转换成一个单独的文件加入输出列表中，这是可以修改输出内容的最后机会
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，将文件的内容写入文件系统中。

在以上过程中， Webpack 会在特定的时间点广播特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，井且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。其实以上7个步骤，可以简单归纳为初始化、编译、输出，三个过程，而这个过程其实就是前面说的基本模型的扩展。

### 常用loader

- file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件，当引入的文件是 `.png`、`.txt `等时，可以通过 `file-loader` 解析项目中的 `url `引入。根据配置将文件拷贝到相应的路径，并修改打包后文件的引入路径，让它指向正确的文件。;

- url-loader：`url-loader` 封装了 `file-loader` 且可以不依赖于 `file-loader` 单独使用，并且可以配置 `limit`。对小于 limit 大小的图片转换成 `Base64`，大于 limit 的时候使用 file-loader 里的方法。

- source-map-loader：加载额外的 Source Map 文件，以方便断点调试;

- image-loader：加载并且压缩图片文件;

- babel-loader：把 ES6 转换成 ES5;

- css-loader：The css-loader interprets @import and url() like import/require() and will resolve them.负责处理 `@import`、`url` 等语句。例如 `import css from 'file.css'`、`url(image.png)`支持模块化、压缩、文件导入等特性;把 CSS 代码注入到 JavaScript 中

- style-loader：Inject CSS into the DOM，在 DOM 里插入一个 `<style>` 标签，并且将 CSS 写入这个标签内;

- postcss-loader：负责进一步处理 CSS 文件，比如添加浏览器前缀，压缩 CSS 等。
- less-loader：将 .less 文件内容转换成 CSS。
- sass-loader：将 .sass 文件内容转换成 CSS。

- eslint-loader：通过 ESLint 检查 JavaScript 代码;

### 常用plugin
- clean-webpack-plugin：打包前自动清理 dist 目录，防止文件残留。
- copy-webpack-plugin：将单个文件或者整个目录复制到构建目录
- mini-css-extract-plugin：将 CSS 抽离出来单独打包并且通过配置可以设置是否压缩。
- html-webpack-plugin：这个插件可以配置生成一个 HTML5 文件，其中 script 标签包含所有 Webpack 包。如果你设置多个入口点，你可以据此实现多页面应用打包。
- webpack-bundle-analyzer：打包分析插件
- speed-measure-webpack-plugin: 打包速度分析，**HardSourceWebpackPlugin 和 speed-measure-webpack-plugin 不能一起使用**
- [hard-source-webpack-plugin](https://github.com/mzgoddard/hard-source-webpack-plugin)（Webpack 4 的打包性能足够好的，dll继续维护的必要了, HardSourceWebpackPlugin is a plugin for webpack to provide an intermediate caching step for modules. In order to see results, you'll need to run webpack twice with this plugin: the first build will take the normal amount of time. The second build will be significantly faster.)

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

1. `hash `是跟整个项目的构建相关，只要项目里有文件更改，整个项目构建的 `hash` 值都会更改，并且全部文件都共用相同的 `hash` 值。（粒度: 整个项目）一旦只修改某一个文件，打包后就会造成所有文件的hash值都会改变，会导致未曾修改的文件的hash值变化，进一步会导致未修改的文件在浏览器的缓存失效了---不常用
2. `chunkhash `是根据不同的入口进行依赖文件解析，构建对应的 chunk（代码块），生成对应的 hash 值。只有被修改的 chunk 在重新构建之后才会生成新的 hash 值，不会影响其它的 chunk。如果在某一入口文件创建的关系依赖图上存在文件内容发生了变化，那么相应的入口文件的chunkhash才会发生变化，否则chunkhash就不会变化，所以chunkhash受它自身chunk的文件内容的影响，只要该chunk中的内容有变化，chunkhash就会变。（粒度:entry 的每个入口文件）因此一般在项目中会把公共库和其他文件拆开，并把公共库代码拆分到一起进行打包，因为公共库的代码变动较少，这样可以实现公共库的长效缓存。webpack4中支持了异步import功能，固，chunkhash也作用于此
3. `contenthash` 是跟每个生成的文件有关，每个文件都有一个唯一的 hash 值。当要构建的文件内容发生改变时，就会生成新的 hash 值，且该文件的改变并不会影响和它同一个模块下的其它文件。（粒度: 每个文件的内容）
使用chunkhash还存在一个问题，当一个JS文件引入了CSS文件（import 'xxx.css'），打包构建后它们的chunkhash值是相同的，因此如果更改了JS文件的内容，即使CSS文件内容没有更改，那么与这个JS关联的CSS文件的chunkhash也会跟着改变，这样就会导致未改变的CSS文件的缓存失效了。针对这种情况，我们可以使用mini-css-extract-plugin插件将CSS从JS文件中抽离出来并使用contenthash，来解决上述问题

`filename` 就是对应于 entry 里面的输入文件，经过webpack 打包后输出文件的文件名。指列在 `entry` 中，打包后输出的文件的名称。

`chunkFilename` 指未列在 entry 中，却又需要被打包出来的文件的名称。

```js
{
	    output: {
            // publicPath: './test',
            filename: 'js/[name].[hash].bundle.js',
            chunkFilename: 'js/[name].[chunkhash].js',
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash].css',
                chunkFilename: 'css/[name].[contenthash].css',
            }),
            // new BundleAnalyzerPlugin(),
            new CleanWebpackPlugin()
        ]
}
```

### Code Splitting

webpack 4 废弃了之前的不怎么好用的 `CommonsChunk`，取而代之的是 `SplitChunks`。

首先 webpack 总共提供了三种办法来实现 Code Splitting，如下：

- 入口配置：entry 入口使用多个入口文件；
- 抽取公有代码：使用 SplitChunks 抽取公有代码；
- 动态加载 ：动态加载一些代码。

#### SplitChunks

默认配置

```javascript
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async', 
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```
参数说明如下：

- chunks：表示从哪些chunks里面抽取代码，除了三个可选字符串值 initial、async、all 之外，还可以通过函数来过滤所需的 chunks；
- minSize：表示抽取出来的文件在压缩前的最小大小，默认为 30000；
- maxSize：表示抽取出来的文件在压缩前的最大大小，默认为 0，表示不限制最大大小；
- minChunks：表示被引用次数，默认为1；
- maxAsyncRequests：最大的按需(异步)加载次数，默认为 5；
- maxInitialRequests：最大的初始化加载次数，默认为 3；
- automaticNameDelimiter：抽取出来的文件的自动生成名字的分割符，默认为 ~；
- name：抽取出来文件的名字，默认为 true，表示自动生成文件名；
- cacheGroups: 缓存组。（这才是配置的关键）

#### 配置css文件压缩成一个
```js
    config.optimization.splitChunks({
      cacheGroups: {
        // 将动态引入的css合并成一个css文件
        async: {
          name: 'styles',
          test: m => m.constructor.name === 'CssModule',
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true
        }})
```
#### cacheGroups

它可以继承/覆盖上面 splitChunks 中所有的参数值，除此之外还额外提供了三个配置，分别为：test, priority 和 reuseExistingChunk。

- test: 表示要过滤 modules，默认为所有的 modules，可匹配模块路径或 chunk 名字，当匹配的是 chunk 名字的时候，其里面的所有 modules 都会选中；
- priority：表示抽取权重，数字越大表示优先级越高。因为一个 module 可能会满足多个 cacheGroups 的条件，那么抽取到哪个就由权重最高的说了算；
- reuseExistingChunk：表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
### [理解webpack4.splitChunks](https://www.cnblogs.com/kwzm/p/10314438.html)

### optimization.splitChunks 中，chunks 的3个值：all、async、initial 的含义

- async表示只从异步加载得模块（动态加载import()）里面进行拆分
- initial表示只从入口模块进行拆分
- all表示以上两者都包括

chunks有三个选项：initial、async和all。它指示应该优先分离同步（initial）、异步（async）还是所有的代码模块。这里的异步指的是通过动态加载方式（import()）加载的模块。

这里的重点是优先二字。以async为例，假如你有两个模块 a 和 b，两者都引用了 jQuery，但是 a 模块还通过动态加载的方式引入了 lodash。那么在 async 模式下，插件在打包时会分离出lodash~for~a.js的 chunk 模块，而 a 和 b 的公共模块 jQuery 并不会被（优化）分离出来，所以它可能还同时存在于打包后的a.bundle.js和b.bundle.js文件中。因为async告诉插件优先考虑的是动态加载的模块

#### [webpack dll](https://www.cnblogs.com/skychx/p/webpack-dllplugin.html)

### 项目中，你使用 webpack 做了哪些优化

- 1. 使用 `happypack`（多进程模型）(它将任务分解给多个子进程去并发执行，子进程处理完后再将结果发给主进程。) 加速构建
- 2. 使用异步import，减小包的体积，路由懒加载，使用webpackChunkName实现更好的分包
- 3. 使用`html-webpack-externals-plugin`，公共库和UI库html cdn引入
- 4. 使用`optimization.splitChunks`，实现更好的打包，如用`cacheGroups-async`, 实现css文件合并成一个等
- 5. dll Plugin（把每次打包不需要变动的文件（一般类库，如:react,lodash）提前打包好，这样每次打包项目的时候，就不需要单独打包这些文件，从而节约了时间）
- 6. babel-loader 的 cacheDirectory， `loader: 'babel-loader?cacheDirectory=true',`
开发环境编译慢: 需要考虑怎么在开发环境做资源缓存，每一次改动代码，让 rebuild 检查的模块越少越快。

- DllPlugin 把一些第三方库，不会改改动的通过 dll 处理，让每一次 rebuild 的时候跳过这些模块的编译。
- `Happypack` 多进程打包，加快编译速度。
`thread loader`（把这个 loader 放置在其他 loader 之前， 放置在这个 loader 之后的 loader 就会在一个单独的 worker【worker pool】 池里运行，一个worker 就是一个nodeJS 进程【node.js proces】，每个单独进程处理时间上限为600ms，各个进程的数据交换也会限制在这个时间内。）
- Webpack 5 , 多级“缓存”提高运行效率

- [关于webpack性能调优](https://zhuanlan.zhihu.com/p/150731200)
- [vue模块化按需编译，突破编译瓶颈](https://zhuanlan.zhihu.com/p/137120584)

### [编写loader](https://v4.webpack.docschina.org/contribute/writing-a-loader/)

编写 loader 时应该遵循以下准则
- 简单易用: loaders 应该只做单一任务。这不仅使每个 loader 易维护，也可以在更多场景链式调用。
- 使用链式传递: 利用 loader 可以链式调用的优势。写五个简单的 loader 实现五项任务，而不是一个 loader 实现五项任务。
- 模块化的输出。保证输出模块化。loader 生成的模块与普通模块遵循相同的设计原则。
- 确保无状态。确保 `loader` 在不同模块转换之间不保存状态。每次运行都应该独立于其他编译模块以及相同模块之前的编译结果。

loader 其实就是一个 function，接收一个参数 source，就是当前的文件内容，然后稍加处理，就可以 return 出一个新的文件内容。

example: 处理 .txt 文件，并且将任何实例中的 `[name]` 直接替换为 loader 选项中设置的 name。然后返回包含默认导出文本的 JavaScript 模块。
```js
import { getOptions } from 'loader-utils';

export default function loader(source) {
  const options = getOptions(this);

  source = source.replace(/\[name\]/g, options.name);

  return `export default ${ JSON.stringify(source) }`;
}
// 使用
module: {
      rules: [{
        test: /\.txt$/,
        use: {
          loader: path.resolve(__dirname, '../config/loader.js'),
          options: {
            name: 'Alice'
          }
        }
      }]
    }
```
异步调用
```js
module.exports = function (source) {
    const callback = this.async()

    // 由于有 3 秒延迟，所以打包时需要 3+ 秒的时间
    setTimeout(() => {
        callback(null, `${source.replace(/;/g, '')}`)
    }, 3000)
}
```
异步 `loader` 需要调用 webpack 的 `async()` 生成一个` callback`，它的第一个参数是 error，这里可设为 null，第二个参数就是处理后的源码。当你异步处理完源码后，调用 callback 即可。

### [编写插件](https://v4.webpack.docschina.org/contribute/writing-a-plugin/)

Compiler 和 Compilation

在插件开发中最重要的两个资源就是 compiler 和 compilation 对象。理解它们的角色是扩展 webpack 引擎重要的第一步。
compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。
compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

一个插件由以下构成

- 一个具名 JavaScript 函数。
- 在它的原型上定义 apply 方法。
- 指定一个触及到 webpack 本身的 事件钩子。
- 操作 webpack 内部的实例特定数据。
- 在实现功能后调用 webpack 提供的 callback。
```typescript
class FileListPlugin {
  apply(compiler) {
    // emit 是异步 hook，使用 tapAsync 触及它，还可以使用 tapPromise/tap(同步)
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
      // 在生成文件中，创建一个头部字符串：
      var filelist = 'In this build:\n\n';

      // 遍历所有编译过的资源文件，
      // 对于每个文件名称，都添加一行内容。
      for (var filename in compilation.assets) {
        filelist += '- ' + filename + '\n';
      }

      // 将这个列表作为一个新的文件资源，插入到 webpack 构建中：
      compilation.assets['filelist.md'] = {
        source: function() {
          return filelist;
        },
        size: function() {
          return filelist.length;
        }
      };

      callback();
    });
  }
}

module.exports = FileListPlugin;
```
### [Tree Shaking](https://webpack.docschina.org/guides/tree-shaking)

必须使用 ES2015 模块语法。是基于esm 静态分析来的，而`require()`语法的 `CommonJS` 模块规范。这些模块是 `dynamic` 动态加载的，这意味着可以根据代码中的条件导入新模块。
```js
var myDynamicModule;

if (condition) {
    myDynamicModule = require("foo");
} else {
    myDynamicModule = require("bar");
} 
```
CommonJS 模块的这种 dynamic 性质意味着无法应用 Tree Shaking，因为在实际运行代码之前无法确定需要哪些模块。

Tree Shaking: 顾名思义，把代码比作一棵树，把树上已经烂掉的果子比喻成不需要的代码，通过摇晃树的方式把烂掉的果子抖下来。

Tree Shaking 是 ES2015 模块定义中的一个功能。它的核心点在于，在不运行模块的情况下静态地分析模块，使得 Webpack 发现哪些部分的代码正在使用，而哪些代码没有被使用。

### [模块加载](https://zhuanlan.zhihu.com/p/243485307)
