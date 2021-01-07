function convert(jsonObj: object | object[]) {
	// 请实现
	if (Array.isArray(jsonObj)) {
		jsonObj.forEach(item => {
			convert(item)
		})
	} else {
		const keys = Object.keys(jsonObj)
		keys.forEach(key => {
			const newKey = convertKey(key)
			jsonObj[newKey] = jsonObj[key]
			delete jsonObj[key]
			if (jsonObj[newKey] && typeof jsonObj[newKey] === 'object') {
				convert(jsonObj[newKey])
			}
		})
	}
	return jsonObj
}

function convertKey(str: string): string {
	let result: string = ''
	for (let i = 0; i < str.length; i++) {
		if (str[i] === '_' && str[i+1]) {
			result = result + str[++i].toUpperCase()
		} else {
			result = result + str[i]
		}
	}
	return result
}


// ------ 测试 ---------
console.log(convert({ 'a_bc_def': 1 }));
console.log(convert({ 'a_bc_def': { 'foo_bar': 2 } }));
console.log(convert({ 'a_bc_def': [{ 'foo_bar': 2 }, { 'goo_xyz': 3 }] }));
