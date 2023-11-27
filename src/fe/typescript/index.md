---
title: Typescript
---

- [TypeScript 高级用法](https://juejin.cn/post/6926794697553739784)

### [interface和type的区别](https://www.jianshu.com/p/555e6998af36)
不同点：

- 扩展语法： interface使用extends，type使用‘&’
- 同名合并：interface 支持，type 不支持。
- 描述类型：对象、函数两者都适用，但是 type 可以用于基础类型、联合类型、元祖。
- 计算属性：type 支持计算属性，生成映射类型,；interface 不支持。

相同点：

- 两者都可以用来描述对象或函数的类型
- 两者都可以实现继承
- 总的来说，公共的用 interface 实现，不能用 interface 实现的再用 type 实现。主要是一个项目最好保持一致。

## 泛型
泛型，即为更广泛的约束类型。解决类型不确定时的约束，如array中map的声明，
定义了一个泛型变量`T`。`T`作为泛型变量的含义为：在定义约束条件时，暂时还不知道数组的每一项数据类型到底是什么，因此我们只能放一个占位标识在这里，待具体使用时再来明确每一项的具体类型。
回调函数会返回一个新的数组项，因此需要重新定义一个新的泛型变量来表达这个新数组，即为`U`。
```typescript
interface Array<T> {
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[]
}
```
- 1. 函数中使用泛型
```typescript
// 声明一个泛型变量
function identity<T>() {}

// 在参数中使用泛型变量
function identity<T>(arg: T) {}

// 在返回值中使用泛型变量
function identity<T>(arg: T): T {}

// 变量声明函数的写法
let myIdentity: <T>(arg: T) => T = identity;
```

- 2. 接口中使用泛型
```typescript
// 使用接口约束一部分数据类型，使用泛型变量让剩余部分变得灵活
interface Parseer<T> {
  success: boolean,
  result: T,
  code: number,
  desc: string
}

// 接口泛型与函数泛型结合
interface Array<T> {
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[]
}
```

- 3. class中使用泛型
```typescript
declare namespace demo02 {
  class GenericNumber<T> {
    private value: T;

    public add: (x: T, y: T) => T
  }
}

// 多个泛型变量传入
declare namespace demo02 {
  class Component<P, S> {
    private constructor(props: P);
    public state: S;
  }
}
```

- 4. 泛型实践场景

```typescript
interface Array<T> {
  length: number,
  toString(): string,
  pop(): T | undefined,
  // 注意此处的含义
  push(...items: T[]): number,
  concat(...items: T[]): T[],
  join(separator?: string): string,
  reverse(): T[],
  shift(): T | undefined;
  slice(start?: number, end?: number): T[],
  sort(compareFn?: (a: T, b: T) =>number): this,
  splice(start: number, deleteCount?: number): T[],
  // 注意此处的重载写法
  splice(start: number, deleteCount: number, ...items: T[]): T[],
  unshift(...items: T[]): number,
  indexOf(searchElement: T, fromIndex?: number): number,
  lastIndexOf(searchElement: T, fromIndex?: number): number,
  every(callbackfn: (value: T, index: number, array: T[]) =>boolean, thisArg?: any): boolean,
  some(callbackfn: (value: T, index: number, array: T[]) =>boolean, thisArg?: any): boolean,
  forEach(callbackfn: (value: T, index: number, array: T[]) =>void, thisArg?: any): void,
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[],
  filter<S extends T>(callbackfn: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[],
  filter(callbackfn: (value: T, index: number, array: T[]) => any, thisArg?: any): T[],
  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T,
  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T,
  reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U,
  // reduceRight 略
  // 索引调用
  [n: number]: T,
}
```

- 5. 描述数据返回结果
约定所有的接口返回满足统一的数据格式。但是具体的可用的数据结果则因为情况不同，会有不同的场景。因此使用泛型先定义一个基本的结构约束。

```typescript
interface Result<T> {
  success: true,
  code: number,
  description: string,
  result: T
}
```

结合Promise，当数据返回结果为number时
> Promise本身就需要接受一个泛型变量，因此这里要注意泛型的嵌套使用
```typescript
function fetchData(): Promise<Result<number>> {
  return http.get('/api/demo/number');
}
```

当数据返回结果为普通JSON数据时
```typescript
interface Person {
  name: string,
  age: number
}

function fetchData(): Promise<Result<Person>> {
  return http.get('/api/demo/person');
}
```
当数据返回为数组时
```typescript
interface Person {
  name: string,
  age: number
}

function fetchData(): Promise<Result<Person[]>> {
  return http.get('/api/demo/person');
}
```
当返回结果为分页对象时

```typescript
interface Result<T> {
  success: true,
  code: number,
  description: string,
  result: T
}

interface Person {
  name: string,
  age: number
}

interface page<T> {
  current: number,
  pageSize: number,
  total: number,
  data: T[]
}

function fetchDat(): Promise<Result<page<Person>>> {
  return http.get('/api/demo/person');
}
```

# Typescript 使用总结

最近这两年，有很多人都在讨论 Typescript，无论是社区还是各种文章都能看出来，整体来说正面的信息是大于负面的，这篇文章就来整理一下我所了解的 Typescript。

本文主要分为 3 个部分：

- Typescript 基本概念
- Typescript 高级用法
- Typescript 总结

## Typescript 基本概念

至于官网的定义，这里就不多做解释了，大家可以去官网查看。[Typescript 设计目标](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Design-Goals)

我理解的定义：赋予 Javascript 类型的概念，让代码可以在运行前就能发现问题。

### Typescript 都有哪些类型

1、Typescript 基本类型，也就是可以被直接使用的单一类型。

- 数字
- 字符串
- 布尔类型
- null
- undefined
- any
- unknown
- void
- object
- 枚举
- never

2、复合类型，包含多个单一类型的类型。

- 数组类型
- 元组类型
- 字面量类型
- 接口类型

3、如果一个类型不能满足要求怎么办？

- 可空类型，默认任何类型都可以被赋值成 null 或 undefined。
- 联合类型，不确定类型是哪个，但能提供几种选择，如：type1 | type2。
- 交叉类型，必须满足多个类型的组合，如：type1 & type2。

### 类型都在哪里使用

在 Typescript 中，类型通常在以下几种情况下使用。

- 变量中使用
- 类中使用
- 接口中使用
- 函数中使用

#### 类型在变量中使用

在变量中使用时，直接在变量后面加上类型即可。

```ts
let a: number;
let b: string;
let c: null;
let d: undefined;
let e: boolean;
let obj: Ixxx = {
  a: 1,
  b: 2,
};
let fun: Iyyy = () => {};
```

#### 类型在类中使用

在类中使用方式和在变量中类似，只是提供了一些专门为类设计的静态属性、静态方法、成员属性、构造函数中的类型等。

```ts
class Greeter {
    static name:string = 'Greeter'
    static log() {
        console.log('log')
    }
    greeting: string;
    constructor (message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}
let greeter = new Greeter("world");
```

#### 类型在接口中使用

在接口中使用也比较简单，可以理解为组合多个单一类型。

```ts
interface IData {
  name: string;
  age: number;
  func: (s: string) => void;
}
```

#### 类型在函数中使用

在函数中使用类型时，主要用于处理函数参数、函数返回值。

```ts
// 函数参数
function a(all: string) {}
// 函数返回值
function a(a: string): string {}
// 可选参数
function a(a: number, b?: number) {}
```

## Typescript 高级用法

Typescript 中的基本用法非常简单，有 js 基础的同学很快就能上手，接下来我们分析一下 Typescript 中更高级的用法，以完成更精密的类型检查。

### 类型断言

#### 尖括号语法

```ts
let value: any = "this is a string";
let length: number = (<string>value).length;
```

#### as 语法

```ts
let value: any = "this is a string";
let length: number = (value as string).length;
```

#### 非空断言

当你明确知道某个值不可能为 `undefined` 和 `null` 时，你可以用 在变量后面加上一个 `!`（非空断言符号）来告诉编译器："嘿！相信我，我确信这个值不为空！"。 非空断言具体的使用场景如下：

```ts
function fun(value: string | undefined | null) {
  const str1: string = value; // error value 可能为 undefined 和 null
  const str2: string = value!; //ok
  const length1: number = value.length; // error value 可能为 undefined 和 null
  const length2: number = value!.length; //ok
}
```

#### 确定赋值断言
TypeScript 的确定赋值断言，允许在实例属性和变量声明后面放置一个 `!` 号，从而告诉 TypeScript 该属性会被明确地赋值。
```ts
let name!: string;
```

上述表达式就是对编译器说："有一个名为 name 的属性，其类型为 string | undefined。它以值 undefined 开始。但每次获取或设置该属性时，我都希望将其视为类型 string。"

more example

```ts
let count: number;
initialize();

// Variable 'count' is used before being assigned.(2454)
console.log(2 * count); // Error

function initialize() {
  count = 10;
}
```
很明显该异常信息是说变量 count 在赋值前被使用了，要解决该问题，我们可以使用确定赋值断言：

```ts
let count!: number;
initialize();
console.log(2 * count); // Ok

function initialize() {
  count = 10;
}
```
### 类中的高级用法

在类中的高级用法主要有以下几点：

- 继承
- 存储器 get set
- readonly 修饰符
- 公有，私有，受保护的修饰符
- 抽象类 abstract

继承和存储器和 ES6 里的功能是一致的，这里就不多说了，主要说一下类的修饰符和抽象类。

**类中的修饰符**是体现面向对象封装性的主要手段，类中的属性和方法在被不同修饰符修饰之后，就有了不同权限的划分，例如：

- public 表示在当前类、子类、实例中都能访问。
- protected 表示只能在当前类、子类中访问。
- private 表示只能在当前类访问。

```ts
class Animal {
  // 公有，私有，受保护的修饰符
  protected AnimalName: string;
  readonly age: number;
  static type: string;
  private _age: number;
  // 属性存储器
  get age(): number {
    return this._age;
  }
  set age(age: number) {
    this._age = age;
  }
  run() {
    console.log("run", this.AnimalName, this.age);
  }
  constructor(theName: string) {
    this.AnimalName = theName;
  }
}
Animal.type = "2"; // 静态属性
const dog = new Animal("dog");
dog.age = 2; // 给 readonly 属性赋值会报错
dog.AnimalName; // 实例中访问 protected 报错
dog.run; // 正常
```

在类中的继承也十分简单，和 ES6 的语法是一样的。

```ts
class Cat extends Animal {
  dump() {
    console.log(this.AnimalName);
  }
}
let cat = new Cat("catname");

cat.AnimalName; // 受保护的对象，报错
cat.run; // 正常
cat.age = 2; // 正常
```

在面向对象中，有一个比较重要的概念就是抽象类，抽象类用于类的抽象，可以定义一些类的公共属性、公共方法，让继承的子类去实现，也可以自己实现。

抽象类有以下两个特点。

- 抽象类不能直接实例化
- 抽象类中的抽象属性和方法，必须被子类实现

:::tip 经典问题：抽象类的接口的区别

- 抽象类要被子类继承，接口要被类实现。
  - 在 ts 中使用 extends 去继承一个抽象类。
  - 在 ts 中使用 implements 去实现一个接口。
- 接口只能做方法声明，抽象类中可以作方法声明，也可以做方法实现。
- 抽象类是有规律的，抽离的是一个类别的公共部分，而接口只是对相同属性和方法的抽象，属性和方法可以无任何关联。
:::

抽象类的用法如下。

```ts
abstract class Animal {
  abstract makeSound(): void;
  // 直接定义方法实例
  move(): void {
    console.log("roaming the earch...");
  }
}
class Cat extends Animal {
  makeSound() {} // 必须实现的抽象方法
  move() {
    console.log('move');
  }
}
new Cat3();
```

### 接口中的高级用法

接口中的高级用法主要有以下几点：

- 继承
- 可选属性
- 只读属性
- 索引类型：字符串和数字
- 函数类型接口
- 给类添加类型，构造函数类型

接口中除了可以定义常规属性之外，还可以定义可选属性、索引类型等。

```ts
interface Ia {
  a: string;
  b?: string; // 可选属性
  readonly c: number; // 只读属性
  [key: number]: string; // 索引类型
}
// 接口继承
interface Ib extends Ia {
  age: number;
}
let test1: Ia = {
  a: "",
  c: 2,
  age: 1,
};
test1.c = 2; // 报错，只读属性
const item0 = test1[0]; // 索引类型
```

接口中同时也支持定义函数类型、构造函数类型。

```ts
// 接口定义函数类型
interface SearchFunc {
  (source: string, subString: string): boolean;
}
let mySearch: SearchFunc = function (x: string, y: string) {
  return false;
};
// 接口中编写类的构造函数类型检查
interface IClass {
  new (hour: number, minute: number);
}
let test2: IClass = class {
  constructor(x: number, y: number) {}
};
```

### 函数中的高级用法

函数中的高级用法主要有以下几点：

- 函数重载
- this 类型

#### 函数重载

函数重载指的是一个函数可以根据不同的入参匹配对应的类型。

例如：案例中的 `doSomeThing` 在传一个参数的时候被提示为 `number` 类型，传两个参数的话，第一个参数就必须是 `string` 类型。

```ts
// 函数重载
function doSomeThing(x: string, y: number): string;
function doSomeThing(x: number): string;
function doSomeThing(x): any {}

let result = doSomeThing(0);
let result1 = doSomeThing("", 2);
```

#### This 类型

我们都知道，Javascript 中的 this 只有在运行的时候，才能够判断，所以对于 Typescript 来说是很难做静态判断的，对此 Typescript 给我们提供了手动绑定 this 类型，让我们能够在明确 this 的情况下，给到静态的类型提示。

其实在 Javascript 中的 this，就只有这五种情况：

- 对象调用，指向调用的对象
- 全局函数调用，指向 window 对象
- call apply 调用，指向绑定的对象
- dom.addEventListener 调用，指向 dom
- 箭头函数中的 this ，指向绑定时的上下文

```ts
// 全局函数调用 - window
function doSomeThing() {
  return this;
}
const result2 = doSomeThing();

// 对象调用 - 对象
interface IObj {
  age: number;
  // 手动指定 this 类型
  doSomeThing(this: IObj): IObj;
  doSomeThing2(): Function;
}

const obj: IObj = {
  age: 12,
  doSomeThing: function () {
    return this;
  },
  doSomeThing2: () => {
    console.log(this);
  },
};
const result3 = obj.doSomeThing();
let globalDoSomeThing = obj.doSomeThing;
globalDoSomeThing(); // 这样会报错，因为我们只允许在对象中调用

// call apply 绑定对应的对象
function fn() {
  console.log(this);
}
fn.bind(document)();

// dom.addEventListener
document.body.addEventListener("click", function () {
  console.log(this); // body
});
```

### 泛型

泛型表示的是一个类型在定义时并不确定，需要在调用的时候才能确定的类型，主要包含以下几个知识点：

- 泛型函数
- 泛型类
- 泛型约束 T extends XXX

我们试想一下，如果一个函数，把传入的参数直接输出，我们怎么去给它编写类型？传入的参数可以是任何类型，难道我们需要把每个类型都写一遍？

- 使用函数重载，得把每个类型都写一遍，不适合。
- 泛型，用一个类型占位 T 去代替，在使用时指定对应的类型即可。

```ts
// 使用泛型
function doSomeThing<T>(param: T): T {
  return param;
}

let y = doSomeThing(1);

// 泛型类
class MyClass<T> {
  log(msg: T) {
    return msg;
  }
}

let my = new MyClass<string>();
my.log("");

// 泛型约束，可以规定最终执行时，只能是哪些类型
function d2<T extends string | number>(param: T): T {
  return param;
}
let z = d2(true);
```

其实泛型本来很简单，但许多初学 Typescript 的同学觉得泛型很难，其实是因为泛型可以结合索引查询符 `keyof`、索引访问符 `T[k]` 等写出难以阅读的代码，我们来看一下。

```ts
// 以下四种方法，表达的含义是一致的，都是把对象中的某一个属性的 value 取出来，组成一个数组
function showKey1<K extends keyof T, T>(items: K[], obj: T): T[K][] {
  return items.map((item) => obj[item]);
}

function showKey2<K extends keyof T, T>(items: K[], obj: T): Array<T[K]> {
  return items.map((item) => obj[item]);
}

function showKey3<K extends keyof T, T>(
  items: K[],
  obj: { [K in keyof T]: any }
): T[K][] {
  return items.map((item) => obj[item]);
}

function showKey4<K extends keyof T, T>(
  items: K[],
  obj: { [K in keyof T]: any }
): Array<T[K]> {
  return items.map((item) => obj[item]);
}

let obj22 = showKey4<"age", { name: string; age: number }>(["age"], {
  name: "yhl",
  age: 12,
});
```

### 类型兼容性

类型兼容性是我认为 Typescript 中最难理解的一个部分，我们来分析一下。

- 对象中的兼容
- 函数返回值兼容
- 函数参数列表兼容
- 函数参数结构兼容
- 类中的兼容
- 泛型中的兼容

在 Typescript 中是通过结构体来判断兼容性的，如果两个的结构体一致，就直接兼容了，但如果不一致，Typescript 给我们提供了一下两种兼容方式：

以 `A = B` 这个表达式为例：

- 协变，表示 B 的结构体必须包含 A 中的所有结构，即：B 中的属性可以比 A 多，但不能少。
- 逆变，和协变相反，即：B 中的所有属性都在 A 中能找到，可以比 A 的少。
- 双向协变，即没有规则，B 中的属性可以比 A 多，也可以比 A 少。

#### 对象中的兼容

对象中的兼容，采用的是协变。

```ts
let obj1 = {
  a: 1,
  b: "b",
  c: true,
};

let obj2 = {
  a: 1,
};

obj2 = obj1;
obj1 = obj2; // 报错，因为 obj2 属性不够
```

#### 函数返回值兼容

函数返回值中的兼容，采用的是协变。

```ts
let fun1 = function (): { a: number; b: string } {
  return { a: 1, b: "" };
};
let fun2 = function (): { a: number } {
  return { a: 1 };
};

fun1 = fun2; // 报错，fun2 中没有 b 参数
fun2 = fun1;
```

#### 函数参数个数兼容

函数参数个数的兼容，采用的是逆变。

```ts
// 如果函数中的所有参数，都可以在赋值目标中找到，就能赋值
let fun1 = function (a: number, b: string) {};
let fun2 = function (a: number) {};

fun1 = fun2;
fun2 = fun1; // 报错， fun1 中的 b 参数不能再 fun2 中找到
```

#### 函数参数兼容

函数参数兼容，采用的是双向协变。

```ts
let fn1 = (a: { name: string; age: number }) => {
  console.log("使用 name 和 age");
};
let fn2 = (a: { name: string }) => {
  console.log("使用 name");
};

fn2 = fn1; // 正常
fn1 = fn2; // 正常
```

:::tip 理解函数参数双向协变

1、我们思考一下，一个函数 `dog => dog`，它的子函数是什么？

> 注意：原函数如果被修改成了另一个函数，但他的类型是不会改变的，ts 还是会按照原函数的类型去做类型检查!

- `grayDog => grayDog`
  - 不对，如果传了其他类型的 dog，没有 grayDog 的方法，会报错。
- `grayDog => animal`
  - 同上。
- `animal => animal`
  - 返回值不对，返回值始终是协变的，必须多传。
- `animal => grayDog`
  - 正确。

所以，函数参数类型应该是逆变的。

2、为什么 Typescript 中的函数参数也是协变呢？

```ts
enum EventType { Mouse, Keyboard }
interface Event { timestamp: number; }
interface MouseEvent extends Event { x: number; y: number }

function listenEvent(eventType: EventType, handler: (n: Event) => void) {
  /* ... */
}
listenEvent(EventType.Mouse, (e: MouseEvent) => console.log(e.x + "," + e.y));
```

上面代码中，我们在调用时传的是 mouse 类型，所以在回调函数中，我们是知道返回的参数一定是一个 MouseEvent 类型，这样是符合逻辑的，但由于 MouseEvent 类型的属性是多于 Event 类型的，所以说 Typescript 的参数类型也是支持协变的。
:::

### 类中的兼容

类中的兼容，是在比较两个实例中的结构体，是一种协变。

```ts
class Student1 {
  name: string;
  // private weight:number
}

class Student2 {
  // extends Student1
  name: string;
  age: number;
}

let student1 = new Student1();
let student2 = new Student2();

student1 = student2;
student2 = student1; // 报错，student1 没有 age 参数
```

需要注意的是，实例中的属性和方法会受到类中修饰符的影响，如果是 private 修饰符，那么必须保证两者之间的 private 修饰的属性来自同一对象。如上文中如果把 private 注释放开的话，只能通过继承去实现兼容。

### 泛型中的兼容

泛型中的兼容，如果没有用到 T，则两个泛型也是兼容的。

```ts
interface Empty<T> {}
let x1: Empty<number>;
let y1: Empty<string>;

x1 = y1;
y1 = x1;
```

### 高级类型

Typescript 中的高级类型包括：交叉类型、联合类型、字面量类型、索引类型、映射类型等，这里我们主要讨论一下

- 联合类型
- 映射类型

#### 联合类型

联合类型是指一个对象可能是多个类型中的一个，如：`let a :number | string` 表示 a 要么是 number 类型，要么是 string 类型。

那么问题来了，我们怎么去确定运行时到底是什么类型？

答：类型保护。类型保护是针对于联合类型，让我们能够通过逻辑判断，确定最终的类型，是来自联合类型中的哪个类型。

判断联合类型的方法很多：

- typeof
- instanceof
- in
- 字面量保护，`===`、`!==`、`==`、`!=`
- 自定义类型保护，通过判断是否有某个属性等

```ts
// 自定义类型保护
function isFish(pet: Fish | Bird): pet is Fish {
  return (<Fish>pet).swim !== undefined;
}
if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```
```ts
interface Square {
  kind: 'square';
  size: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

type Shape = Square | Rectangle;

function area(s: Shape) {
  if (s.kind === 'square') {
    // 现在 TypeScript 知道 s 的类型是 Square
    // 所以你现在能安全使用它
    return s.size * s.size;
  } else {
    // 不是一个 square ？因此 TypeScript 将会推算出 s 一定是 Rectangle
    return s.width * s.height;
  }
}
```

##### is

`is` 关键字更为精准的控制类型，以下代码相当于告诉编译器，如果返回结果为 true，则代表 val 是 string 类型：
```typescript
const isString = (val: unknown): val is string => getType(val) === 'string'
```

没有 `is string`人是可以看出结果就是 val 为 string，但是 ts 类型推导不出来，只能推出 isString 方法传入了类型为 unknown 的参数，方法的返回结果类型为 boolean，加了 `is string` 就是多了这么一个信息：若返回值为 true，则 val 类型为 string。这一点放在 if 里边有用。

#### 映射类型

映射类型表示可以对某一个类型进行操作，产生出另一个符合我们要求的类型：

- `Partial<T>`，将 `T` 中的类型都变为可选；
- `ReadOnly<T>`，将 `T` 中的类型都变为只读；
- `Pick`, 抽取对象子集，挑选一组属性并组成一个新的类型；
- `Record`，只作用于 obj 属性而不会引入新的属性；
- `Exclude<T, U>`，从 `T` 中剔除可以赋值给 `U `的类型；
- `Extract<T, U>`，提取 T 中可以赋值给 U 的类型；
- `NonNullable<T>`，从 T 中剔除 null 和 undefined；
- `Parameters<T>`，获取函数的参数类型，将每个参数类型放在一个元组中；
- `ReturnType<T>`，获取函数返回值类型；
- `InstanceType<T>`，获取构造函数类型的实例类型。

我们也可以编写自定义的映射类型。

```ts
//定义toPromise映射
type ToPromise<T> = { [K in keyof T]: Promise<T[K]> };
type NumberList = [number, number];
type PromiseCoordinate = ToPromise<NumberList>;
// [Promise<number>, Promise<number>]
```

##### Partial
`Partial` 的实现用到了 `in` 和 `keyof`
```ts
/**
 * Make all properties in T optional
 */
type Partial<T> = {
    [P in keyof T]?: T[P]
}
```
- `[P in keyof T]`遍历T上的所有属性
- `?`:设置为属性为可选的
- `T[P]`设置类型为原来的类型

`DeepPartial`
```ts
type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;
type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;
```

##### Readonly
```ts
/**
 * Make all properties in T readonly
 */
type Readonly<T> = {
    readonly [P in keyof T]: T[P]
}
```

##### Pick
```ts
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
    [P in K]: T[P]
}
```
Pick映射类型有两个参数:
- 第一个参数T，表示要抽取的目标对象
- 第二个参数K，具有一个约束：K一定要来自T所有属性字面量的联合类型

##### Record
```ts
/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
    [P in K]: T
}
```

Record 映射类型有两个参数:
- 第一个参数可以传入继承于 any 的任何值；
- 第二个参数，作为新创建对象的值，被传入。

##### ReturnType

```ts
// eg
type T0 = ReturnType<() => string>  // string

type T1 = ReturnType<(s: string) => void>  // void

/**
 * Obtain the return type of a function type
 */
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any
```
#### Omit和[Exclude](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers)区别

主要是泛型的参数不一样

- `Omit<Type, Keys>`: 基于以声明的类型做属性剔除
```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}
 
type TodoPreview = Omit<Todo, "description">;
 
const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
  createdAt: 1615544252770,
};
```
- `Exclude<UnionType, ExcludedMembers>` => 从UnionType中去掉所有能够赋值给ExcludedMembers的属性，然后剩下的属性构成一个新的类型

```ts
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">; // type T1 = "c"
type T2 = Exclude<string | number | (() => void), Function>; // type T2 = string | number

//源码实现 T extends U可以理解为 T是否assignable到U
type Exclude<T, U> = T extends U ? never : T;
type Extract<T, U> = T extends U ? T : never;
```

Pick结合Omit实现Omit
```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

```ts
type Test = {
 name: string;
 age: number;
 salary?: number;
};
//无效，这样没有意义，并不能够删除其中的字段
type wrongExcluded = Exclude<Test, "salary">;
type salary = { salary?: number };
//有效
type excluded1 = Exclude<Test, salary>; //never，
//有效且有意义
type excluded2 = Exclude<Test | salary | { noSalary: boolean }, salary>; //{ noSalary: boolean }
```
## TS 声明文件

### `declare`

当使用第三方库时，很多三方库不是用 TS 写的，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。

### `.d.ts`

把声明语句放到一个单独的文件（`Vue.d.ts`）中，这就是声明文件，以 `.d.ts` 为后缀。

TypeScript与ECMAScript 2015一样，任何包含**顶级import或者export**的文件都被当成一个模块。相反地，如果一个文件不带有顶级的import或者export声明，那么它的内容被视为**全局可见**的（因此对模块也是可见的）（全局就是以tsconfig.json文件为根目录的所有文件都能访问到）



```ts
// src/Vue.d.ts

interface VueOption {
    el: string,
    data: any
}

declare class Vue {
    options: VueOption
    constructor(options: VueOption)
}
```

### 自己写声明文件

比如以前写了一个请求小模块 `myFetch`，代码如下，

```ts
function myFetch(url, method, data) {
    return fetch(url, {
        body: data ? JSON.stringify(data) : '',
        method
    }).then(res => res.json())
}

myFetch.get = (url) => {
    return myFetch(url, 'GET')
}

myFetch.post = (url, data) => {
    return myFetch(url, 'POST', data)
}

export default myFetch
```
现在新项目用了 TS 了，要在新项目中继续用这个 myFetch，有两种选择：

- 用 TS 重写 myFetch，新项目引重写的 myFetch
- 直接引 myFetch ，给它写声明文件
如果选择第二种方案，就可以这么做，
```ts
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

declare function myFetch<T = any>(url: string, method: HTTPMethod, data?: any): Promise<T>

declare namespace myFetch { // 使用 namespace 来声明对象下的属性和方法
    const get: <T = any>(url: string) => Promise<T> 
    const post: <T = any>(url: string, data: any) => Promise<T>
}
```

## Mark

```ts
// keyof any对应的类型为number | string | symbol，也就是可以做对象键(专业说法叫索引 index)的类型集合。
type k1 = keyof any;
```
## Typescript 总结

### Typescript 优点

1、静态类型检查，提早发现问题。

2、类型即文档，便于理解，协作。

3、类型推导，自动补全，提升开发效率。

4、出错时，可以大概率排除类型问题，缩短 bug 解决时间。

实战中的优点：

1、发现 es 规范中弃用的方法，如：Date.toGMTString。

2、避免了一些不友好的开发代码，如：动态给 obj 添加属性。

3、vue 使用变量，如果没有在 data 定义，会直接抛出问题。

### Typescript 缺点

1、短期增加开发成本。

2、部分库还没有写 types 文件。

3、不是完全的超集。

实战中的问题：

1、还有一些坑不好解决，axios 编写了拦截器之后，typescript 反映不到 response 中去。

## 参考资料

- [Typescript 官网](https://www.tslang.cn/)
- [一份通俗易懂的 TS 教程，入门 + 实战](https://mp.weixin.qq.com/s/C3A-uNwAeqajB4NqwFIBPQ)
- [深入理解 Typescript](https://jkchao.github.io/typescript-book-chinese/)
