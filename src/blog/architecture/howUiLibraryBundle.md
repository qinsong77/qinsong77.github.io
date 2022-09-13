---
title: 组件库都是如何打包的
layout: BlogLayout
------------------

打包后的标准的输出参考：
- [打包 JavaScript 库的现代化指南](https://github.com/frehner/modern-guide-to-packaging-js-library/blob/main/README-zh_CN.md)


## [material-ui](https://github.com/mui/material-ui/blob/master/package.json)

`@emotion` css-in-js样式方案，  `"sideEffects": false,`

- 使用rollup打包输出umd
- 使用tsc输出类型
- 使用babel构建输出cjs和esm，按文件夹格式

cjs输出的文件夹比其他组件库提升了一级，即一个组件库的文件夹和package.json一级，就支持这样引入组件
```js
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
```
## [chakra-ui](https://github.com/chakra-ui/chakra-ui)

`@emotion` css-in-js样式方案，  `"sideEffects": false,`

turborepo + pnpm workspce, 每一个组件都是一个package，在[@chakra-ui/react](https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/react/package.json)

中再把每一个组件都安装成依赖，全部暴露出来。

目录结构
```md
|-- package
|  |-- components
|  |  |-- button
|  |  |  |-- **stories**
|  |  |  |-- **tests**
|  |  |  |-- src
|  |  |  |  |-- button.tsx
|  |  |  |  |-- index.ts
|  |  |  |-- index.ts
|  |  |  |-- package.json
|  |  |  |-- tsup.config.ts
|  |  |-- react
|  |  |  |-- **tests**
|  |  |  |-- src
|  |  |  |  |-- button.tsx
|  |  |  |  |-- index.ts
|  |  |  |-- index.ts
|  |  |  |-- package.json
|  |  |  |-- tsup.config.ts

```

使用的[tsup](https://www.npmjs.com/package/tsup) 打包

`tsup.config.ts`，每个组件配置一样
```ts
import { defineConfig } from "tsup"
import { findUpSync } from "find-up"

export default defineConfig({
    clean: true,
    format: ["cjs", "esm"],
    outExtension(ctx) {
        return { js: `.${ctx.format}.js` }
    },
    inject: process.env.JSX ? [findUpSync("react-shim.js")!] : undefined,
})
```

## [naive-ui](https://github.com/tusen-ai/naive-ui)

- 使用rollup打包输出umd
- 使用`tsc` 输出es modules 和cjs，tsc按目录结构输出

`tsconfig.esm.json`

```json5
{
  "extends": "../tsconfig.json",
  "exclude": ["./**/*.spec.*"],
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "../es",
    // cjs, module设置为 CommonJs
    "module": "ES6",
    "target": "ES6",
    "jsx": "react"
  }
}
```

## ant-design

less方案
```json
{
  "files": [
    "dist",
    "lib",
    "es"
  ],
  "sideEffects": [
    "dist/*",
    "es/**/style/*",
    "lib/**/style/*",
    "*.less"
  ]
}
```
抽取了个package[`antd-tools`](https://github.com/ant-design/antd-tools/blob/master/lib/gulpfile.js)

本质上是`glup` + babel

- [React 组件库搭建指南（三）：编译打包](https://github.com/worldzhao/blog/issues/5)
- [组件库构建方案演进](https://www.infoq.cn/article/vma6h6ujzdeljkferurz)
- [前端组件库构建那些事儿](https://buptsteve.github.io/blog/posts/020.ui-lib-1.html)
- [居然有比 npm link 更好的调试？](https://mp.weixin.qq.com/s/I4hhrgI3-Y18HD8zw_9g9w)
- [How to Create and Publish a React Component Library](https://dev.to/alexeagleson/how-to-create-and-publish-a-react-component-library-2oe)
- [如何让组件库支持按需引入](https://zhuanlan.zhihu.com/p/473188268)
- [You may not need a bundler for your NPM library](https://cmdcolin.github.io/posts/2022-05-27-youmaynotneedabundler)
- [关于package.json中main字段的指向问题](https://jingsam.github.io/2018/03/12/npm-main.html)
