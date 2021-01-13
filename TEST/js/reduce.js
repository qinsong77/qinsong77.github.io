const arr = [
	{name: 'Tom', point: 4},
	{name: 'Jack', point: 7},
	{name: 'Nile', point: 3},
]

let max = arr.reduce(((previousValue, currentValue) => previousValue.point > currentValue.point ? previousValue : currentValue))
console.log(max)

