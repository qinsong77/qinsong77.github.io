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
具体元素跟写法，可参考：<https://blog.csdn.net/qq_27674439/article/details/90608220>

#### `<img>`是什么元素

> `<img />` 标签没有独占一行，所以是行内元素;既然是行内元素为什么能够设置宽高呢？`<img />` 标签属于替换元素，具有内置的宽高属性，所以可以设置，具体解释看下面。

从元素本身的特点来讲，可以分为不可替换元素和替换元素,元素相关的[MDN解释](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Replaced_element)

##### 不可替换元素
- (X)HTML 的大多数元素是不可替换元素，即其内容直接表现给用户端(例如浏览器),如：`<h1>我是标题</h1>`。

##### 可替换元素

- 浏览器根据元素的标签和属性，来决定元素的具体显示内容,例如浏览器会根据 `<img>`标签的src属性的值来读取图片信息并显示出来，而如果查看(X)HTML代码，则看不到图片的实际内容；又例如根据 `<input>` 标签的type属性来决定是显示输入框，还是单选按钮等
- (X)HTML中的` <img>、<input>、<textarea>、<select>、<object> `都是替换元素。这些元素往往没有实际的内容，即是一个空元素
如：`<img src="tigger.jpg"/>`、`<input type="submit" name="Submit" value="提交"/>`
- **可替换元素的性质同设置了display:inline-block的元素一致**


总结
- <img>属于可替换元素
- <img>同时具有行内元素，行内块，和块级元素的特性
- 替换元素一般有内在尺寸，所以具有 width 和 height，可以设定，例如你不指定 <img> 的 width 和 height 时，就按其内在尺寸显示，也就是图片被保存的时候的宽度和高度


- 对于表单元素，浏览器也有默认的样式，包括宽度和高度
- `<img>、<input>`属于行内替换元素。height/width/padding/margin均可用。效果等于块元素。
