---
title: Summary of CSS
---

### [css晦涩难懂的点](https://juejin.cn/post/6888102016007176200)

### [Web开发者应该掌握的CSS tricks](https://lhammer.cn/You-need-to-know-css/#/zh-cn/)

### [各种页面常见布局知名网站实例分析相关阅读推荐](https://www.sweet-kk.top/css-layout)

### 网页布局
> [总结](https://www.zhihu.com/question/21775016/answer/1358336033)

### [你未必知道的49个CSS知识点](https://juejin.im/post/6844903902123393032)

#### [从网易与淘宝的font-size思考前端设计稿与工作流](https://www.cnblogs.com/lyzg/p/4877277.html)

### 自适应布局和响应式布局

响应式布局实现一个网站能够兼容多个终端，网页的布局针对屏幕大小的尺寸而进行响应，流式布局+弹性布局，再搭配媒体查询技术使用。

自适应布局大致是指网页能够在不同大小的终端设备上自行适应显示。就是让一个网站在不同大小的设备上呈现显示同一样的页面，让同一个页面适应不同大小屏幕，根据屏幕的大小，自动缩放。多用rem+js实现，在移动端适配多种屏幕。


### em&&[rem](https://yanhaijing.com/css/2017/09/29/principle-of-rem-layout/)

px像素（Pixel）。相对长度单位。像素px是相对于显示器屏幕分辨率而言的。

#### em

**em**，`em`值的大小是动态的。当定义或继承`font-size`属性时，`1em`等于该元素的字体大小。如果你在网页中任何地方都没有设置文字大小的话，那它将等于浏览器默认文字大小，通常是`16px`。所以通常1em = 16px。2em = 32px。 如果你设置了body元素的字体大小为20px，那1em = 20px、2em = 40px。那个2就是当前em大小的倍数。

`em`单位受父元素的影响，是因为font-size本身是继承属性。如果没有定义，就要基于父元素，直到html,html未设置则是浏览器的默认文字大小`16px`

所有未经调整的浏览器都符合: 1em=16px。那么12px=0.75em,10px=0.625em。为了简化font-size的换算，需要在css中的body选择器中声明Font-size=62.5%，这就使em值变为 16px*62.5%=10px, 这样12px=1.2em, 10px=1em, 也就是说只需要将你的原来的px数值除以10，然后换上em作为单位就行了。

#### rem

`rem`即 root em，顾名思义，就是根元素 `em` 大小。 `em` 相对于当前元素， `rem` 相对于根元素，本质差别在于当前元素是多变的，根元素是固定的，也就是说，如果使用 rem，我们的计算值不会受当前元素 `font-size` 大小的影响。css3新增。

- [flex布局](#flex布局)
- [伪类和伪元素](#伪类和伪元素)
- [img是什么元素](#img-是什么元素)
- [line-height:1.5和line-height:150%的区别](#line-height-1-5和line-height-150-的区别)

### 盒模型

组成：盒模型由内容区域、内边距、边框、外边距四部分组成。

实际大小：盒模型实际大小由内容区域、内边距、边框三部分组成，css设置`width`和`height`是对盒子内容区域设置的。

`box-sizing`属性：
- W3C标准盒模型（content-box）: 一个块的总宽度= width + margin(左右) + padding(左右) + border(左右);
- IE（怪异）盒模型（border-box：border、padding 的设置不会影响元素的宽高，那么css给盒子设置的`width`和`height`属性就等于盒模型的实际大小（包括内容区域、内边距、边框）;
![](./imgs/content_box.png)
![](./imgs/box-sizing.png)

`border-color` 默认颜色就是
color 色值”。具体来讲，就是当没有指定` border-color `颜色值的时候，会使用当前元素的
color 计算值作为边框色。具有类似特性的 CSS 属性还有 outline、box-shadow 和 text-shadow 等。

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
##### align-items和align-content
align-items: 定义了项目在交叉轴上的对齐方式
```css
.container {
    align-items: flex-start | flex-end | center | baseline | stretch;
}
```
align-content: 定义了多根轴线的对齐方式，如果项目只有一根轴线，那么该属性将不起作用
```css
.container {
    align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```

### 定位position

- `static`
HTML 元素的默认值，即没有定位，遵循正常的文档流对象。静态定位的元素不会受到 top, bottom, left, right影响。

- `relative`
相对定位元素的定位是相对其正常位置。移动相对定位元素，但它原本所占的空间不会改变。相对定位元素经常被用来作为绝对定位元素的容器块。

- `absolute`
绝对定位的元素的位置相对于最近的已定位父元素（除了static的父元素），如果元素没有已定位的父元素，那么它的位置相对于`<html>`--**错误，经过测试是相对于浏览器窗口**:
top, bottom, left, right百分比写法是**相对于父元素box的大小**;
absolute 定位使元素的位置与文档流无关，因此不占据空间。absolute 定位的元素和其他元素重叠。

- `fixed`
元素的位置相对于浏览器窗口是固定位置。即使窗口是滚动的它也不会移动：fixed定位使元素的位置与文档流无关，因此不占据空间。
 `fixed`定位的元素和其他元素重叠。
 
- `sticky`
粘性定位：position: sticky; 在目标区域以内，它的行为就像 `position:relative;`在滑动过程中，某个元素距离其父元素的距离达到`sticky`粘性定位的要求时(比如`top：100px`)；`position:sticky`这时的效果相当于`fixe`d定位，固定到适当位置；

元素定位表现为在跨越特定阈值（相对偏移）前为相对定位，之后为固定定位。

元素固定的相对偏移是相对于离它最近的具有滚动框的祖先元素，如果祖先元素都不可以滚动，那么是相对于viewport来计算元素的偏移量。 

这个特定阈值（相对偏移）指的是 top, right, bottom 或 left 之一，换言之，指定 top, right, bottom 或 left 四个阈值其中之一，才可使粘性定位生效。否则其行为与相对定位相同。

使用条件：

1、父元素不能`overflow:hidden`或者`overflow:auto`属性；

2、必须指定`top、bottom、left、right`4个值之一，否则只会处于相对定位；

3.父元素的高度不能低于`sticky`元素的高度；

4、sticky元素仅在其父元素内生效。

- inherit
规定应该从父元素继承 position 属性的值。

#### [伪类](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes)和伪元素

伪类和伪元素的根本区别在于：它们是否创造了新的元素

伪类，指可以通过元素选择器，就可以实现的效果，如`first-child`，`active`, `:checked`，`:disabled`， `:nth-child()`等。 而伪元素，是指需要通过创元素，才可以实现的效果，如`first-letter`,`before`，`after`等。
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

### line-height:1.5和line-height:150%的区别

区别体现在子元素继承时，如下：

- 父元素设置line-height:1.5会直接继承给子元素，子元素根据自己的font-size再去计算子元素自己的line-height。
- 父元素设置line-height:150%是计算好了line-height值，然后把这个计算值给子元素继承，子元素继承拿到的就是最终的值了。此时子元素设置font-size就对其line-height无影响了。

比如父元素设置属性：font- size:14px;line-height:1.5,child设置font-size:26px;

那么父元素：line-height = 14px * 1.5 = 21px，子元素：line-height = 26px * 1.5 = 39px。

父元素设置属性：font-size:14px;line-height:150%,child设置font-size:26px;

那么父元素：line-height = 14px * 150% = 21px，子元素：line-height = 父元素的line-height = 21px。

### 1px问题

[文章](https://juejin.cn/post/6896713964848152589)

```scss
.border1px {
  position: relative;
  &::after{
    position: absolute;
    content: '';
    background-color: #ddd;
    display: block;
    width: 100%;
    height: 1px; 
    transform: scale(1, 0.5); /* 进行缩放*/
    top: 0;
    left: 0;
  }
}
```

#### devicePixelRatio属性


该 `Window` 属性 `devicePixelRatio` 能够返回当前显示设备的物理像素分辨率与 `CSS` 像素分辨率的比率。此值也可以解释为像素大小的比率：一个 CSS 像素的大小与一个物理像素的大小的比值。简单地说，这告诉浏览器应该使用多少个屏幕的实际像素来绘制单个 CSS 像素。devicePixelRatio 属性值为一个 double（MDN）

物理像素一般指屏幕的分辨率，设备出厂就设定好了，当然操作系统可以改显示的分辨率，一个像素就是一个点，也就是厂家在生产显示设备时就决定的实际点的个数。
上对于不同的设备而言，物理像素点的大小是不一样的，这样就会带来问题：举个例子，21英寸显示器的分辨率是1440x1080，5.8英寸的iPhone X的分辨率是2436×1125，
用CSS画一条线，其长度是20px，如果都以物理像素作为度量单位，那么在显示器上看起来正常，在iPhone X屏幕上就变得非常小，不是想要的结果。所以呢，为了解决这个问题，还需要一个新的度量单位，
这个度量单位必须是与设备无关的，采用这个单位，无论在何种设备上，相同长度的线看起来都应该差不多，这就是**设备独立像素(device-independent pixels, dips )**

物理像素可以理解为硬件设备，设备独立像素可以认为是程序员控制显示器的接口，中间会经过操作系统来将设备独立像素转换成物理像素，用实际的物理像素点来显示。
所以，在编程中能获取到的都是设备独立像素，如CSS中的获取的所有像素都是设备独立像素，而物理像素对于程序员来说是透明的，没法在代码中看到的。

不管何种设备，一般都满足：设备独立像素 <= 物理像素

`window.devicePixelRatio` = 设备物理像素 / 设备独立像素

通过`window.devicePixelRatio`，可以知道一个设备独立像素用几个物理像素点来表示。如iPhone X中，`devicePixelRation`为3，iPhone6/7/8中`devicePixelRatio`的为2。当然，devicePixelRation并不一定是整数，也有可能是1.5，2.25这些小数值。

#### 缩放

说完上面的概念，也许会有个疑惑：有一张400x300的图片，分别放到400x300和800x600的显示器上全屏显示，会怎么样呢？

先来看400x300的显示器，由于是全屏显示，正好图片也是400x300的分辨率，两者相等，于是很愉快的，显示器上一个像素点就显示照片上的一个像素，整个图片完美的显示出来了

而在800x600的显示器上全屏时，图片上点的数目不够用了，这时，屏幕上的4个像素点只能显示照片的一个像素点（为什么是4呢，因为一个像素点可以看成是一个正方形，横向和纵向都是2倍，所以2x2=4）。由于像素已经是最小的单位了，不能再往下分了，所以就只能就近取色，所以最后的图片看起来就会模糊。

这个原理与Retina屏幕显示是一样的。比如，对于一幅400x300的图片，用CSS设定其宽高为400x300，CSS设定的是设备独立像素。在普通屏幕上，CSS指定的400x300像素大小区域正好是400x300个物理像素点，图片完美显示，对应上面的情况一；在Retina屏上，devicePixelRatio为2，CSS指定的400x300像素大小区域有800x600个物理像素点，对应的就是上面的情况2，所以就会有模糊的情况。具体原理可以参考下面的图（来自网络）：

![](./imgs/scale_1.png)

为了解决Retina屏幕的显示问题，往往会用更高分辨率的图片来代替，比如对于上面的情况，如果用800x600的图片，那么在Retina屏幕上显示就会非常完美，但是换到普通屏幕上，问题又来了：显示器上的一个物理像素点要显示照片上的4个像素点，装不下了。这时候，会自动下采样。下采样之后的，看起来也不会有太大问题，但可能会有点色差或者缺少锐利度。

![](./imgs/scale_2.png)

#### CSS的单位
CSS的单位分两种：绝对长度单位和相对长度单位。

**绝对单位：**
- cm：厘米
- mm：毫米
- in：英寸
- pc(picas):一英寸的1/6
- pt(points)：一英寸的1/72
- **px(pixels)：一英寸的1/96**

之所以叫绝对长度单位，是因为在只有普通屏幕的时代，相同的单位无论在何种设备上，显示出来的长度都是一致的，并且1cm就是等于物理长度1厘米。而后来，由于Retina显示屏的出现，**绝对长度单位里面的“绝对”，是指单位之间关系是绝对固定的**
。比如，`1in = 72pt`和`1in = 96px`是永远固定不变的。关系不变，就需要选取其中一个作为基准：

- 在打印机设备中，一般是以物理单位作为基准，即1in对应物理单位的1in，此时，1px的长度就是1/96in。所有单位都是与物理长度对应的
- 而在显示设备（电脑和手机）中，一般是以像素作为基准的。比如在iPhone X中，设备的宽度是2.79in（物理宽度），屏幕分辨率是1125物理像素，window.devicePixelRatio = 3，也就是3个物理像素表示一个CSS像素，所以iPhone X宽度的CSS像素是375px。此时，CSS单位的1in表示的实际长度是2.79 / 375 * 96in = 0.71424in，此时，CSS的1in并不表示物理长度1in

**相对长度单位：**

相对于预定义的长度或特征，一般是相对于字体或者viewport，在移动端适配中有很重要的作用

相对于字体
- ex (x-height)：等于所用字体的小写字母x的高度
- ch (character)：等于所用字体的数字0的宽度
- em：相对于最近父级font-size，所以会有层层嵌套的问题，每一层都是相对于最近父级。
- rem ：相对于html标签的font-size

相对于viewport
- vh：viewport高度的1/100
- vw：viewport宽度的1/100
- vmin：viewport宽高较小者的1/100
- vmax：viewport宽高较大者的1/100

#### visual viewport、layout viewport和ideal viewport介绍

[**visual viewport**](https://developer.mozilla.org/zh-CN/docs/Web/API/VisualViewport)

这个是浏览器给我们用的、能真正用来显示网页内容的区域，可以通过下面的js命令获取：
```javascript
window.innerWidth
window.innerHeight
```
正如上面所说的，前端里面能获取到的像素基本上都是CSS像素，所以这个的单位也是CSS像素。对于iPhone X，浏览器全屏状态下，其`window.innerWidth`的值为375。

而`screen.width`和`screen.height`，主要是用来获取整个屏幕的大小的，而`window.innerWidth`和`window.innerHeight`
只是获取浏览器可用显示区域的大小，也就是浏览器中间负责显示的部分。当浏览器全屏时，要去掉状态栏、标签栏、任务栏等区域，当浏览器非全屏时，其值更小。由于在移动端，浏览器一般都是全屏的，所以大多数情`screen.width`和`windows.innerWidth`相等。

**layout viewport**

```javascript
document.documentElement.clientWidth
document.documentElement.clientHeight
```
与布局视口（layout viewport）不同的是：只有最上层的 window 才有视觉视口（visual viewport）这一概念。因此只有最上层 window 的 VisualViewport 属性才是有效的，其他层的视觉视口属性可看作是布局视口属性的别名。比如，对于一个` <iframe> `，其对应的视觉视口属性 `VisualViewport.width` 相当于对应的布局视口属性，如 `document.documentElement.clientWidth`.- MDN

网页最早是出现在电脑上的，电脑的物理像素可能比手机还要低，但是电脑的设备无关像素（或者说是分辨率吧，更严谨一些）是明显大于手机的设备无关像素的，毕竟电脑的屏幕尺寸远比手机大啊。那些在电脑上的网页，如果没有经过专门的优化，直接搬到手机上看，那么问题就来了，网页会被挤得变形。所以，手机厂商为了解决这个问题，设置了一个`layout viewport`。

这是一个虚拟的窗口，其大小比手机屏幕大，加载网页时，直接把HTML渲染在这个虚拟的窗口中，这样就不会样式错乱了。在查看的时候，毕竟手机的visual viewport小啊，那就只能通过滚动条来看了。

做个比喻，layout viewport就是一张大白纸，HTML的内容就写在这个大白纸上，visual viewport就是一个放大镜，上下左右移动，可以显示其中的一部分。

Layout viewport的大小可以通过`document.documentElement.clientWidth`和`document.document.clientHeight`，实际使用中可能会有一些兼容问题，这跟DOCTYPE声明有关。不同浏览器的layout viewport大小不同，常见的有980px、1024px。

**ideal viewport**

移动设备的理想viewport。

Layout viewport是为了能将电脑上的网页正确的显示到手机上。当浏览器拿到一个网页时，首先会渲染到这个layout viewport里面。可是现在有很多网页会针对手机做专门的设计，比如现在的一些H5活动页，设计的尺寸就是在手机上看的。此时如果还是把网页渲染到这个大的layout viewport上，实在是有点不合适了。所以，还应该有个ideal viewport，这个ideal viewport应该与手机屏幕大小的相同，确切来说，等于visual viewport的大小。把页面渲染到这个ideal viewport里面，就能在visual viewport中完美显示。

#### [使用meta标签设置viewport](https://segmentfault.com/a/1190000020218602)
#### 伪类+transform实现

### clientHeight、offsetHeight、scrollHeight、offsetTo、scrollTop,`Element.getBoundingClientRect()`

每个HTML元素都具有clientHeight offsetHeight scrollHeight offsetTop scrollTop 这5个和元素高度、滚动、位置相关的属性，总结出规律如下：

clientHeight和offsetHeight属性和元素的滚动、位置没有关系它代表元素的高度，其中：

#### [clientHeight](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/clientHeight)
包括`padding`但不包括border、水平滚动条、margin的元素的高度。对于`display:inline`的元素这个属性一直是0，单位px，只读元素。box-sizing属性设置不会影响。

`clientHeight` 可以通过 CSS `height` + CSS `padding` - 水平滚动条高度 (如果存在)来计算.

`element.style.height`获取的是内联属性（即： 标签内设置的style）,也就是说如果是在css中设置的，获取不到。通常只用来设置样式。

`window.getComputedStyle(ele, [伪类])`（返回的是元素所有的样式属性）能获取css height

上面2个返回的都是如`200px`的字符串css值

#### [Element.getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
方法返回元素的大小及其相对于视口的位置。

返回值是一个 `DOMRect` 对象，这个对象是由该元素的 `getClientRects()` 方法返回的一组矩形的集合，就是该元素的 CSS 边框大小。返回的结果是包含完整元素的最小矩形，并且拥有left, top, right, bottom, x, y, width, 和 height这几个以像素为单位的只读属性用于描述整个边框。除了width 和 height 以外的属性是相对于视图窗口的左上角来计算的。-mdn

用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置。

top、left和css中的理解很相似，right是指元素右边界距窗口最左边的距离，bottom是指元素下边界距窗口最上面的距离。width、height是元素自身的宽高。

![](./imgs/getBoundingClient.png)

获取到的结果都是Number，不带单位

- clientWidth	获取元素可视部分的宽度，即 CSS 的 width 和 padding 属性值之和，元素边框和滚动条不包括在内，也不包含任何可能的滚动区域
- clientHeight	获取元素可视部分的高度，即 CSS 的 height 和 padding 属性值之和，元素边框和滚动条不包括在内，也不包含任何可能的滚动区域
- offsetWidth	元素在页面中占据的宽度总和，包括 width、padding、border 以及滚动条的宽度
- offsetHeight	元素在页面中占据的高度总和，包括 height、padding、border 以及滚动条的宽度
- scrollWidth	当元素设置了 overflow:scroll 样式属性时，元素的总宽度，也称滚动宽度。在默认状态下，如果该属性值大于 clientWidth 属性值，则元素会显示滚动条，以便能够翻阅被隐藏的区域
- scrollHeight	当元素设置了 overflow:scroll 样式属性时，元素的总高度，也称滚动高度。在默认状态下，如果该属性值大于 clientWidth 属性值，则元素会显示滚动条，以便能够翻阅被隐藏的区域
- scrollTop: 代表在有滚动条时，滚动条向下滚动的距离也就是元素顶部被遮住部分的高度。在没有滚动条时scrollTop==0恒成立。单位px，可读可设置。
- offsetTop: 当前元素顶部距离最近父元素顶部的距离,和有没有滚动条没有关系。单位px，只读元素。
[文章](https://juejin.cn/post/6844904133921619982)
