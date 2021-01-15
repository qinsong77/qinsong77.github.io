---
title: Summary of interview
---

### [蚂蚁、字节、滴滴面试经历总结](https://juejin.im/post/6844904161830502407)
### [必须要懂的原生JS-上](https://juejin.im/post/6844903815053852685)
### [必须要懂的原生JS-中](https://juejin.im/post/6844903828093927431)
### [由浅入深，66条JavaScript面试知识点](https://juejin.cn/post/6844904200917221389)
### [18道浏览器面试题](https://juejin.im/post/6854573215830933512)
### [promise面试汇总](https://zhuanlan.zhihu.com/p/288384170)
### [面试题](https://github.com/mqyqingfeng/frontend-interview-question-and-answer/issues)
### css
 - [1](https://juejin.im/post/6888102016007176200)
 
 ### [优化总结](https://juejin.im/post/6892994632968306702)

#### 项目中，你使用 webpack 做了哪些优化

- 1. 使用 `happypack` 加速构建
- 2. 使用异步import，减小包的体积，路由懒加载，使用webpackChunkName实现更好的分包
- 3. 使用`html-webpack-externals-plugin`，公共库和UI库html cdn引入
- 4. 使用`optimization.splitChunks`，实现更好的打包，如用`cacheGroups-async`, 实现css文件合并成一个等
- 5. dll Plugin（把每次打包不需要变动的文件（一般类库，如:react,lodash）提前打包好，这样每次打包项目的时候，就不需要单独打包这些文件，从而节约了时间）
