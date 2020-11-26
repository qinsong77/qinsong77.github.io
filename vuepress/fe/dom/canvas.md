---
title: canvas
---

### canvas绘图不清晰的解决方案

canvas 作图经常会遇到canvas绘制的图片模糊不清问题，这种问题实际上是画布尺寸与画布范围内实际像素不一致造成的。了解 [dpr](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/devicePixelRatio)
可以使用`window.matchMedia()` 检查`devicePixelRatio`的值是否发生更改（例如，如果用户将窗口拖动到带有 不同的像素密度）
##### dpr

`Window` 接口的`devicePixelRatio`返回当前显示设备的物理像素分辨率与CSS像素分辨率之比。 此值也可以解释为像素大小的比率：一个CSS像素的大小与一个物理像素的大小。 简单来说，它告诉浏览器应使用多少屏幕实际像素来绘制单个CSS像素。

语法： `value = window.devicePixelRatio;`

#### 原因分析
假设dpr = 2；图片大小为60x60px;  

　1.DOM呈现图片过程

图片——》浏览器css像素（显示尺寸）——》屏幕实际像素

　　60x60   ——》           30x30             ——》                 60x60

　　图片像素——》实际像素

　　1： 1

　　2.canvas绘制过程

　　图片像素——》canvas像素（画布尺寸）——》css像素（显示尺寸）——》屏幕实际像素

　　60x60      ——》           30x30          ——》                30x30           ——》            60x60

　　图片像素——》画布像素——》实际像素

　　4：        1：        4

　　也就是说，canvas的绘制过程中图片到画布的过程中进行了像素的抽稀，画布到屏幕像素时又进行了插值，所以造成图片质量下降。

#### 解决方案
    
除了以下解决方法，还可以使用[CanvasRenderingContext2D.scale()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/scale)方法，把canvas的上下文同比放大，这样我们在绘制的时候就不需要再次对坐标进行处理，直接按照原始的值绘制即可。
```javascript
function setupCanvas2(width, height){
    // create canvas
    const canvas = document.createElement('canvas')
    const ctx  = canvas.getContext('2d')
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    document.querySelector('.container').appendChild(canvas)

    // scale canvas
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    return {
        canvas,
        ctx
    }
}
```
   放大画布的尺寸，但是canvas显示尺寸不变；

　　图片像素——》canvas像素（画布尺寸）——》css像素（显示尺寸）——》屏幕实际像素

　　60x60    ——》     60x60     ——》        30x30       ——》     60x60

　　图片像素——》实际像素

　　1：  ——》     1 
而canvas的设计的时候正好有对象的属性来分别管理画布尺寸和显示尺寸；canvas的width、height属性用于管理画布尺寸；canvas的style属性中的width、height正好是显示尺寸。

也就是说解决方案就是设置画布尺寸与实际像素的一致，显示尺寸为正常显示尺寸；

假设canvas的显示尺寸为窗口宽度，创建canvas的时候指定canvas的width属性为`2 * body.clientHeight；style.width.clientHeight + 'px'`;
```javascript
// 计算设备的dpr
function setupCanvas(canvas){
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    return canvas
}
```
