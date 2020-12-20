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


