const fs = require('fs')

function run(fn) {
	let gen = fn()
	function next(err, data) {
		console.log(data)
		const result = gen.next()
		console.log(result)
		if(result.done) return
		result.value(next)
	}
	next()
}
var ThunkReadFile = function (fileName){
	return function (callback){
		console.log(callback.toString())
		return fs.readFile(fileName, callback);
	};
};
function* gen() {
	let a = yield ThunkReadFile('./stream')
	console.log(a)
	let b = yield ThunkReadFile('./1.js')
	console.log(b)
}

run(gen)


function compose(...fns) {
	if (fns.length === 0) return arg => arg
	if (fns.length === 1) return fns[0]
	return fns.reduce((res, cur) =>(...args) => res(cur(...args)))
}


// 例子
function lowerCase(input) {
	return input && typeof input === "string" ? input.toLowerCase() : input;
}

function upperCase(input) {
	return input && typeof input === "string" ? input.toUpperCase() : input;
}

function trim(input) {
	return typeof input === "string" ? input.trim() : input;
}

function split(input, delimiter = ",") {
	return typeof input === "string" ? input.split(delimiter) : input;
}

// compose函数的实现，请参考 “组合函数的实现” 部分。
const trimLowerCaseAndSplit = compose(lowerCase, trim, split);
console.log(trimLowerCaseAndSplit(" a,B,C ")) // ["a", "b", "c"]
