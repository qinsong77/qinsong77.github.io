---
title: Dom
---

[「查缺补漏」高频考点浏览器面试题](https://juejin.cn/post/6854573215830933512)

- [操作dom的Api](#操作dom的api)
- [输入url到页面展示发生了什么](#输入url到页面展示发生了什么)
- [事件机制](#%E4%BA%8B%E4%BB%B6%E6%9C%BA%E5%88%B6)
  - [事件触发有三个阶段](#事件触发有三个阶段)
  - [注册事件](#%E6%B3%A8%E5%86%8C%E4%BA%8B%E4%BB%B6)
  - [passive为什么能优化页面的滚动性能](#passive为什么能优化页面的滚动性能)
  - [事件委托](#事件委托)
  - [e.target和e.currentTarget](#e-target和e-currenttarget)
- [跨域](#%E8%B7%A8%E5%9F%9F)
  - [JSONP](#jsonp)
  - [CORS](#cors)
  - [document.domain](#documentdomain)
  - [postMessage](#postmessage)
- [浏览器缓存](#浏览器缓存)
- [cookie到WebStorage、IndexedDB](#cookie到webstorage、indexeddb)
- [Storage Event](#storage-event)
- [浏览器页面渲染机制](#浏览器页面渲染机制)
  - [Load 和 DOMContentLoaded 区别](#load-%E5%92%8C-domcontentloaded-%E5%8C%BA%E5%88%AB)
  - [图层](#%E5%9B%BE%E5%B1%82)
  - [重绘（Repaint）和回流（Reflow）](#重绘-repaint-和回流-reflow)
  - [减少重绘和回流](#%E5%87%8F%E5%B0%91%E9%87%8D%E7%BB%98%E5%92%8C%E5%9B%9E%E6%B5%81)
- [Event loop](#event-loop)
  - [Node 中的 Event loop](#node-%E4%B8%AD%E7%9A%84-event-loop)
- [浏览器与Node的事件循环(Event Loop)的区别](#浏览器与node的事件循环-event-loop-的区别)
- [Service Worker](#service-worker)
- [setTimeout和requestAnimationFrame](#settimeout和requestanimationframe)
- [defer与async的区别](#defer与async的区别)
- [Preload&Prefetch](#preload-prefetch)
- [websocket](https://juejin.cn/post/6854573221241421838)
- [MutationObserver](#MutationObserver)
- [浏览器每一帧都需要完成哪些工作](#浏览器每一帧都需要完成哪些工作)
- [图片知识](#图片知识)
  
----

### 操作dom的Api

#### 节点查找API

- document.getElementById ：根据ID查找元素，大小写敏感，如果有多个结果，只返回第一个；

- document.getElementsByClassName ：根据类名查找元素，多个类名用空格分隔，返回一个 HTMLCollection 。注意兼容性为IE9+（含）。另外，不仅仅是document，其它元素也支持 getElementsByClassName 方法；

- document.getElementsByTagName ：根据标签查找元素，表示查询所有标签，返回一个 HTMLCollection 。

- document.getElementsByName ：根据元素的name属性查找，返回一个 NodeList 。

- document.querySelector ：返回单个Node，IE8+(含），如果匹配到多个结果，只返回第一个。

- document.querySelectorAll ：返回一个 NodeList ，IE8+(含）。

- document.forms ：获取当前页面所有form，返回一个 HTMLCollection ；

#### 节点创建API
- createElement创建元素：
```javascript
var elem = document.createElement("div");  
elem.id = 'test';  
elem.style = 'color: red';  
elem.innerHTML = '我是新创建的测试节点';  
document.body.appendChild(elem);  
```
通过 createElement 创建的元素并不属于 document 对象，它只是创建出来，并未添加到html文档中，要调用 appendChild 或 insertBefore 等方法将其添加到HTML文档中。
- createTextNode创建文本节点：
```javascript
var node = document.createTextNode("我是文本节点");  
document.body.appendChild(node);  
```
- cloneNode 克隆一个节点：
node.cloneNode(true/false) ，它接收一个bool参数，用来表示是否复制子元素。
```javascript
var from = document.getElementById("test");  
var clone = from.cloneNode(true);  
clone.id = "test2";  
document.body.appendChild(clone);  
```
克隆节点并不会克隆事件，除非事件是用属性上绑定的事件(比如`onclick="alert(1)"`)这种方式绑定的，用 `addEventListener` 和 `node.onclick=xxx;` 方式绑定的都不会复制。

- `document.createDocumentFragment` : 用来创建一个 DocumentFragment ，也就是文档碎片，它表示一种轻量级的文档，主要是用来存储临时节点，大量操作DOM时用它可以大大提升性能。
```javascript
const list = document.querySelector('#list');
const fruits = ['Apple', 'Orange', 'Banana', 'Melon'];

const fragment = document.createDocumentFragment();

fruits.forEach(fruit => {
  const li = document.createElement('li');
  li.innerHTML = fruit;
  fragment.appendChild(li);
});

list.appendChild(fragment);
```

- `document.createElementNS`: `document.createElementNS`与`document.createElement`类似，也用于创建标签节点，只是它需要一个额外的命名空间URI作为参数。此命名空间用于标识该节点属于哪种XML类型。命名空间为什么是必须的：一个xml文档可能包含多个软件模块的元素和属性，在不同软件模块中使用相同名称的元素或属性，可能会导致识别和冲突问题，而xml命名空间可以解决该问题。有效的命名空间URI:

  - HTML： http://www.w3.org/1999/xhtml
  - SVG：http://www.w3.org/2000/svg
  - XBL：http://www.mozilla.org/xbl
  - XUL：http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul
  
使用document.createElement创建svg就有问题，而createElementNS不会

```html
<body>
<svg
  xmlns="http://www.w3.org/2000/svg"
  version="1.1"
  width="100%"
  height="100%"
  id="svg"
>
  <defs>
    <marker
      id="markerArrow"
      markerWidth="10"
      markerHeight="10"
      refX="2"
      refY="6"
      orient="auto"
    >
      <path d="M2,2 L2,10 L10,6 L2,2" fill="rgba(207, 219, 230, 1)" />
    </marker>
  </defs>
</svg>
<script>
    const path = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    path.setAttribute("d", "M105,72 C105,100 105,100 173,100");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-width", "2px");
    path.setAttribute("stroke", "rgba(207, 219, 230, 1)");
    path.setAttribute("marker-end", "url(#markerArrow)");
    document.getElementById("svg").appendChild(path);
</script>
</body>
```
#### 节点修改API
- `appendChild`: `parent.appendChild(child);`
- `insertBefore`: `parentNode.insertBefore(newNode, refNode);` 在指定的已有子节点之前插入新的子节点。
- `removeChild`: removeChild用于删除指定的子节点并返回子节点,`var deletedChild = parent.removeChild(node);  `
- `replaceChild`: 用于将一个节点替换另一个节点, `parent.replaceChild(newChild, oldChild);`
- [`insertAdjacentHTML`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/insertAdjacentHTML)

#### 节点关系API
- 父关系API
  - parentNode ：每个节点都有一个parentNode属性，它表示元素的父节点。Element的父节点可能是Element，Document或DocumentFragment；
  - parentElement ：返回元素的父元素节点，与parentNode的区别在于，其父节点必须是一个Element元素，如果不是，则返回null；
- 子关系API
  - children ：返回一个实时的 HTMLCollection ，子节点都是Element，IE9以下浏览器不支持；
  - childNodes ：返回一个实时的 NodeList ，表示元素的子节点列表，注意子节点可能包含文本节点、注释节点等；
  - firstChild ：返回第一个子节点，不存在返回null，与之相对应的还有一个 firstElementChild ；
  - lastChild ：返回最后一个子节点，不存在返回null，与之相对应的还有一个 lastElementChild ；
- 兄弟关系型API  
  - previousSibling ：节点的前一个节点，如果不存在则返回null。注意有可能拿到的节点是文本节点或注释节点，与预期的不符，要进行处理一下。
  
  - nextSibling ：节点的后一个节点，如果不存在则返回null。注意有可能拿到的节点是文本节点，与预期的不符，要进行处理一下。
  
  - previousElementSibling ：返回前一个元素节点，前一个节点必须是Element，注意IE9以下浏览器不支持。
  
  - nextElementSibling ：返回后一个元素节点，后一个节点必须是Element，注意IE9以下浏览器不支持。

#### 元素属性型API  
- setAttribute 给元素设置属性：`element.setAttribute(name, value);`其中name是特性名，value是特性值。如果元素不包含该特性，则会创建该特性并赋值。
- getAttribute: getAttribute返回指定的特性名相应的特性值，如果不存在，则返回null：`var value = element.getAttribute("id");`
- hasAttribute: `var result = element.hasAttribute(name);`
- dataset
```javascript
// <div id="user" data-id="1234567890" data-user="johndoe" data-date-of-birth>John Doe</div>

let el = document.querySelector('#user');

// el.id == 'user'
// el.dataset.id === '1234567890'
// el.dataset.user === 'johndoe'
// el.dataset.dateOfBirth === ''

el.dataset.dateOfBirth = '1960-10-03'; // set the DOB.

// 'someDataAttr' in el.dataset === false
el.dataset.someDataAttr = 'mydata';
// 'someDataAttr' in el.dataset === true
```
#### 样式相关API
- 1. 直接修改元素的样式
```javascript
elem.style.color = 'red';  
elem.style.setProperty('font-size', '16px');  
elem.style.removeProperty('color');  
```
- 2. 动态添加样式规则
```javascript
var style = document.createElement('style');  
style.innerHTML = 'body{color:red} #top:hover{background-color: red;color: white;}';  
document.head.appendChild(style);  
```
- 3. classList获取样式class
```javascript
// div is an object reference to a <div> element with class="foo bar"
div.classList.remove("foo");
div.classList.add("anotherclass");

// if visible is set remove it, otherwise add it
div.classList.toggle("visible");

// add/remove visible, depending on test conditional, i less than 10
div.classList.toggle("visible", i < 10 );

alert(div.classList.contains("foo"));

// add or remove multiple classes
div.classList.add("foo", "bar", "baz");
div.classList.remove("foo", "bar", "baz");

// add or remove multiple classes using spread syntax
let cls = ["foo", "bar"];
div.classList.add(...cls); 
div.classList.remove(...cls);

// replace class "foo" with class "bar"
div.classList.replace("foo", "bar");
```
- 4. window.getComputedStyle：通过 element.sytle.xxx 只能获取到内联样式，借助 window.getComputedStyle 可以获取应用到元素上的所有样式。`var style = window.getComputedStyle(element[, pseudoElt]);`



### [输入URL到页面展示发生了什么](https://zhuanlan.zhihu.com/p/190320054)
>[git地址](https://github.com/venaissance/myBlog/issues/17)

### [事件机制](https://zh.javascript.info/introduction-browser-events)
#### 事件触发有三个阶段
1. 捕获阶段：事件从window对象自上而下向目标节点传播的阶段；

2. 目标阶段：真正的目标节点正在处理事件的阶段；

3. 冒泡阶段：事件从目标节点自下而上向window对象传播的阶段。

捕获是从上到下，事件先从window对象，然后再到document（对象），然后是html标签（通过document.documentElement获取html标签），然后是body标签（通过document.body获取body标签），然后按照普通的html结构一层一层往下传，最后到达目标元素。


````javascript
// 以下会先打印冒泡然后是捕获
el.addEventListener(
  'click',
  event => {
    console.log('冒泡')
  },
  false
)
el.addEventListener(
  'click',
  event => {
    console.log('捕获 ')
  },
  true
)
````
事件触发一般来说会按照上面的顺序进行，但是也有特例，如果给一个目标节点同时注册冒泡和捕获事件，事件触发会按照注册的顺序执行。

#### 注册事件
通常我们使用`addEventListener`注册事件，该函数的第三个参数可以是布尔值，也可以是对象。
对于布尔值 `useCapture` 参数来说，该参数默认值为`false`。`useCapture`决定了注册的事件是捕获事件还是冒泡事件。对于对象参数来说，可以使用以下几个属性

- `capture`，布尔值，和 `useCapture` 作用一样
- `once`，布尔值，值为`true`表示该回调只会调用一次，调用后会移除监听
- `passive`，布尔值，表示永远不会调用`preventDefault`，用于优化浏览器页面滚动的性能，让页面滚动更顺滑

一般来说，我们只希望事件只触发在目标上，这时候可以使用`stopPropagation` 来阻止事件的进一步传播。通常我们认为`stopPropagation` 是用来阻止事件冒泡的，
其实该函数也可以阻止捕获事件。`stopImmediatePropagation` 同样也能实现阻止事件，但是还能阻止该事件目标执行别的注册事件。

##### passive为什么能优化页面的滚动性能

chrome的线程化渲染框架的两个线程：

- 内核线程（Main/Render Thread）：负责DOM树构建、元素的布局、图层绘制记录部分（main-thread side）、JavaScript的执行
- 合成线程（Compositor Thread）：图层绘制实现部分（impl-side）、图层图像合成

![](./image/chrome_render.png)

上图可知，页面`Frame#1`在内核线程中完成js执行、布局和绘制后，经过一个周期合成线程去执行`Frame#1`页面图像的合成。

用户输入事件分类：

- 在内核线程处理的事件
- 直接由合成线程处理的事件

区别

在内核线程处理的事件：需要经过内核线程处理的输入事件要在内核线程执行逻辑，**遇到内核线程在忙，无法立即响应**。如用户的大部分输入事件都跟页面元素有关系，一旦页面元素注册了对应事件的监听器，监听器的逻辑代码（JavaScript）必须在内核线程中执行（V8引擎运行在内核线程），因此这种输入事件经常无法立即得到响应。

直接由合成线程处理的事件：不经过内核线程就能快速处理的输入事件为手势输入事件（滑动、捏合）。

虽然手势事件可以不在内核线程处理，但是手势事件的产生还是离不开内核线程。

passive 的意思是“顺从的”，表示它不会对事件的默认行为说 no，浏览器知道了一个监听器是 passive 的，它就可以在两个线程里同时执行监听器中的 JavaScript 代码和浏览器的默认行为了。

#### [事件委托](https://zh.javascript.info/event-delegation)

由于事件会在冒泡阶段向上传播到父节点，因此可以把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件。这种方法叫做事件的代理（delegation）。

如果一个节点中的子节点是动态生成的，那么子节点需要注册事件的话应该注册在父节点上
```html
<ul id="ul">
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  <li>5</li>
</ul>
<script>
  let ul = document.querySelector('#ul')
  ul.addEventListener('click', event => {
    console.log(event.target)
  })
</script>
```
事件代理的方式相对于直接给目标注册事件来说，有以下优点
- 节省内存
- 不需要给子节点注销事件

#### e.target和e.currentTarget

`Event` 接口的只读属性 [`currentTarget`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/currentTarget)表示的，**标识是当事件沿着 `DOM` 触发时事件的当前目标。它总是指向事件绑定的元素，而 `Event.target` 则是事件触发的元素。**

如下例子，`e.target`指向的是事件触发的元素，点击的第一个li,所以`e.target`指向的是第一个li,而`e.currentTarget`指向事件绑定的元素，事件绑定的是ul，所以指向的Ul
```html
<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <title>Event Delegation</title>
</head>
<body>
<ul>
   <li id="li1">hello 1</li>
   <li>hello 2</li>
   <li>hello 3</li>
   <li>hello 4</li>
</ul>
<script>
	let ul = document.querySelectorAll('ul')[0]
	let aLi = document.querySelectorAll('li')
	ul.addEventListener('click', function (e) {
		console.log(e)
		let oLi1 = e.target
		let oLi2 = e.currentTarget
		console.log(oLi1)   //  被点击的li
		console.log(oLi2)   // ul
		console.log(oLi1 === oLi2)  // false
        console.log(e.currentTarget === this)
        console.log(e.target.id)
	})
</script>
</body>
</html>
```
`currentTarget`始终是监听事件者，即 直接调用`addEventListener`那个节点

而`target`是事件的真正发出者， 即 触发事件的节点，在`click`事件中就是被点击的节点。可用于事件冒泡

`this === e.currentTarget` 总是为true

`this === e.target` 有可能不是true


#### oninput和onchange区别

- oninput事件在元素值发送变化是立即触发
- onchange在元素失去焦点时触发（当失去焦点时，修改属性值，则无法触发此事件）

react 把两者视为一样的了

### [跨域](https://juejin.im/post/6844904126246027278)
因为浏览器出于安全考虑，有同源策略。也就是说，如果协议、域名或者端口有一个不同就是跨域，Ajax 请求会失败。

常用方法解决方法
#### JSONP
JSONP 的原理很简单，就是利用`<script>`标签没有跨域限制的漏洞。通过`<script>`标签指向一个需要访问的地址并提供一个回调函数来接收数据当需要通讯时。
```html
<script src="http://domain/api?param1=a&param2=b&callback=jsonp"></script>
<script>
    function jsonp(data) {
    	console.log(data)
	}
</script>
```
JSONP 使用简单且兼容性不错，但是只限于 `get` 请求。

在开发中可能会遇到多个 JSONP 请求的回调函数名是相同的，这时候就需要自己封装一个 JSONP，以下是简单实现
```javascript
function jsonp(url, jsonpCallback, success) {
  let script = document.createElement('script')
  script.src = url
  script.async = true
  script.type = 'text/javascript'
  window[jsonpCallback] = function(data) {
    success && success(data)
  }
  document.body.appendChild(script)
}
jsonp('http://xxx', 'callback', function(value) {
  console.log(value)
})
```
#### CORS
> CORS（Cross-Origin Resource Sharing）跨域资源共享，定义了必须在访问跨域资源时，浏览器与服务器应该如何沟通。CORS背后的基本思想就是使用自定义的HTTP头部让浏览器与服务器进行沟通，从而决定请求或响应是应该成功还是失败。目前，所有浏览器都支持该功能，IE浏览器不能低于IE10。整个CORS通信过程，都是浏览器自动完成，不需要用户参与。对于开发者来说，CORS通信与同源的AJAX通信没有差别，代码完全一样。浏览器一旦发现AJAX请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。


CORS 需要浏览器和后端同时支持。IE 8 和 9 需要通过 `XDomainRequest` 来实现。

浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端。只要后端实现了 CORS，就实现了跨域。

服务端设置 Access-Control-Allow-Origin 就可以开启 CORS。 该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源。

#### WebSocket协议跨域

> Websocket是HTML5的一个持久化的协议，它实现了浏览器与服务器的全双工通信，同时也是跨域的一种解决方案。WebSocket和HTTP都是应用层协议，都基于 TCP 协议。但是 「WebSocket 是一种双向通信协议，在建立连接之后，WebSocket 的 server 与 client 都能主动向对方发送或接收数据」。同时，WebSocket 在建立连接时需要借助 HTTP 协议，连接建立好了之后 client 与 server 之间的双向通信就与 HTTP 无关了。
  

#### document.domain
该方式只能用于二级域名相同的情况下，比如 `a.test.com `和 `b.test.com` 适用于该方式。

只需要给页面添加 document.domain = 'test.com' 表示二级域名都相同就可以实现跨域
#### postMessage
这种方式通常用于获取嵌入页面中的第三方页面数据。一个页面发送消息，另一个页面判断来源并接收消息
```javascript
// 发送消息端
window.parent.postMessage('message', 'http://test.com')
// 接收消息端
var mc = new MessageChannel()
mc.addEventListener('message', event => {
  var origin = event.origin || event.originalEvent.origin
  if (origin === 'http://test.com') {
    console.log('验证通过')
  }
})
```


### 浏览器缓存
> [介绍](https://sanyuan0704.top/my_blog/blogs/perform/001.html)

### [web储存方案](https://juejin.im/post/6844904192549584903)

### cookie到WebStorage、IndexedDB
> [介绍](https://juejin.im/post/6844903812092674061)

cookie，localStorage，sessionStorage，indexDB

|     特性     |                   cookie                   |       localStorage       | sessionStorage |         indexDB          |
| :----------: | :----------------------------------------: | :----------------------: | :------------: | :----------------------: |
| 数据生命周期 |     一般由服务器生成，可以设置过期时间     | 除非被清理，否则一直存在 | 页面关闭就清理 | 除非被清理，否则一直存在 |
| 数据存储大小 |                     4K                     |            5M            |       5M       |           无限           |
| 与服务端通信 | 每次都会携带在 header 中，对于请求性能影响 |          不参与          |     不参与     |          不参与          |

从上表可以看到，`cookie` 已经不建议用于存储。如果没有大量数据存储需求的话，可以使用 `localStorage` 和 `sessionStorage` 。对于不怎么改变的数据尽量使用 `localStorage` 存储，否则可以用 `sessionStorage` 存储。

对于 `cookie`，我们还需要注意安全性。

|   属性    |                             作用                             |
| :-------: | :----------------------------------------------------------: |
|   value   | 如果用于保存用户登录态，应该将该值加密，不能使用明文的用户标识 |
| http-only |            不能通过 JS 访问 Cookie，减少 XSS 攻击            |
|  secure   |               只能在协议为 HTTPS 的请求中携带                |
| same-site |    规定浏览器不能在跨域请求中携带 Cookie，减少 CSRF 攻击     |

#### [sessionStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage)

它与 localStorage 相似，不同之处在于 localStorage 里面存储的数据没有过期时间设置，而存储在 sessionStorage 里面的数据在页面会话结束时会被清除（关闭当前页面的时候会清除）。


- 页面会话在浏览器打开期间一直保持，并且重新加载或恢复页面仍会保持原来的页面会话。
- 在新标签或窗口打开一个页面时会复制顶级浏览会话的上下文作为新会话的上下文，这点和 session cookies 的运行方式不同。(意思是点击当前页面的 `<a target="_blank" href=“/subapp/device”></a>` 标签时，在新页面中的 sessionStorage 的值是复制的当前页面的，注意并不是共用的。)
- 打开多个相同的URL的Tabs页面，会创建各自的sessionStorage。
- 关闭对应浏览器窗口（Window）/ tab，会清除对应的sessionStorage。 

sessionStorage 应用

- 存储用户输入的内容，当页面刷新的时候可以立刻显示出刷新前的内容；

- 对使用 browser history 部署的单页应用，可以在前端使用 `sessionStorage` 实现路由匹配（不会报 404），不需要使用 nginx 做一次转发；
实现自动匹配路由的过程是这样的：当访问 `a.com/page1` 页面的时候，由于服务器并没有这个页面，服务器会返回 `404.html`（浏览器当前的路由仍然是 `a.com/page1`），浏览器执行 404.html 时会先设置 `sessionStorage.redirect` 为当前的 url，然后 `<meta>` 会立刻让页面跳转到` /`，服务器此时会返回 `index.html`，浏览器执行 `<script>` 中的代码获取到 `sessionStorage.redirect`，然后执行 `history.replaceState` 替换当前的 url，这样就达到了想要的跳转效果（`history.replaceState` 只会更改浏览器地址栏，不会让浏览器主动去服务器获取对应的页面）。

```html
<head>
    <script>
      sessionStorage.redirect = location.href;
    </script>
    <meta http-equiv="refresh" content="0;URL='/'"></meta>
</head>
```

在单页应用的模板 index.html 中，填下面的代码：
```html
<body>
  <div id="root"></div>
  <script>
    // 这段代码要放在其他js的前面
    ;(function() {
      var redirect = sessionStorage.redirect
      delete sessionStorage.redirect
      if (redirect && redirect != location.href) {
        history.replaceState(null, null, redirect)
      }
    })()
  </script>
</body>
```
### [Storage Event](https://developer.mozilla.org/zh-CN/docs/Web/API/StorageEvent)
其实就是当浏览器打开多个同域的tab页面时，设置了storage的监听事件，并且值和之前的不一样，其他tab会触发回调，`localStorage`可以，但`sessionStorage`不可以。
```javascript
localStorage.setItem('name', 'tom')
window.addEventListener('storage', e => {
  console.log('e', e)
})
```
Storage 事件可以用来在同域下的页面之间实现广播机制，该事件是在 window 上触发的。该事件不在导致数据变化的当前页面(tab)触发（如果浏览器同时打开一个域名下面的多个页面，当其中的一个页面改变 localStorage 的数据时，其他所有页面的 storage 事件会被触发，而原始页面并不触发 storage 事件）；

event 包含的关键信息：

- event.key 发生变更的 key；

- event.oldValue 变更之前的值；

- event.newValue 变更之后的值；

触发的条件有两个：

- 不在当前的 tab 触发，相同的 url 在两个不同的 tab 也是会触发的；

- localstorage.setItem(key, value) 只有当后一次设置的 value 不同的时候才会触发该事件，相同的话也没有必要触发了；

### 浏览器页面渲染机制
- [【Web动画】CSS3 3D 行星运转 && 浏览器渲染原理](https://www.cnblogs.com/coco1s/p/5439619.html)
> [介绍](https://juejin.im/post/6844903815758479374)

#### [浏览器的渲染原理](https://mp.weixin.qq.com/s?__biz=MzIxMjE5MTE1Nw==&mid=2653218120&idx=1&sn=bb06f680de8cbbadcd8df92ff68d14fc&chksm=8c999792bbee1e8454c7a858353f5de69ed0261ee23183eaab1a161a5c5e748b8cb5e4b4a417&mpshare=1&scene=23&srcid=1229XZoiB6bnwfUCq9pyC20r&sharer_sharetime=1609233596674&sharer_shareid=1958dfa2b35b63c7a7463d11712f39df#rd)

![](./image/Browser_principle.png)

浏览器的渲染机制一般分为以下几个步骤

1. 处理 HTML 并构建 DOM 树。
2. 处理 CSS 构建 CSSOM 树。
3. 将 DOM 与 CSSOM 合并成一个渲染树。
4. 根据渲染树来布局，计算每个节点的位置。
5. 调用 GPU 绘制，合成图层，显示在屏幕上。

![An image](../image/dom/1.png)

在构建 CSSOM 树时，会阻塞渲染，直至 CSSOM 树构建完成。并且构建 CSSOM 树是一个十分消耗性能的过程，所以应该尽量保证层级扁平，减少过度层叠，越是具体的 CSS 选择器，执行速度越慢。

当 HTML 解析到 script 标签时，会暂停构建 DOM，完成后才会从暂停的地方重新开始。也就是说，如果你想首屏渲染的越快，就越不应该在首屏就加载 JS 文件。并且 CSS 也会影响 JS 的执行，只有当解析完样式表才会执行 JS，所以也可以认为这种情况下，CSS 也会暂停构建 DOM。

![An image](../image/dom/2.png)
![An image](../image/dom/3.png)

#### Load 和 DOMContentLoaded 区别

Load 事件触发代表页面中的 DOM，CSS，JS，图片已经全部加载完毕。

DOMContentLoaded 事件触发代表初始的 HTML 被完全加载和解析，不需要等待 CSS，JS，图片加载。

#### 图层

一般来说，可以把普通文档流看成一个图层。特定的属性可以生成一个新的图层。**不同的图层渲染互不影响**，所以对于某些频繁需要渲染的建议单独生成一个新图层，提高性能。**但也不能生成过多的图层，会引起反作用。**

通过以下几个常用属性可以生成新图层

- 3D 变换：`translate3d`、`translateZ`
- [`will-change`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/will-change)
- `video`、`iframe` 标签
- 通过动画实现的 `opacity` 动画转换
- `position: fixed`

#### 重绘（Repaint）和回流（Reflow）

重绘和回流是渲染步骤中的一小节，但是这两个步骤对于性能影响很大。

- 回流（reflow）

当渲染树（render Tree）中的一部分(或全部)因为元素的规模尺寸，布局，隐藏等改变而需要重新构建。这就称为回流（reflow），也就是重新布局（relayout）。

每个页面至少需要一次回流，就是在页面第一次加载的时候。在回流的时候，浏览器会使渲染树中受到影响的部分失效，并重新构造这部分渲染树，完成回流后，浏览器会重新绘制受影响的部分到屏幕中，该过程成为重绘。

- 重绘（repaint）

当render tree中的一些元素需要更新属性，而这些属性只是影响元素的外观，风格，而不会影响布局的，比如 background-color 。则就叫称为重绘。

- 回流是布局或者几何属性需要改变就称为回流。
- 重绘是当节点需要更改外观而不会影响布局的，比如改变 `color` 就叫称为重绘


回流必定会发生重绘，重绘不一定会引发回流。回流所需的成本比重绘高的多，改变深层次的节点很可能导致父节点的一系列回流。

回流何时触发：
- 调整窗口大小（Resizing the window）
- 改变字体（Changing the font）
- 增加或者移除样式表（Adding or removing a stylesheet）
- 内容变化，比如用户在input框中输入文字（Content changes, such as a user typing text inan input box）
- 激活 CSS 伪类，比如 :hover (IE 中为兄弟结点伪类的激活)（Activation of CSS pseudo classes such as :hover (in IE the activation of the pseudo class of a sibling)）
- 操作 class 属性（Manipulating the class attribute）
- 脚本操作 DOM（A script manipulating the DOM）
- 计算 offsetWidth 和 offsetHeight 属性（Calculating offsetWidth and offsetHeight）
- 设置 style 属性的值 （Setting a property of the style attribute）

所以对于页面而言，我们的宗旨就是尽量减少页面的回流重绘，简单的一个栗子：

````javascript
// 下面这种方式将会导致回流reflow两次
var newWidth = aDiv.offsetWidth + 10; // Read
aDiv.style.width = newWidth + 'px'; // Write
var newHeight = aDiv.offsetHeight + 10; // Read
aDiv.style.height = newHeight + 'px'; // Write
 
// 下面这种方式更好，只会回流reflow一次
var newWidth = aDiv.offsetWidth + 10; // Read
var newHeight = aDiv.offsetHeight + 10; // Read
aDiv.style.width = newWidth + 'px'; // Write
aDiv.style.height = newHeight + 'px'; // Write
````
上面四句，因为涉及了 offsetHeight 操作，浏览器强制 reflow 了两次，而下面四句合并了 offset 操作，所以减少了一次页面的回流。 

减少回流、重绘其实就是需要减少对渲染树的操作（合并多次多DOM和样式的修改），并减少对一些style信息的请求，尽量利用好浏览器的优化策略。

**flush队列**

其实浏览器自身是有优化策略的，如果每句 Javascript 都去操作 DOM 使之进行回流重绘的话，浏览器可能就会受不了。所以很多浏览器都会优化这些操作，浏览器会维护 1 个队列，把所有会引起回流、重绘的操作放入这个队列，等队列中的操作到了一定的数量或者到了一定的时间间隔，浏览器就会 flush 队列，进行一个批处理。这样就会让多次的回流、重绘变成一次回流重绘。

但是也有例外，因为有的时候我们需要精确获取某些样式信息，下面这些：

- offsetTop, offsetLeft, offsetWidth, offsetHeight
- scrollTop/Left/Width/Height
- clientTop/Left/Width/Height
- width,height
- 请求了getComputedStyle(), 或者 IE的 currentStyle
这个时候，浏览器为了反馈最精确的信息，需要立即回流重绘一次，确保给到我们的信息是准确的，所以可能导致 flush 队列提前执行了。

很多人不知道的是，重绘和回流其实和 Event loop 有关。

1. 当 Event loop 执行完 Microtasks 后，会判断 document 是否需要更新。因为浏览器是 60Hz 的刷新率，每 16ms 才会更新一次。
2. 然后判断是否有 `resize` 或者 `scroll` ，有的话会去触发事件，所以 `resize` 和 `scroll` 事件也是至少 16ms 才会触发一次，并且自带节流功能。
3. 判断是否触发了 media query
4. 更新动画并且发送事件
5. 判断是否有全屏操作事件
6. 执行 `requestAnimationFrame` 回调
7. 执行 `IntersectionObserver` 回调，该方法用于判断元素是否可见，可以用于懒加载上，但是兼容性不好
8. 更新界面
9. 以上就是一帧中可能会做的事情。如果在一帧中有空闲时间，就会去执行 `requestIdleCallback` 回调。

以上内容来自于 [HTML 文档](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)

#### 减少重绘和回流

- 使用 `translate` 替代 `top`

  ```html
  <div class="test"></div>
  <style>
  	.test {
  		position: absolute;
  		top: 10px;
  		width: 100px;
  		height: 100px;
  		background: red;
  	}
  </style>
  <script>
  	setTimeout(() => {
          // 引起回流
  		document.querySelector('.test').style.top = '100px'
  	}, 1000)
  </script>
  ```

- 使用 `visibility` 替换 `display: none` ，因为前者只会引起重绘，后者会引发回流（改变了布局）

- 把 DOM 离线后修改，比如：先把 DOM 给 `display:none` (有一次 Reflow)，然后你修改100次，然后再把它显示出来

- 不要把 DOM 结点的属性值放在一个循环里当成循环里的变量

  ```js
  for(let i = 0; i < 1000; i++) {
      // 获取 offsetTop 会导致回流，因为需要去获取正确的值
      console.log(document.querySelector('.test').style.offsetTop)
  }
  ```

- 不要使用 table 布局，可能很小的一个小改动会造成整个 table 的重新布局

- 动画实现的速度的选择，动画速度越快，回流次数越多，也可以选择使用 `requestAnimationFrame`

- CSS 选择符从右往左匹配查找，避免 DOM 深度过深

- 将频繁运行的动画变为图层，图层能够阻止该节点回流影响别的元素。比如对于 `video` 标签，浏览器会自动将该节点变为图层。

![An image](../image/dom/4.png)

#### 动画的性能检测及优化

chrome 勾选下面 `show FPS meter` 显示页面的 FPS 信息，以及 GPU 的使用率

1. 使用 will-change 提高页面滚动、动画等渲染性能
```css
will-change: auto
will-change: scroll-position
will-change: contents
will-change: transform        // Example of <custom-ident>
will-change: opacity          // Example of <custom-ident>
will-change: left, top        // Example of two <animateable-feature>
 
will-change: unset
will-change: initial
will-change: inherit
 
// 示例
.example{
    will-change: transform;
}
```
2. 使用 transform3d api 代替 transform api，强制开始 GPU 加速。

3D transform 会启用GPU加速，例如 translate3D, scaleZ 之类，当然我们的页面可能并没有 3D 变换，但是不代表我们不能启用 GPU 加速，在非 3D 变换的页面也使用 3D transform 来操作，算是一种 hack 加速法。我们实际上不需要z轴的变化，但是还是假模假样地声明了，去欺骗浏览器。

### Event loop
众所周知 JS 是门非阻塞单线程语言，因为在最初 JS 就是为了和浏览器交互而诞生的。如果 JS 是门多线程的语言话，我们在多个线程中处理 DOM 就可能会发生问题（一个线程中新加节点，另一个线程中删除节点），当然可以引入读写锁解决这个问题。

JS 在执行的过程中会产生执行环境，这些执行环境会被顺序的加入到执行栈中。如果遇到异步的代码，会被挂起并加入到 Task（有多种 task） 队列中。一旦执行栈为空，Event Loop 就会从 Task 队列中拿出需要执行的代码并放入执行栈中执行，所以本质上来说 JS 中的异步还是同步行为。
```javascript
console.log('script start')

setTimeout(function() {
  console.log('setTimeout')
}, 0)

console.log('script end')
```
以上代码虽然 `setTimeout` 延时为 0，其实还是异步。这是因为 `HTML5` 标准规定这个函数第二个参数不得小于 4 毫秒，不足会自动增加。所以 `setTimeout` 还是会在 `script end `之后打印。

不同的任务源会被分配到不同的 Task 队列中，任务源可以分为 微任务（microtask） 和 宏任务（macrotask）。在 ES6 规范中，microtask 称为 `jobs`，macrotask 称为 `task`。

```javascript
console.log('script start')

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')
// script start => Promise => script end => promise1 => promise2 => setTimeout
```
以上代码虽然 `setTimeout` 写在 `Promise` 之前，但是因为 `Promise `属于微任务而 `setTimeout` 属于宏任务，所以会有以上的打印。

微任务包括 `process.nextTick` ，`promise` ，`Object.observe` ，`MutationObserver`

宏任务包括 `script` ， `setTimeout` ，`setInterval` ，`setImmediate` ，`I/O` ，`UI rendering`

很多人有个误区，认为微任务快于宏任务，其实是错误的。因为宏任务中包括了 `script`，浏览器会先执行一个宏任务，接下来有异步代码的话就先执行微任务。

所以正确的一次 Event loop 顺序是这样的

- 执行同步代码，这属于宏任务
- 执行栈为空，查询是否有微任务需要执行
- 执行所有微任务
- 必要的话渲染 UI
- 然后开始下一轮 Event loop，执行宏任务中的异步代码
通过上述的 Event loop 顺序可知，如果宏任务中的异步代码有大量的计算并且需要操作 DOM 的话，为了更快的 界面响应，我们可以把操作 DOM 放入微任务中

### Node 中的 Event loop
```
┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<──connections───     │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```

- timer

timers 阶段会执行 `setTimeout` 和 `setInterval`

一个 `timer` 指定的时间并不是准确时间，而是在达到这个时间后尽快执行回调，可能会因为系统正在执行别的事务而延迟。

下限的时间有一个范围：`[1, 2147483647]` ，如果设定的时间不在这个范围，将被设置为 1。

- I/O

I/O 阶段会执行除了 close 事件，定时器和 setImmediate 的回调

- idle, prepare
idle, prepare 阶段内部实现

- poll

poll 阶段很重要，这一阶段中，系统会做两件事情

   1、执行到点的定时器
   
   2、执行 poll 队列中的事件
   
并且当 poll 中没有定时器的情况下，会发现以下两件事情

1、如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者系统限制

2、如果 poll 队列为空，会有两件事发生

   如果有 `setImmediate` 需要执行，poll 阶段会停止并且进入到 check 阶段执行 setImmediate
   
   如果没有 `setImmediate` 需要执行，会等待回调被加入到队列中并立即执行回调

如果有别的定时器需要被执行，会回到 timer 阶段执行回调。

- check

check 阶段执行 `setImmediate`

- close callbacks

close callbacks 阶段执行 close 事件

并且在 Node 中，有些情况下的定时器执行顺序是随机的
```javascript
setTimeout(() => {
  console.log('setTimeout')
}, 0)
setImmediate(() => {
  console.log('setImmediate')
})
// 这里可能会输出 setTimeout，setImmediate
// 可能也会相反的输出，这取决于性能
// 因为可能进入 event loop 用了不到 1 毫秒，这时候会执行 setImmediate
// 否则会执行 setTimeout
```
当然在这种情况下，执行顺序是相同的
```javascript
var fs = require('fs')

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout')
  }, 0)
  setImmediate(() => {
    console.log('immediate')
  })
})
// 因为 readFile 的回调在 poll 中执行
// 发现有 setImmediate ，所以会立即跳到 check 阶段执行回调
// 再去 timer 阶段执行 setTimeout
// 所以以上输出一定是 setImmediate，setTimeout
```
上面介绍的都是 macrotask 的执行情况，microtask 会在以上每个阶段完成后立即执行。
````javascript
setTimeout(() => {
  console.log('timer1')

  Promise.resolve().then(function() {
    console.log('promise1')
  })
}, 0)

setTimeout(() => {
  console.log('timer2')

  Promise.resolve().then(function() {
    console.log('promise2')
  })
}, 0)

// 以上代码在浏览器和 node 中打印情况是不同的
// 浏览器中一定打印 timer1, promise1, timer2, promise2
// node 中可能打印 timer1, timer2, promise1, promise2
// 也可能打印 timer1, promise1, timer2, promise2
````
Node 中的 process.nextTick 会先于其他 microtask 执行。
```javascript
setTimeout(() => {
  console.log('timer1')

  Promise.resolve().then(function() {
    console.log('promise1')
  })
}, 0)

process.nextTick(() => {
  console.log('nextTick')
})
// nextTick, timer1, promise1
```
### 浏览器与Node的事件循环(Event Loop)的区别
> [介绍](https://juejin.im/post/6844903761949753352)


### Service Worker

> Service workers 本质上充当Web应用程序与浏览器之间的代理服务器，也可以在网络可用时作为浏览器和网络间的代理。它们旨在（除其他之外）使得能够创建有效的离线体验，拦截网络请求并基于网络是否可用以及更新的资源是否驻留在服务器上来采取适当的动作。他们还允许访问推送通知和后台同步API。

目前该技术通常用来做缓存文件，提高首屏速度，可以试着来实现这个功能。

```js
// index.js
if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register("sw.js")
    .then(function(registration) {
      console.log("service worker 注册成功");
    })
    .catch(function(err) {
      console.log("servcie worker 注册失败");
    });
}
// sw.js
// 监听 `install` 事件，回调中缓存所需文件
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("my-cache").then(function(cache) {
      return cache.addAll(["./index.html", "./index.js"]);
    })
  );
});

// 拦截所有请求事件
// 如果缓存中已经有请求的数据就直接用缓存，否则去请求数据
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        return response;
      }
      console.log("fetch source");
    })
  );
});
```

打开页面，可以在开发者工具中的 `Application` 看到 Service Worker 已经启动了
![An image](../image/dom/5.png)
在 Cache 中也可以发现我们所需的文件已被缓存

![An image](../image/dom/6.png)
当我们重新刷新页面可以发现我们缓存的数据是从 Service Worker 中读取的

![An image](../image/dom/7.png)


### setTimeout和requestAnimationFrame
> [介绍](https://juejin.im/post/6844904083204079630)

屏幕刷新率是屏幕在每秒钟能刷新的次数，单位是赫兹（Hz），取决于显示器。

动画帧率（FPS-Frame Per Second）：FPS 表示的是每秒钟画面更新次数，理论上说，FPS 越高，动画会越流畅，目前大多数设备的屏幕刷新率为 60 次/秒，所以通常来讲 FPS 为 60 frame/s 时动画效果最好，也就是每帧的消耗时间为 16.67ms。

[为什么要用 setTimeout 模拟 setInterval ？](https://segmentfault.com/a/1190000038829248)

### defer与async的区别
defer与async的区别是：defer要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行；async一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。一句话，defer是“渲染完再执行”，async是“下载完就执行”。另外，如果有多个defer脚本，会按照它们在页面出现的顺序加载，而多个async脚本是不能保证加载顺序的。

![An image](./image/defer_async.png)

### [Preload&Prefetch](https://blog.csdn.net/vivo_tech/article/details/109485871)

#### `prefetch`(预提取)
prefetch(链接预取）是一种浏览器机制，其利用浏览器空闲时间来下载或预取用户在不久的将来可能访问的文档。网页向浏览器提供一组预取提示，并在浏览器完成当前页面的加载后开始静默地拉取指定的文档并将其存储在缓存中。当用户访问其中一个预取文档时，便可以快速的从浏览器缓存中得到。

prefetch作用是告诉浏览器加载下一页面可能会用到的资源,加速下一个页面的加载速度;

#### `Preload`(预加载)
1. preload 提供了一种声明式的命令，让浏览器提前加载指定资源(加载后并不执行)，需要执行时再执行，不阻塞渲染和document的onload事件
2. as 属性不能忽略，如果忽略 as 属性，或者错误的 as 属性会使 preload 等同于 XHR 请求，浏览器不知道加载的是什么，因此会赋予此类资源非常低的加载优先级
3. 对于字体文件，要带`crossorigin `属性，

#### 区分
1. preload 是告诉浏览器页面必定需要的资源，浏览器一定会加载这些资源

2. prefetch 是告诉浏览器页面可能需要的资源，浏览器不一定会加载这些资源

3. 在VUE SSR生成的页面中，首页的资源均使用preload，而路由对应的资源，则使用prefetch

### [MutationObserver](https://segmentfault.com/a/1190000012787829)

兼容最低要求IE11，用于观察Node(节点)变化的。

`MutationObserver`是一个构造器，接受一个`callback`参数，用来处理节点变化的回调函数，返回两个参数，`mutations`：节点变化记录列表（`sequence<MutationRecord>`），`observer`：构造`MutationObserver`对象。

```javascript
const observer = new MutationObserver(function(mutations, observer) {
  
})
```
MutationObserver对象有三个方法，分别如下：

- observer：设置观察目标，接受两个参数，target：观察目标，options：通过对象成员来设置观察选项
- disconnect：阻止观察者观察任何改变
- taskRecords：清空记录队列并返回里面的内容

### base64编码解码
```javascript
window.btoa('china is so nb') // 编码
"Y2hpbmEgaXMgc28gbmI="
window.atob("Y2hpbmEgaXMgc28gbmI=") // 解码
"china is so nb"
```

#### [property 和 attribute](https://www.cnblogs.com/lmjZone/p/8760232.html)
- property是DOM中的属性，是JavaScript里的对象；
- attribute是HTML标签上的特性，它的值只能够是字符串；
attributes是属于property的一个子集，它保存了HTML标签上定义属性。

### 浏览器每一帧都需要完成哪些工作
页面是一帧一帧绘制出来的，当每秒绘制的帧数（FPS）达到 60 时，页面是流畅的，小于这个值时，用户会感觉到卡顿。

1s 60 帧，所以每一帧分到的时间是 `1000/60 ≈ 16 ms`。所以书写代码时力求不让一帧的工作量超过 16ms。
![](./image/lifeOfaFrame.png)

通过上图可看到，一帧内需要完成如下六个步骤的任务：
- 处理用户的交互
- JS 解析执行
- 帧开始。窗口尺寸变更，页面滚去等的处理
- rAF(requestAnimationFrame)
- 布局
- 绘制
- 如果这六个步骤中，任意一个步骤所占用的时间过长，总时间超过 16ms 了之后，用户也许就能看到卡顿。

#### [图片知识](https://mp.weixin.qq.com/s?__biz=MzI1ODk2Mjk0Nw==&mid=2247484351&idx=1&sn=e88a658e93cd5e3fa4abd035714d2fa4&chksm=ea0160d3dd76e9c56df658fab1466d41751b90e05bd6a27b972ebf5f5d7204d11c6cd4d8a089&scene=21#wechat_redirect)
