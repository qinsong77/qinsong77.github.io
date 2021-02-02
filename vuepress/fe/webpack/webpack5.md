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
