class Rectangle {
	static value = 'static'
	// constructor
	constructor(height, width) {
		this.height = height;
		this.width = width;
	}
	
	// Getter
	get area() {
		return this.calcArea()
	}
	
	// Method
	calcArea() {
		return this.height * this.width;
	}
}

const rectangle = new Rectangle(10, 20);
console.log(rectangle.area);
// 输出 200

// 继承
class Square extends Rectangle {
	
	constructor(length) {
		super(length, length);
		
		// 如果子类中存在构造函数，则需要在使用“this”之前首先调用 super()。
		this.name = 'Square';
	}
	
	get area() {
		return this.height * this.width;
	}
}

const square = new Square(10);
console.log(square.area);
// 输出 100
Square.__proto__ === Rectangle // true  继承属性
Square.prototype.__proto__ === Rectangle.prototype // true 继承方法

console.log(Object.getPrototypeOf(square) === Square.prototype) // true
console.log(Object.getPrototypeOf(Square.prototype) === Rectangle.prototype) //true
console.log(Square.value) // 'static'
console.log(square.value) // undefined

