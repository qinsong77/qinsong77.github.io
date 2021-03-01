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


function deepClone(obj, hash = new WeakMap()) {
	if(obj === null) return obj
	if(obj instanceof RegExp) return new RegExp(obj)
	if(obj instanceof Date) return new Date(obj)
	if(typeof obj !== 'object') return obj
	if(hash.has(obj)) return obj.get(obj)
	const cloneObj = new obj.constructor()
	hash.set(cloneObj, cloneObj)
	for(const key in obj) {
		if(obj.hasOwnProperty(key)) {
			cloneObj[key] = deepClone(obj[key], hash)
		}
	}
	return cloneObj
}

function needDeepClone(obj) {
	return ['[object Object]', '[object Array]', '[object Map]', '[object Set]'].includes(Object.prototype.toString.call(obj))
}

function copyBaseValue(value) {
	if(value === null) return null
	if(typeof value !== 'object') return value
	return new value.constructor(value)
}

function depC(data) {
	if(!needDeepClone(data)) return copyBaseValue(data)
	const hash = new WeakMap()
	const cloneData = new data.constructor()
	const stack = [{
		origin: data,
		copyData: cloneData
	}]

	while (stack.length > 0) {
		const [origin, copyData] = stack.pop()
		if(!hash.has(copyData)) hash.set(copyData, copyData)
		const type = Object.prototype.toString.call(origin)
		switch (type) {
			case '[object Array]':
				origin.forEach(v => {
					if(!needDeepClone(v)) copyData.push(v)
					else if (hash.has(v)) copyData.push(v)
					else {
						const newCopyData = new v.constructor()
						hash.set(newCopyData, newCopyData)
						copyData.push(newCopyData)
						stack.push({
							origin: v,
							copyData: newCopyData
						})
					}
				})
		}
	}
	return cloneData
}

function deepClone2(data) {

	if (!needDeepClone(data)) return copyBaseValue(data)

	const hashMap = new WeakMap()
	const cloneData = new data.constructor()
	const stack = [
		{
			source: data,
			target: cloneData,
		}
	]

	while (stack.length) {
		// 深度优先遍历
		const [source, target] = stack.pop()

		if (!hashMap.has(source)) {
			hashMap.set(source, target)
		}

		const stringType = Object.prototype.toString.call(source)

		switch (stringType) {
			case '[object Object]':
				const keys = Object.keys(source)
				keys.forEach(key => {
					if(!needDeepClone(source[key])) {
						target[key] = copyBaseValue(source[key])
					} else {
						if (hashMap.has(source[key])) target[key] = hashMap.get(source[key])
						else {
							const newTarget = new source[key].constructor()
							stack.push({
								source: source[key],
								target: newTarget
							})
							target[key] = newTarget
						}
					}
				})
				break

			case '[object Array]':
				source.forEach(v => {
					if (!needDeepClone(v)) {
						target.push(copyBaseValue(v))
					} else {
						if (hashMap.has(v)) target.push(hashMap.get(v))
						else {
							const newTarget = new v.constructor()
							stack.push({
								source: v,
								target: newTarget
							})
							target.push(newTarget)
						}
					}
				})
				break

			case '[object Map]':
				source.forEach((v, k) => {
					if (!needDeepClone(v)) target.set(k, copyBaseValue(v))
					else {
						if (hashMap.has(v)) target.set(k, hashMap.get(v))
						else {
							const newTarget = new v.constructor()
							stack.push({
								source: v,
								target: newTarget
							})
							target.set(k, newTarget)
						}
					}
				})
				break

			case '[object Set]':
				source.forEach(v => {
					if (!needDeepClone(v)) target.add(copyBaseValue(v))
					else {
						if (hashMap.has(v)) target.add(hashMap.get(v))
						else {
							const newTarget = new v.constructor()
							stack.push({
								source: v,
								target: newTarget
							})
							target.add(newTarget)
						}
					}
				})
				break
		}
	}

	return cloneData
}


class Observer {
	constructor(name) {
		this.name = name
	}
	notify() {
		console.log(`${this.name} has been notified.`);
	}
}

class Subject {
	constructor() {
		this.observers = []
	}

	addObserver(observer) {
		this.observers.push(observer)
	}

	notifyObservers () {
		console.log("notify all the observers");
		this.observers.forEach(observer => observer.notify())
	}
}

// 1. 创建主题对象
const subject = new Subject()

// 2. 添加观察者
const observerA = new Observer('ObserverA')
const observerB = new Observer('ObserverB')
subject.addObserver(observerA)
subject.addObserver(observerB)

// 3. 通知所有观察者
subject.notifyObservers()


class EventEmitter {
	constructor(_maxListeners = 10) {
		this._maxListeners = _maxListeners
		this._events = new Map()
	}
	// 向事件队列添加事件
	// prepend为true表示向事件队列头部添加事件
	addListener(type, listener, prepend = false) {
		const events = this._events.get(type)
		if(Array.isArray(events) && events === this._maxListeners) return false
		if(!this._events.has(type)) this._events.set(type, [listener])
		else if(prepend) events.unshift(listener)
		else events.push(listener)
		return true
	}

