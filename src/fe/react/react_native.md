# React Native

- [ReactNative原理-启动流程](https://juejin.cn/post/6844904184500715527)
- [React Native 原理与实践](https://zhuanlan.zhihu.com/p/343519887)
![](./image/react_native1.png)

## 原理

### JavaScriptCore
JavaScriptCore 是 JavaScript 引擎，通常会被叫做虚拟机，专门设计来解释和执行 JavaScript 代码。在 React Native 里面，JavaScriptCore 负责 bundle 产出的 JS 代码的解析和执行。

- 大多数情况下，React Native 使用的是JavaScriptCore，也就是 `Safari` 所使用的 `JavaScript 引擎`。但是在 iOS 上 JavaScriptCore 并没有使用即时编译技术（JIT），因为在 iOS 中应用无权拥有可写可执行的内存页（因此无法动态生成代码）。
- 在使用 Chrome 调试时，所有的 JavaScript 代码都运行在 Chrome 中，并且通过 WebSocket 与原生代码通信。此时的运行环境是V8 引擎。

### JS Engine

React Native 需要一个 JS 的运行环境，因为 React Native 会把应用的 JS 代码编译成一个 JS 文件（x x.bundle），React Native 框架的目标就是解释运行这个 JS 脚本文件，如果是 Native 拓展的 API，则直接通过 bridge 调用 Native 方法，最基础的比如绘制 UI 界面，映射 Virtual DOM 到真实的 UI 组件中。
