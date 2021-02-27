---
title: 继承
---

## 1、原型链继承
> 构造函数、原型和实例之间的关系：每个构造函数都有一个原型对象（prototype），原型对象都包含一个指向构造函数的指针（constructor ），而实例都包含一个原型对象的指针（[[prototype]]属性，可以通过_proto_获取）。
>继承的本质就是复制，即重写原型对象，代之以一个新类型的实例。

```javascript
function SuperType() {
    this.property = true;
}

SuperType.prototype.getSuperValue = function() {
    return this.property;
}

function SubType() {
    this.subproperty = false;
}

// 这里是关键，创建SuperType的实例，并将该实例赋值给SubType.prototype
SubType.prototype = new SuperType(); 

SubType.prototype.getSubValue = function() {
    return this.subproperty;
}

var instance = new SubType();
console.log(instance.getSuperValue()); // true

```
> 原型链方案存在的缺点：多个实例对引用类型的操作会被篡改。

```javascript
function SuperType(){
  this.colors = ["red", "blue", "green"];
}
function SubType(){}

SubType.prototype = new SuperType();

var instance1 = new SubType();
instance1.colors.push("black");
alert(instance1.colors); //"red,blue,green,black"

var instance2 = new SubType(); 
alert(instance2.colors); //"red,blue,green,black"

```
## 2、借用构造函数继承
> 使用父类的构造函数来增强子类实例，等同于复制父类的实例给子类（不使用原型）
```javascript
function  SuperType(){
    this.color=["red","green","blue"];
}
function  SubType(){
    //继承自SuperType
    SuperType.call(this);
}
var instance1 = new SubType();
instance1.color.push("black");
alert(instance1.color);//"red,green,blue,black"

var instance2 = new SubType();
alert(instance2.color);//"red,green,blue"

```
>核心代码是SuperType.call(this)，创建子类实例时调用SuperType构造函数，于是SubType的每个实例都会将SuperType中的属性复制一份。
##### 缺点：

- 只能继承父类的实例属性和方法，不能继承原型属性/方法
- 无法实现复用，每个子类都有父类实例函数的副本，影响性能

## 3、组合继承
> 组合上述两种方法就是组合继承。用原型链实现对原型属性和方法的继承，用借用构造函数技术来实现实例属性的继承。
```javascript
function SuperType(name){
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function(){
  alert(this.name);
};

function SubType(name, age){
  // 继承属性
  // 第二次调用SuperType()
  SuperType.call(this, name);
  this.age = age;
}

// 继承方法
// 构建原型链
// 第一次调用SuperType()
SubType.prototype = new SuperType(); 
// 重写SubType.prototype的constructor属性，指向自己的构造函数SubType
SubType.prototype.constructor = SubType; 
SubType.prototype.sayAge = function(){
    alert(this.age);
};

var instance1 = new SubType("Nicholas", 29);
instance1.colors.push("black");
alert(instance1.colors); //"red,blue,green,black"
instance1.sayName(); //"Nicholas";
instance1.sayAge(); //29

var instance2 = new SubType("Greg", 27);
alert(instance2.colors); //"red,blue,green"
instance2.sayName(); //"Greg";
instance2.sayAge(); //27

```

##### 缺点：

- 第一次调用SuperType()：给SubType.prototype写入两个属性name，color。
- 第二次调用SuperType()：给instance1写入两个属性name，color。
>实例对象instance1上的两个属性就屏蔽了其原型对象SubType.prototype的两个同名属性。所以，组合模式的缺点就是在使用子类创建实例对象时，其原型中会存在两份相同的属性/方法。

## 4、原型式继承
>利用一个空对象作为中介，将某个对象直接赋值给空对象构造函数的原型。
```javascript

function object (obj) {
	function F () {
	}
	
	F.prototype = obj
	return new F ()
}

```
object()对传入其中的对象执行了一次浅复制，将构造函数F的原型直接指向传入的对象。

```javascript
var person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"]
};

var anotherPerson = object(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");

var yetAnotherPerson = object(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");

alert(person.friends);   //"Shelby,Court,Van,Rob,Barbie"

```
##### 缺点：

- 原型链继承多个实例的引用类型属性指向相同，存在篡改的可能。
- 无法传递参数
>另外，ES5中存在Object.create()的方法，能够代替上面的object方法。


## 5、寄生式继承
>核心：在原型式继承的基础上，增强对象，返回构造函数
```javascript

function createAnother(original){
  var clone = new Object(original); // 通过调用 object() 函数创建一个新对象
  clone.sayHi = function(){  // 以某种方式来增强对象
    alert("hi");
  };
  return clone; // 返回这个对象
}


```
函数的主要作用是为构造函数新增属性和方法，以增强函数

