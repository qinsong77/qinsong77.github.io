---
title: React
---
[react](https://zh-hans.reactjs.org/)

[React技术揭秘](https://react.iamkasong.com/)

[图解React](http://www.7km.top/)

[react+typescript](https://github.com/typescript-cheatsheets/react)

[2021年React学习路线图](https://mp.weixin.qq.com/s?__biz=MzUxMzcxMzE5Ng==&mid=2247505750&idx=2&sn=a31164ddf69f49e3761d2a6d660cf316&chksm=f9526215ce25eb031cbb1f8e0137b3fb3e30f6305fb183f028ab12419699695173b51c44b49d&scene=132#wechat_redirect)


`npx create-react-app my-app --typescript` => `--typescript`被弃用，使用`--template typescript`
## 概述

React用于构建用户界面的 JavaScript 库

单项数据流：
把组件相当于一个函数，props 相当于函数的传参。如果组件内部可以改变 props 就相当于，在函数内部改变参数。那么这个函数就产生了副作用，那么这个函数就不是一个 `pure function`。这会使函数变的不可测试，不可测试也就不能预测执行结果，从而降低代码可维护性。

React采用自上而下单向数据流的方式，管理自身的数据与状态。在单向数据流中，数据只能由父组件触发，向下传递到子组件。

可以在父组件中定义state，并通过props的方式传递到子组件。如果子组件想要修改父组件传递而来的状态，则**只能给父组件发送消息，由父组件改变，再重新传递给子组件**。

在React中，**state与props的改变，都会引发组件重新渲染。如果是父组件的变化，则父组件下所有子组件都会重新渲染**。

在class组件中，组件重新渲染，是执行render方法。

**而在函数式组件中，是整个函数重新执行。**
### 函数式组件

函数式组件与普通的函数几乎完全一样。只不过函数执行完毕时，返回的是一个JSX结构。

```jsx harmony
function Hello() {
  return <div>hello world.</div>
}
```

- **1. 函数式组件接收props作为自己的参数**

```typescript jsx

import React from 'react';

interface Props {
  name: string,
  age: number
}

function Demo({ name, age }: Props) {
  return [
    <div>name: {name}</div>,
    <div>age: {age}</div>
  ]
}

export default Demo;
```

- 2. **props的每次变动，组件都会重新渲染一次，函数重新执行。**

- 3. **没有this。那么也就意味着，之前在class中由于this带来的困扰就自然消失了。**

## [生命周期](https://zh-hans.reactjs.org/docs/react-component.html)

## React16.3.0之前生命周期:

[文章](https://juejin.cn/post/6844904021233238024)

![](./image/react-lifeCircle-old.png)

### 创建期:

- constructor(props, context)
- componentWillMount()
- render()
- componentDidMount()

### 运行时:

#### props发生变化时

- componentWillReceiveProps(nextProps, nextContext)
- shouldComponentUpdate(nextProps, nextState, nextContext)
- componentWillUpdate(nextProps, nextState, nextContext)
- render
- componentDidUpdate(prevProps, prevState, snapshot)

#### state发生变化时

- shouldComponentUpdate(nextProps, nextState, nextContext)
- componentWillUpdate(nextProps, nextState, nextContext)
- render
- componentDidUpdate(prevProps, prevState, snapshot)

### 卸载时

- componentWillUnmount()

## React16.3.0之后的生命周期

### 创建期:

- constructor(props, context)
- static getDerivedStateFromProps(props, status)
- render()
- componentDidMount()

或者如下生命周期:

- constructor(props, context)
- componentWillMount() / UNSAFE_componentWillMount()
- render()
- componentDidMount()
注意: `getDerivedStateFromProps`/`getSnapshotBeforeUpdate` 和 `componentWillMount`/`componentWillReceiveProps`/`componentWillUpdate` 如果同时存在，React会在控制台给出警告信息，且仅执行 getDerivedStateFromProps/getSnapshotBeforeUpdate 【React@16.7.0】

### 运行时:

#### props发生变化时

- static getDerivedStateFromProps(props, status)
- shouldComponentUpdate(nextProps, nextState, nextContext)
- render
- getSnapshotBeforeUpdate(prevProps, prevState)
- componentDidUpdate(prevProps, prevState, snapshot)

或者如下生命周期:

- componentWillReceiveProps(nextProps, nextContext)/UNSAFE_componentWillReceiveProps
- shouldComponentUpdate(nextProps, nextState, nextContext)
- componentWillUpdate(nextProps, nextState, nextContext)
- render
- componentDidUpdate(prevProps, prevState, snapshot)

#### state发生变化时

- static getDerivedStateFromProps(props, status)
- shouldComponentUpdate(nextProps, nextState, nextContext)
- render
- getSnapshotBeforeUpdate(prevProps, prevState)
- componentDidUpdate(prevProps, prevState, snapshot)
或者如下生命周期:

- shouldComponentUpdate(nextProps, nextState, nextContext)
- componentWillUpdate(nextProps, nextState, nextContext)/UNSAFE_componentWillUpdate
- render
- componentDidUpdate(prevProps, prevState, snapshot)
#### 销毁时

- componentWillUnmount()

[示意图](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

新的生命周期图示:

![](./image/react-lifecircle1.png)

![](./image/react-lifecircle2.png)

### 受控与非受控组件

受控组件：在 HTML 中，表单元素（如`<input>、 <textarea>、<select>`)通常自己维护 state，并根据用户输入进行更新。
即如Input的value绑定了state,而onChange时使用setState更新。

也可以说是组件外部能控制组件内部的状态，则表示该组件为受控组件。

外部想要控制内部的组件，就必须要往组件内部传入props。而通常情况下，受控组件内部又自己有维护自己的状态。例如input组件。

如下实现


```typescript jsx
import React, {useState, useEffect} from 'react'

interface Props {
	value?: string,
	maxLength?: number
}

export default function App({value, maxLength}: Props) {
	const [state, setState] = useState('')
	useEffect(() => {
		value && setState(value) // 这里能通过props控制state
	}, [value])
	function updateValue(inputValue: string) {
		if (maxLength !== undefined && inputValue.length > maxLength) return
		else setState(inputValue)
	}
	return (
		<div className='input-item'>
			<input value={state} onInput={(e => updateValue(e.currentTarget.value))} style={{ paddingRight: maxLength !== undefined ? '36px' : '10px'}}/>
			{ maxLength !== undefined &&
				<span>{ state.length + '/' + maxLength}</span>
			}
		</div>
	)
}
```

在大多数情况下，推荐使用 `受控组件` 来处理表单数据。

在一个受控组件中，表单数据是由 `React` 组件来管理的。另一种替代方案是使用非受控组件，这时表单数据将交**由 `DOM` 节点来处理**。

写一个非受控组件，而不是为每个状态更新都编写数据处理函数，使用 `ref` 来从 `DOM`节点中获取表单数据。

```jsx harmony
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```


### [setState](https://zhuanlan.zhihu.com/p/39512941)

- setState 只在合成事件和钩子函数中是“异步”的，在原生事件和setTimeout 中都是同步的。
- setState 的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形成了所谓的“异步”，当然可以通过第二个参数 setState(partialState, callback) 中的callback拿到更新后的结果。
- setState 的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和setTimeout 中不会批量更新，在“异步”中如果对同一个值进行多次setState，setState的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时setState多个不同的值，在更新时会对其进行合并批量更新。

### React.PureComponent与React.memo()

一个组件重新重新渲染，一般三种情况：

1. 要么是组件自己的状态改变
2. 要么是父组件重新渲染，导致子组件重新渲染，但是父组件的 props 没有改版
3. 要么是父组件重新渲染，导致子组件重新渲染，但是父组件传递的 props 改变


React.PureComponent 中以浅层对比 prop 和 state 的方式来实现`shouldComponentUpdate(nextProps, nextState)`。仅作对象的浅层比较。如果对象中包含复杂的数据结构，则有可能因为无法检查深层的差别，产生错误的比对结果。

其实就是默认实现了`shouldComponentUpdate`，可以判断是否重新渲染。而memo是对函数式组件的高阶运用。

`React.memo` 仅检查 `props` 变更。如果函数组件被` React.memo `包裹，且其实现中拥有 `useState `或 `useContext` 的 Hook，当 context 发生变化时，它仍会重新渲染。
默认情况下其只会对复杂对象做浅层对比，如果想要控制对比过程，那么可以将自定义的比较函数通过第二个参数传入来实现。
```jsx harmony
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default React.memo(MyComponent, areEqual);
```
```jsx harmony
class Child extends React.PureComponent {
	// shouldComponentUpdate(nextProps, nextState, nextContext) {
	// 	return nextProps.seconds !== this.props.seconds
	// }
	
	render(){
		console.log('I am rendering');
		return (
			<div>I am update every {this.props.seconds} seconds</div>
		)
	}
}
```

### 高阶组件
高阶组件是参数为组件，返回值为新组件的函数。组件是将 props 转换为 UI，而高阶组件是将组件转换为另一个组件。

HOC 是纯函数，没有副作用。

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```
example：

```jsx harmony

const withMouse = (Component) => {
  return class extends React.Component {
    state = { x: 0, y: 0 }

    handleMouseMove = (event) => {
      this.setState({
        x: event.clientX,
        y: event.clientY
      })
    }

    render() {
      return (
        <div onMouseMove={this.handleMouseMove}>
          <Component {...this.props} {...this.state} />
        </div>
      )
    }
  }
}
```
使用
```jsx harmony
const App2= withMouse(({ x, y }) => {
  return (
    <div style={{ height: '100%' }}>
      <div>x: {position.x}, y: {position.y}</div>
    </div>
  )
})
```

问题: 

当嵌套使用多个高阶组件时，在代码中无法识别props中的参数，是哪里来的。并且当参数命名重复时一样无法解决。因此高阶组件在使用时会非常小心，以至于在很多场景下，我们放弃共同逻辑片段的封装，因为这会很容易造成滥用。

#### render props

```typescript jsx
import React from 'react'

interface Props {
    render: (props: { x: number, y: number }) => React.ReactNode
}

class Mouse extends React.Component<Props>{
    state = {
        x: 0,
        y: 0
    }

    handleMouseMove = (event: React.MouseEvent<HTMLDivElement, any>) => {
        this.setState({
            x: event.clientX,
            y: event.clientY
        })
    }

    render() {
        return (
            <div onMouseMove={this.handleMouseMove} className='mouse-move-container'>
                {this.props.render(this.state)}
            </div>
        )
    }
}
// 使用
export default function () {
    return (
        <Mouse render={
            ({x, y}) => (
                <div>x: {x}, y: {y}</div>
            )
        }/>
    )
}
```
`render props`解决了来源问题，同时也避免了命名冲突。

问题

1. 可读性不高，直观上比较别扭。我们可以在Mouse组件中处理很多额外逻辑，甚至定义更多的交互样式。因此使用时会造成一些困扰。
2. 存在局限性。我们期望的是能够切割逻辑片段，render props最终仍然是组件化思维的扩展运用
