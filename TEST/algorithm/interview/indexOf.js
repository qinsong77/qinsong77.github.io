function indexOf(a, b){
	let result = -1, flag = false, count = 0
	for (let i = 0; i < a.length; i++) {
		if (flag) {
			if (count === b.length) return i - count
			if (a[i] === b[count]) {
				count++
			} else {
				flag = false
				i = i - count + 1
				count = 0
			}
		} else {
			if (a[i] === b[count]) {
				flag = true
				count++
			} else {
				flag = false
				count = 0
			}
		}
	}
	return result
}

console.log(indexOf('0121abv1', 'abv') === '0121abv1'.indexOf('abv'))

String.prototype.myIndexOf = function(str){
	var sourceArr = this.split('')
	var num = -1
	for (var i in sourceArr) {
		if (sourceArr[i] === str.slice(0, 1)) {
			if (str === this.slice(i, Number(i) + str.length)) {
				num = i
			}
		}
	}
	return num
}
