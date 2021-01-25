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
