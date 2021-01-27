---
title: Typescript
---

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
function identity<T> {}

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
