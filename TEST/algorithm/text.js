function twoSum(arr, target) {
	let i = 0
	while (i < arr.length) {
		const v = arr[i++]
		const findIndex = arr.indexOf(target - v, i)
		if (findIndex !== -1) return [i--, findIndex]
	}
	return [0, 0]
}
function ListNode(val, next) {
     this.val = (val===undefined ? 0 : val)
     this.next = (next===undefined ? null : next)
}
let start = new ListNode(1, new ListNode(2))

function reverseNode (start, end) {
	let prev = null
	let newEnd = start
	while(prev!== end) {
		let temp = start.next
		start.next = prev
		prev = start
		start = temp
	}
	return [prev, newEnd]
}
var reverseKGroup = function(head, k) {
	let count = 0
	let start = null
	let end = null
	let lastNode = null
	let curr = head
	let res = null
	while(curr) {
		if(count === 0) {
			start = curr
		} else if(count === k-1) {
			end = curr
			let next = curr.next
			const [newStart, newEnd] = reverseNode(start, end)
			curr.next = next
			if(lastNode) {
				lastNode.next = newStart
			} else {
				res = newStart
			}
			lastNode = newEnd
			count = -1
		} else {
			if(curr.next === null) {
				lastNode.next = start
				break
			}
		}
		curr = curr.next
		count++
	}
	return res
};

console.log(reverseKGroup(start, 2))
