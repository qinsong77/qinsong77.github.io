---
title: 手写实现
---
### Object.create的实现
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
```javascript
function _instanceOf(instanceObject, classFunc) {
	let protoType = classFunc.prototype
	let proto = target.__proto__
	// 或者
	// let proto = Object.getPrototypeOf(instanceObject)
	while (true) {
		if (proto === null) return false
		if (proto === protoType) return true
		proto = proto.__proto__ // 或者 proto = Object.getPrototypeOf(proto)
	}
}
```

### new实现

```javascript
    function Create() {
      // 创建一个空对象
      const object = {}
      // 获取构造函数
      const Constructor = [].shift.call(arguments)
      // 链接到原型
      object.__proto__ = Constructor.prototype
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
    const point = Create(Point, 1, 2)
```

## call, apply, bind 的实现

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
```

### [深拷贝](https://segmentfault.com/a/1190000020255831)
```javascript
/*
  递归，除了了嵌套引用，但会嵌套多层递归会爆栈
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

// 维护一个数组队列，while循环 https://yanhaijing.com/javascript/2018/10/10/clone-deep/
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

### 手写 EventHub（发布-订阅）
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
    this.cache[eventName].forEach((fn) => fn());
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
```
