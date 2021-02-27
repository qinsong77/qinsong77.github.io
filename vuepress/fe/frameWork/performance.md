---
title: 前端性能优化
---

- [前端性能优化 24 条建议](https://juejin.cn/post/6892994632968306702)
- [Web 用户体验设计提升指南](https://juejin.cn/post/6932647134944886797)

一个网站加载性能如何主要看白屏时间和首屏时间。

白屏时间：指从输入网址，到页面开始显示内容的时间。

首屏时间：指从输入网址，到页面完全渲染的时间。

## 前端指标
1. FP，First Paint。是页面导航与浏览器将该网页的第一个像素渲染到屏幕上所用的中间时，渲染是任何与输入网页导航前的屏幕上的内容不同的内容。背景色会很快完成绘制

2. FCP，First Contentful Paint。当页面绘制完第一个 DOM 内容，会触发首屏，这里的内容可以是文字、图片或者是 canvas。

3. FMP，First Meaning Paint。首次有效绘制。这是一个很主观的指标。根据业务的不同，每一个网站的有效内容都是不相同的，有效内容就是网页中"主角元素"。对于视频网站而言，主角元素就是视频。对于搜索引擎而言，主角元素就是搜索框。

4. ATF，Above The Fold，首屏时间

5. TTI，Time To Interact，首次交互时间，可以用DomReady时间。可交互时间。用于标记应用已进行视觉渲染并能可靠响应用户输入的时间点。应用可能会因为多种原因而无法响应用户输入：①页面组件运行所需的JavaScript尚未加载完成。②耗时较长的任务阻塞主线程

6. 资源总下载时间。Load时间 >= DomContentLoaded时间

 （1）Dom加载完时间，DomContentLoaded。

 （2）页面资源加载完时间，Load，包括图片，音视频等异步资源。但是资源加载完之后，页面还没有完全稳定，完全稳定的时间由finish决定。

7. 服务端重要接口加载速度。

8. 客户端启动容器（WebView）时间。

## 优化方向
前端性能优化分为两个方向，一是工程化方向，另一个是细节方向。

### 工程化方向

1. 客户端Gzip离线包，服务器资源Gzip压缩。

2. JS瘦身，Tree shaking，ES Module，动态Import，动态Polyfill。

3. 图片加载优化，Webp，考虑兼容性，可以提前加载一张图片，嗅探是否支持Webp。

4. 延迟加载不用长内容。通过打点，看某些弹窗内或者子内容是否要初始化加载。

6. 服务端渲染，客户端预渲染。

7. CDN静态资源

8. Webpack Dll，通用优先打包抽离，利用浏览器缓存。

9. 骨架图

10. 数据预取，包括接口数据，和加载详情页图片。

11. Webpack本身提供的优化，Base64，资源压缩，Tree shaking，拆包chunk。

12. 减少重定向。

### 细节方向

1. 图片，图片占位，图片懒加载。 雪碧图

2. 使用 prefetch / preload 预加载等新特性

3. 服务器合理设置缓存策略

4. async（加载完当前js立即执行）/defer(所有资源加载完之后执行js)

5. 减少Dom的操作，减少重排重绘

6. 从客户端层面，首屏减少和客户端交互，合并接口请求。

7. 数据缓存。

8. 首页不加载不可视组件。

9. 防止渲染抖动，控制时序。

10. 减少组件层级。

11. 优先使用Flex布局。

### 卡顿问题解决

1. CSS动画效率比JS高，css可以用GPU加速，3d加速。如果非要用JS动画，可以用requestAnimationFrame。

2. 批量进行DOM操作，固定图片容器大小，避免屏幕抖动。

3. 减少重绘重排。

4. 节流和防抖。

5. 减少临时大对象产生，利用对象缓存，主要是减少内存碎片。

6. 异步操作，IntersectionObserver，PostMessage，RequestIdleCallback。

### 性能优化API

1. Performance。performance.now()与new Date()区别，它是高精度的，且是相对时间，相对于页面加载的那一刻。但是不一定适合单页面场景。

2. window.addEventListener("load", ""); window.addEventListener("domContentLoaded", "");

3. Img的onload事件，监听首屏内的图片是否加载完成，判断首屏事件。

4. RequestFrameAnmation 和 RequestIdleCallback。

5. IntersectionObserver、MutationObserver，PostMessage。

6. Web Worker，耗时任务放在里面执行。

### 检测工具
1. Chrome Dev Tools

2. Page Speed

3. Jspref

### 首屏优化

#### [CRP](https://juejin.cn/post/6844903757038223367)
CRP： 即**关键渲染路径** (Critical Rendering Path)， 关键渲染路径是浏览器将 HTML CSS JavaScript 转换为在屏幕上呈现的像素内容所经历的一系列步骤。
