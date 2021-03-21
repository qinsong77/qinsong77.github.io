const isFunction = v => typeof v === 'function'
const isObject = obj => typeof obj === 'object' && obj !== null
const isThenable = obj => (isFunction(obj) || isObject(obj)) && 'then' in obj
const isPromise = promise => promise instanceof Promise

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

const handleCallback = (callback, state, result) => {
	const { onFulfilled, onRejected, resolve, reject } = callback
	try {
		if(state === FULFILLED) {
			isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result)
		} else if(state === REJECTED) {
			isFunction(onRejected) ? resolve(onRejected(result)) : reject(result)
		}
	} catch (e) {
		reject(e)
	}
}

const handleCallbacks = (callbacks, state, result) => {
	while (callbacks.length) handleCallback(callbacks.shift(), state, result)
}

const transition = (promise, state, result) => {
	if (promise.state !== PENDING) return
	promise.state = state
	promise.result = result
	setTimeout(() => handleCallbacks(promise.callbacks, state, result), 0)
}

const resolvePromise = (promise, result, resolve, reject) => {
	if(result === promise) {
		const reason = new TypeError('can not fulfill promise with itself')
		return  reject(reason)
	}
	if(isPromise(result)) {
		return result.then(resolve, reject)
	}
	if(isThenable(result)) {
		try {
			const then = result.then
			if(isFunction(then)) {
				return new Promise(then.bind(result)).then(resolve, reject)
			}
		} catch (e) {
			return reject(e)
		}
	}
	
	resolve(result)
}

class Promise {
	constructor(executor) {
		if(typeof executor !== 'function') {
			throw new TypeError('executor must be a function')
		}
		this.state = PENDING
		this.result = null
		this.callbacks = []
		
		const onFulfilled = value => transition(this, FULFILLED, value)
		const onRejected = reason => transition(this, REJECTED, reason)
		
		let ignore = false
		const resolve = value => {
			if (ignore) return
			ignore = true
			resolvePromise(this, value, onFulfilled, onRejected)
		}
		const reject = reason => {
			if (ignore) return
			ignore = true
			onRejected(reason)
		}
		
		try {
			executor(resolve, reject)
		} catch (error) {
			reject(error)
		}
	}
	
	then(onFulfilled, onRejected) {
		return new Promise((resolve, reject) => {
			const callback = { onFulfilled, onRejected, resolve, reject }
			if(this.state === PENDING) {
				this.callbacks.push(callback)
			} else {
				setTimeout(() => handleCallback(callback, this.state, this.result), 0)
			}
		})
	}
	
	static resolve = value => new Promise(resolve => resolve(value))
	static reject = reason => new Promise((_, reject) => reject(reason))
}

module.exports = Promise

// promise 测试工具
// npm install promises-aplus-tests -D
Promise.defer = Promise.deferred = function () {
	let deferred = {}
	
	deferred.promise = new Promise((resolve, reject) => {
		deferred.resolve = resolve
		deferred.reject = reject
	})
	return deferred
}
