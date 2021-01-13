let singleton = (function(){
	function Single(){
		this.name = 'singleton'
	}
	let instance = null
	return function getInstance(){
		if (!instance) {
			instance = new Single()
		}
		return instance
	}
})()

console.log(singleton() === singleton())
