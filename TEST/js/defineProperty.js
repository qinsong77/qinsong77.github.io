const obj = {}
Object.defineProperty(obj, 'key1', {
	configurable: false,
	writable: false,
	value: 'test key1'
})
console.log(obj)
