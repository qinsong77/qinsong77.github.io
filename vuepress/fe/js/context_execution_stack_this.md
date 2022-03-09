---
title: 执行上下文、执行栈、this
---
## 执行上下文
相关文章

- [解密 JavaScript 执行上下文](https://juejin.cn/post/6844903847513554952)
- [[译]理解 JavaScript 中的执行上下文和执行栈](https://juejin.cn/post/6844903682283143181)

### 什么是执行上下文？

简而言之，执行上下文是评估和执行 JavaScript 代码的环境的抽象概念。每当 Javascript 代码在运行的时候，它都是在执行上下文中运行。

### 执行上下文的类型
浏览器执行JS函数其实是分两个过程的。一个是创建阶段Creation Phase,一个是执行阶段Execution Phase。
当执行 JS 代码时，会产生三种执行上下文。

- 全局执行上下文 — 这是默认或者说基础的上下文，任何不在函数内部的代码都在全局上下文中。它会执行两件事：创建一个全局的 window 对象（浏览器的情况下），并且设置 this 的值等于这个全局对象。一个程序中只会有一个全局执行上下文。
- 函数执行上下文 — 每当一个函数被调用时, 都会为该函数创建一个新的上下文。每个函数都有它自己的执行上下文，不过是在函数被调用时创建的。函数上下文可以有任意多个。每当一个新的执行上下文被创建，它会按定义的顺序（将在后文讨论）执行一系列步骤。
- eval 执行上下文 — 执行在 eval 函数内部的代码也会有它属于自己的执行上下文，不常用，不做表述。


### ES3 执行上下文的内容

执行上下文是一个抽象的概念，我们可以将它理解为一个 object ，一个执行上下文里包括以下内容：

- 变量对象（VO），包含变量、函数声明和函数的形参，该属性只能在全局上下文中访问;
- 活动对象 AO;
- 作用域链（JS 采用词法作用域，也就是说变量的作用域是在定义时就决定了）
- 调用者信息this

```javascript
var a = 10
function foo(i) {
  var b = 20
}
foo()
```

对于上述代码，执行栈中有两个上下文：全局上下文和函数 `foo` 上下文。

```javascript
stack = [
    globalContext,
    fooContext
]
```

对于全局上下文来说，VO 大概是这样的

```javascript
globalContext.VO === globe
globalContext.VO = {
    a: undefined,
	foo: [Function],
}
```

对于函数 `foo` 来说，VO 不能访问，只能访问到活动对象（AO）

```javascript
fooContext.VO === foo.AO
fooContext.AO {
    i: undefined,
	b: undefined,
    arguments: []
}
// arguments 是函数独有的对象(箭头函数没有)
// 该对象是一个伪数组，有 `length` 属性且可以通过下标访问元素
// 该对象中的 `callee` 属性代表函数本身
// `caller` 属性代表函数的调用者
```

对于作用域链，可以把它理解成包含自身变量对象和上级变量对象的列表，通过 `[[Scope]]` 属性查找上级变量

```javascript
fooContext.[[Scope]] = [
    globalContext.VO
]
fooContext.Scope = fooContext.[[Scope]] + fooContext.VO
fooContext.Scope = [
    fooContext.VO,
    globalContext.VO
]
```

接下来让我们看一个老生常谈的例子，`var`

```javascript
b() // call b
console.log(a) // undefined

var a = 'Hello world'

function b() {
	console.log('call b')
}
```

想必以上的输出大家肯定都已经明白了，这是因为函数和变量提升的原因。通常提升的解释是说将声明的代码移动到了顶部，这其实没有什么错误，便于大家理解。但是更准确的解释应该是：在生成执行上下文时，会有两个阶段。第一个阶段是创建的阶段（具体步骤是创建 VO），JS 解释器会找出需要提升的变量和函数，并且给他们提前在内存中开辟好空间，函数的话会将整个函数存入内存中，变量只声明并且赋值为 undefined，所以在第二个阶段，也就是代码执行阶段，我们可以直接提前使用。

在提升的过程中，相同的函数会覆盖上一个函数，并且函数优先于变量提升

```javascript
b() // call b second

function b() {
	console.log('call b fist')
}
function b() {
	console.log('call b second')
}
var b = 'Hello world'
```

`var` 会产生很多错误，所以在 ES6中引入了 `let`。`let` 不能在声明前使用，但是这并不是常说的 `let` 不会提升，`let` 提升了声明但没有赋值，因为临时死区导致了并不能在声明前使用。

对于非匿名的立即执行函数需要注意以下一点

```javascript
var foo = 1
(function foo() {
    foo = 10
    console.log(foo)
}()) // -> ƒ foo() { foo = 10 ; console.log(foo) }
```

因为当 JS 解释器在遇到非匿名的立即执行函数时，会创建一个辅助的特定对象，然后将函数名称作为这个对象的属性，因此函数内部才可以访问到 `foo`，但是这个值又是只读的，所以对它的赋值并不生效，所以打印的结果还是这个函数，并且外部的值也没有发生更改。

 ```javascript
specialObject = {};

Scope = specialObject + Scope;

foo = new FunctionExpression;
foo.[[Scope]] = Scope;
specialObject.foo = foo; // {DontDelete}, {ReadOnly}

delete Scope[0]; // remove specialObject from the front of scope chain
 ```

## ES5中的执行上下文

ES5 规范又对 ES3 中执行上下文的部分概念做了调整，最主要的调整，就是去除了 ES3 中变量对象和活动对象，以 词法环境组件（ LexicalEnvironment component） 和 变量环境组件（ VariableEnvironment component） 替代。

### 怎么创建执行上下文？

创建执行上下文有两个阶段：1) 创建阶段 和 2) 执行阶段。

