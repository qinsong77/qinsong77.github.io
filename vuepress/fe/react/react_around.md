---
title: React Around
---

### redux

- [源码解析1](https://juejin.cn/post/6844904036013965325)
- [源码解析2](https://juejin.cn/post/6937491452838559781)

### immutable.js

**持久化数据结构**和**结构共享**

`Immutable Data`是一种利用结构共享形成的持久化数据结构，一旦有部分被修改，那么将会返回一个全新的对象，并且原来相同的节点会直接共享。

每次修改一个 immutable 对象时都会创建一个新的不可变的对象，在新对象上操作并 不会影响到原对象的数据。

具体点来说，「immutable」 对象数据内部采用是多叉树的结构，凡是有节点被改变，那么它和与它相关的所有**上级节点都更新**。

![](./image/immutable.gif)

- Javascript引用类型复用，不正确的操作导致复用前的数据也改变
- 使用深拷贝，有各种问题，比如性能，循环引用的处理，`key` 里面 `getter`，`setter` 以及原型链上的内容如何处理，React使用时导致的不必要的重复渲染
- immutable: 创建一个被 deepClone 过的数据，新的数据进行有副作用 (side effect) 的操作都不会影响到之前的数据。其实就是创建全选的父引用，复用之前的引用类型，当对应的引用类型
的数据改变是，才创建新的复制。

即2个特点：
1. 将所有的原生数据类型（Object， Array等）都会转化成 `immutable-js` 的内部对象（`Map`，`List` 等），并且任何操作最终都会返回一个**新的** `immutable` 的值。
2. 在 `immutable-js` 的数据结构中，深层次的对象 在没有修改的情况下仍然能够保证严格相等，即**深层嵌套对象的结构共享**

- [源码解析](https://zhuanlan.zhihu.com/p/44571842)

### React Css 方案

1. css modules

类似Vue的`scoped`，可以解决CSS变量名冲突

2. css in js

[styled-components](https://github.com/styled-components/styled-components)

3. [styled-jsx](https://github.com/vercel/styled-jsx)

#### react如何实现keep-alive
- [React 中的状态自动保存](https://juejin.cn/post/6844903942522929160)
