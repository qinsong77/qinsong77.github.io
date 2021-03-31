const initialState  = {
	count: 0
}

export default function reducer(state = initialState, action) {
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