	// 移除某个事件
	removeListener(type, listener) {
		const events = this._events.get(type)
		if(Array.isArray(events) && listener) {
			this._events.set(type, events.filter(e => e !== listener && e.origin !== listener))
			return true
		} else return false
	}
	// 向事件队列添加事件，只执行一次
	once(type, listener) {
		const only = (...args) => {
			listener.apply(this, args)
			this.removeListener(type, listener)
		}
		only.origin = listener
		this.addListener(type, only)
	}
	// 执行某类事件
	emit(type, ...args) {
		const events = this._events.get(type)
		if(Array.isArray(events)) {
			events.forEach(fn => fn.apply(this, args))
		}
	}
	setMaxListeners(maxEventCount) {
		this._maxListeners = maxEventCount
	}
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

function Singleton(name,t) {
	this.name = name
	this.t = t
	this.instance = null
}

Singleton.prototype.getInstance = function (arg) {
	if(!this.instance) {
		this.instance = new Singleton(arg)
	}
	return this.instance
}

// console.log(Singleton.getInstance('tom', 12))
// console.log(Singleton.getInstance('tom11', 13))

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

Array.prototype.reduce = function (fn, prev) {
	const arr = this
	prev = prev || arr[0]

	for(let i = 0; i < arr.length; i++) {
		prev = fn(prev, arr[i], i, arr)
	}
	return prev
}

function uniq(arr) {
	return Array.from(new Set(arr))
}

function flat(arr) {
	const stack = [...arr]
	const res = []
	while (stack.length) {
		const next = stack.pop()
		if(Array.isArray(next)) {
			stack.push(...next)
		} else {
			res.push(next)
		}
	}
	return res.reverse()
}

function flat(arr, depth) {
	return depth > 0 ? arr.reduce((prev, val) =>  prev.concat(Array.isArray(val) ? flat(val, depth -1) : val), []) : arr.slice()
}

class LRUCache {
	constructor(capacity) {
		this.capacity = capacity
		this.cache = new Map()
	}
	get (key) {
		if(this.cache.has(key)) {
			const value = this.cache.get(key)
			this.cache.delete(key)
			this.cache.set(key, value)
			return value
		}
		else return -1
	}
	put (key, value) {
		if(this.cache.has(key)) {
			this.cache.delete(key)
			this.cache.set(key, value)
		} else {
			const size = this.cache.size
			if(size === this.capacity) {
				const keys = this.cache.keys()
				const key = keys.next().value
				this.cache.delete(key)
			}
			this.cache.set(key, value)
		}
	}
}
class Singleton {
	constructor(name) {
		this.name = name
	}
	static instance = null
	static getInstance (name) {
		if(!this.instance) this.instance = new Singleton(name)
		return this.instance
	}
}


Promise.all = function(promiseArrays){
	return new Promise((resolve, reject) => {
		if (!Array.isArray(promiseArrays)) {
			const type = typeof promiseArrays
			return reject(new TypeError(`TypeError: ${type} ${promiseArrays} is not iterable`))
		}
		const length = promiseArrays.length
		let resultArr = []
		let counter = 0
		for (let i = 0; i < length; i++) {
			Promise.resolve(promiseArrays[i])
				.then(res => {
					resultArr[i] = res
					counter++
					if(counter === length) resolve(resultArr)
				})
				.catch(err => {
					reject(err)
				})
		}
	})
}

function throttle(fn, wait) {
	let timer = null
	let startTime = Date.now()
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
window.addEventListener('resize', throttle((e) => console.log(new  Date().getTime()), 2000))

function instanceofF(obj, con) {
	if(typeof obj !== 'object' || obj === null) return false
	let protype = con.prototype
	let proto = obj.__proto__
	while (true) {
		if(proto === null) return true
		if(proto === protype) return  true
		proto = proto.__proto__
	}
}

Object.is = function(x, y){
	if(x === y) { // -0 === -0 true
		return x !== 0
	}
	return  x!==x && y!== y // NaN !== NaN
}


function Async(fn){
	return new Promise(((resolve, reject) => {
		const gen = fn()

		function next(...args){
			const { done, value } = gen.next(...args)
			if (done) return resolve(value)
			Promise.resolve(value)
				.then(res => {
					next(res)
				})
				.catch(e => gen.throw(e))
		}
		try {
			next()
		} catch (e) {
			reject(e)
		}
	}))
}

function getJSON(data) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(data)
		}, 2000)
	})
}

Async(function* () {
	try {
		console.log('start')
		console.time()
		const result1 = yield getJSON('data/first.json')
		console.log(result1)
		const result2 = yield getJSON(result1.repeat(2))
		console.log(result2)
		const result3 = yield getJSON(result2.repeat(3))
		console.log(result3)
		console.timeEnd()
		return result3
	} catch (e) {
		console.log(e)
	}
}).then(res => {
	console.log(res)
})

function argTest(){
	function test1(a, b, c){
		console.log(a)
		console.log(b)
		console.log(c)
	}
	test1(...arguments)
}
