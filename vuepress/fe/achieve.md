---
title: 手写实现
---
## 目录
- [Object.create的实现](#object-create的实现)
- [instanceOf](#instanceof)
- [new实现](#new实现)
- [call,apply,bind的实现](#call-apply-bind的实现)
  - [模拟实现call](#模拟实现call)
  - [模拟实现apply](#模拟实现apply)
  - [模拟实现bind](#模拟实现bind)
- [es5实现继承](#es5-实现继承)
- [函数柯里化](#函数柯里化)
- [深拷贝](#深拷贝)
- [手写EventHub（发布-订阅）](#手写eventhub-发布-订阅)
- [单例模式](#单例模式)
- [数组reduce实现](#数组reduce实现)
- [数组去重](#数组去重)
- [取并集，交集，差集，子集](#取并集，交集，差集，子集)
- [数组扁平化](#数组扁平化)
- [数组操作](#数组操作)
- [JSONP的实现](#jsonp的实现)
- [基于promise封装ajax](#基于promise封装ajax)
- [异步循环打印](#异步循环打印)
- [图片懒加载](#图片懒加载)
- [Promise](#promise)



### Object.create的实现
Object.create原本的行为：

![An image](./image/achieve/object_create.png)

```javascript
if (typeof Object.create !== "function") {
    Object.create = function create(prototype) {
      // 排除传入的对象是 null 和 非object的情况
        if (prototype === null || typeof prototype !== 'object') {
        throw new TypeError(`Object prototype may only be an Object: ${prototype}`);
        }
      // 让空对象的 __proto__指向 传进来的 对象(prototype)
      // 目标 {}.__proto__ = prototype
      function Temp() {};
      Temp.prototype = prototype;
      return new Temp;
    }
}
```

### instanceOf
> instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
>实际上，实例对象上的__proto__就是指向构造函数的prototype
语法： result = variable instanceof constructor
思路：

步骤1：先取得当前类的原型，当前实例对象的原型链

步骤2：一直循环（执行原型链的查找机制）
 - 取得当前实例对象原型链的原型链（proto = `proto.__proto__`，沿着原型链一直向上查找）
 - 如果当前实例的原型链__proto__上找到了当前类的原型prototype，则返回 true
 - 如果一直找到`Object.prototype.__proto__`=== null，Object的基类(null)上面都没找到，则返回 false
```javascript
function _instanceOf(instanceObject, classFunc) {
	let protoType = classFunc.prototype
	let proto = instanceObject.__proto__
	// 或者
	// let proto = Object.getPrototypeOf(instanceObject)
	while (true) {
		if (proto === null) return false
		if (proto === protoType) return true
		proto = proto.__proto__ 
        // 或者 proto = Object.getPrototypeOf(proto)
	}
}
```

### new实现

要创建 Person 的实例，应使用 new 操作符。以这种方式调用构造函数会执行如下操作。(JS高级程序设计描述)
- (1) 在内存中创建一个新对象。
- (2) 这个新对象内部的`[[Prototype]]`特性被赋值为构造函数的 prototype 属性。
- (3) 构造函数内部的 this 被赋值为这个新对象（即 this 指向新对象）。
- (4) 执行构造函数内部的代码（给新对象添加属性）。
- (5) 如果构造函数返回非空对象，则返回该对象；否则，返回刚创建的新对象

构造函数与普通函数唯一的区别就是调用方式不同。
```javascript
    function myNew() {
      // 创建一个空对象，实例.__proto__ = 类.prototype
      const object = {}
      // 获取构造函数
      const Constructor = [].shift.call(arguments)
      // 某些函数未必有 `prototype` 属性，比如箭头函数
      if (!Constructor.prototype) throw new Error('First argument is not a constructor.')
      // 链接到原型
      object.__proto__ = Constructor.prototype
      //  Object.setPrototypeOf(object, Constructor.prototype)
      // 绑定this 执行构造函数
      const result = Constructor.apply(object, arguments)
      // 确保new出来是个对象
      return typeof result === 'object' ? result : object
    }
    // test
    function Point(x, y) {
    	this.x = x
    	this.y = y
    }
    const point = myNew(Point, 1, 2)
```

## call,apply,bind的实现

### 模拟实现call
> MDN: call() 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数。
::: tip
注意：该方法的语法和作用与 apply() 方法类似，只有一个区别，就是 call() 方法接受的是一个参数列表，而 apply() 方法接受的是一个包含多个参数的数组。
:::

- 1.判断当前this是否为函数，防止Function.prototype.myCall() 直接调用
- 2.context 为可选参数，如果不传的话默认上下文为 window
- 3.为context 创建一个 Symbol（保证不会重名）属性，将当前函数赋值给这个属性
- 4.处理参数，传入第一个参数后的其余参数
- 5.调用函数后即删除该Symbol属性
```javascript
    Function.prototype.mayCall = function(context, ...args) {
        if (this === Function.prototype) {
          return undefined // 用于防止 Function.prototype.myCall() 直接调用
        }
        // 首先判断调用对象
        if(typeof this !== 'function') {
            throw new TypeError('error')
        }
        context = context || window
        const fn = Symbol()
        context[fn] = this
        const result = context[fn](...args)
        delete context[fn]
        return  result
    }
```
### 模拟实现apply
apply实现类似call，参数为数组

```javascript
    Function.prototype.myApply = function (context, args) {
        if (this === Function.prototype) {
            return undefined // 用于防止 Function.prototype.myCall() 直接调用
        }
         // 首先判断调用对象
        if(typeof this !== 'function') {
           throw new TypeError('error')
        }
        context = context || window
        const fn = Symbol()
        context[fn] = this
        
        // Array.isArray
        if (!Array.isArray) {
          Array.isArray = function(arg) {
            return Object.prototype.toString.call(arg) === '[object Array]'
          }
        }

        const result = Array.isArray(args) ? context[fn](...args) : context[fn]()
        delete context[fn]
        return result
    }
```

### 模拟实现bind
- 1.处理参数，返回一个闭包
- 2.判断是否为构造函数调用，如果是则使用new调用当前函数
- 3.如果不是，使用apply，将context和处理好的参数传入

```javascript
/*
Function.prototype.myBind = function (context, ...args) {
	// 首先判断调用对象是否为函数
	if(typeof this !== 'function') {
		throw new TypeError('error')
	}
	
	const that = this
	
	return function F(...newArgs) {
		if (this instanceof F) {
			return new that(...args, ...newArgs)
		}
		return that.apply(context, args.concat(newArgs))
	}
}
*/
// version 2
Function.prototype.myBind = function(asThis) {
  var slice = Array.prototype.slice;
  var args1 = slice.call(arguments, 1);
  var fn = this;
  if (typeof fn !== "function") {
    throw new Error("Must accept function");
  }
  function resultFn() {
    var args2 = slice.call(arguments, 0);
    return fn.call(
      resultFn.prototype.isPrototypeOf(this) ? this : asThis, // new 的情况下 this 改绑成 new 出来的对象实例
      args1.concat(args2)
    );
  }
  resultFn.prototype = fn.prototype;
  return resultFn;
}
```


### ES5 实现继承
> 寄生组合继承是ES5的最佳实现

所谓寄生组合式继承，即通过借用构造函数来继承属性，通过原型链的形式来继承方法。

只调用了一次父类构造函数，效率更高。避免在子类.prototype上面创建不必要的、多余的属性，与其同时，原型链还能保持不变。

```javascript
function Parent(name) {
	this.name = name
	this.colors = ['red', 'blue', 'green']
}

Parent.prototype.getName = function () {
	return this.name
}

function Child(name, age) {
	Parent.call(this, name)
	this.age = age
}

Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child

Child.prototype.getAge = function () {
	return this.age
}

let Tom = new Child('Tom', 17)
Tom.getAge()
```

### 函数柯里化

```javascript
function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args)
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2))
      }
    }
  }
}
// 用例
function sum(a, b, c) {
  return a + b + c;
}

let curriedSum = curry(sum);

alert( curriedSum(1, 2, 3) ); // 6，仍然可以被正常调用
alert( curriedSum(1)(2,3) ); // 6，对第一个参数的柯里化
alert( curriedSum(1)(2)(3) ); // 6，全柯里化
```

### [深拷贝](https://segmentfault.com/a/1190000020255831)
> [使用proxy](https://github.com/KieSun/FE-advance-road/blob/master/wheels/deepClone/index.md)
```javascript

// 数组浅拷贝可以用slice,concat, [...array]，对象可以用Object.assign. {...obj}
const arr = [1, 2, 3]
const arrCopy = arr.slice()
arr.push(3)
// arrCopy 为[1,2,3]

var obj = {k: '1'}
var obj2 = {...obj}
// obj2 ==={k: "1"} true
obj.ff = '12'
// obj2 ==={k: "1"} true

/*
  递归，解决了嵌套引用，但会嵌套多层递归会爆栈
*/
function deepClone(target, hashMap = new WeakMap()){
	if (target === null) return target // typeof null === 'object'
	if (typeof target !== 'object') return target // undefined, string, number, function, symbol
	// 是对象的话就要进行深拷贝
	// 处理循环引用
	if (hashMap.get(target)) {
		return hashMap.get(target)
	}
	
	let cloneTarget = new target.constructor()
	// 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
	// 防止循环引用
	hashMap.set(target, cloneTarget)
	const stringType = Object.prototype.toString.call(target)
	switch (stringType) {
		case '[object Boolean]':
		case '[object Number]':
		case '[object String]':
		case '[object Error]':
		case '[object Date]':
		case '[object RegExp]':
			return new target.constructor(target)
		case '[object Set]':
			target.forEach(v => cloneTarget.add(deepClone(v, hashMap)))
			break
		case '[object Map]':
			target.forEach((v, k) => cloneTarget.set(k, deepClone(v, hashMap)))
			break
		case '[object Array]':
			target.forEach((v, index) => cloneTarget[index] = deepClone(v, hashMap))
			break
		case '[object Object]':
			const keys = Object.keys(target)
			keys.forEach(key => cloneTarget[key] = deepClone(target[key], hashMap))
			break
	}
	return cloneTarget
}

function needDeepClone(target) {
	const stringType = Object.prototype.toString.call(target)
	return ['[object Set]', '[object Map]', '[object Array]', '[object Object]'].includes(stringType)
}

function copyBaseValue(target) {
	if (target === null) return target // typeof null === 'object'
	if (typeof target !== 'object') return target
	return new target.constructor(target)
}

// 维护一个栈(数组），while循环 https://yanhaijing.com/javascript/2018/10/10/clone-deep/
function deepClone2(data, hashMap = new WeakMap()) {
	
	if (!needDeepClone(data)) return copyBaseValue(data)
	
	let cloneData = new data.constructor()
	// 循环数组
	const loopList = [
		{
			source: data,
			target: cloneData,
		}
	]
	
	while (loopList.length) {
		// 深度优先遍历
		const node = loopList.pop()
		const source = node.source
		let target = node.target
		
		if (!hashMap.get(source)) {
			hashMap.set(source, target)
		}
		
		const stringType = Object.prototype.toString.call(source)
		
		switch (stringType) {
			case '[object Object]':
				const keys = Object.keys(source)
				keys.forEach(key => {
					if (needDeepClone(source[key])) {
						if (hashMap.get(source[key])) {
							target[key] = hashMap.get(source[key])
						} else {
							const newNode = {
								source: source[key],
								target: new source[key].constructor()
							}
							loopList.push(newNode)
							target[key] = newNode.target
						}
					} else {
						target[key] = copyBaseValue(source[key])
					}
				})
				break
			
			case '[object Array]':
				source.forEach(v => {
					if (needDeepClone(v)) {
						
						if (hashMap.get(v)) {
							target.push(hashMap.get(v))
						} else {
							const newNode = {
								source: v,
								target: new v.constructor()
							}
							loopList.push(newNode)
							target.push(newNode.target)
						}
					} else {
						target.push(copyBaseValue(v))
					}
				})
				break
			
			case '[object Map]':
				source.forEach((v, k) => {
					if (needDeepClone(v)) {
						if (hashMap.get(v)) {
							target.set(k, hashMap.get(v))
						} else {
							const newNode = {
								source: v,
								target: new v.constructor()
							}
							loopList.push(newNode)
							target.set(k, newNode.target)
						}
					} else {
						target.set(k, copyBaseValue(v))
					}
				})
				break
			
			case '[object Set]':
				source.forEach(v => {
					if (needDeepClone(v)) {
						
						if (hashMap.get(v)) {
							target.add(hashMap.get(v))
						} else {
							const newNode = {
								source: v,
								target: new v.constructor()
							}
							loopList.push(newNode)
							target.add(newNode.target)
						}
						
					} else {
						target.add(copyBaseValue(v))
					}
				})
				break
		}
	}
	
	
	return cloneData
}
```

### 手写EventHub（发布-订阅）
核心思路是：

 - 使用一个对象作为缓存
 - on 负责把方法注册到缓存的 EventName 对应的数组
 - emit 负责遍历触发 EventName 底下的方法数组
 - off 找方法的索引，并删除
```javascript
class EventHub {
  cache = {};
  on(eventName, fn) {
    this.cache[eventName] = this.cache[eventName] || [];
    return this.cache[eventName].push(fn) -1; // push会返回数组length, 暂时用key作为键值
  }
  emit(eventName) {
    this.cache[eventName].forEach((cb) => cb());
  }
  off(eventName, fn) {
    const index = this.cache[eventName].findIndex(item => item === fn)
    if (index === -1) return;
    this.cache[eventName].splice(index, 1);
  }
  offIndex(eventName, index) {
    this.cache[eventName].splice(index, 1);
  }
}

// 观察者模式
function EventEmitter() {
	this._maxListeners = 10
	this._events = Object.create(null)
}

// 向事件队列添加事件
// prepend为true表示向事件队列头部添加事件
EventEmitter.prototype.addListener = function (type, listener, prepend) {
	if (!this._events) {
		this._events = Object.create(null)
	}
	if (this._events[type]) {
		if (prepend) {
			this._events[type].unshift(listener)
		} else {
			this._events[type].push(listener)
		}
	} else {
		this._events[type] = [listener]
	}
}

// 移除某个事件
EventEmitter.prototype.removeListener = function (type, listener) {
	if (Array.isArray(this._events[type])) {
		if (!listener) {
			delete this._events[type]
		} else {
			this._events[type] = this._events[type].filter(e => e !== listener && e.origin !== listener)
		}
	}
}

// 向事件队列添加事件，只执行一次
EventEmitter.prototype.once = function (type, listener) {
	const only = (...args) => {
		listener.apply(this, args)
		this.removeListener(type, listener)
	}
	only.origin = listener
	this.addListener(type, only)
}

// 执行某类事件
EventEmitter.prototype.emit = function (type, ...args) {
	if (Array.isArray(this._events[type])) {
		this._events[type].forEach(fn => {
			fn.apply(this, args)
		})
	}
}

// 设置最大事件监听个数
EventEmitter.prototype.setMaxListeners = function (count) {
	this.maxListeners = count
}

// test
var emitter = new EventEmitter()

var onceListener = function (args) {
	console.log('我只能被执行一次', args, this)
}

var listener = function (args) {
	console.log('我是一个listener', args, this)
}

emitter.once('click', onceListener)
emitter.addListener('click', listener)

emitter.emit('click', '参数')
emitter.emit('click')

emitter.removeListener('click', listener)
emitter.emit('click')

```

#### JavaScript自定义事件

`DOM`也提供了类似上面`EventEmitter`的API，基本使用：
```javascript
//1、创建事件
var myEvent = new Event('myEvent')

//2、注册事件监听器
elem.addEventListener('myEvent', function (e) {
	
})

//3、触发事件
elem.dispatchEvent(myEvent)
```

### 单例模式
使用闭包实现
```javascript
function Singleton(name) {
	this.name = name
}

Singleton.prototype.getName = function () {
	return this.name
}

Singleton.getInstance = (function () {
	let instance
	return function (name) {
		if (!instance) {
			instance = new Singleton(name)
		}
		return instance
	}
})()

var a = Singleton.getInstance('tom')
var b = Singleton.getInstance('Tom')

console.log(a === b)  
```

### 数组reduce实现
```javascript
// 实现reduce
// prev, next, currentIndex, array
Array.prototype.myReduce = function (cb, prev) {
	let i = 0
	if (!prev) {
		prev = prev || this[0]
		i++
	}
	for (; i < this.length; i++) {
		prev = cb(prev, this[i], i, this)
	}
	return prev
}
// 测试
const sum = [1, 2, 3].myReduce((prev, next) => {
	return prev + next
})

console.log(sum) // 6

function unique(arr) {
	return arr.myReduce((prev, cur) => prev.includes(cur) ? prev : [...prev, cur], [])
}

const arr2 = [1, 1, 'true', 'true', true, true, 15, 15, false, false, undefined, undefined, null, null, NaN, NaN, 'NaN', 0, 0, 'a', 'a', {}, {}]
console.log(unique(arr2))
```

### 数组去重
 - 1、使用set
```javascript
function unique(array) {
  return Array.from(new Set(array))
}
```
- 2、利用for嵌套for，然后splice去重（ES5中最常用）
```javascript
function unique(array) {
	for (let i = 0; i < array.length; i++) {
		for (let j = i + 1; j < array.length; j++) {
			if (array[i] === array[j]) {
				array.splice(j, 1)
				j--
			}
		}
	}
	return array
}
```
- 3、使用indexOf, push
```javascript
function unique(array) {
	const arr = []
	for (let i = 0; i < array.length; i++) {
		if (arr.indexOf(array[i]) === -1) {
			arr.push(array[i])
		}
	}
	return arr
}
```
### 取并集，交集，差集，子集
```javascript
// 取并集
const arrayA = [1, 2, 3], arrayB = [2, 4, 3, 5]

function unionArray(arrayA, arrayB, compareFun = (a, b) => a === b) {
	const result = [...arrayA]
	arrayB.forEach(b => {
		if (!result.find(a => compareFun(a, b))) result.push(b)
	})
	return result
}
// 简化写法
console.log([...new Set([...arrayA, ...arrayB])])

// 取交集
function intersectionArray(arrayA, arrayB, compareFun = (a, b) => a === b) {
	return arrayA.filter(a => arrayB.find(b => compareFun(a, b)))
}
console.log(intersectionArray(arrayA, arrayB))
// 简化写法
const intersectionResult = [...new Set(arrayA.filter(v => new Set(arrayB).has(v)))]
console.log(intersectionResult)

// 取差集
function differenceArray(arrayA, arrayB, compareFun = (a, b) => a === b) {
	return arrayA.filter(a => !arrayB.find(b => compareFun(a, b)))
}
console.log(differenceArray(arrayA, arrayB))
const differenceResult = [...new Set(arrayA.filter(v => !new Set(arrayB).has(v)))]
console.log(differenceResult)

```

### 数组扁平化
```javascript
// es5
let arr = [
	[1, 2, 2],
	[3, 4, 5, 5],
	[6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10
]

function myFlatArray(array) {
	const result = []
	let cycleArray = (arr) => {
		arr.forEach(v => {
			if (Array.isArray(v)) {
				cycleArray(v)
			} else {
				result.push(v)
			}
		})
	}
	cycleArray(array)
	return result
}

function flatten(array) {
      return array.reduce(
        (target, current) =>
          Array.isArray(current) ?
            target.concat(flatten(current)) :
            target.concat(current)
        , [])
    }
```

### 数组操作
```javascript
const array = [3, 2, 1, 4, 5]
// 最值

// reduce
array.reduce((c, n) => Math.max(c, n))

// Math.math

Math.max.apply(null, array)
Math.max(...array)

Array.prototype.reduceToMap = function (handler) {
	return this.reduce((target, current, index) => {
		target.push(handler.call(this, current, index))
		return target
	}, [])
}

Array.prototype.reduceToFilter = function (handler) {
	return this.reduce((target, current, index) => {
		if (handler.call(this, current, index)) {
			target.push(current)
		}
		return target
	}, [])
}


// 数组乱序
// 从最后一个元素开始，从数组中随机选出一个位置，交换，直到第一个元素。
function disorder(array) {
	const length = array.length
	let current = length - 1
	let random
	while (current > -1) {
		random = Math.floor(length * Math.random());
		[array[current], array[random]] = [array[random], array[current]]
		current--
	}
	return array
}
```

### JSONP的实现

需要服务端配合，返回能执行回调函数的js

> 利用\<script>标签没有跨域限制的“漏洞”来达到与第三方通讯的目的。
>当需要通讯时，本站脚本创建一个\<script>元素，地址指向第三方的API网址，
>形如：\<script src="http://www.example.net/api?param1=1&param2=2">\</script> 
>并提供一个回调函数来接收数据（函数名可约定，或通过地址参数传递）。    
>第三方产生的响应为json数据的包装（故称之为jsonp，即json padding），
>形如：callback({"name":"hax","gender":"Male"})这样浏览器会调用callback函数，并传递解析后json对象作为参数。本站脚本可在callback函数里处理所传入的数据。

- 1.将传入的data数据转化为url字符串形式
- 2.处理url中的回调函数
- 3.创建一个script标签并插入到页面中
- 4.挂载回调函数

```javascript
(function (window, document) {
	'use strict'
	var jsonp = function (url, data, callback) {
		// 1.将传入的data数据转化为url字符串形式
		// {id:1,name:'jack'} => id=1&name=jack
		var dataStr = url.indexOf('?') === -1 ? '?' : '&'
		for (var key in data) {
			dataStr += key + '=' + data[key] + '&'
		}
		
		// 2 处理url中的回调函数
		// cbFuncName回调函数的名字 ：my_json_cb_名字的前缀 + 随机数（把小数点去掉）
		var cbFuncName = 'my_json_cb_' + Math.random().toString().replace('.', '')
		dataStr += 'callback=' + cbFuncName
		
		// 3.创建一个script标签并插入到页面中
		var scriptEle = document.createElement('script')
		scriptEle.src = url + dataStr
		
		// 4.挂载回调函数
		window[cbFuncName] = function (data) {
			callback(data)
			// 处理完回调函数的数据之后，删除jsonp的script标签
			document.body.removeChild(scriptEle)
		}
		
		document.body.appendChild(scriptEle)
	}
	window.$jsonp = jsonp
})(window, document)

```

### 基于Promise封装Ajax

```javascript
function ajax(method = 'get', url, params) {
	return new Promise(((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		const paramString = getStringParam(params)
		if (method === 'get' && paramString) {
			url.indexOf('?') ? url += paramString : url += `?${paramString}`
		}
		
		xhr.open(method, url)
		
		xhr.onload = function () {
			const result = {
				status: xhr.status,
				statusText: xhr.statusText,
				headers: xhr.getAllResponseHeaders(),
				data: xhr.response || xhr.responseText
			}
			if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
				resolve(result)
			} else {
				reject(result)
			}
		}
		// 设置请求头
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		// 跨域携带cookie
		xhr.withCredentials = true
		// 错误处理
		xhr.onerror = function () {
			reject(new TypeError('请求出错'))
		}
		xhr.timeout = function () {
			reject(new TypeError('请求超时'))
		}
		xhr.onabort = function () {
			reject(new TypeError('请求被终止'))
		}
		if (method === 'post') {
			xhr.send(paramString)
		} else {
			xhr.send()
		}
	}))
}
```

### 异步循环打印

```javascript
const sleep = function (time, i) {
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			resolve(i)
		}, time)
	})
}


const start = async function () {
	for (let i = 0; i < 6; i++) {
		let result = await sleep(1000, i)
		console.log(result)
	}
}

start()
```
### 图片懒加载

#### 监听图片高度
图片，用一个其他属性存储真正的图片地址：
```html
  <img src="loading.gif" data-src="https://cdn.pixabay.com/photo/2015/09/09/16/05/forest-931706_1280.jpg" alt="">
  <img src="loading.gif" data-src="https://cdn.pixabay.com/photo/2014/08/01/00/08/pier-407252_1280.jpg" alt="">
  <img src="loading.gif" data-src="https://cdn.pixabay.com/photo/2014/12/15/17/16/pier-569314_1280.jpg" alt="">
  <img src="loading.gif" data-src="https://cdn.pixabay.com/photo/2010/12/13/10/09/abstract-2384_1280.jpg" alt="">
  <img src="loading.gif" data-src="https://cdn.pixabay.com/photo/2015/10/24/11/09/drop-of-water-1004250_1280.jpg">
```
通过图片offsetTop和window的innerHeight，scrollTop判断图片是否位于可视区域。

或者使用API [Element.getBoundingClientRect()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)
```javascript
var img = document.getElementsByTagName('img')
var n = 0 //存储图片加载到的位置，避免每次都从第一张图片开始遍历
lazyload() //页面载入完毕加载可是区域内的图片
// 节流函数，保证每200ms触发一次
function throttle(event, time) {
	let timer = null
	return function (...args) {
		if (!timer) {
			timer = setTimeout(() => {
				timer = null
				event.apply(this, args)
			}, time)
		}
	}
}

window.addEventListener('scroll', throttle(lazyload, 200))

function lazyload() { //监听页面滚动事件
	var seeHeight = window.innerHeight //可见区域高度
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop //滚动条距离顶部高度
	for (var i = n; i < img.length; i++) {
		console.log(img[i].offsetTop, seeHeight, scrollTop)
		if (img[i].offsetTop < seeHeight + scrollTop) {
			if (img[i].getAttribute('src') == 'loading.gif') {
				img[i].src = img[i].getAttribute('data-src')
			}
			n = i + 1
		}
	}
}
```

#### [IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)
IntersectionObserver接口 (从属于Intersection Observer API) 提供了一种异步观察目标元素与其祖先元素或顶级文档视窗(viewport)交叉状态的方法。祖先元素与视窗(viewport)被称为根(root)。

Intersection Observer可以不用监听scroll事件，做到元素一可见便调用回调，在回调里面我们来判断元素是否可见。

```javascript
if (IntersectionObserver) {
	let lazyImageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry, index) => {
			let lazyImage = entry.target
			// 如果元素可见            
			if (entry.intersectionRatio > 0) {
				if (lazyImage.getAttribute('src') == 'loading.gif') {
					lazyImage.src = lazyImage.getAttribute('data-src')
				}
				lazyImageObserver.unobserve(lazyImage)
			}
		})
	})
	for (let i = 0; i < img.length; i++) {
		lazyImageObserver.observe(img[i])
	}
}
```

### promise

#### promise 实现进度通知
```javascript
class TrackAblePromise extends Promise {
	constructor(executor){
		const notifyHandlers = []
		super((resolve, reject) => {
			return executor(resolve, reject, (status) => {
				notifyHandlers.map((handler) => handler(status))
			})
		})
		this.notifyHandlers = notifyHandlers
	}

	notify (notifyHandler) {
		this.notifyHandlers.push(notifyHandler)
		return this
	}
}

let p = new TrackAblePromise((resolve, reject, notify) => {
	function countDown(x){
		if (x > 0) {
			notify(`${ 20 * x} % remaining`)
			setTimeout(() => countDown(x - 1), 1000)
		} else {
			resolve()
		}
	}
	countDown(5)
})

p.notify((x) => setTimeout(console.log, 0 , 'progress:', x))

p.then(() => console.log('completed'))
```

#### 手写promise
> [文章](https://juejin.im/post/6844903665686282253)
```javascript
class MyPromise {
	constructor(handle){
		if (typeof handle !== 'function') {
			throw new Error('MyPromise must accept a function as a parameter')
		}

		// 添加状态
		this._status = PENDING
		this._value = undefined
		// 添加成功回调函数队列
		this._fulfilledQueues = []
		// 添加失败回调函数队列
		this._rejectedQueues = []

		try {
			handle(this._resolve.bind(this), this._reject.bind(this))
		} catch (err) {
			this._reject(err)
		}
	}


	// 添加resolve时执行的函数
	_resolve(val){
		const run = () => {
			if (this._status !== PENDING) return
			// 依次执行成功队列中的函数，并清空队列
			const runFulfilled = (value) => {
				let cb
				while (cb = this._fulfilledQueues.shift()) {
					cb(value)
				}
			}
			// 依次执行失败队列中的函数，并清空队列
			const runRejected = (error) => {
				let cb
				while (cb = this._rejectedQueues.shift()) {
					cb(error)
				}
			}
			/* 如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
				当前Promise的状态才会改变，且状态取决于参数Promise对象的状态
			*/
			if (val instanceof MyPromise) {
				val.then(value => {
					this._value = value
					this._status = FULFILLED
					runFulfilled(value)
				}, err => {
					this._value = err
					this._status = REJECTED
					runRejected(err)
				})
			} else {
				this._value = val
				this._status = FULFILLED
				runFulfilled(val)
			}
		}
		// 为了支持同步的Promise，这里采用异步调用
		setTimeout(run, 0)
	}

	// 添加reject时执行的函数
	_reject(err){
		if (this._status !== PENDING) return
		// 依次执行失败队列中的函数，并清空队列
		const run = () => {
			this._status = REJECTED
			this._value = err
			let cb
			while (cb = this._rejectedQueues.shift()) {
				cb(err)
			}
		}
		// 为了支持同步的Promise，这里采用异步调用
		setTimeout(run, 0)
	}

	// 添加then方法
	then(onFulfilled, onRejected){
		const { _value, _status } = this
		// 返回一个新的Promise对象
		return new MyPromise((onFulfilledNext, onRejectedNext) => {
			// 封装一个成功时执行的函数
			let fulfilled = value => {
				try {
					if (!(typeof onFulfilled === 'function')) {
						onFulfilledNext(value)
					} else {
						let res = onFulfilled(value)
						if (res instanceof MyPromise) {
							// 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
							res.then(onFulfilledNext, onRejectedNext)
						} else {
							//否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
							onFulfilledNext(res)
						}
					}
				} catch (err) {
					// 如果函数执行出错，新的Promise对象的状态为失败
					onRejectedNext(err)
				}
			}
			// 封装一个失败时执行的函数
			let rejected = error => {
				try {
					if (!(typeof onRejected === 'function')) {
						onRejectedNext(error)
					} else {
						let res = onRejected(error)
						if (res instanceof MyPromise) {
							// 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
							res.then(onFulfilledNext, onRejectedNext)
						} else {
							//否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
							onFulfilledNext(res)
						}
					}
				} catch (err) {
					// 如果函数执行出错，新的Promise对象的状态为失败
					onRejectedNext(err)
				}
			}
			switch (_status) {
				// 当状态为pending时，将then方法回调函数加入执行队列等待执行
				case PENDING:
					this._fulfilledQueues.push(fulfilled)
					this._rejectedQueues.push(rejected)
					break
				// 当状态已经改变时，立即执行对应的回调函数
				case FULFILLED:
					fulfilled(_value)
					break
				case REJECTED:
					rejected(_value)
					break
			}
		})
	}

	// 添加catch方法
	catch(onRejected){
		return this.then(undefined, onRejected)
	}

	// 添加静态resolve方法
	static resolve(value){
		// 如果参数是MyPromise实例，直接返回这个实例
		if (value instanceof MyPromise) return value
		return new MyPromise(resolve => resolve(value))
	}

	// 添加静态reject方法
	static reject(value){
		return new MyPromise((resolve, reject) => reject(value))
	}

	// 添加静态all方法
	static all(list){
		return new MyPromise((resolve, reject) => {
			/**
			 * 返回值的集合
			 */
			let values = []
			let count = 0
			for (let [i, p] of list.entries()) {
				// 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
				this.resolve(p).then(res => {
					values[i] = res
					count++
					// 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
					if (count === list.length) resolve(values)
				}, err => {
					// 有一个被rejected时返回的MyPromise状态就变成rejected
					reject(err)
				})
			}
		})
	}

	// 添加静态race方法
	static race(list){
		return new MyPromise((resolve, reject) => {
			for (let p of list) {
				// 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
				this.resolve(p).then(res => {
					resolve(res)
				}, err => {
					reject(err)
				})
			}
		})
	}

	finally(cb){
		return this.then(
			value => MyPromise.resolve(cb()).then(() => value),
			reason => MyPromise.resolve(cb()).then(() => {
				throw reason
			})
		)
	}
}
```
