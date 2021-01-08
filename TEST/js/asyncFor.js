const delay = timeout => new Promise(resolve=> setTimeout(resolve, timeout, timeout));

const allDelay = [
	delay(3000),
	delay(3000),
	delay(3000)
]

async function runAll (promises) {
	for (let pr of promises) {
		console.log(1)
		const res = await delay(2000)
		console.log(res)
	}
}

runAll(allDelay)

var getNumbers = () => {
	return [1,2,3]
}
async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array)
	}
}
var multi = num => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (num) {
				resolve(num * num)
			} else {
				reject(new Error('num not specified'))
			}
		}, 1000)
	})
}
async function test () {
	var nums = getNumbers()
	asyncForEach(nums, async x => {
		var res = await multi(x)
		console.log(res)
	})
}
// test()
async function test2 () {
	var nums = await getNumbers()
	for(let x of nums) {
		var res = await multi(x)
		console.log(res)
	}
}
// test2()
