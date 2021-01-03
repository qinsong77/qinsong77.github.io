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
