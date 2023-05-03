---
title: Summary
---

- [从Chrome V8源码看JavaScript数组](https://mp.weixin.qq.com/s/6U6zLT5pSiCI6DZ9-IV-xw)

- 视频 [V8引擎是如何运行JS](https://www.bilibili.com/video/BV1zV411z7RX)

## 视频内容
### 介绍

哪些程序用到V8

- Chrome浏览器的JS引擎是V8
- Nodejs的运行时环境是V8
- electron的底层引擎是V8跨平台桌面应用开发工具

blink是渲染引擎，V8是JS引擎

访问Dom的接口是由Blink提供的

### 功能

接收JavaScript代码，编译代码后执行C++程序，编译后的代码可以在多种操作系统多种处理器上运行。

1. 编译和执行JS代码
2. 处理调用栈
3. 内存分配
4. 垃圾回收

### V8的js编译和执行

- 解析器  parser  js --> 解析成功抽象语法树AST
- 解释器  interpreter   AST --> 字节码bytecode，也有直接执行字节码的能力
- 编译器  compiler  bytecode --> 更高效的机器码

V8版本5.9之前没有解释器，但是有两个编译器

#### 5.9版本的V8

1. parser  解释器生成抽象语法树AST
2. compiler  编译器Full-codegen  基准编译器  直接生成机器码
3. 运行一段时间后，由分析器线程优化js代码
4. compiler  编译器CrankShaft   优化编译器   重新生成AST提升运行效率

这样设计的缺点

1. 机器码会占用大量的内存
2. 缺少中间层机器码，无法实现一些优化策略
3. 无法很好的支持和优化JS的新语特性，无法拥抱未来
