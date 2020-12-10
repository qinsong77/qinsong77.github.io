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

`flex` 属性是 `flex-grow`、`flex-shrink` 和 `flex-basis` 的缩写属性。有三个关键字属性：`initial(0 1 auto)`、 `auto(1 1 auto)`和 `none(0, 0, auto)`，默认值为 `initial`，即 `0 1 auto`。也可以单独定义属性值。

- `flex-grow`: 定义项目的放大比例，其值为无单位数(≥0)。默认值为 0，表示存在剩余空间（flex 容器的大小减去所有项目加起来的大小），也不放大。若 flex-grow 为无单位正数，则根据兄弟项目的不同 flex-grow 系数，按比例进行分配。

- `flex-shrink`: 定义了 flex 元素的收缩规则，其值为无单位数(≥0)。默认值为 1，表示容器空间不足时，项目按比例收缩，值越大收缩比例越大。若值为 0，表示该项目不收缩。

- `flex-basis`：定义了在分配剩余空间之前，项目在主轴方向上的初始大小。浏览器根据这个属性，计算主轴是否有剩余空间。其值可以是带单位的长度值(≥0)，也可以是一个相对于其父弹性盒容器主轴尺寸的百分数(≥0%)。默认值为 auto，表示项目的本来大小。

> 当一个元素同时被设置了 flex-basis (除值为 auto 外) 和 width (或者在 flex-direction: column 情况下设置了 height) , flex-basis 具有更高的优先级。

flex 默认值是： `0 1 auto`

flex:1的含义：`flex:1 =  flex: 1 1 0% =flex-grow: 1;flex-shrink: 1;flex-basis: 0%;`（即项目初始大小为 0，所以主轴方向上的剩余空间就是容器的大小，又因为项目的 `flex-grow `都为 1，所以项目等比例放大，最终表现为均匀分布在弹性盒子容器中。）



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

### line-height1.5和line-height:150%的区别

区别体现在子元素继承时，如下：

- 父元素设置line-height:1.5会直接继承给子元素，子元素根据自己的font-size再去计算子元素自己的line-height。
- 父元素设置line-height:150%是计算好了line-height值，然后把这个计算值给子元素继承，子元素继承拿到的就是最终的值了。此时子元素设置font-size就对其line-height无影响了。

比如父元素设置属性：font- size:14px;line-height:1.5,child设置font-size:26px;

那么父元素：line-height = 14px * 1.5 = 21px，子元素：line-height = 26px * 1.5 = 39px。

父元素设置属性：font-size:14px;line-height:150%,child设置font-size:26px;

那么父元素：line-height = 14px * 150% = 21px，子元素：line-height = 父元素的line-height = 21px。
