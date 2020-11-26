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


function myNew() {
	let obj = {}
	const constructor = Array.prototype.shift.call(arguments)
	if (constructor && constructor.prototype) {
		obj.__proto__ = constructor.prototype
		const result = constructor.call(obj, arguments)
		return typeof result === 'object' ? result : obj
	} else {
		throw new Error()
	}
}
