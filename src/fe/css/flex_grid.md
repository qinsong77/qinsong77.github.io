---
title: flex和grid
---


### flex布局

![](./imgs/flex.png)

`dispaly: flex;`将对象作为弹性伸缩盒显示，默认width为`100%`，铺满整行。
`dispaly: inline-flex;`将对象作为内联块级弹性伸缩盒显示，父元素默认会根据子元素的宽高去自适应。
> [介绍文章](https://zhuanlan.zhihu.com/p/25303493)

> [介绍文章](https://juejin.im/post/6866914148387651592)

`flex` 属性是 `flex-grow`、`flex-shrink` 和 `flex-basis` 的缩写属性。有三个关键字属性：`initial(0 1 auto)`、 `auto(1 1 auto)`和 `none(0, 0, auto)`，默认值为 `initial`，即 `0 1 auto`。也可以单独定义属性值。

- `flex-grow`: 定义项目的放大比例，其值为无单位数(≥0)。默认值为 0，表示存在剩余空间（**flex 容器的大小减去所有项目加起来的大小**），也不放大。若 flex-grow 为无单位正数，则根据兄弟项目的不同 flex-grow 系数，按比例进行分配。

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
#### align-items和align-content
align-items: 定义了项目在交叉轴上的对齐方式
```
.container {
    align-items: flex-start | flex-end | center | baseline | stretch;
}
```
align-content: 定义了多根轴线的对齐方式，如果项目只有一根轴线，那么该属性将不起作用
```
.container {
    align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```
#### Flex布局如何实现最后一个元素右对齐（CSS）
在最后一项元素使用样式：`margin-left: auto;`

### [Grid布局](http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)

display: grid | inline-grid，设为网格布局以后，容器子元素（项目）的`float`、`display: inline-block`、`display: table-cell`、`vertical-align和column-*`等设置都将失效。

`grid-template-columns`属性定义每一列的列宽，

`grid-template-rows`属性定义每一行的行高。

#### grid-template-columns 属性，grid-template-rows 属性

`grid-template-columns: 100px 100px 100px;`表示3列，每一列的行宽是100px，也可使用百分比。

- repeat(n, width)
`grid-template-columns: repeat(3, 33.33%)`，表示重复三列width为33.3%；
`grid-template-columns: repeat(2, 100px 20px 80px);`定义了6列，第一列和第四列的宽度为100px，第二列和第五列为20px，第三列和第六列为80px。

- auto-fill
`grid-template-columns: repeat(auto-fill, 100px);`表示每列宽度100px，然后自动填充，直到容器不能放置更多的列。

- fr（fraction） 
   项目占的比例。`grid-template-columns: 150px 1fr 2fr;`第一列的宽度为150像素，第二列的宽度是第三列的一半。
- `minmax()`: `minmax()`函数产生一个长度范围，表示长度就在这个范围之中。它接受两个参数，分别为最小值和最大值。

 `grid-template-columns: 1fr 1fr minmax(100px, 1fr);`  minmax(100px, 1fr)表示列宽不小于100px，不大于1fr。
   
- auto: 表示由浏览器自己决定长度。

`grid-template-columns: 100px auto 100px;`-第二列的宽度，基本上等于该列单元格的最大宽度，除非单元格内容设置了min-width，且这个值大于最大宽度。

- **两栏式布局**
```css
.wrapper {
  display: grid;
  grid-template-columns: 70% 30%;
}
```
- **十二网格布局**: grid-template-columns: repeat(12, 1fr);

#### `grid-row-gap` 属性，`grid-column-gap` 属性，`grid-gap` 属性
- `grid-row-gap`属性设置行与行的间隔（行间距）
- `grid-column-gap`属性设置列与列的间隔（列间距）
- `grid-gap`属性是`grid-column-gap`和`grid-row-gap`的合并简写形式,`grid-gap: <grid-row-gap> <grid-column-gap>;`省略了第二个值，浏览器认为第二个值等于第一个值。
- 根据最新标准，上面三个属性名的grid-前缀已经删除，grid-column-gap和grid-row-gap写成`column-gap`和`row-gap`，grid-gap写成`gap`。
```css
.container {
  grid-row-gap: 20px;
  grid-column-gap: 20px;
}
```

#### grid-auto-flow: 子元素顺序grid-auto-flow属性决定，默认值是row，即"先行后列"。也可以将它设成column，变成"先列后行"。

#### justify-items 属性，align-items 属性，place-items 属性

- justify-items属性设置单元格内容的水平位置（左中右）
- align-items属性设置单元格内容的垂直位置（上中下）。
- place-items属性是align-items属性和justify-items属性的合并简写形式。
```css
.container {
  justify-items: start | end | center | stretch;
  align-items: start | end | center | stretch;
}
```
#### justify-content 属性，align-content 属性，place-content 属性
- justify-content属性是整个内容区域在容器里面的水平位置（左中右）
- align-content属性是整个内容区域的垂直位置（上中下）。
- place-content属性是align-content属性和justify-content属性的合并简写形式。
```css
.container {
  justify-content: start | end | center | stretch | space-around | space-between | space-evenly;
  align-content: start | end | center | stretch | space-around | space-between | space-evenly;  
}
```
