---
title: Summary
---

- [前端工程化](#前端工程化)
- [Monorepo](#monorepo)
- [postcss](#postcss)
- [webpack工作流程](#简述webpack工作流程)
- [打包过程](#打包过程)
- [常用loader](#常用loader)
- [常用plugin](#常用plugin)
- [热更新](#热更新)
- [3种hash](#_3种hash)
- [Code Splitting](#code-splitting)
- [项目中-你使用-webpack-做了哪些优化](#项目中-你使用-webpack-做了哪些优化)
- [编写loader](#编写loader)
- [编写插件](#编写插件)
- [Tree Shaking](#tree-shaking)
- [Webpack模块加载打包原理](#webpack模块打包原理)
- [require.context是什么](#require-context是什么)
- [SourceMap](#sourcemap)

## 文章合集
- [webpack 5源码解析系列](https://juejin.cn/column/6978684601921175583)
- [万字总结一文吃透 Webpack 核心原理](https://juejin.cn/post/6949040393165996040)
- [基于源码的 Webpack 结构分析](https://mp.weixin.qq.com/s/JjjL3ojDVreAIfdQzYum1g)
- [webpack 中那些最易混淆的 5 个知识点](https://juejin.cn/post/6844904007362674701)

### DSL
`domain specific language`，领域特定语言

- [前端 DSL 实践指南](https://zhuanlan.zhihu.com/p/107947462)


## 前端工程化

 - [手把手带你入门前端工程化——超详细教程](https://zhuanlan.zhihu.com/p/276458191)
 - [前端工程化](https://juejin.cn/post/6844904132512317453)

前端工程化可以分成四个方面来说，分别为模块化、组件化、规范化和自动化。

#### 模块化
模块化是指将一个文件拆分成多个相互依赖的文件，最后进行统一的打包和加载，这样能够很好的保证高效的多人协作。其中包含

- JS 模块化：CommonJS、AMD、CMD 以及 ES6 Module。
- CSS 模块化：Sass、Less、Stylus、[BEM](https://www.bemcss.com/)（`即模块名 + 元素名 + 修饰器名`。）、CSS Modules 等。其中预处理器和 BEM 都会有的一个问题就是样式覆盖。而 CSS Modules 则是通过 JS 来管理依赖，最大化的结合了 JS 模块化和 CSS 生态，比如 Vue 中的 style scoped。
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


## Monorepo

总结作用
1. 单仓库实现将各包统一收敛在packages中，在上层统一统筹管理各个package的依赖、构建、开发/调试、测试、版本、发布，提供更优雅的多包管理和协作方案。
2. 用于单仓库多项目管理，组件页面复用，代码规范统一。

Monorepo 的全称是 monolithic repository，即单体式仓库，与之对应的是 Multirepo(multiple repository)，这里的“单”和“多”是指每个仓库中所管理的模块数量。

Monorepo就是把**多个项目放在一个仓库里面**，相对立的是传统的 `MultiRepo` 模式，即每个项目对应一个单独的仓库来分散管理。

Monorepo解决了：
1. 代码复用
2. 版本管理
3. 项目基建：由于在 MultiRepo 当中，各个项目的工作流是割裂的，因此每个项目需要单独配置开发环境、配置 CI 流程、配置部署发布流程等等，甚至每个项目都有自己单独的一套脚手架工具。

#### 收益
1. 首先是**工作流的一致性**，由于所有的项目放在一个仓库当中，复用起来非常方便，如果有依赖的代码变动，那么用到这个依赖的项目当中会立马感知到。并且所有的项目都是使用最新的代码，不会产生其它项目版本更新不及时的情况。
2. 其次是**项目基建成本的降低**，所有项目复用一套标准的工具和规范，无需切换开发环境，如果有新的项目接入，也可以直接复用已有的基建流程，比如 CI 流程、构建和发布流程。这样只需要很少的人来维护所有项目的基建，维护成本也大大减低。
3. 再者，**团队协作也更加容易**，一方面大家都在一个仓库开发，能够方便地共享和复用代码，方便检索项目源码，另一方面，git commit 的历史记录也支持以功能为单位进行提交，之前对于某个功能的提交，需要改好几个仓库，提交多个 commit，现在只需要提交一次，简化了 commit 记录，方便协作。

![](./image/monorepo.png)

![](./image/monorepovsMutirepo.png)

#### lerna
A tool for managing JavaScript projects with multiple packages.

- 使用yarn workspaces单纯的处理依赖问题。
- 用lerna来处理统筹管理package的问题。
1. 自动解决packages之间的依赖关系
2. 通过 git 检测文件改动，自动发布
3. 根据 git 提交记录，自动生成 CHANGELOG

- [彻底搞懂基于 Monorepo 的 lerna 模块](https://mp.weixin.qq.com/s/Qf65Pk0t1n0L1s7Fv-XZewhttps://mp.weixin.qq.com/s/Qf65Pk0t1n0L1s7Fv-XZew)

#### [TurboRepo](https://turborepo.org/docs/getting-started)

优势
- 增量构建：缓存构建内容，并跳过已经计算过的内容，通过增量构建来提高构建速度
- 内容hash：通过文件内容计算出来的hash来判断文件是否需要进行构建
- 云缓存：可以和团队成员共享CI/CD的云构建缓存，来实现更快的构建
- 并行执行：在不浪费空闲 CPU 的情况下，以最大并行数量来进行构建
- 任务管道：通过定义任务之间的关系，让 Turborepo 优化构建的内容和时间
- 约定式配置：通过约定来降低配置的复杂度，只需要几行简单的 JSON 就能完成配置

## postcss
对于`css`类似于`babel`对于js的功能。
- [神奇的 postcss](https://mp.weixin.qq.com/s/TAKvKLXIG25gnuHSzt7Edg)

## 简述webpack工作流程

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

**bundle**: webpack 处理好 `chunk` 文件后，最后会输出 `bundle` 文件，这个 bundle 文件包含了经过加载和编译的最终源文件，所以它可以直接在浏览器中运行。

一般来说一个 chunk 对应一个 bundle，比如上图中的 utils.js -> chunks 1 -> utils.bundle.js；但也有例外，比如说上图中，我就用 MiniCssExtractPlugin 从 chunks 0 中抽离出了 index.bundle.css 文件。

> `module`，`chunk` 和 bundle 其实就是同一份逻辑代码在不同转换场景下的取了三个名字：

> 直接写出来的是 `module`，webpack 处理时是 `chunk`，最后生成浏览器可以直接运行的 `bundle`。

### 构建过程
关于 webpack 的工作流程，简单来说可以概括为以下几步：

- （1）初始化参数

解析 Webpack 配置参数，合并 `Shell` 传入和 `webpack.config.ts` 文件配置的参数，形成最后的配置结果。

- （2）开始编译

上一步得到的参数初始化 `compiler` 对象，注册所有配置的插件，插件监听 Webpack 构建生命周期的事件节点，做出相应的反应，执行对象的 run 方法开始执行编译。

- （3）确定入口

从配置文件（ `webpack.config.ts` ）中指定的 `entry` 入口，开始解析文件构建 `AST` 语法树，找出依赖，递归下去。

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

1. 初始化参数
2. 开始编译 用上一步得到的参数初始`Compiler`对象，加载所有配置的插件，通过执行对象的`run`方法开始执行编译
3. 确定入口 根据配置中的 `Entry` 找出所有入口文件
4. 编译模块 从入口文件出发，调用所有配置的 `Loader` 对模块进行编译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
5. 完成模块编译 在经过第4步使用 `Loader` 翻译完所有模块后， 得到了每个模块被编译后的最终内容及它们之间的依赖关系
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 `Chunk`，再将每个 `Chunk` 转换成一个单独的文件加入输出列表中，这是可以修改输出内容的最后机会
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，将文件的内容写入文件系统中。

在以上过程中， Webpack 会在特定的时间点广播特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，井且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。其实以上7个步骤，可以简单归纳为初始化、编译、输出，三个过程，而这个过程其实就是前面说的基本模型的扩展。

## 常用loader

- file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件，当引入的文件是 `.png`、`.txt `等时，可以通过 `file-loader` 解析项目中的 `url `引入。根据配置将文件拷贝到相应的路径，并修改打包后文件的引入路径，让它指向正确的文件;

- url-loader：`url-loader` 封装了 `file-loader` 且可以不依赖于 `file-loader` 单独使用，并且可以配置 `limit`。对小于 limit 大小的图片转换成 `Base64`，大于 limit 的时候使用 file-loader 里的方法。

- source-map-loader：加载额外的 Source Map 文件，以方便断点调试;

- image-loader：加载并且压缩图片文件;

- babel-loader：把 ES6 转换成 ES5;

- css-loader：The css-loader interprets @import and url() like import/require() and will resolve them. 负责处理 `@import`、`url` 等语句。例如 `import css from 'file.css'`、`url(image.png)`支持模块化、压缩、文件导入等特性；把 CSS 代码注入到 JavaScript 中

- style-loader：Inject CSS into the DOM，在 DOM 里插入一个 `<style>` 标签，并且将 CSS 写入这个标签内;

- postcss-loader：负责进一步处理 CSS 文件，比如添加浏览器前缀，压缩 CSS 等。
- less-loader：将 .less 文件内容转换成 CSS。
- sass-loader：将 .sass 文件内容转换成 CSS。

- eslint-loader：通过 ESLint 检查 JavaScript 代码;

### [编写loader](https://v4.webpack.docschina.org/contribute/writing-a-loader/)

编写 loader 时应该遵循以下准则
- 简单易用: loaders 应该只做单一任务。这不仅使每个 loader 易维护，也可以在更多场景链式调用。
- 使用链式传递: 利用 loader 可以链式调用的优势。写五个简单的 loader 实现五项任务，而不是一个 loader 实现五项任务。
- 模块化的输出。保证输出模块化。loader 生成的模块与普通模块遵循相同的设计原则。
- 确保无状态。确保 `loader` 在不同模块转换之间不保存状态。每次运行都应该独立于其他编译模块以及相同模块之前的编译结果。

loader 其实就是一个 function，接收一个参数 source，就是当前的文件内容，然后稍加处理，就可以 return 出一个新的文件内容。

example: 处理 .txt 文件，并且将任何实例中的 `[name]` 直接替换为 loader 选项中设置的 name。然后返回包含默认导出文本的 JavaScript 模块。
::: details 点击查看代码
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
:::
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

## 常用plugin
- HotModuleReplacementPlugin：webpack内置的模块热更新插件。Hot-Module-Replacement 的热更新是依赖于 webpack-dev-server，后者是在打包文件改变时更新打包文件或者 reload 刷新整个页面，HRM 是只更新修改的部分。
- clean-webpack-plugin：打包前自动清理 dist 目录，防止文件残留。
- terser-webpack-plugin： Webpack4.0 默认是使用 terser-webpack-plugin 这个压缩插件
- compression-webpack-plugin：gzip 压缩
- copy-webpack-plugin：将单个文件或者整个目录复制到构建目录
- mini-css-extract-plugin：将 CSS 抽离出来单独打包并且通过配置可以设置是否压缩。
- html-webpack-plugin：这个插件可以配置生成一个 HTML5 文件，其中 script 标签包含所有 Webpack 包。如果你设置多个入口点，你可以据此实现多页面应用打包。
- webpack-bundle-analyzer：打包分析插件
- speed-measure-webpack-plugin: 打包速度分析，**HardSourceWebpackPlugin 和 speed-measure-webpack-plugin 不能一起使用**
- [hard-source-webpack-plugin](https://github.com/mzgoddard/hard-source-webpack-plugin)（Webpack 4 的打包性能足够好的，dll继续维护的必要了, HardSourceWebpackPlugin is a plugin for webpack to provide an intermediate caching step for modules. In order to see results, you'll need to run webpack twice with this plugin: the first build will take the normal amount of time. The second build will be significantly faster.)

### [编写插件](https://v4.webpack.docschina.org/contribute/writing-a-plugin/)

`Compiler` 和 `Compilation`

在插件开发中最重要的两个资源就是 compiler 和 compilation 对象。理解它们的角色是扩展 webpack 引擎重要的第一步。
compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。

`compilation` 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

一个插件由以下构成

- 一个具名 JavaScript 函数。
- 在它的原型上定义 apply 方法。
- 指定一个触及到 webpack 本身的 事件钩子。
- 操作 webpack 内部的实例特定数据。
- 在实现功能后调用 webpack 提供的 callback。

比如一个输出打包文件列表的插件
```javascript
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

## 热更新

- [Webpack HMR 原理解析](https://zhuanlan.zhihu.com/p/30669007)
- [轻松理解webpack热更新原理](https://mp.weixin.qq.com/s/2L9Y0pdwTTmd8U2kXHFlPA)
- [了不起的 Webpack HMR 学习指南（含源码分析）](https://mp.weixin.qq.com/s?__biz=MjM5MDc4MzgxNA==&mid=2458455505&idx=1&sn=b6d5258393b5c41b77cdc78299e94697&chksm=b1c22df886b5a4eed560aa9aa95bc27d473d58ebabb501ec98c282bdbc8308e9951cea59a060&scene=178&cur_album_id=1556921519803596802#rd)

在 Webpack 的 webpack.config.ts 中：
1. 配置 devServer 的 hot 为 true
2. 在 plugins 中增加 new webpack.HotModuleReplacementPlugin()
```javascript
// webpack.config.ts
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


### 3种hash

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
- [理解webpack4.splitChunks](https://www.cnblogs.com/kwzm/p/10314438.html)
默认配置


```javascript
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async', // 参数可能是：all，async和initial，这里表示拆分异步模块。
      minSize: 30000, // 如果模块的大小大于30kb，才会被拆分
      minChunks: 1,
      maxAsyncRequests: 5, // 按需加载时最大的请求数，意思就是说，如果拆得很小，就会超过这个值，限制拆分的数量。
      maxInitialRequests: 3, // 入口处的最大请求数
      automaticNameDelimiter: '~', // webpack将使用块的名称和名称生成名称（例如vendors~main.js）
      name: true, // 拆分块的名称
      cacheGroups: {
        // 缓存splitchunks
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2, // 一个模块至少出现2次引用时，才会被拆分
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
  ::: details 点击查看代码
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
  :::
  
#### cacheGroups

它可以继承/覆盖上面 splitChunks 中所有的参数值，除此之外还额外提供了三个配置，分别为：test, priority 和 reuseExistingChunk。

- test: 表示要过滤 modules，默认为所有的 modules，可匹配模块路径或 chunk 名字，当匹配的是 chunk 名字的时候，其里面的所有 modules 都会选中；
- priority：表示抽取权重，数字越大表示优先级越高。因为一个 module 可能会满足多个 cacheGroups 的条件，那么抽取到哪个就由权重最高的说了算；
- reuseExistingChunk：表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。

### optimization.splitChunks 中，chunks 的3个值：all、async、initial 的含义

- async表示只从异步加载得模块（动态加载import()）里面进行拆分
- initial表示只从入口模块进行拆分
- all表示以上两者都包括

chunks有三个选项：initial、async和all。它指示应该优先分离同步（initial）、异步（async）还是所有的代码模块。这里的异步指的是通过动态加载方式（import()）加载的模块。

这里的重点是优先二字。以async为例，假如你有两个模块 a 和 b，两者都引用了 jQuery，但是 a 模块还通过动态加载的方式引入了 lodash。那么在 async 模式下，插件在打包时会分离出lodash~for~a.js的 chunk 模块，而 a 和 b 的公共模块 jQuery 并不会被（优化）分离出来，所以它可能还同时存在于打包后的a.bundle.js和b.bundle.js文件中。因为async告诉插件优先考虑的是动态加载的模块

#### [webpack dll](https://www.cnblogs.com/skychx/p/webpack-dllplugin.html)

### 项目中，你使用 webpack 做了哪些优化

#### 构建速度
开发环境编译慢: 需要考虑怎么在开发环境做资源缓存，每一次改动代码，让 rebuild 检查的模块越少越快。
分析工具：
- speed-measure-webpack-plugin：分析出 Webpack 打包过程中 Loader 和 Plugin 的耗时，有助于找到构建过程中的性能瓶颈。
- webpack-bundle-analyzer：可视化的方式直观地看到打包的bundle中到底包含哪些模块内容，以及每一个模块的体积大小。可以根据这些信息去分析项目结构，调整打包配置，进行优化。


- 1. 使用 `happypack`（多进程模型）(它将任务分解给多个子进程去并发执行，子进程处理完后再将结果发给主进程。) 加速构建。v4及以上webpack已使用多线程，没必要使用这个了。在webpack4之后，可以使用thread-loader。`thread loader`（把这个 loader 放置在其他 loader 之前， 放置在这个 loader 之后的 loader 就会在一个单独的 worker【worker pool】 池里运行，一个worker 就是一个nodeJS 进程【node.js process】，每个单独进程处理时间上限为600ms，各个进程的数据交换也会限制在这个时间内。）
- 2. 利用缓存：利用缓存可以提升二次构建速度。
  - a. 在一些性能开销较大的 `loader` 之前添加此`cache-loader`，以将结果缓存到磁盘中。或者babel-loader 的 cacheDirectory， `loader: 'babel-loader?cacheDirectory=true',`；
  - b. hard-source-webpack-plugin(webpack 5)
- 3. 缩小打包作用域：
  - exclude/include （确定 loader 规则范围）
  - resolve.modules 指明第三方模块的绝对路径（减少不必要的查找）
  - resolve.extensions 尽可能减少后缀尝试的可能性
  - noParse 对完全不需要解析的库进行忽略（不去解析但仍会打包到 bundle 中，注意被忽略掉的文件里不应该包含 import、require、define 等模块化语句）
  - IgnorePlugin（完全排除模块）
  - 合理使用 alias
- 4. 动态链接库
  - a. 使用`html-webpack-externals-plugin`，公共库和UI库html cdn引入或者`Externals`
  - b. [dll Plugin](https://www.cnblogs.com/skychx/p/webpack-dllplugin.html)（把每次打包不需要变动的文件（一般类库，如:react,lodash）提前打包好，这样每次打包项目的时候，就不需要单独打包这些文件，从而节约了时间），先使用`DllPlugin`打包第三方库，在使用`DLLReferencePlugin`引用`manifest.json`，去关联第1步中已经打好的包
 
#### 优化构建体积
- 1. 使用动态import，减小包的体积，路由懒加载，使用webpackChunkName实现更好的分包
- 2. 代码分割：使用`optimization.splitChunks`，实现更好的打包，如用`cacheGroups-async`， 实现css文件合并成一个等
- 3. treeShaking： 使用ES6的`import/export`语法，并且具名导入导出代码，而不要使用`export default`。
- 4. 图片压缩( image-webpack-loader)、url-loader图片base64内联，或者雪碧图（postcss-sprites）等
- 5. 代码压缩: `uglifyjs-webpack-plugin` 和 `terser-webpack-plugin`（可以开启多线程压缩）。v4.26.0版本之前，webpack内置的压缩插件是uglifyjs-webpack-plugin，从v4.26.0版本开始，换成了terser-webpack-plugin。
```javascript
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  optimization: {
    minimizer: [  
      new TerserPlugin({
        parallel: true,  //开启并行压缩，可以加快构建速度
        sourceMap: true, //如果生产环境使用source-maps，则必须设置为true
      })
    ]
  }
}
```
- 6. gzip：使用webpack生成gzip文件需要借助compression-webpack-plugin，使用配置如下：
```javascript
const CompressionWebpackPlugin = require("compression-webpack-plugin")
module.exports = {
  plugins: [
     new CompressionWebpackPlugin({
       test: /\.(js|css)$/,         //匹配要压缩的文件
       algorithm: "gzip"
     })
  ]
}
```

- [一文搞定webpack构建优化策略](https://juejin.cn/post/6953790342613172237)
- [关于webpack性能调优](https://zhuanlan.zhihu.com/p/150731200)
- [vue模块化按需编译，突破编译瓶颈](https://zhuanlan.zhihu.com/p/137120584)

### [Tree Shaking](https://webpack.docschina.org/guides/tree-shaking)

- [原理](https://juejin.cn/post/7002410645316436004)

Tree shaking 是一种通过清除多余代码方式来优化项目打包体积的技术，专业术语叫 Dead code elimination。基于 `ES Module` 规范，它会在运行过程中静态分析模块之间的导入导出，确定 ESM 模块中哪些导出值未曾其它模块使用，并将其删除，以此实现打包产物的优化。

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

其实tree-shaking的消除原理是依赖于ES6的模块特性。

ES6 module 特点：

1. 只能作为模块顶层的语句出现
2. import 的模块名只能是字符串常量
3. import binding 是 immutable的

**ES6模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析**,

Webpack 中，Tree-shaking 的实现一是先标记出模块导出值中哪些没有被用过，二是使用 `Terser`删掉这些没被用到的导出语句。标记过程大致可划分为三个步骤：

- Make 阶段，收集模块导出变量并记录到模块依赖关系图 ModuleGraph 变量中
- Seal 阶段，遍历 ModuleGraph 标记模块导出变量有没有被使用
- 生成产物时，若变量没有被其它模块使用则删除对应的导出语句

> 标记功能需要配置 `optimization.usedExports = true` 开启

### [Webpack模块打包原理](https://juejin.cn/post/6844903802382860296)
- [模块加载](https://zhuanlan.zhihu.com/p/243485307)
webpack根据`webpack.config.ts`中的入口文件，在入口文件里识别模块依赖，不管这里的模块依赖是用`CommonJS`写的，还是`ES6 Module`规范写的，webpack会自动进行分析，并通过转换、编译代码，打包成最终的文件。最终文件中的模块实现是基于webpack自己实现的`webpack_require`（es5代码），所以打包后的文件可以跑在浏览器上。

使用一个立即执行函数，实现了类似Common Js require和exports的特性，核心是`__webpack_require__`的实现，
创建模块缓存`installedModules `，从入口文件执行require。

懒加载是动态创建`jsonp`的动态script标签，加载异步模块，加载完成`window["webpackJsonp"]` push模块，异步模块打包后的文件中保存着异步模块源代码，同时为了区分不同的异步模块，还保存着该异步模块对应的标识：chunkId。

webpack实现模块的异步加载有点像jsonp的流程。在主js文件中通过在head中构建script标签方式，异步加载模块信息；再使用回调函数webpackJsonpCallback，把异步的模块源码同步到主文件中，所以后续操作异步模块可以像同步模块一样。

1. 到异步模块时，使用`__webpack_require__.e`函数去把异步代码加载进来。该函数会在html的head中动态增加script标签，src指向指定的异步模块存放的文件；
2. 加载的异步模块文件会执行webpackJsonpCallback函数，把异步模块加载到主文件中；
3. 所以后续可以像同步模块一样,直接使用__webpack_require__("./src/async.js")加载异步模块。

源码中的`primose`使用非常精妙，主模块加载完成异步模块才resolve()

  ::: details 点击查看代码
```js
// 0.bundle.js

// 异步模块
// window["webpackJsonp"]是连接多个chunk文件的桥梁
// window["webpackJsonp"].push = 主chunk文件.webpackJsonpCallback
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  [0], // 异步模块标识chunkId,可判断异步代码是否加载成功
  // 跟同步模块一样，存放了{模块路径：模块内容}
  {
  "./src/async.js": (function(module, __webpack_exports__, __webpack_require__) {
      __webpack_require__.r(__webpack_exports__);
      __webpack_exports__["default"] = (function () {
        return 'hello, aysnc module';
      });
    })
  }
]);

```
```js
// webpack.config.ts
const path = require('path');

module.exports = {
    mode: 'development',
  // JavaScript 执行入口文件
  entry: './src/main.js',
  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: 'bundle.js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  }
};
```

```js
// src/add
export default function(a, b) {
    let { name } = { name: 'hello world,'} // 这里特意使用了ES6语法
    return name + a + b
}

// src/main.js
import Add from './add'
console.log(Add, Add(1, 2))
```

build.js

```js
// modules是存放所有模块的数组，数组中每个元素存储{ 模块路径: 模块导出代码函数 }
(function(modules) {
// 模块缓存作用，已加载的模块可以不用再重新读取，提升性能
var installedModules = {};

// 关键函数，加载模块代码
// 形式有点像Node的CommonJS模块，但这里是可跑在浏览器上的es5代码
function __webpack_require__(moduleId) {
  // 缓存检查，有则直接从缓存中取得
  if(installedModules[moduleId]) {
    return installedModules[moduleId].exports;
  }
  // 先创建一个空模块，塞入缓存中
  var module = installedModules[moduleId] = {
    i: moduleId,
    l: false, // 标记是否已经加载
    exports: {} // 初始模块为空
  };

  // 把要加载的模块内容，挂载到module.exports上
  modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  module.l = true; // 标记为已加载

  // 返回加载的模块，调用方直接调用即可
  return module.exports;
}

// __webpack_require__对象下的r函数
// 在module.exports上定义__esModule为true，表明是一个模块对象
__webpack_require__.r = function(exports) {
  Object.defineProperty(exports, '__esModule', { value: true });
};

// 启动入口模块main.js
return __webpack_require__(__webpack_require__.s = "./src/main.js");
})
({
  // add模块
  "./src/add.js": (function(module, __webpack_exports__, __webpack_require__) {
    // 在module.exports上定义__esModule为true
    __webpack_require__.r(__webpack_exports__);
    // 直接把add模块内容，赋给module.exports.default对象上
    __webpack_exports__["default"] = (function(a, b) {
      let { name } = { name: 'hello world,'}
      return name + a + b
    });
  }),

  // 入口模块
  "./src/main.js": (function(module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__)
    // 拿到add模块的定义
    // _add__WEBPACK_IMPORTED_MODULE_0__ = module.exports，有点类似require
    var _add__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/add.js");
    // add模块内容: _add__WEBPACK_IMPORTED_MODULE_0__["default"]
    console.log(_add__WEBPACK_IMPORTED_MODULE_0__["default"], Object(_add__WEBPACK_IMPORTED_MODULE_0__["default"])(1, 2))
  })
});
```
  :::
### require.context是什么
一个webpack的api，通过执行`require.context`函数获取一个特定的上下文，主要用来实现自动化导入模块，在前端工程中，如果遇到从一个文件夹引入很多模块的情况，
可以使用这个api，它会遍历文件夹中的指定文件，然后自动导入，使得不需要每次显式的调用`import`导入模块。比如在Vue中使用`require.context`函数遍历modules文件夹的所有文件一次性导入到index.js中

> 语法: `require.context(directory, useSubdirectories = false, regExp = /^.//);`
require.context函数接受三个参数
 
1. directory {String} -读取文件的路径
 
2. useSubdirectories {Boolean} -是否遍历文件的子目录
 
3. regExp {RegExp} -匹配文件的正则

### [SourceMap](https://mp.weixin.qq.com/s/87VqGBaT9aF1B1Tokr4CKQ)

sourceMap可以帮我们直接定位到编译前代码的特定位置。

sourceMap其实就是就是一段维护了前后代码映射关系的json描述文件，包含了以下一些信息：

- version：sourcemap版本（现在都是v3）
- file：转换后的文件名。
- sourceRoot：转换前的文件所在的目录。如果与转换前的文件在同一目录，该项为空。
- sources：转换前的文件。该项是一个数组，表示可能存在多个文件合并。
- names：转换前的所有变量名和属性名。
- mappings：记录位置信息的字符串。mappings 信息是关键，它使用Base64 VLQ 编码，包含了源代码与生成代码的位置映射信息。
