function hex2rgb(hex) {
	const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
	if(reg.test(hex)) {
		if(hex.length === 4) {
			let newHex = '#'
			for(let i = 1; i < hex.length; i++) {
				newHex = newHex + hex[i] + hex[i]
			}
			hex = newHex
		}

		const arr = []
		for(let i = 1; i < hex.length; i = i + 2) {
			arr.push(parseInt('0x' + hex.slice(i, i+2)))
			console.log(arr)
		}

		return `rgb(${arr.join(',')})`
	} else {
		return hex
	}
}

console.log(hex2rgb('#000000') === 'rgb(0,0,0)')
console.log(hex2rgb('#fff'))
console.log(hex2rgb('#abc'))
