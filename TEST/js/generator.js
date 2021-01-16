function* myGenerator(msg) {
	const resultMsg = yield ('first & ' + msg)
	console.log(resultMsg) // world
	yield ('second & ' + resultMsg + ' & ' + msg)
}

const gen = myGenerator('hello')

const result1 = gen.next('test') // { value: 'first & hello', done: false }
console.log(result1)
const result2 = gen.next('world') // { value: 'second & world&hello', done: false }
console.log(result2)

