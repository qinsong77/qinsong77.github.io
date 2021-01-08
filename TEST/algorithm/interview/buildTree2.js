const data = [
	{ id: 1001, parentId: 0, name: 'AA' },
	{ id: 1002, parentId: 1001, name: 'BB' },
	{ id: 1003, parentId: 1001, name: 'CC' },
	{ id: 1004, parentId: 1003, name: 'DD' },
	{ id: 1005, parentId: 1003, name: 'EE' },
	{ id: 1006, parentId: 1002, name: 'FF' },
	{ id: 1007, parentId: 1002, name: 'GG' },
	{ id: 1008, parentId: 1004, name: 'HH' },
	{ id: 1009, parentId: 1005, name: 'II' },
	{ id: 1011, parentId: 101, name: '444' },
	{ id: 10108, parentId: 10109, name: 'tt' },
	{ id: 10109, parentId: 10015, name: 'JJ' },
	{ id: 101, parentId: 10108, name: '333' },
];

function buildTree (data) {
	const result = []
	const dataMap = new Map()
	data.forEach(item => dataMap.set(item.id, item))
	data.forEach(item => {
		const { parentId } = item
		const parentNode = dataMap.get(parentId)
		if (parentNode) {
			parentNode.Children = parentNode.Children || []
			parentNode.Children.push(item)
		} else {
			result.push(item)
		}
	})
	return result
}

const print = (arr,space = 0) =>  {
	arr.forEach(node => {
		console.log('  '.repeat(space) + node.name + ' \n ')
		if (node.Children) {
			print(node.Children, space + 2)
		}
	})
}
print(buildTree(data), 0)
