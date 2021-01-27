const useState = function(){
	let state = null
	return function(value){
		state = state || value
		function dispatch(newValue){
			state = newValue
			console.log('render happen')
		}
		return [state, dispatch]
	}
}()


function Demo(){
	const [ counter, setCounter] = useState('0')
	console.log(counter)
	return function(value){
		setCounter(value)
	}
}

const render = Demo()
render(12)
Demo()
Demo()
