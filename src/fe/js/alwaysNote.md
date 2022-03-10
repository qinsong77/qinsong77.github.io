---
title: 常用笔记
---

### 事件防抖和节流
>节流防抖就好比乘电梯，比如delay是10秒，那么防抖就是电梯每进来一个人就要等10秒再运行，而节流就是电梯保证每10秒可以运行一次

区别：防抖动是将多次执行变为最后一次执行，节流是将多次执行变成每隔一段时间执行。

#### 函数防抖(debounce)(立即防抖和非立即防抖)
在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。
核心思想：每次事件触发都会删除原有定时器，建立新的定时器。通俗意思就是反复触发函数，只认最后一次，从最后一次开始计时。

[文章](https://github.com/mqyqingfeng/Blog/issues/22)
```javascript
function debounce(fn, delay) {
    let timer = null
    return function (...args) {
        let context = this
        if(timer) clearTimeout(timer)
        timer = setTimeout(function() {
            fn.apply(context, args)
        },delay)
    }
}
```
##### 适合应用场景：
- search搜索，用户不断输入值时，用防抖来节约Ajax请求,也就是输入框事件。
- window触发resize时，不断的调整浏览器窗口大小会不断的触发这个事件，用防抖来让其只触发一次

#### 函数节流(throttle)(时间戳和定时版)
节流的意思是让函数有节制地执行，而不是毫无节制的触发一次就执行一次。在一段时间内，只执行一次。
规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。

[文章](https://github.com/mqyqingfeng/Blog/issues/26)
```javascript
// 时间戳版本-- 立即执行，第一次肯定立即执行，最后一次不一定执行
function throttle(fn, wait){
	let previous = 0
	return function(...args){
		const now = + new Date()
		const context = this
		if ( now - previous > wait) {
			fn.apply(context, args)
			previous = now
		}
	}
}
// 定时器 第一次延迟执行，
function throttle(fn, wait){
	let timer = null
	return function(...args){
		const context = this
		if(!timer) {
			timer = setTimeout(() => {
				timer = null
				fn.apply(context, args)
			}, wait)
		}
	}
}

function throttle(fn, wait) {
	let timer = null
	let startTime = 0
	return function () {
		const arg = arguments
		const remaining = wait - (Date.now() - startTime)
		if(timer) clearTimeout(timer)
		if(remaining <= 0) {
			startTime = Date.now()
			fn.apply(this, arg)
		} else {
			timer = setTimeout(() => {
				fn.apply(this, arg)
				timer = null
			}, remaining)
		}
	}
}
window.addEventListener('resize', throttle(() => console.log(new  Date().getTime()), 2000))
```
##### 适合应用场景：

- 鼠标的点击事件，比如mousedown只触发一次
- 监听滚动事件，比如是否滑到底部自动加载更多，用throttle判断
- 比如游戏中发射子弹的频率(1秒发射一颗)


### 使用场景

比如绑定响应鼠标移动、窗口大小调整、滚屏等事件时，绑定的函数触发的频率会很频繁。若稍处理函数微复杂，需要较多的运算执行时间和资源，往往会出现延迟，甚至导致假死或者卡顿感。为了优化性能，这时就很有必要使用 debounce 或 throttle了。

### debounce 与 throttle 区别

防抖 （debounce） ：多次触发，只在最后一次触发时，执行目标函数。

节流（throttle）：限制目标函数调用的频率，比如：1s内不能调用2次。

### debounce
```js
// 这个是用来获取当前时间戳的
function now() {
  return +new Date()
}
/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */
function debounce (func, wait = 50, immediate = true) {
  let timer, context, args

  // 延迟执行函数
  const later = () => setTimeout(() => {
    // 延迟函数执行完毕，清空缓存的定时器序号
    timer = null
    // 延迟执行的情况下，函数会在延迟函数中执行
    // 使用到之前缓存的参数和上下文
    if (!immediate) {
      func.apply(context, args)
      context = args = null
    }
  }, wait)

  // 这里返回的函数是每次实际调用的函数
  return function(...params) {
    // 如果没有创建延迟执行函数（later），就创建一个
    if (!timer) {
      timer = later()
      // 如果是立即执行，调用函数
      // 否则缓存参数和调用上下文
      if (immediate) {
        func.apply(this, params)
      } else {
        context = this
        args = params
      }
    // 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个
    // 这样做延迟函数会重新计时
    } else {
      clearTimeout(timer)
      timer = later()
    }
  }
}
```

### throttle
```js
/**
 * underscore 节流函数，返回函数连续调用时，func 执行频率限定为 次 / wait
 *
 * @param  {function}   func      回调函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始函数的的调用，传入{leading: false}。
 *                                如果想忽略结尾函数的调用，传入{trailing: false}
 *                                两者不能共存，否则函数不能执行
 * @return {function}             返回客户调用函数
 */
_.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    // 之前的时间戳
    var previous = 0;
    // 如果 options 没传则设为空对象
    if (!options) options = {};
    // 定时器回调函数
    var later = function() {
      // 如果设置了 leading，就将 previous 设为 0
      // 用于下面函数的第一个 if 判断
      previous = options.leading === false ? 0 : _.now();
      // 置空一是为了防止内存泄漏，二是为了下面的定时器判断
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      // 获得当前时间戳
      var now = _.now();
      // 首次进入前者肯定为 true
      // 如果需要第一次不执行函数
      // 就将上次时间戳设为当前的
      // 这样在接下来计算 remaining 的值时会大于0
      if (!previous && options.leading === false) previous = now;
      // 计算剩余时间
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      // 如果当前调用已经大于上次调用时间 + wait
      // 或者用户手动调了时间
      // 如果设置了 trailing，只会进入这个条件
      // 如果没有设置 leading，那么第一次会进入这个条件
      // 还有一点，你可能会觉得开启了定时器那么应该不会进入这个 if 条件了
      // 其实还是会进入的，因为定时器的延时
      // 并不是准确的时间，很可能你设置了2秒
      // 但是他需要2.2秒才触发，这时候就会进入这个条件
      if (remaining <= 0 || remaining > wait) {
        // 如果存在定时器就清理掉否则会调用二次回调
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        // 判断是否设置了定时器和 trailing
        // 没有的话就开启一个定时器
        // 并且不能不能同时设置 leading 和 trailing
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };
```

## 下载文件
可使用[FileSaver.js插件](https://juejin.cn/post/6901790184841412622)
```javascript
export default function downLoadFile (fileName, data) {
  // 兼容ie11,edge
  if (window.navigator.msSaveOrOpenBlob) {
    try {
      const blobObject = new Blob([data])
      window.navigator.msSaveOrOpenBlob(blobObject, decodeURI(fileName))
    } catch (e) {
      console.log(e)
    }
  } else {
    const url = URL.createObjectURL(data)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', decodeURI(fileName))
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  }
}
```

## 深度复制
```javascript
export default function deepClone (obj) {
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    return obj // 原始类型直接返回
  }
  const o = Array.isArray(obj) ? [] : {}
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i]
    }
  }
  return o
}
```
## debounce
```javascript
// 这个是用来获取当前时间戳的
function now() {
  return +new Date()
}
/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */
function debounce (func, wait = 50, immediate = true) {
  let timer, context, args

  // 延迟执行函数
  const later = () => setTimeout(() => {
    // 延迟函数执行完毕，清空缓存的定时器序号
    timer = null
    // 延迟执行的情况下，函数会在延迟函数中执行
    // 使用到之前缓存的参数和上下文
    if (!immediate) {
      func.apply(context, args)
      context = args = null
    }
  }, wait)

  // 这里返回的函数是每次实际调用的函数
  return function(...params) {
    // 如果没有创建延迟执行函数（later），就创建一个
    if (!timer) {
      timer = later()
      // 如果是立即执行，调用函数
      // 否则缓存参数和调用上下文
      if (immediate) {
        func.apply(this, params)
      } else {
        context = this
        args = params
      }
    // 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个
    // 这样做延迟函数会重新计时
    } else {
      clearTimeout(timer)
      timer = later()
    }
  }
}
```

## throttle
```javascript
/**
 * underscore 节流函数，返回函数连续调用时，func 执行频率限定为 次 / wait
 *
 * @param  {function}   func      回调函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始函数的的调用，传入{leading: false}。
 *                                如果想忽略结尾函数的调用，传入{trailing: false}
 *                                两者不能共存，否则函数不能执行
 * @return {function}             返回客户调用函数
 */
_.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    // 之前的时间戳
    var previous = 0;
    // 如果 options 没传则设为空对象
    if (!options) options = {};
    // 定时器回调函数
    var later = function() {
      // 如果设置了 leading，就将 previous 设为 0
      // 用于下面函数的第一个 if 判断
      previous = options.leading === false ? 0 : _.now();
      // 置空一是为了防止内存泄漏，二是为了下面的定时器判断
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      // 获得当前时间戳
      var now = _.now();
      // 首次进入前者肯定为 true
      // 如果需要第一次不执行函数
      // 就将上次时间戳设为当前的
      // 这样在接下来计算 remaining 的值时会大于0
      if (!previous && options.leading === false) previous = now;
      // 计算剩余时间
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      // 如果当前调用已经大于上次调用时间 + wait
      // 或者用户手动调了时间
      // 如果设置了 trailing，只会进入这个条件
      // 如果没有设置 leading，那么第一次会进入这个条件
      // 还有一点，你可能会觉得开启了定时器那么应该不会进入这个 if 条件了
      // 其实还是会进入的，因为定时器的延时
      // 并不是准确的时间，很可能你设置了2秒
      // 但是他需要2.2秒才触发，这时候就会进入这个条件
      if (remaining <= 0 || remaining > wait) {
        // 如果存在定时器就清理掉否则会调用二次回调
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        // 判断是否设置了定时器和 trailing
        // 没有的话就开启一个定时器
        // 并且不能不能同时设置 leading 和 trailing
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };
```

## isObject
```javascript
export default function isObject(obj) {
  let type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}
```

### 数组乱序
```js
const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5)
// 测试
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(shuffleArray(arr))
```
### 复制到剪贴板

```js
const copyToClipboard = (text) =>
  navigator.clipboard?.writeText && navigator.clipboard.writeText(text)
// 测试
copyToClipboard("Hello World!")
```
### 检测暗黑模式、生成随机色、滚动到顶部

```js
const isDarkMode = () =>
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
// 测试
console.log(isDarkMode())
// 生成随机色
const generateRandomHexColor = () =>
  `#${Math.floor(Math.random() * 0xffffff) .toString(16)}`;
// 滚动到顶部
const scrollToTop = (element) =>
  element.scrollIntoView({ behavior: "smooth", block: "start" })
```
