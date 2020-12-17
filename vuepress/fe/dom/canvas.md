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


## File、Blob、dataURL 和 canvas 的应用与转换

[文章](https://mp.weixin.qq.com/s?__biz=Mzg2NDAzMjE5NQ==&mid=2247486251&idx=2&sn=4155a16dcd53b137f741fed9d4235be1&chksm=ce6ecf87f91946912074fa668a9e2d258703e0c9de8d94088e69597f0996be962de9da4f0ec6&mpshare=1&scene=23&srcid=1217bhpRXtY68nVx8cO1APYq&sharer_sharetime=1608178912753&sharer_shareid=1958dfa2b35b63c7a7463d11712f39df#rd)

### 1. File
(1) 通常情况下， `File `对象是来自用户在一个 input 元素上选择文件后返回的 FileList 对象,也可以是来自由拖放操作生成的 `DataTransfer` 对象，或者来自 `HTMLCanvasElement` 上的 `mozGetAsFile()` API。

(2) `File` 对象是特殊类型的 `Blob`，且可以用在任意的 Blob 类型的 `context` 中。比如：`FileReader`, `URL.createObjectURL()`, `createImageBitmap()`, 及 `XMLHttpRequest.send()` 都能处理 `Blob` 和 `File`

### 2. Blob
(1) Blob 对象表示一个不可变、原始数据的类文件对象。它的数据可以按文本或二进制的格式进行读取，也可以转换成 `ReadableStream` 来用于数据操作。
    
(2) Blob 表示的不一定是JavaScript原生格式的数据。File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。

### 3. dataURL
(1) `Data URLs`，即前缀为 data: 协议的URL，其允许内容创建者向文档中嵌入小文件。

(2) `Data URLs` 由四个部分组成：前缀(data:)、指示数据类型的MIME类型、如果非文本则为可选的base64标记、数据本身：`data:[][;base64]`,
比如一张 png 格式图片，转化为 `base64` 字符串形式：`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAgAElEQVR4XuxdB5g`

### 4. canvas
(1) `Canvas API` 提供了一个通过JavaScript 和 HTML的 canvas 元素来绘制图形的方式。它可以用于动画、游戏画面、数据可视化、图片编辑以及实时视频处理等方面。

文件格式转换关系图

![](./image/blob_file_dateUrl_canvas.png)

### 相互转化

1. File、Blob 转化成 dataURL

FileReader 对象允许 Web 应用程序异步读取文件(或原始数据缓冲区)内容，使用 File 或 Blob 对象指定要读取的文件或数据。

```javascript
function fileToDataURL(file) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    // reader 读取文件成功的回调
    reader.onload = function(e) {
      return reader.result
    }
}
```

2. `dataURL(base64)` 转化成 Blob(二进制)对象
```javascript
function dataURLToBlob(fileDataURL) {
    let arr = fileDataURL.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while(n --) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], {type: mime})
}
```

3. File, Blob 文件数据绘制到 canvas

思路：File, Blob ——> dataURL ——> canvas
```javascript
function fileAndBlobToCanvas(fileDataURL) {
    let img = new Image()
    img.src = fileDataURL
    let canvas = document.createElement('canvas')
    if(!canvas.getContext) {
      alert('浏览器不支持canvas')
      return;
    }
    let ctx = canvas.getContext('2d')
    document.getElementById('container').appendChild(canvas)
    img.onload = function() {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
}
```

4. 从 canvas 中获取文件 dataURL
```javascript

function canvasToDataURL() {
    let canvas = document.createElement('canvas')
    let canvasDataURL = canvas.toDataURL('image/png', 1.0)
    return canvasDataURL
}

```
5. createObjectURL: 直接用 URL 对象，引用保存在 File 和 Blob 中数据的 URL。使用对象 URL 的好处是可以不必把文件内容读取到 JavaScript 中 而直接使用文件内容。为此，只要在需要文件内容的地方提供对象 URL 即可。
```javascript
function file2Image(file, callback) {
  var image = new Image();
  var URL = window.webkitURL || window.URL;
  if (URL) {
    var url = URL.createObjectURL(file);
    image.onload = function() {
      callback(image);
      window.revokeObjectURL(url);
    };
    image.src = url;
  } else {
      image.onload = function() {
        callback(image);
      }
      image.src = fileToDataURL(file)
  }
}
```
