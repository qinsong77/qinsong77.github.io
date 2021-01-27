---
title: 框架汇总
---


### [SPA 路由](https://juejin.im/post/6895882310458343431)

### Axios
- [值得借鉴的地方](https://juejin.im/post/6885471967714115597)

### [Better Scroll](https://juejin.im/post/6876943860988772360)

#### [git-rebase](https://www.jianshu.com/p/6960811ac89c)

git merge 操作合并分支会让两个分支的每一次提交都按照提交时间（并不是push时间）排序，并且会将两个分支的最新一次commit点进行合并成一个新的commit，最终的分支树呈现非整条线性直线的形式

git rebase操作实际上是将当前执行rebase分支的所有基于原分支提交点之后的commit打散成一个一个的patch，并重新生成一个新的commit hash值，再次基于原分支目前最新的commit点上进行提交，并不根据两个分支上实际的每次提交的时间点排序，rebase完成后，切到基分支进行合并另一个分支时也不会生成一个新的commit点，可以保持整个分支树的完美线性

rebase的最大好处并不是消除merge，而是避免merge的交织。

简要来说，就是在merge进被合分支（如master）之前，最好将自己的分支给rebase到最新的被合分支（如master）上，然后用pull request创建merge请求。

### [ESLint 和 Prettier](https://zhuanlan.zhihu.com/p/80574300)
ESLint 主要解决了两类问题, 

1. 代码质量问题：使用方式有可能有问题(problematic patterns)
2. 代码风格问题：风格不符合一定规则 (doesn’t adhere to certain style guidelines)

但其实 ESLint 主要解决的是代码质量问题。另外一类代码风格问题其实 `Airbnb JavaScript Style Guide` 并没有完完全全做完。
`Prettier` 接管了两个问题其中的代码格式的问题，而使用 `Prettier + ESLint` 就完完全全解决了两个问题。


#### [Git Reset 三种模式](https://www.jianshu.com/p/c2ec5f06cf1a)

### [彻底理解服务端渲染 - SSR原理](https://github.com/yacan8/blog/issues/30)
