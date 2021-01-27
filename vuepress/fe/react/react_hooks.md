---
title: React Hooks
---

[React Hooks 原理](https://github.com/brickspert/blog/issues/26)

[React Hooks 导读](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzI4NjE3MzQzNg==&action=getalbum&album_id=1490474787792617475&scene=173)
## 一、什么是 Hooks
**有状态的函数式组件。**
- React认为，UI视图是数据的一种视觉映射，即`UI = F(DATA)`，这里的F需要负责对输入数据进行加工、并对数据的变更做出响应
- 公式里的F在React里抽象成组件，React是以组件（Component-Based）为粒度编排应用的，组件是代码复用的最小单元
- 在设计上，React采用props属性来接收外部的数据，使用state属性来管理组件自身产生的数据（状态），而为了实现（运行时）对数据变更做出响应需要，React采用基于类（Class）的组件设计！
- React 一直都提倡使用**函数组件**，但是有时候需要使用 `state` 或者其他一些功能时，只能使用**类组件**，因为函数组件没有实例，没有生命周期函数，只有类组件才有;
- Hooks 是 React 16.8 新增的特性，它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性
- 如果你在编写函数组件并意识到需要向其添加一些 state，以前的做法是必须将其它转化为 class。现在你可以直接在现有的函数组件中使用 `Hooks`
凡是 `use` 开头的 React API  都是 `Hooks`

## 二、Hooks 解决的问题

### 1. 类组件的不足
- 状态逻辑难复用： 在组件之间复用状态逻辑很难，可能要用到 `render props` （渲染属性）或者 `HOC`（高阶组件），但无论是渲染属性，还是高阶组件，都会在原先的组件外包裹一层父容器（一般都是 div 元素），导致层级冗余

HOC使用（老生常谈）的问题
- 嵌套地狱，每一次HOC调用都会产生一个组件实例
- 可以使用类装饰器缓解组件嵌套带来的可维护性问题，但装饰器本质上还是HOC
- 包裹太多层级之后，可能会带来props属性的覆盖问题

Render Props：

- 数据流向更直观了，子孙组件可以很明确地看到数据来源
- 但本质上`Render Props`是基于闭包实现的，大量地用于组件的复用将不可避免地引入了callback hell问题
- 丢失了组件的上下文，因此没有`this.props`属性，不能像HOC那样访问`this.props.children`

- 趋向复杂难以维护：

  - 在生命周期函数中混杂不相干的逻辑（如：在 componentDidMount 中注册事件以及其他的逻辑，在 componentWillUnmount 中卸载事件，这样分散不集中的写法，很容易写出 bug ）
  - 类组件中到处都是对状态的访问和处理，导致组件难以拆分成更小的组件


- this 指向问题：父组件给子组件传递函数时，必须绑定 `this`，react 中的组件四种绑定 `this` 方法的区别

## Hooks 优势

- 能优化类组件的三大问题
- 能在无需修改组件结构的情况下复用状态逻辑（自定义 Hooks ）
- 能将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据）
- 副作用的关注点分离：副作用指那些没有发生在数据向视图转换过程中的逻辑，如 ajax 请求、访问原生dom 元素、本地持久化缓存、绑定/解绑事件、添加订阅、设置定时器、记录日志等。以往这些副作用都是写在类组件生命周期函数中的。而 useEffect 在全部渲染完毕后才会执行，useLayoutEffect 会在浏览器 layout 之后，painting 之前执行。

## 注意事项

- 只能在函数内部的最外层调用 Hook，不要在循环、条件判断或者子函数中调用
- 只能在 React 的函数组件中调用 Hook，不要在其他 JavaScript 函数中调用


#### React Hooks能够让函数组件拥有内部状态的基本原理
利用闭包，记住了上一次的值，如下
```javascript
const useState = function(){
	let state = null
	return function(value){
    // 第一次调用时没有初始值，因此使用传入的初始值赋值
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

const render = Demo() // log 0
render(12)
Demo() // log 12
Demo() // log 12
```
更为相似的例子
```typescript
// state.js
let state = null;

export const useState = (value: number) => {
  // 第一次调用时没有初始值，因此使用传入的初始值赋值
  state = state || value;

  function dispatch(newValue) {
    state = newValue;
    // 假设此方法能触发页面渲染
    render();
  }

  return [state, dispatch];
}
```
在其他模块中引入并使用。
````typescript jsx
import React from 'react';
import {useState} from './state';

function Demo() {
  // 使用数组解构的方式，定义变量
  const [counter, setCounter] = useState(0);

  return (
    <div onClick={() => setCounter(counter + 1)}>hello world, {counter}</div>
  )
}

export default Demo();
````
执行上下文state（模块state）以及在state中创建的函数useState

当useState在Demo中执行时，访问了state中的变量对象，那么闭包就会产生。
### useState
每次渲染都是独立的闭包， `setTimeout`中打印的是上一次的值
````jsx harmony
function Test() {
	console.log('render 1')
	const [ state, setSate] = useState(0)
	function AlertNum() {
		setSate((state+1))
		setTimeout(() => {
			setSate(number=>number+1)
			// setSate((state+1)) // 不起作用
			alert(state) // 0
		}, 3000)
	}
	return (
		<div>
			<p>{ state }</p>
			<button onClick={() => setSate(prev => prev +1)}>add</button>
			<br/>
			<button onClick={AlertNum}>AlertNum</button>
		</div>
	)
}
````

```jsx harmony
function Demo() {
	console.log('render 1')
	const [state, setState] = useState(111)
	
	const [obj, setObj] = useState({
		a: 1,
		b: 2
	})
	function test() {
		obj.a = 2
		// setObj({ ...obj, a: 12})
		setObj(obj) // 不会导致render,所以不会渲染，但是当state变化，Demo组件会重新render, 而由于闭包的特性， obj的a已经变化，所以显示的a也会变成2
		console.log(obj)
	}
    return ()
}
```
使用memo的区别
```jsx harmony
import React, { memo, useState } from 'react'

function Counter1(props) {
	console.log(`Counter ${props.name} render`)
	
	// 这个函数只在初始渲染时执行一次，后续更新状态重新渲染组件时，该函数就不会再被调用
	function getInitState() {
		return { number: props.number }
	}
	
	let [counter, setCounter] = useState(getInitState)
	let [counter1, setCounter2] = useState(props.number) // props变化时，这个counter1依然是第一次的值
	return (
		<>
			<h1>name: { props.name }</h1>
			<p>{counter.number}</p>
			<button onClick={() => setCounter({ number: counter.number + 1 })}>+</button>
			<button onClick={() => setCounter(counter)}>setCounter</button>
		</>
	)
}

const Counter1Memo = memo(Counter1)

function Test() {
	console.log('render 1')
	const [state, setSate] = useState(0)
	
	function AlertNum() {
		setSate((state + 1))
		setTimeout(() => {
			setSate(number => number + 1)
			// setSate((state+1)) // 不起作用
			alert(state) // 0
		}, 3000)
	}
	// 但state变化时
    // name 是1,2,3的都要render
	return (
		<div>
			<p>{state}</p>
			<button onClick={() => setSate(prev => prev + 1)}>add</button>
			<br/>
			<button onClick={AlertNum}>AlertNum</button>
			<Counter1 number={state} name='1' key={1}/>
			<Counter1 number={12} name='2' key={2}/>
			<Counter1Memo number={state} name='3' key={3}/>
			<Counter1Memo number={12} name='4' key={4}/>
		</div>
	)
}

export default Test
```
```jsx harmony
import React, { memo, useCallback, useMemo, useState } from 'react'

function SubCounter({ onClick, data }) {
	console.log('SubCounter render')
	return (
		<button onClick={onClick}>{data.number}</button>
	)
}

const SubCounter2 = memo(SubCounter)

let oldData; let oldAddClick
export default function Counter2() {
	console.log('Counter render')
	const [name, setName] = useState('计数器')
	const [number, setNumber] = useState(0)
	// 父组件更新时，这里的变量和函数每次都会重新创建，那么子组件接受到的属性每次都会认为是新的
	// 所以子组件也会随之更新，这时候可以用到 useMemo
	// 有没有后面的依赖项数组很重要，否则还是会重新渲染
	// 如果后面的依赖项数组没有值的话，即使父组件的 number 值改变了，子组件也不会去更新
	// const data = useMemo(()=>({number}),[]);
	const data = useMemo(() => ({ number }), [number]) // number变化了sub才会重新render,name变了不会
	console.log('data===oldData ', data === oldData)
	oldData = data
	
	// 有没有后面的依赖项数组很重要，否则还是会重新渲染
	const addClick = useCallback(() => {
		setNumber(number + 1)
	}, [number]) // number变化了sub才会重新render,name变了不会
	console.log('addClick===oldAddClick ', addClick === oldAddClick)
	oldAddClick = addClick
	return (
		<>
			<input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
			<SubCounter2 data={data} onClick={addClick}/>
		</>
	)
}
```

### useEffect

在function组件中，每当DOM完成一次渲染，都会有对应的副作用执行，useEffect用于提供自定义的执行内容，它的第一个参数（作为函数传入）就是自定义的执行内容。为了避免反复执行，传入第二个参数（由监听值组成的数组）作为比较(浅比较)变化的依赖，比较之后值都保持不变时，副作用逻辑就不再执行。

- 1. 只在第一次渲染时执行，第二个参数传空数组。即没有传入比较变化的变量，则比较结果永远都保持不变，那么副作用逻辑就只能执行一次。
```jsx harmony
const [list, setList] = useState(0);

// DOM渲染完成之后副作用执行
useEffect(() => {
  recordListApi().then(res => {
    setList(res.data);
  })
// 记得第二个参数的使用
}, []);
```

- 2. 创造一个变量，来作为变化值，实现目的的同时防止循环执行
```jsx harmony
import React, { useState, useEffect } from 'react';
import './style.scss';

export default function AnimateDemo() {
  const [list, setList] = useState(0);
  const [loading, setLoading] = useState(true);

  // DOM渲染完成之后副作用执行
  useEffect(() => {
    if (loading) {
      recordListApi().then(res => {
        setList(res.data);
      })
    }
  }, [loading]);

  return (
    <div className="container">
      <button onClick={() => setLoading(true)}>点击刷新</button>

      <FlatList data={list} />
    </div>
  )
}
```