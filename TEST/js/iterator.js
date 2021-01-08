const obj = {
	k: 123,
	[Symbol.iterator]: function () {
		return {
			next: function () {
				return {
					value: 1,
					done: true
				}
			}
		}
	}
}
console.log(...obj)


var name = '123'
var fun = () => {
	console.log(this.name)
}

fun()

var obj2 = {
	name: 'name',
	test: fun
}
obj2.test()

const arr = [1,2,3]

for (const [key, value] of new Map(arr.map((item, i) => [i, item]))) {
	console.log(key)
	console.log(value)
}
