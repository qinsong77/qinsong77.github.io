---
title: Summary of CSS
---

### flex布局
> [介绍](https://juejin.im/post/6866914148387651592)

flex左侧固定，右侧自适应，设置`min-width: 0;`保证内容不超出外层容器，如果没有设置min-width，当内容大于剩余盒子宽度时会超出父盒子，设置min-width保证内容局限在父盒子内。
```html
<div class="flex">
  <div class="left">我在左边，自适应布局</div>
  <div class="right">我在右边，定宽</div>
</div>
<style></style>
.flex{
  display: flex;
}
 
.left{
  flex: 1;
  min-width: 0; // 重要
  background: red;
}
 
.right{
  background:green;
  width: 200px;
}

```


### 网页布局
> [总结](https://www.zhihu.com/question/21775016/answer/1358336033)

### [你未必知道的49个CSS知识点](https://juejin.im/post/6844903902123393032)
