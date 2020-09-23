---
title: 常用笔记
---

### 事件防抖和节流
>节流防抖就好比乘电梯，比如delay是10秒，那么防抖就是电梯每进来一个人就要等10秒再运行，而节流就是电梯保证每10秒可以运行一次
#### 函数防抖(debounce)(立即防抖和非立即防抖)
在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。
核心思想：每次事件触发都会删除原有定时器，建立新的定时器。通俗意思就是反复触发函数，只认最后一次，从最后一次开始计时。

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
```javascript
  function throttle(fn, delay) {
            let flag = true,
                timer = null;
            return function (...args) {
                let context = this;
                if (!flag) return;
                flag = false;
                clearTimeout(timer)
                timer = setTimeout(() => {
                    fn.apply(context, args);
                    flag = true;
                }, delay);
            };
        };
  window.addEventListener('resize', throttle(() => console.log(new  Date().getTime()), 2000))
```
##### 适合应用场景：

- 鼠标的点击事件，比如mousedown只触发一次
- 监听滚动事件，比如是否滑到底部自动加载更多，用throttle判断
- 比如游戏中发射子弹的频率(1秒发射一颗)

## 下载文件
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
## throttle
```javascript
export default function throttle (func, wait, options) {
  let timeout, context, args, result;
  let previous = 0;
  if (!options) options = {};

  let later = function() {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  let throttled = function() {
    let _now = new Date().getTime();
    if (!previous && options.leading === false) previous = _now;
    let remaining = wait - (_now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}
```

## debounce
```javascript
// When a sequence of calls of the returned function ends, the argument
// function is triggered. The end of a sequence is defined by the ‘wait’ 
// parameter. If ‘immediate’ is passed, the argument function will be 
// triggered at the beginning of the sequence as well. 
export default function debounce(func, wait, immediate) {
  var timeout, result;

  var later = function(context, args) {
    timeout = null;
    if (args) result = func.apply(context, args);
  };

  var debounced = restArguments(function(args) {
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(this, args);
    } else {
      timeout = delay(later, wait, this, args);
    }

    return result;
  });

  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}
```

## isObject
```javascript
export default function isObject(obj) {
  let type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}
```
