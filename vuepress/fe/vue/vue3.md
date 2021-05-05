---
title: Vue 3.0
---

[Vue3 响应式原理](https://juejin.cn/post/6858899262596448270)


### [Vue3.0 性能优化及新特性深度解析](https://mp.weixin.qq.com/s/r90ABtYXcOwB7J_ILLYBpg)

- 性能
- Tree-shaking 支持
- Composition API
- Fragment、Teleport、Suspense
- 自定义渲染API
- 更好的 TS 支持

#### 编译时对VDom的性能优化

1. PatchFlag

只能带patchFlag 的 Node 才被认为是动态的元素，会被追踪属性的修改。并且 PatchFlag 会标识动态的属性类型有哪些

2. hoistStatic 静态节点提升

当使用hoistStatic时，所有 静态的节点都被提升到render方法之外。这意味着，他们只会在应用启动的时候被创建一次，而后随着每次的渲染被不停的复用。

3. cacheHandler 事件监听缓存

编辑器会为你动态创建一个内联函数，内联函数里面再去饮用当前组件上最新的handler。之后编辑器会将内联函数缓存。每次重新渲染时如果事件处理器没有变，就会使用缓存中的事件处理而不会重新获取事件处理器。这个节点就可以被看作是一个静态的节点。这种优化更大的作用在于当其作用域组件时，之前每次重新渲染都会导致组件的重新渲染，在通过handler缓存之后，不会导致组件的重新渲染了。

4. SSR 服务端渲染

5. StaticNode 静态节点

#### Tree Shaking

因为ES6模块是静态引用的，所以我们可以在编译时正确的判断到底加载了哪些代码。对代码全局做一个分析，找到那些没用被用到的模块、函数、变量，并把这些去掉。

#### Composition API

对options Api的优化， 使得逻辑复用及代码组合更清楚

核心 API
- reactive
- ref
- computed
- readonly
- watchEffect
- watch
- Lifecycle Hooks

#### Fragment、Teleport、Suspense
- Fragment

Vue3中不在要求模版的根节点必须是只能有一个节点。根节点和render函数返回的可以是纯文字、数组、单个节点，如果是数组，会自动转化为 Fragments。

- Teleport

对标 React Portal。更方便的方式创建弹窗组件等

- Suspense

等待嵌套的异步依赖。再把一个嵌套的组件树渲染到页面上之前，先在内存中进行渲染，并记录所有的存在异步依赖的组件。只有所有的异步依赖全部被resolve之后，才会把整个书渲染到dom中。当你的组件中有一个 async的 setup函数，这个组件可以被看作是一个Async Component，只有当这个组件被Resolve之后，再把整个树渲染出来

#### Typescript
