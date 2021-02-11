function createElement() {

}

function createDom(fiber) {
	const dom =
		fiber.type === 'Text_ELEMENT'
			? document.createTextNode('')
			: document.createElement(fiber.type)
	
	const isProperty = key => key !== 'children'
	Object.keys(fiber.props)
		.filter(isProperty)
		.forEach(name => {
			dom[name] = fiber.props[name]
		})
	return dom
}
let nextUnitOfWork = null
let wipRoot = null

function render(element,container) {
	wipRoot = {
		dom: container,
		props: {
			children: [element]
		}
	}
	nextUnitOfWork = wipRoot
}

function workLoop(deadline) {
	let shouldYield = false
	while (nextUnitOfWork && !shouldYield) {
		nextUnitOfWork = performUnitWork(nextUnitOfWork)
		shouldYield = deadline.timeRemaining() < 1
	}
	requestIdleCallback(workLoop())
}

function performUnitWork(fiber) {
	if(!fiber.dom) {
		fiber.dom = createDom(fiber)
	}
	if(fiber.parent) {
		fiber.parent.dom.appendChild(fiber.dom)
	}
	
	const elements = fiber.props.children
	
	let index = 0
	let prevSibling = null
	
	while (index < elements.length) {
		const element = elements[index]
		
		const newFiber = {
			type: element.type,
			props: elements.props,
			parent: fiber,
			dom: null
		}
		
		if (index === 0) {
			fiber.child = newFiber
		} else {
			prevSibling.sibling = newFiber
		}
		
		prevSibling = newFiber
		index++
	}
	
	if(fiber.child) {
		return fiber.child
	}
	
	let nextFiber = fiber
	while (nextFiber) {
		if(nextFiber.sibling) {
			return  nextFiber.sibling
		}
		nextFiber = nextFiber.parent
	}
}

function commitRoot() {
	commitWork(wipRoot.child)
	wipRoot = null
}


function commitWork(fiber) {
	if (!fiber) {
		return
	}
	const domParent = fiber.parent.dom
	domParent.appendChild(fiber.dom)
	commitWork(fiber.child)
	commitWork(fiber.sibling)
}
