const initialState  = {
	count: 0
}

function reducer(state = initialState, action) {
	switch (action.type) {
		case 'add':
			return {
				...state,
				count: state.count + action.payload
			}
		case 'subtract':
			return {
				...state,
				count: state.count - action.payload
			}
		default:
			return initialState
	}
}

 const createStore = (reducer) => {
	let currentState = {}
	let observers = []
	function getState() {
		return currentState
	}

	function dispatch(action) {
		currentState = reducer(currentState, action)
		observers.forEach(fn => fn())
	}

	 dispatch({ type: '@@REDUX_INIT' })  //初始化store数据

	function subscribe(fn) {
		observers.push(fn)
	}

	return { getState, subscribe, dispatch }
}
const store = createStore(reducer)  //创建store
store.subscribe(() => { console.log('组件1收到store的通知') })
store.subscribe(() => { console.log('组件2收到store的通知') })
store.dispatch({ type: 'add', payload: 12 })    //执行加法操作,给count加1
console.log(store.getState())       //获取state
function ListNode(val, next) {
	this.val = (val===undefined ? 0 : val)
	   this.next = (next===undefined ? null : next)
		}

		let arr = [4,2,1,3]
let head = arr.reduceRight((prev, curr) => {
		return new ListNode(curr, prev)
}, new ListNode(arr[0]))
console.log(head)
var sortList = function(head) {
	if(head === null) return null
	let newHead = new ListNode(head.val)
	while(head.next) {
		let node = head.next
		let temp = newHead
		let prev = null
		while(temp && temp.val < node.val) {
			temp = temp.next
			prev = temp
		}
		if(prev) {
			prev.next = new ListNode(node.val, temp)
		} else {
			newHead = new ListNode(node.val, temp)
		}
		head = head.next
	}

	return newHead
};
console.log(sortList(head))

// class Observer {
//
// }
//
// class Subscribe {
// 	constructor() {
// 		this.obs = []
// 	}
// 	addListener (ob) {
// 		this.obs.push(ob)
// 	}
// 	notify() {
// 		this.obs.forEach(ob => ob.fn())
// 	}
// }