```javascript
var person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"]
};
var anotherPerson = createAnother(person);
anotherPerson.sayHi(); //"hi"


```
##### 缺点（同原型式继承）：：

- 原型链继承多个实例的引用类型属性指向相同，存在篡改的可能。
- 无法传递参数

## 6、寄生组合式继承
>结合借用构造函数传递参数和寄生模式实现继承
```javascript

// 本质 本质在于 subType.prototype.__proto === superType.prototype;
function inheritPrototype(subType, superType){
  var prototype = Object.create(superType.prototype); // 创建对象，创建父类原型的一个副本
  prototype.constructor = subType;                    // 增强对象，弥补因重写原型而失去的默认的constructor 属性
  subType.prototype = prototype;                      // 指定对象，将新创建的对象赋值给子类的原型
}

// 父类初始化实例属性和原型属性
function SuperType(name){
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function(){
  alert(this.name);
};

// 借用构造函数传递增强子类实例属性（支持传参和避免篡改）
function SubType(name, age){
  SuperType.call(this, name);
  this.age = age;
}

// 将父类原型指向子类
inheritPrototype(SubType, SuperType);
// 其实就是这样
SubType.prototype = Object.create(SuperType.prototype)
SubType.prototype.constructor = SubType



// 新增子类原型属性
SubType.prototype.sayAge = function(){
  alert(this.age);
}

var instance1 = new SubType("xyc", 23);
var instance2 = new SubType("lxy", 23);

instance1.colors.push("2"); // ["red", "blue", "green", "2"]
instance1.colors.push("3"); // ["red", "blue", "green", "3"]


```
> 这个例子的高效率体现在它只调用了一次SuperType 构造函数，并且因此避免了在SubType.prototype 上创建不必要的、多余的属性。于此同时，原型链还能保持不变；因此，还能够正常使用instanceof 和isPrototypeOf()
  这是最成熟的方法，也是现在库实现的方法

```javascript
var person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"]
};
var anotherPerson = createAnother(person);
anotherPerson.sayHi(); //"hi"


```
##### 缺点：

- 子类想要在原型上添加方法，必须在继承之后添加，否则将覆盖掉原有原型上的方法。这样的话 若是已经存在的两个类，就不好办了。

## 7、混入方式继承多个对象
```javascript

function MyClass() {
     SuperClass.call(this);
     OtherSuperClass.call(this);
}

// 继承一个类
MyClass.prototype = Object.create(SuperClass.prototype);
// 混合其它
Object.assign(MyClass.prototype, OtherSuperClass.prototype);
// 重新指定constructor
MyClass.prototype.constructor = MyClass;

MyClass.prototype.myMethod = function() {
     // do something
};

```
> Object.assign会把 OtherSuperClass原型上的函数拷贝到 MyClass原型上，使 MyClass 的所有实例都可用 OtherSuperClass 的方法。


## 8、ES6类继承extends
>extends关键字主要用于类声明或者类表达式中，以创建一个类，该类是另一个类的子类。其中constructor表示构造函数，一个类中只能有一个构造函数，有多个会报出SyntaxError错误,如果没有显式指定构造方法，则会添加默认的 constructor方法，使用例子如下。
```javascript
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
```
> extends继承的核心代码如下，其实现和上述的寄生组合式继承方式一样

```javascript
function _inherits(subType, superType) {
  
    // 创建对象，创建父类原型的一个副本
    // 增强对象，弥补因重写原型而失去的默认的constructor 属性
    // 指定对象，将新创建的对象赋值给子类的原型
    // 完成了下面2件事情
    // subType.__proto__ === superType;
    // subType.prototype.__proto__ === superType.prototype;
    subType.prototype = Object.create(superType && superType.prototype, {
        constructor: {
            value: subType,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    
    if (superType) {
        Object.setPrototypeOf 
            ? Object.setPrototypeOf(subType, superType) 
            : subType.__proto__ = superType;
    }
}
```

#### 静态方法和静态属性
```javascript
class Parent {
	constructor(name) {
		this.name = name
	}
	static sum = 0
	static func() {
		return this.sum
	}
}

class Child extends Parent {}

console.log(Parent.func()) // 0
console.log(Child.func()) // 0
```
![](./image/es6_extend.png)

