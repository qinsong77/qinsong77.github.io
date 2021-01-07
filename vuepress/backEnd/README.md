---
title: Summary of node
---

### Nest.js
> [中文网](https://docs.nestjs.cn/)


### [Cookie、Session、Token、JWT](https://juejin.im/post/6844904034181070861)


### [一篇文章构建你的 NodeJS 知识体系](https://juejin.cn/post/6844903767926636558)

#### 基本知识点

- `__dirname`: 总是返回被执行的 js 所在文件夹的绝对路径;
- `__filename`: 总是返回被执行的 js 的绝对路径;
- `process.cwd()`: 总是返回运行 node 命令时所在的文件夹的绝对路径;
- `path.dirname()`： 返回 path 的目录名
- `path.join()`：所有给定的 path 片段连接到一起，然后规范化生成的路径
- `path.resolve()`：方法会将路径或路径片段的序列解析为绝对路径，解析为相对于当前目录的绝对路径，相当于cd命令
