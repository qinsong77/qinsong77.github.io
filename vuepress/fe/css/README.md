---
title: Summary of CSS
---

### [css晦涩难懂的点](https://juejin.cn/post/6888102016007176200)

### [Web开发者应该掌握的CSS tricks](https://lhammer.cn/You-need-to-know-css/#/zh-cn/)

### [各种页面常见布局知名网站实例分析相关阅读推荐](https://www.sweet-kk.top/css-layout)

### 网页布局
> [总结](https://www.zhihu.com/question/21775016/answer/1358336033)

### [你未必知道的49个CSS知识点](https://juejin.im/post/6844903902123393032)

### flex布局
> [介绍文章](https://zhuanlan.zhihu.com/p/25303493)

> [介绍文章](https://juejin.im/post/6866914148387651592)

flex:1的含义：`flex:1 =  flex: 1 1 0% =flex-grow: 1;flex-shrink: 1;flex-basis: 0%;`

flex左侧固定，右侧自适应，设置`min-width: 0;`保证内容不超出外层容器，如果没有设置min-width，当内容大于剩余盒子宽度时会超出父盒子，设置min-width保证内容局限在父盒子内。
也可设置右侧`flex-shrink: 0;`不缩小
```html
<div class="flex">
  <div class="left">我在左边，自适应布局</div>
  <div class="right">我在右边，定宽</div>
</div>
<style>
.flex{
  display: flex;
}
 
.left{
  flex: 1;
  min-width: 0; // 重要
  background: red;
}
 
.right{
  /*flex-shrink: 0;*/
  background:green;
  width: 200px;
}
</style>
```
#### [从网易与淘宝的font-size思考前端设计稿与工作流](https://www.cnblogs.com/lyzg/p/4877277.html)

#### 伪类和伪元素

伪类和伪元素的根本区别在于：它们是否创造了新的元素

伪类，指可以通过元素选择器，就可以实现的效果，如frist-child，active等。 而伪元素，是指需要通过创元素，才可以实现的效果，如first-letter,before，after等。
具体元素跟写法有兴趣，可参考：<https://blog.csdn.net/qq_27674439/article/details/90608220>