#### The Creation Phase
在 JavaScript 代码执行前，执行上下文将经历创建阶段。在创建阶段会发生三件事：

1. this 值的决定，即我们所熟知的 This 绑定。
2. 创建词法环境组件。
3. 创建变量环境组件。
所以执行上下文在概念上表示如下：

```javascript
ExecutionContext = {
  ThisBinding = [this value],
  LexicalEnvironment = { ... },
  VariableEnvironment = { ... },
}
```

##### This 绑定：

在全局执行上下文中，`this` 的值指向全局对象。(在浏览器中，`this`引用 `Window` 对象)。

在函数执行上下文中，`this` 的值取决于该函数是如何被调用的。如果它被一个引用对象调用，那么 `this` 会被设置成那个对象，否则 `this` 的值被设置为全局对象或者 `undefined`（在严格模式下）。例如：

```javascript
let foo = {
  baz: function() {
  console.log(this);
  }
}

foo.baz();   // 'this' 引用 'foo', 因为 'baz' 被
             // 对象 'foo' 调用

let bar = foo.baz;

bar();       // 'this' 指向全局 window 对象，因为
             // 没有指定引用对象
```
##### 词法环境
[官方的 ES6](http://ecma-international.org/ecma-262/6.0/) 文档把词法环境定义为
>词法环境是一种规范类型，基于 ECMAScript 代码的词法嵌套结构来定义标识符和具体变量和函数的关联。一个词法环境由环境记录器和一个可能的引用外部词法环境的空值组成。
简单来说词法环境是一种持有标识符—变量映射的结构。（这里的标识符指的是变量/函数的名字，而变量是对实际对象[包含函数类型对象]或原始数据的引用）。

现在，在词法环境的内部有两个组件：(1) 环境记录器和 (2) 一个外部环境的引用。

1. 环境记录器是存储变量和函数声明的实际位置。
2. 外部环境的引用意味着它可以访问其父级词法环境（作用域）。

词法环境有两种类型：

- 全局环境（在全局执行上下文中）是没有外部环境引用的词法环境。全局环境的外部环境引用是 null。它拥有内建的 Object/Array/等、在环境记录器内的原型函数（关联全局对象，比如 window 对象）还有任何用户定义的全局变量，并且 this的值指向全局对象。
- 在函数环境中，函数内部用户定义的变量存储在环境记录器中。并且引用的外部环境可能是全局环境，或者任何包含此内部函数的外部函数。

环境记录器也有两种类型（如上！）：

1. 声明式环境记录器存储变量、函数和参数。
2. 对象环境记录器用来定义出现在全局上下文中的变量和函数的关系。

简而言之，
- 在全局环境中，环境记录器是对象环境记录器。
- 在函数环境中，环境记录器是声明式环境记录器。

注意 — 对于函数环境，声明式环境记录器还包含了一个传递给函数的 arguments 对象（此对象存储索引和参数的映射）和传递给函数的参数的 length。
抽象地讲，词法环境在伪代码中看起来像这样：
```javascript
GlobalExectionContext = {
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 在这里绑定标识符
    }
    outer: [null]
  }
}

FunctionExectionContext = {
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 在这里绑定标识符
    }
    outer: [Global or outer `function` environment reference]
  }
}
```
##### 变量环境：

它同样是一个词法环境，其环境记录器持有变量声明语句在执行上下文中创建的绑定关系。

如上所述，变量环境也是一个词法环境，所以它有着上面定义的词法环境的所有属性。

在 ES6 中，词法环境组件和变量环境的一个不同就是前者被用来存储函数声明和变量（`let` 和 `const`）绑定，而后者只用来存储 `var` 变量绑定。

我们看点样例代码来理解上面的概念：
```javascript
let a = 20;
const b = 30;
var c;

function multiply(e, f) {
 var g = 20;
 return e * f * g;
}

c = multiply(20, 30);
```
执行上下文看起来像这样：

```javascript
GlobalExectionContext = {

  ThisBinding: `<Global Object>`,

  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 在这里绑定标识符
      a: `< uninitialized >`,
      b: `< uninitialized >`,
      multiply: `< func >`
    }
    outer: `<null>`
  },

  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 在这里绑定标识符
      c: undefined,
    }
    outer: `<null>`
  }
}

FunctionExectionContext = {
  ThisBinding: `<Global Object>`,

  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 在这里绑定标识符
      Arguments: {0: 20, 1: 30, length: 2},
    },
    outer: `<GlobalLexicalEnvironment>`
  },

  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 在这里绑定标识符
      g: undefined
    },
    outer: `<GlobalLexicalEnvironment>`
  }
}
```
**注意** — 只有遇到调用函数` multiply` 时，函数执行上下文才会被创建。

可能你已经注意到 `let` 和 `const` 定义的变量并没有关联任何值，但 `var` 定义的变量被设成了 `undefined`。

这是因为在创建阶段时，引擎检查代码找出变量和函数声明，虽然函数声明完全存储在环境中，但是变量最初设置为 `undefined`（`var` 情况下），或者未初始化（`let` 和 `const` 情况下）。

这就是为什么你可以在声明之前访问 `var` 定义的变量（虽然是 `undefined`），但是在声明之前访问 `let` 和 `const` 的变量会得到一个引用错误。

这就是我们说的变量声明提升。


## 执行栈

> 执行栈，也就是在其它编程语言中所说的“调用栈”，是一种拥有 LIFO（后进先出）数据结构的栈，被用来存储代码运行时创建的所有执行上下文。
当 JavaScript 引擎第一次遇到你的脚本时，它会创建一个全局的执行上下文并且压入当前执行栈。每当引擎遇到一个函数调用，它会为该函数创建一个新的执行上下文并压入栈的顶部。

引擎会执行那些执行上下文位于栈顶的函数。当该函数执行结束时，执行上下文从栈中弹出，控制流程到达当前栈中的下一个上下文。

让我们通过下面的代码示例来理解：

```javascript
let a = 'Hello World!';

function first() {
  console.log('Inside first function');
  second();
  console.log('Again inside first function');
}

function second() {
  console.log('Inside second function');
}

first();
console.log('Inside Global Execution Context');

```

![An image](./image/execution_stack.png)

上述代码的执行上下文栈。

当上述代码在浏览器加载时，JavaScript 引擎创建了一个全局执行上下文并把它压入当前执行栈。当遇到 `first()` 函数调用时，JavaScript 引擎为该函数创建一个新的执行上下文并把它压入当前执行栈的顶部。

当从 `first() `函数内部调用 `second()` 函数时，JavaScript 引擎为 `second()` 函数创建了一个新的执行上下文并把它压入当前执行栈的顶部。当 `second()` 函数执行完毕，它的执行上下文会从当前栈弹出，并且控制流程到达下一个执行上下文，即 `first()` 函数的执行上下文。

当 `first()` 执行完毕，它的执行上下文从栈弹出，控制流程到达全局执行上下文。一旦所有代码执行完毕，JavaScript 引擎从当前栈中移除全局执行上下文。


### 执行阶段
这是整篇文章中最简单的部分。在此阶段，完成对所有这些变量的分配，最后执行代码。

**注意** — 在执行阶段，如果 `JavaScript` 引擎不能在源码中声明的实际位置找到 `let` 变量的值，它会被赋值为 `undefined`。

## 结论

1. 执行上下文创建阶段分为绑定this，创建词法环境，变量环境三步，两者区别在于词法环境存放函数声明与const let声明的变量，而变量环境只存储var声明的变量。
2. 词法环境主要由环境记录与外部环境引入记录两个部分组成，全局上下文与函数上下文的外部环境引入记录不一样，全局为null，函数为全局环境或者其它函数环境。环境记录也不一样，全局叫对象环境记录，函数叫声明性环境记录。
3. 应该明白为什么会存在变量提升，函数提升，而let const没有(在 ES6 中，词法环境组件和变量环境的一个不同就是前者被用来存储函数声明和变量（let 和 const）绑定，而后者只用来存储 var 变量绑定。)。
4. ES3之前的变量对象与活动对象的概念在ES5之后由词法环境，变量环境来解释，两者概念不冲突，后者理解更为通俗易懂。

### [this的指向](https://juejin.cn/post/6844904077818609678)
> 在 ES5 中，其实 this 的指向，始终坚持一个原理：this 永远指向最后调用它的那个对象。[文章](https://juejin.im/post/6844903496253177863)


函数中的 this: 在一个函数的执行上下文中， `this` 由该函数的调用者提供，由调用函数的方式来决定其指向 。
如果调用者被某一个对象所拥有，那么在调用该函数时， 内部的 `this` 指向该对象。如果调用者**函数独立调用**，那么该函数内部的 `this` 则指向 `undefined`。但是在非严格模式中，当 this 指向
`undefined` 时，它会自动指向全局对象。

#### 改变 this 的指向的方法
- 使用 ES6 的箭头函数
- 在函数内部使用 _this = this
- 使用 apply、call、bind
- new 实例化一个对象

```javascript
function foo() {
	console.log(this.a)
}
var a = 1
foo() // 1

var obj = {
	a: 2,
	foo: foo
}
obj.foo() // 2

// 以上两者情况 `this` 只依赖于调用函数前的对象，优先级是第二个情况大于第一个情况

// 以下情况是优先级最高的，`this` 只会绑定在 `c` 上，不会被任何方式修改 `this` 指向
var c = new foo()
c.a = 3
console.log(c.a) // 3

function a() {
    return () => {
        return () => {
        	console.log(this)
        }
    }
}
console.log(a()()()) // windows
// 箭头函数其实是没有 this 的，这个函数中的 this 只取决于他外面的第一个不是箭头函数的函数的 this。在这个例子中，因为调用 a 符合前面代码中的第一个情况，所以 this 是 window。并且 this 一旦绑定了上下文，就不会被任何代码改变。
```

```javascript
'use strict';
var a = 20;
function foo () {
    var a = 1;
    var obj = {
        a: 10,
        c: this.a + 20
    }
    return obj.c;
}
console.log(window.foo()); // 40
console.log(foo()); //报错 TypeError
// 非严格模式都是输出40
```
对象字面量的写法并不会产生自己的作用域，因此 obj.c上的`this`属性并不会指向obj ，而是与foo函数内部的this一样。

因此当使用 window.foo()调用时， foo 内部的 this 指向 window 对象，这个时候 this.a 则
能访问到全局的 a 变量。 但是当 foo()独立调用时， foo 内部的 this 指向 undefined，严格模式中，因此并不会转向 window 对象， 此时执行代码会报错，`Uncaught TypeError:
Cannot read property ’ a ’ of undefined` 。
```javascript
var id = 10
var obj = {
  id: 1,
  foo: function(){
    console.log(this.id)
  },
  foo2: () => {
    console.log(this.id)
  }
}
function fn (){ console.log(this) }
var arr = [fn, () => console.log(this)]

var bar = obj.foo
obj.foo() // 1
obj.foo2() // 10
bar() // 10
arr[0]() // arr
arr[1]() // window
```
```javascript
window.data=5
var fo = {
   data:6,
   click() {
   	 console.log(this.data)
   }
}
div.addEventListener('click',foo.click)
// 点击div写出控制台的打印值
// 如何输出5，如何输出6
```
输出`undefined`，在`addEventListener`中指向的是这个div元素，如果绑定事件是onClick，则是指向window
#### 箭头函数

- 箭头函数没有`prototype`；
- 箭头函数是匿名函数，是不能作为构造函数的，不能使用`new`；
- 箭头函数不绑定`arguments`，取而代之用rest参数`(…rest)`解决；
- 箭头函数不能当做`Generator`函数，不能使用`yield`关键字；
- 箭头函数会捕获其所在上下文的 `this` 值，作为自己的 `this` 值，任何方法都改变不了其指向，如`call(),bind(),apply()`，而普通函数的this指向调用它的那个对象。
