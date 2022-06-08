---
title: React Testing Library
layout: BlogLayout
------------------
[[toc]]

## Guide
[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) 在`DOM Testing Library`的基础上添加一些API，主要用于测试React组件。如果是其它的技术栈，可以选择对应的[`Testing Library`](https://testing-library.com/) 库。该库在使用过程并不关注组件的内部实现，而是更关注测试。该库基于`react-dom`和`react-dom/test-utils`，是以上两者的轻量实现。

### Vs Jest

`RTL`并不是`Jest`的替代选择，两者不是二选一的关系，`Jest`是`Javascript`最流行的测试框架，`Jest`就是一个`test runner`，可以命令行式的跑所有的测试用例，并且
提供测试suites、cases、断言的函数，还有`spies, mocks, stubs`等。而`RTL`，只是测试库中`Reac`t的一个分支其他的还有`Vue`、`Angular`等，测试库其他比如还有[`Enzyme`](https://github.com/enzymejs) 等。

### 安装

同`Jest`一样，如果`create-react-app`创建的，`RTL`已内置好，但比如专门用于测试`hooks`的[`@testing-library/react-hooks`](https://react-hooks-testing-library.com/) 还是要自己添加安装。

```shell
pnpm i @testing-library/react @testing-library/user-event @testing-library/react-hooks  @testing-library/jest-dom -D
# 基于eslint和testing library的最佳实践去提示，避免一些常见的错误
pnpm i eslint-plugin-testing-library -D
```

- [`@testing-library/dom`](https://testing-library.com/docs/dom-testing-library/intro): 一个轻量级的(DOM 查询、交互)测试解决方案，它使用了一种与 ”用户的在页面中查找元素" 类似的DOM查询方式，以保证准确性;
- [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro) : 在 `@testing-library/dom` 基础上，将 `React组件`渲染为 `DOM` 便于后边测试;
- [`@testing-library/user-event`](https://testing-library.com/docs/user-event/intro/) : 提供了更加高级的浏览器交互模拟 – 即事件;
- [`@testing-library/jest-dom`](https://github.com/testing-library/jest-dom) ：追加一系列辅助测试 DOM 的 `matchers` 匹配器，需要在每个 `react test`文件的顶部引用，否则类似 `expect(dom).toBeInTheDocument()` 这样的断言则没法用，可以在`setup`中统一导入。
- [`@testing-library/react-hooks`](https://react-hooks-testing-library.com/): 专门用于测试hooks的库。
- [`eslint-plugin-testing-library`](https://github.com/testing-library/eslint-plugin-testing-library) : 基于`eslint`和`testing library`的最佳实践去做提示，避免一些常见的错误。

### Basic
#### 基本能力
- 组件渲染(render)
- 元素查找(get/query/find)
- 事件触发(fireEvent)

#### 基本使用

在编写单元测试过程中，可以按照AAA模式实现。即：

* Arrange 编排，使用[render](https://testing-library.com/docs/react-testing-library/api#render)

```
render(component)
```

* Act 执行，使用[fireEvent](https://testing-library.com/docs/dom-testing-library/api-events/#fireevent) 去触发用户行为。

```
fireEvent.click(element)
```

* Assert 断言，对期望的结果予以判断。

```
expect(result).matcher()
```

example:

```tsx
//Search.tsx
import React from 'react'

export const Search: React.FC<
  React.PropsWithChildren<{
    value: string
    onChange: (e: React.ChangeEvent) => void
  }>
  > = ({ value, onChange, children }) => {
  return (
    <div>
      <label htmlFor="search">{children}</label>
      <div>
        <label htmlFor="search">{children}</label>
        <input
          id="search"
          type="text"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
```
test file
```tsx
//Search.test.tsx
import React from 'react'
// 引入@testing-library/react提供的方法
import { render, fireEvent, screen } from '@testing-library/react'
import { Search } from './Search'

describe('Search', () => {
  test('calls the onChange callback handler', () => {
    const onChange = jest.fn()
    // Arrange 编排
    render(
      <Search
        value=""
        onChange={onChange}>
        Search:
      </Search>
    )
    // Act 执行
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'JavaScript' },
    })
    // Assert 断言
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
```

#### 常用API

* [`render`](https://testing-library.com/docs/react-testing-library/api/#render)

render的参数：

```typescript
render(
    ui: React.ReactElement<any>,
    options?: {
      container, // ui 渲染的位置，默认是创建个div并append到document.body上
      baseElement,
      hydrate,,
      legacyRoot
      wrapper, // 常用于注入类似React-Router、Redux、或者自定义的Provider
      queries //用于自定义选择器
    }
)
```

render的结果：

```js
const {
    ...queries, // 选择器，例如(get/query/find)By(Text/Label/...)
    container: HTMLDivElement, // 默认自动创建一个div,并插入到body中
    baseElement: HTMLBodyElement, // 相当于document.body
    debug: Function, // 打印当前document.body
    rerender: Function, //重新渲染组件
    unmount: Function, //组件卸载，此时container.innerHTML === ''
    asFragment:Function //记录某个时刻的dom
} = render()
```

render的例子：

```ts
// 列出的是常用的
const { queryByText, container, baseElement, debug, rerender, unmount } = render(conponent)
```

* `cleanup`

相当于给组件置成`unmount`,一般在`afterEach()`中执行，如果使用的`Jest`,不需要在`afterEach`中手动设置，框架已默认每次test结束后执行`cleanup`。

* [`Queries`](https://testing-library.com/docs/queries/about/)


| search type<br/>（单个元素） | search type<br/>（多个元素） | function<br/>（查询单个元素）                                                                                                  | 适用场景                        |
|------------------------|------------------------|------------------------------------------------------------------------------------------------------------------------|-----------------------------|
| getBy                  | getAllBy               | getByText<br/>getByRole<br/>getByLabelText<br/>getByPlaceholderText<br/>getByAltText<br/>getByDisplayValue             | 由于只返回元素或error，适用于确定该元素存在的情况 |
| queryBy                | queryAllBy             | queryByText<br/>queryByRole<br/>queryByLabelText<br/>queryByPlaceholderText<br/>queryByAltText<br/>queryByDisplayValue | 用于元素可能不存在                   |
| findBy                 | findAllBy              | findByText<br/>findByRole<br/>findByLabelText<br/>findByPlaceholderText<br/>findByAltText<br/>findByDisplayValue       | 用于异步元素                      |

examples:
```
LabelText: getByLabelText: <label for="search" />
PlaceholderText: getByPlaceholderText: <input placeholder="Search" />
AltText: getByAltText: <img alt="profile" />
DisplayValue: getByDisplayValue: <input value="JavaScript" />
TestId: getByTestId: <div data-testid='search'></div>
```

- _findBy_: findBy主要是查找最终会出现在dom中的异步元素，如果能确定一个元素不会出现在dom里，则使用queryBy，否则使用getBy
- ` query*` API 只用于断言当前元素不能被找到(可以在找不到元素的情况下不会抛出异常（返回  null）。唯一的好处是可以用来判断这个元素是否没有被渲染到页面上。)
  因为类似 `get*` 和 `find*` 相关的 API 在找不到元素时都会自动抛出异常 —— 这样你就可以看到渲染的内容以及为什么找不到元素的原因。然而，`query*` 只会返回 `null`，
- 
htlm如：`<h3>Hello <span>World</span></h3>`
```js
// Before
screen.getByText(/hello world/i)
// |>Error: TestingLibraryElementError: Unable to find an element with the text: /hello world/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

// In version 9
screen.getByRole('heading', { name: /hello world/i })
// |> HTMLHeadingElement
```

* `fireEvent`

```
fireEvent(node, event)
```

[events API](https://testing-library.com/docs/dom-testing-library/api-events)

* [`act`](https://testing-library.com/docs/react-testing-library/api/#act)

**后面会详细讲解**。

对react-dom/test-utils中的[act](https://reactjs.org/docs/test-utils.html#act) 函数进行了一层包装。act的作用是在你进行断言之前，保证所有由组件渲染、用户交互以及数据获取产生的**更新**全部在dom实现。

```
act(() => {
  // render components
});
act(() => {
  // fireEvent
});
// make assertions
```

* `waitFor`

用于异步

```
waitFor(Promise)
```

waitFor 的目的是可以让你等一些指定的事情发生。如果传了空的 callback，可能它在今天还能 Work，因为你只是想在 Event Loop 等一个 Tick 就好了。但这样你也会留下一个脆弱的测试用例，一旦改了某些异步逻辑它很可能就崩了。

在 waitFor 里等待指定的断言，不要传空 callback

waitFor 适用的情况是：在执行的操作和断言之间存在不确定的时间量。因此，callback 可在不确定的时间和频率（在间隔以及 DOM 变化时调用）被调用（或者检查错误）。所以这也意味着你的副作用可能会被多次调用！

同时，这也意味着你不能在 waitFor 里面使用快照断言（SnapShot Assertion）。如果你想要用快照断言，首先要等待某些断言走完了，然后再拍快照。

建议：把副作用放在 waitFor 回调的外面，回调里只能有断言

*  `screen`

`screen`的方法继承自queries, queries有的能力都有，此外还增加了`debug()`的能力.


#### 补充

- 关于更多自定义的东西，例如render、选择器以及与Jest有的配置，查阅[官方文档](https://testing-library.com/docs/react-testing-library/setup/) 吧，写得很清楚.

- 对于dom的一些断言，可以添加`testing-library`库提供的`@testing-library/jest-dom`来更好得对dom进行断言。

```
// In your own jest-setup.js (or any other name)
import '@testing-library/jest-dom'

// In jest.config.js add (if you haven't already)
setupFilesAfterEnv: ['<rootDir>/jest-setup.js']
```

匹配器概览：

```
//Custom matchers
toBeDisabled
toBeEnabled
toBeEmptyDOMElement
toBeInTheDocument
toBeInvalid
toBeRequired
toBeValid
toBeVisible
toContainElement
toContainHTML
toHaveAccessibleDescription
toHaveAccessibleName
toHaveAttribute
toHaveClass
toHaveFocus
toHaveFormValues
toHaveStyle
toHaveTextContent
toHaveValue
toHaveDisplayValue
toBeChecked
toBePartiallyChecked
toHaveErrorMessage
//Deprecated matchers
toBeEmpty
toBeInTheDOM
toHaveDescription
```
具体用法，可以[查阅文档](https://github.com/testing-library/jest-dom)


## 详细教程

### render a component
以一个最简单例子的开始
src/App.tsx
```tsx
import React from 'react'

const title = 'Hello React'

function App() {
  return <div>{title}</div>
}

export default App;
```
src/App.test.tsx
```tsx {1,9}
import React from 'react'
import { render, screen } from '@testing-library/react'

import App from './App'

describe('App', () => {
  test('renders App component', () => {
    render(<App />)
    screen.debug();
  })
})
```

```html
<body>
  <div>
    <div>
      Hello React
    </div>
  </div>
</body>
```

下面是一个稍微复杂一点的搜索input，使用了`useState, event handler, props`，是一个受控组件 (controlled component):



    
### [act](https://reactjs.org/docs/testing-recipes.html#act)

最常见的报错就是：`Warning: An update to Balances inside a test was not wrapped in act(...).`




当写UI测试时，像`rendering`, `user events`, or `data fetching - promise`的任务都会被看作用户与View的交互，
在断言前，`react-dom/test-utils`提供`act`方法确保所有这些动作都更新并且作用到dom上。
`act()`接收一个函数作为第一个参数，并调用作用（apply）到Dom(jsdom)上，当`act()`函数被执行，可以使用断言，确保测试运行更贴近用户的真实体验。

然而从`react-dom/test-utils`导入并使用是比较冗余的，可以从`testing-library/react`导入.

```js
test('Testing', () => {
  act(() => {
    /* Codes you want to apply to the DOM */
    (e.g. ReactDOM.render(<Counter />, container);)
  });
  /* assume that the code is applied to the DOM */
});
```

```js
act(() => {
  // render components
});
// make assertions
```

由于react的更新是异步的，

RTL中的`render() `, `userEvent` , `fireEvent`都已经被`act`包裹了。

也就意味这当你使用这些方法时，组件相关的state都会刷新，额外添加的同步act不会改变任何东西。
(It means that every time you use one of these utilities, all component’s relevant state updates are flushed. An additional synchronous act() is not going to change anything.)

```js
// ActOne.js
import { useState } from 'react'

const ActOne = () => {
    const [title, setTitle] = useState('')

    const handleClick = () => {
        setTitle('Clicked') // act() in RTL render() makes this update happen
    }

    return (
        <>
            <button onClick={handleClick}>Click me</button>
            {title}
        </>
    )
}

export default ActOne

// ActOne.test.js
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ActOne from './ActOne'

// fail
it('renders title when clicked', () => {
    render(<ActOne />) // this is wrapped in act()

    userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('Clicked')).toBeInTheDocument()
})

// success

it('renders title when clicked', async () => {
    render(<ActOne />) // this is wrapped in act()

    await waitFor(() => userEvent.click(screen.getByRole('button')))

    expect(screen.getByText('Clicked')).toBeInTheDocument()
})

```

testing-library/react overrides eventWrapper() so the event functions are executed in act().

[code source](https://github.com/testing-library/react-testing-library/blob/main/src/pure.js#L21-L23)

```js
import { configure as configureDTL } from '@testing-library/dom';
import act from './act-compat';// overried
configureDTL({
  eventWrapper: cb => { // like userEvent.click()
    let result;
    act(() => {
      result = cb();
    });
    return result;
  },
})
```

因此就不用再用act去包裹userEvent了

```js
// ❌
act(() => {
    userEvent.click(screen.getByText('Component'));
});
// ✅
userEvent.click(screen.getByText('Component'));
```

当然，RTL的render也wrap了

```
function render(ui, { hydrate = false, ...rest }) {
  (...)
  act(() => {
    if (hydrate) {
      ReactDOM.hydrate(wrapUiIfNeeded(ui), container)
    } else {
      ReactDOM.render(wrapUiIfNeeded(ui), container)
    }
  })
 (...)
}
```

```js
// App.js
import { useEffect, useState } from "react";

const App = () => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/1"
      );
      const { title } = await response.json();

      setTitle(title); // this happens after the test is done
    };

    fetchData();
  }, []);

  return <>{title}</>;
};

// App.test.js
import { render, screen } from "@testing-library/react";

it("renders title", () => {
  jest.spyOn(window, "fetch").mockResolvedValue({
    json: async () => ({ title: "Fetched" }),
  });

  render(<App />);
   
  // this happens before the state update is scheduled
  expect(screen.getByText("Fetched")).toBeInTheDocument();
});
````

waitFor , waitForElementToBeRemoved or findBy . async utilities

### 什么时候用userEvent和fireEvent

consider fireEvent being the low-level api, while userEvent sets a flow of actions.

[userEvent.click code](https://github.com/testing-library/user-event/blob/5feaa942f46bb37d96c2f2fbeb4b33e8beff75ad/src/click.js#L87-L103)

You can see that depending of which element you are trying to click, userEvent will do a set of different actions (e.g. if it's a label or a checkbox).

useEvent触发的事件行为更像用户在真实的浏览器触发的，比如`fireEvent.change()`只会触发一次change事件，`userEvent.type`也会触发一次change事件，但也会触发`keyDown, keyPress, keyUp events`.

以这个例子为例：

```tsx {18,22}
describe('Search', () => {
  test('calls the onChange callback handler', async () => {
    const onChange = jest.fn()

    render(
      <Search
        value=""
        onChange={onChange}>
        Search:
      </Search>
    )

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'JavaScript' },
    })

    // success
    expect(onChange).toHaveBeenCalledTimes(1)

    await userEvent.type(screen.getByRole('textbox'), 'JavaScript')
    // success
    expect(onChange).toHaveBeenCalledTimes(10)
  })
})
```
断言都pass了，但明显userEvent时，onchange执行10次更加符合真实的场景

```js
// ❌
fireEvent.change(input, {target: {value: 'hello world'}})

// ✅
userEvent.type(input, 'hello world')
```
`@testing-library/user-event` 是在 `fireEvent` 基础上实现的，但它提供了一些更接近用户交互的方法。上面这个例子中，`fireEvent.change` 其实只触发了 `Input` 的一个 `Change `事件。但是 `type` 则可以对每个字符都会触发 `keyDown、keyPress 和 keyUp 一系列事件。这能更接近用户的真实交互场景。好处是可以很好地和你当前那些没有监听 Change 事件的库一起使用。

我们现在还在进行` @testing-library/user-event `这个库的开发，来保证它能像它承诺的那样：能够触发用户在执行特定操作时会触发的所有相同事件。不过，现在它还没完全做到这一点，这也是为什么它还没有合入 @testing-library/dom （可能在未来的某个时候会合入）。但是，我对它有足够的信心，建议你多关注和使用它，而不是 fireEvent。
### 什么时候得用act

##### 当使用`jest.useFakeTimers()`时

mockfunction 的类型错误

https://www.benmvp.com/blog/using-jest-mock-functions-typescript/

使用[eslint-plugin-testing-library](https://github.com/testing-library/eslint-plugin-testing-library) 去避免没有必要的act包裹

不推荐用 waitFor 等待 find* 的查询结果
```js
// ❌
const submitButton = await waitFor(() =>
    screen.getByRole('button', {name: /submit/i}),
)

// ✅
const submitButton = await screen.findByRole('button', {name: /submit/i})
```

- [When should I use act() in react-testing-library?](https://flyingsquirrel.medium.com/when-should-i-use-act-in-react-testing-library-d7dd22a3340e)
- [act](https://github.com/threepointone/react-act-examples/blob/master/sync.md)
- [You Probably Don’t Need act() in Your React Tests](https://javascript.plainenglish.io/you-probably-dont-need-act-in-your-react-tests-2a0bcd2ad65c)
- [React Testing Library Tutorial](https://www.robinwieruch.de/react-testing-library/)
- [Making sure you're using the correct query](https://timdeschryver.dev/blog/making-sure-youre-using-the-correct-query)
- [使用 `React Testing Library` 的 15 个常见错误](https://mp.weixin.qq.com/s/pgdcDNjDGPgNq76Zh_dZxg)
- [testing-playground](https://testing-playground.com/)
