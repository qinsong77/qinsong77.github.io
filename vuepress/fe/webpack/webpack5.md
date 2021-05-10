---
title: Webpack5
---

## General direction

This release focus on the following:

- Improve build performance with Persistent Caching.
- Improve Long Term Caching with better algorithms and defaults.
- Improve bundle size with better Tree Shaking and Code Generation.
- Improve compatibility with the web platform.
- Clean up internal structures that were left in a weird state while implementing features in v4 without introducing any breaking changes.
- Prepare for future features by introducing breaking changes now, allowing us to stay on v5 for as long as possible.

- 通过持久化硬盘缓存能力来提升构建性能
- 通过更好的算法来改进长期缓存（降低产物资源的缓存失效率）
- 通过更好的 Tree Shaking 能力和代码的生成逻辑来优化产物的大小
- 改善 web 平台的兼容性能力
- 清除了内部结构中，在 Webpack4 没有重大更新而引入一些新特性时所遗留下来的一些奇怪的 state
- 通过引入一些重大的变更为未来的一些特性做准备，使得能够长期的稳定在 Webpack5 版本上

## 新特性介绍
- 持久化缓存
- moduleIds & chunkIds的优化
- 更智能的tree shaking
- nodeJs的polyfill脚本被移除
- 支持生成e6/es2015的代码
- SplitChunk和模块大小
- Module Federation


[webpack5总结](https://juejin.cn/post/6850037264962027534)

### 持久化缓存

在webpack5之前，可以使用cache-loader将编译结构写入硬盘缓存，还可以使用babel-loader，设置option.cacheDirectory将babel-loader编译的结果写进磁盘。

在webpack5中，默认开启缓存，缓存默认是在内存里。可以对cache进行设置
```javascript
module.export = {
    cache: {
        type:'filesystem',  //  'memory' | 'filesystem'
        cacheDirectory: 'node_modules/.cache/webpack', // 默认将缓存存储在 node_modules/.cache/webpack
        // 缓存依赖，当缓存依赖修改时，缓存失效
        buildDependencies:{
        	// 将你的配置添加依赖，更改配置时，使得缓存失效
        	config: [__filename]
    	} 
    }
}
```
- 默认情况下webpack 会假定其所处的 `node_modules` 目录仅由包管理器修改，将会跳过hash和时间戳处理，出于性能考虑，仅使用package的名称和版本。
- 当设置 cache.type: "filesystem" 时，webpack 会在内部以分层方式启用文件系统缓存和内存缓存。从缓存读取时，会先查看内存缓存，如果内存缓存未找到，则降级到文件系统缓存。写入缓存将同时写入内存缓存和文件系统缓存。
- 文件系统缓存不会直接将对磁盘写入的请求进行序列化。它将等到编译过程完成且编译器处于空闲状态才会执行。如此处理的原因是序列化和磁盘写入会占用资源，并且我们不想额外延迟编译过程。
- 缓存淘汰策略设计：文件缓存存储在 node_modules/.cache/webpack，对于一个缓存集合，最大限度应该不超过 5 个缓存内容，最大累积资源占用不超过 500 MB，当逼近或超过 500MB 的阈值时，优先删除最老的缓存内容。同时，也设计了缓存的有效时长为 2 个星期。

### moduleIds & chunkIds的优化
- chunk：webpack打包最终生成的单独文件块，最终生成的单独文件，一个文件对应一个chunk。
- module：每一个源码 js 文件其实都可以看成一个 module。

chunkId的缺点

- webpack5改进了moduleIds 和 chunkIds的确定。在webpack5之前，没有从entry打包的chunk文件，都会以1，2，3...的文件命名方式输出。(文件名称后的hash值是用chunkhash生成的)
- 这样会造成一个后果是，当删除或者暂时不使用1.js这个文件后，那么2.js->1.js，3.js->2.js，这样就会造成原本线上的2.js请求时会造成缓存失效。
- 在webpack5之前也是可以通过`webpackChunkName`来解决命名问题

### SplitChunk和模块大小
- 模块现在能够以更好的方式表示大小，而不是显示单个数字和不同类型的大小。
- 默认情况下，只能处理 javascript 的大小，但是你现在可以传递多个值来管理它们:
```javascript
module.export = {
    optimization: {
      splitChunks: {
      minSize: {
            javascript: 30000,
            style: 50000,
        }
      }
    }
}
```

### Module Federation
动态加载 可以允许代码在运行时按需加载另一个应用的代码。
- Module Federation 使 JavaScript 应用得以从另一个 JavaScript 应用中动态地加载代码 —— 同时共享依赖。让代码直接在项目间利用 CDN 直接共享，不再需要本地安装 Npm 包、构建再发布了！
