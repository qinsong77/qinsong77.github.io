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
