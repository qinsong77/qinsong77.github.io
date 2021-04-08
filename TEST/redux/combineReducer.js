let nextTodoId = 0
const addTodo = text => ({
	type: 'ADD_TODO',
	id: nextTodoId++,
	text
})

const setVisibilityFilter = filter => ({
	type: 'SET_VISIBILITY_FILTER',
	filter
})

const toggleTodo = id => ({
	type: 'TOGGLE_TODO',
	id
})

const VisibilityFilters = {
	SHOW_ALL: 'SHOW_ALL',
	SHOW_COMPLETED: 'SHOW_COMPLETED',
	SHOW_ACTIVE: 'SHOW_ACTIVE'
}

const visibilityFilter = (state = VisibilityFilters.SHOW_ALL, action) => {
	switch (action.type) {
		case 'SET_VISIBILITY_FILTER':
			return action.filter
		default:
			return state
	}
}

const todos = (state = [], action) => {
	switch (action.type) {
		case 'ADD_TODO':
			return [
				...state,
				{
					id: action.id,
					text: action.text,
					completed: false
				}
			]
		case 'TOGGLE_TODO':
			return state.map(todo =>
				(todo.id === action.id)
					? {...todo, completed: !todo.completed}
					: todo
			)
		default:
			return state
	}
}

const createStore = (reducer) => {
	let state;
	let listeners = [];
	
	const getState = () => state;
	
	const dispatch = (action) => {
		state = reducer(state, action);
		listeners.forEach(listener => listener());
	};
	
	const subscribe = (listener) => {
		listeners.push(listener);
		return () => {
			listeners = listeners.filter(l => l !== listener);
		}
	};
	
	dispatch({});
	
	return { getState, dispatch, subscribe };
};

const combineReducers = reducers => {
	return (state = {}, action) => {
		return Object.keys(reducers).reduce(
			(nextState, key) => {
				console.log(key)
				console.log(action)
				nextState[key] = reducers[key](state[key], action);
				// console.log(nextState)
				return nextState;
			},
			{}
		);
	};
};

const rootReducer = combineReducers({
	todos,
	visibilityFilter
})

// console.log(rootReducer.toString())
const { getState, dispatch, subscribe } = createStore(rootReducer)
// console.log(getState())
dispatch(addTodo('121'))
console.log(getState())

function combineReducers2(reducers) {
	var reducerKeys = Object.keys(reducers);
	var finalReducers = {};
	for (var i = 0; i < reducerKeys.length; i++) {
		var key = reducerKeys[i];
		if (process.env.NODE_ENV !== 'production') {
			if (typeof  reducers[key] === 'undefined') {
				warning("No reducer provided for key \"" + key + "\"");
			}
		}
		if (typeof  reducers[key] === 'function') {
			finalReducers[key] = reducers[key];
		}
	}
	var finalReducerKeys = Object.keys(finalReducers);
	var unexpectedKeyCache;
	if (process.env.NODE_ENV !== 'production') {
		unexpectedKeyCache = {};
	}
	var shapeAssertionError;
	try {
		assertReducerShape(finalReducers);
	} catch (e) {
		shapeAssertionError = e;
	}
	return function combination(state, action) {
		if (state === void  0) {
			state = {};
		}
		if (shapeAssertionError) {
			throw shapeAssertionError;
		}
		if (process.env.NODE_ENV !== 'production') {
			var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
			if (warningMessage) {
				warning(warningMessage);
			}
		}
		var hasChanged = false;
		var nextState = {};
		for (var _i = 0; _i < finalReducerKeys.length; _i++) {
			var _key = finalReducerKeys[_i];
			var reducer = finalReducers[_key];
			var previousStateForKey = state[_key];
			var nextStateForKey = reducer(previousStateForKey, action);
			if (typeof  nextStateForKey === 'undefined') {
				var errorMessage = getUndefinedStateErrorMessage(_key, action);
				throw new Error(errorMessage);
			}
			nextState[_key] = nextStateForKey;
			hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
		}
		hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
		return hasChanged ? nextState : state;
	};
}
