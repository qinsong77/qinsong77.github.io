---
title: Summary
---

### [webpack小书](https://www.timsrc.com/article/2/webpack-book)

### [Webpack揭秘](https://juejin.cn/post/6844903685407916039)

### Webpack中publicPath详解
> [文章](https://juejin.im/post/6844903601060446221)
>
### [由浅入深配置webpack4](https://juejin.im/post/6859888538004783118)

### [手写webpack核心原理](https://juejin.im/post/6854573217336541192)
### [体积减少80%！释放webpack tree-shaking的真正潜力](https://juejin.cn/post/6844903769646317576)
    
### [轻松理解webpack热更新原理](https://mp.weixin.qq.com/s/2L9Y0pdwTTmd8U2kXHFlPA)

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
