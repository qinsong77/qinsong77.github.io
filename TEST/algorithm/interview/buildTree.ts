interface TreeNode extends Record<string, any> {
	id: number;
	parentId: number;
	name: string;
	Children?: TreeNode [];
}

function printTree(list: TreeNode[]): void {
	// 请实现此方法
	let result:TreeNode [] = []
	let addNodeSet = new Set()
	list.forEach(node => {
		const { id, parentId } = node
		if (!addNodeSet.has(id)) {
			// 找到父节点
			const parent = list.find(v => v.id === parentId)
			if (parent) {
				if (addNodeSet.has(parent.id)) { // 如果已经添加了父节点
					// 这里需要递归操作，找出父节点
					const findResultParent:(arr: TreeNode[], id: number) => TreeNode  = function (arr: TreeNode[], id: number) {
						let reNode: TreeNode
						for (let i = 0; i < arr.length; i++) {
							if (arr[i].id === id) {
								reNode = arr[i]
								break
							} else {
								let re = findResultParent(arr[i].Children, id)
								if (re) {
									reNode = re
									return reNode
								}
							}
						}
						return reNode
					}
					
					const parentNode = findResultParent(result, parent.id)
					if (!parentNode.Children) {
						parentNode.Children = []
					}
					parentNode.Children.push(Object.assign({Children: []}, node))
					addNodeSet.add(id)
				} else {
					addNodeSet.add(parent.id)
					addNodeSet.add(id)
					result.push(Object.assign({Children: [node]}, node))
				}
			} else {
				addNodeSet.add(id)
				result.push(Object.assign({Children: []}, node))
			}
		}
	})
	
	const print :(arr: TreeNode[], space: number) => void = function(arr: TreeNode[], space: number = 0) {
		arr.forEach(node => {
			console.log('  '.repeat(space) + node.name + ' \n ')
			if (node.Children) {
				print(node.Children, space + 2)
			}
		})
	}
	print(result, 0)
}

//============= 测试代码 ==============
const list: TreeNode[] = [
	{ id: 1001, parentId: 0, name: 'AA' },
	{ id: 1002, parentId: 1001, name: 'BB' },
	{ id: 1003, parentId: 1001, name: 'CC' },
	{ id: 1004, parentId: 1003, name: 'DD' },
	{ id: 1005, parentId: 1003, name: 'EE' },
	{ id: 1006, parentId: 1002, name: 'FF' },
	{ id: 1007, parentId: 1002, name: 'GG' },
	{ id: 1008, parentId: 1004, name: 'HH' },
	{ id: 1009, parentId: 1005, name: 'II' },
];

printTree(list);
