Object.create = function (proto) {
	function Temp () {}
	Temp.prototype = proto
	return new Temp()
}

function instanceOf2(obj, con) {
	if (typeof obj !== 'object' || obj === null) return false
	var prototype = con.prototype
	var proto = obj.__proto__
	while (true) {
		if (proto === null) return false
		if (proto === prototype) return true
		proto = proto.__proto__
	}
}


function myNew(func, ...args){
	const obj = {}
	obj.__proto__ = func.prototype
	const result = func.call(obj, ...args)
	if ((typeof result === 'object' && result !== null) || typeof result === 'function') {
		return  result
	}
	return obj
}

function SuperType(name){
	this.name = name
	this.colors = ['black', 'red']
}

SuperType.prototype.getName = function(){
	return this.name
}

function SubType(name, age){
	this.age = age
	SuperType.call(this, name)
}

// 1
SubType.prototype = new SubType()
SubType.prototype.constructor = SubType

// or
SubType.prototype = Object.create(SuperType.prototype)
SubType.prototype.constructor = SubType



function binarySearch(arr, target){
	let low = 0
	let high = arr.length - 1
	while (low <= high) {
		const mid = Math.floor((low + high)/2)
		const midValue = arr[mid]
		if (midValue > target) {
			high = mid - 1
		} else if (midValue < target) {
			low = mid + 1
		} else {
			return mid
		}
	}
	return -1
}

Function.prototype.myCall = function (context, ...args) {
	if (typeof this !== 'function') {
		throw new TypeError('error')
	}
	context = context || context
	const fn = Symbol()
	context[fn] = this
	const result = context[fn](...args)
	delete context[fn]
	return result
}

function f(...args) {
	console.log(args)
}
f(1,2,3, 'test')


Function.prototype.myBind = function (...args) {
	const fn = this
	if (typeof fn !== 'function') {
		throw new TypeError('error')
	}

	const obj = args.shift() || window

	return function (...args2) {
		return fn.apply(obj, args.concat(args2))
	}

}



function asyncSelf(generator) {
	const gen = generator()
	function next(arg) {
		const { done, value} = gen.next(arg)
		if (done) return
		if (value instanceof Promise) {
			value.then(res => next(res))
				.catch(e => gen.throw(e))
		} else next(value)
	}
	try {
		next()
	} catch (e) {
		gen.throw(e)
	}
}

let objIterator = {
	[Symbol.iterator]: function () {
		return {
			next: function () {
				return {
					done: false,
					value: this.value
				}
			}
		}
	}
}

class RangeIterator {
	constructor(start, stop) {
		this.value = start
		this.stop = stop
	}

	[Symbol.iterator] () {
		return this
	}

	next() {
		const { value, stop } = this
		if (value < stop) {
			this.value ++
			return {
				done: false,
				value
			}
		}
		return {
			done: true,
			value: undefined
		}
	}
}

function range(start, stop) {
	return new RangeIterator(start, stop);
}

for (let value of range(0, 3)) {
	console.log(value); // 0, 1, 2
}

function debounce(fn, wait){
	let timer = null
	return function(...args){
		if (timer) window.clearTimeout(timer)
		else timer = setTimeout(() => {
			f(...args)
		}, wait)
	}
}


function curry(fn) {
	return function curryed(...args) {
		if(fn.length <= args.length) {
			return fn.apply(this, args)
		} else {
			return function (...args2) {
				return curryed.apply(this, args.concat(args2))
			}
		}
	}
}

function cr(obj) {
	function f() {
	}
	f.prototype = obj
	return new f()
}

function ins(obj, con) {
	let protoType = con.prototype
	let proto = obj.__proto__
	while (true) {
		if(proto === null) return false
		if(proto === protoType) return true
		proto = proto.__proto__
	}
}

function newF() {
	let obj = {}
	const con = [].shift.call(arguments)
	obj.__proto__ = con.prototype
	let res = con.call(obj, arguments)
	if((typeof result === 'object' && result !== null) || typeof result === 'function') {
		return result
	}
	return obj
}


function deepClone(obj, hash = new WeakMap()) {
	if(obj === null || obj === undefined) return obj
	if(obj instanceof Date) return new Date(obj)
	if(obj instanceof RegExp) return new RegExp(obj)
	if(typeof obj !== 'object') return obj
	if(hash.get(obj)) return hash.get(obj)
	let cloneObj = new obj.constructor()
	hash.set(obj, cloneObj)
	for(let key in obj) {
		if(obj.hasOwnProperty(key)) {
			cloneObj[key] = deepClone(obj[key], hash)
		}
	}
	return cloneObj
}

Function.prototype.myCall2  = function (content, ...args) {
	if(typeof this !== 'function') {
		throw new TypeError('error')
	}
	let symbol = new Symbol()
	content[symbol] = this
	let res = content[symbol](...args)
	delete content[symbol]
	return res
}




function Point(x, y) {
	this.x = x;
	this.y = y;
}


Function.prototype.myBind = function (context) {
	const slice = Array.prototype.slice
	const args1 = slice.call(arguments, 1)
	const func = this
	if(typeof func !== 'function') {
		throw new Error("Must accept function")
	}
	const NOOP = function () {}
	NOOP.prototype = func.prototype
	function resultFunc() {
		const args2 = slice.call(arguments,0)
		return func.apply(
			// (this instanceof NOOP) ? this : context,
			resultFunc.prototype.isPrototypeOf(this) ? this : context,
			args1.concat(args2)
		)
	}
	resultFunc.prototype = new NOOP()
	resultFunc.prototype.constructor = resultFunc
	return resultFunc
}
Point.prototype.toString = function() {
	return this.x + ',' + this.y;
};
var YAxisPoint = Point.myBind(null, 0/*x*/);

/*（译注：polyfill 的 bind 方法中，如果把 bind 的第一个参数加上，
即对新绑定的 this 执行 Object(this)，包装为对象，
因为 Object(null) 是 {}，所以也可以支持）*/

var axisPoint = new YAxisPoint(5);
console.log(axisPoint.toString()) // '0,5'

console.log(axisPoint instanceof Point) // true
console.log(axisPoint instanceof YAxisPoint) // true
console.log(new YAxisPoint(17, 42) instanceof Point) // true

function compose(...funcs) {
	return function (x) {
		return funcs.reduce((prev, func) => func(prev), x)
	}
}