#### super
1. super作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次super函数。只能在`constructor`中第一行调用.
2. super作为对象时，在普通方法中，**指向父类的原型对象**；**在静态方法中，指向父类**。ES6 规定，在子类普通方法中通过super调用父类的方法时，**方法内部的this指向当前的子类实例**。由于this指向子类实例，所以如果通过super对某个属性赋值，这时super就是this，赋值的属性会变成子类实例的属性。
```javascript
class A {
  constructor() {
    this.x = 1;
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;
    console.log(super.x); // undefined
    console.log(this.x); // 3
  }
}

let b = new B();
```

#### extends
Class 作为构造函数的语法糖，同时有`prototype`属性和`__proto__`属性，因此同时存在两条继承链。
1. 子类的`__proto__`属性，表示构造函数的继承，总是指向父类。
2. 子类`prototype`属性的`__proto__`属性，表示方法的继承，总是指向父类的`prototype`属性。
```javascript
class A {
}

class B extends A {
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```


## 总结
1、 函数声明和类声明的区别 
函数声明会提升，类声明不会。首先需要声明你的类，然后访问它，否则像下面的代码会抛出一个ReferenceError。

```javascript
let p = new Rectangle(); 
// ReferenceError

class Rectangle {}

```

2、 ES5继承和ES6继承的区别 
- ES5的继承实质上是先创建子类的实例对象，然后再将父类的构造方法添加到this上（`Parent.call(this)`）.
- ES6的继承有所不同，实质上是先创建父类的实例对象this，然后再用子类的构造函数修改this。因为子类没有自己的this对象，所以必须先调用父类的super()方法，否则新建实例报错。
- ES6类必须使用new调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用new也可以执行。
- ES6类的所有实例共享一个原型对象。
- ES6类的内部，默认就是[严格模式](http://www.ruanyifeng.com/blog/2013/01/javascript_strict_mode.html)，所以不需要使用`use strict`指定运行模式。

### es6继承步骤解析

```javascript
class Point {
    constructor(x, y){
        this.x = x
        this.y = y
    }

    toString(){
        return '(' + this.x + ', ' + this.y + ')'
    }
}

class ColorPoint extends Point {
    constructor(x, y, color){
        super(x, y) // 调用父类的constructor(x, y)
        this.color = color
    }

    toString(){
        return this.color + ' ' + super.toString()
    }
}
```

babel 转译后
```javascript
var ColorPoint =
    /*#__PURE__*/
    function(_Point){
        _inherits(ColorPoint, _Point)

        function ColorPoint(x, y, color){
            var _this

            _classCallCheck(this, ColorPoint)

            _this = _possibleConstructorReturn(this, _getPrototypeOf(ColorPoint).call(this, x, y)) // 调用父类的constructor(x, y)

            _this.color = color
            return _this
        }

        _createClass(ColorPoint, [{
            key: 'toString',
            value: function toString(){
                return this.color + ' ' + _get(_getPrototypeOf(ColorPoint.prototype), 'toString', this).call(this)
            }
        }])

        return ColorPoint
    }(Point)
```
如上是经过babel转译后的代码，有几个关键点：

#### 一、 _inherits()
```javascript
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(obj, proto) {
  obj.__proto__ = proto
  return obj
}
```
首先完成`extends`对象的校验，必须是`function` 或者`null`，否则报错。其次完成以下事情：
```javascript
ColorPoint.__proto__ = Point
ColorPoint.prototype.__proto__ = Point.prototype
```
####  二、 `ColorPoint` 构造函数中 `_classCallCheck()`， `_possibleConstructorReturn()`

```javascript
function _classCallCheck(instance, Constructor) {
		if (!_instanceof(instance, Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}
```
主要是用来检测构造函数不能直接调用，必须是通过`new`的方式来调用。
```javascript
function _possibleConstructorReturn(self, call){
		if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
			return call
		}
		return _assertThisInitialized(self)
	}
```

调用父类的构造函数，初始化一些实例属性，并将`this`返回。使用该返回的`this`赋值给子类的`this`对象，子类通过这一步返回的`this`对象，再该基础之上在添加一些实例属性。

这就是最大的不同之处。如果不经历这一步，子类没有`this`对象，一旦操作一个不存在的`this`对象就会报错。

#### 三、 `_createClass()`
最后一步完成原型属性与静态属性的挂载，如果是原型属性，挂在在`constructor`上的`prototype`上，如果是静态属性或者静态方法，则挂在`constructor` 上。
```javascript
function _createClass(Constructor, protoProps, staticProps){
		if (protoProps) _defineProperties(Constructor.prototype, protoProps)
		if (staticProps) _defineProperties(Constructor, staticProps)
		return Constructor
	}
```
