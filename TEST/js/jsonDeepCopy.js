var test = {
	name: 'a',
	date: [new Date(1536627600000), new Date(1540047600000)],
};

let b = JSON.parse(JSON.stringify(test))
console.log(b);
// {
// 	name: 'a',
// 		date: [ '2018-09-11T01:00:00.000Z', '2018-10-20T15:00:00.000Z' ]
// }

var obj = {
	name: 'a',
	reg: new RegExp('\\w+'),
	error: new Error('error')
}

console.log(JSON.parse(JSON.stringify(obj))) // { name: 'a', reg: {}, error: {} }

var funObj = {
	name: 'a',
	fun: function(){
		console.log(this.a)
	},
	un: undefined,
	na: NaN,
	in: Infinity,
	una: -Infinity,
	f: funObj
}

console.log(JSON.parse(JSON.stringify(funObj))) // { name: 'a', na: null, in: null, una: null }

function Person(name) {
	this.name = name;
	console.log(name)
}

const Tom = new Person('Tom');
console.log(Tom)
const Objj = {
	name: 'a',
	tom: Tom,
};
const copyed = JSON.parse(JSON.stringify(Objj));
console.log(copyed)
Objj.name = 'test'
console.log(JSON.parse(JSON.stringify(Objj)))
