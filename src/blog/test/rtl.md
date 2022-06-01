title: RTL
layout: BlogLayout
------------------

[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) 基于`DOM Testing Library`的基础上添加一些API，主要用于测试React组件。如果是其它的技术栈，可以选择对应的[`Testing Library`](https://testing-library.com/) 库。该库在使用过程并不关注组件的内部实现，而是更关注测试。该库基于`react-dom`和`react-dom/test-utils`，是以上两者的轻量实现。

## Guide

### 安装

```shell
pnpm i @testing-library/react @testing-library/user-event @testing-library/react-hooks  @testing-library/jest-dom -D
# 基于eslint和testing library的最佳实践去提示避免一些场景错误
pnpm i eslint-plugin-testing-library -D
```

- `@testing-library/dom`: 一个轻量级的(DOM 查询、交互)测试解决方案,它使用了一种与 ”用户的在页面中查找元素" 类似的DOM查询方式，以保证准确性;
- `@testing-library/react`: 在 `@testing-library/dom` 基础上，将 React 组件渲染为 DOM 便于后边测试;
- `@testing-library/user-event`: 提供了更加高级的浏览器交互模拟 – 即事件;
- `@testing-library/jest-dom`：追加一系列辅助测试 DOM 的 `matchers` 匹配器，需要在每个 react test 文件的顶部引用，否则类似 `expect(dom).toBeInTheDocument()` 这样的断言则没法用，可以在setup中统一处
- `@testing-library/react-hooks`: 测试hooks的
- `eslint-plugin-testing-library`: 基于eslint和testing library的最佳实践去提示避免一些场景错误

### 3. 基本能力

基本能力
组件渲染(render)
元素查找(get/query/find)
事件触发(fireEvent)

### 使用

在编写单元测试过程中，可以按照AAA模式实现。

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

examole:

```
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
        <input id="search" type="text" value={value} onChange={onChange} />
      </div>
    </div>
  )
}

```

```
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
      <Search value="" onChange={onChange}>
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

### 5.常用API

`render`

render的参数：

```
render(
    ui: React.ReactElement<any>,
    options?: {
        container, //
        baseElement,
        wrapper, //
        queries //用于自定义选择器
    }
)
```

render的结果：

```
{
    ...queries, //选择器，例如(get/query/find)By(Text/Label/...)
    container: HTMLDivElement,//自动创建一个div,并插入到body中
    baseElement: HTMLBodyElement, //相当于document.body
    debug: Function, //打印当前document.body
    rerender: Function, //重新渲染组件
    unmount: Function, //组件卸载，此时container.innerHTML === ''
    asFragment:Function //记录某个时刻的dom
}
```

render的例子：

```
//列出的是常用的
{queryByText, container, baseElement, debug, rerender, unmount} = render(conponent)
```

`cleanup`

相当于给组件置成unmount,一般在afterEach()中执行，如果使用的Jest,不需要在afterEach中手动设置，框架已默认每次test结束后执行cleanup。

`Queries`


| search type<br/>（单个元素） | search type<br/>（多个元素） | function<br/>（查询单个元素）                                                                                          | 适用场景                                          |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| getBy                        | getAllBy                     | getByText<br/>getByRole<br/>getByLabelText<br/>getByPlaceholderText<br/>getByAltText<br/>getByDisplayValue             | 由于只返回元素或error，适用于确定该元素存在的情况 |
| queryBy                      | queryAllBy                   | queryByText<br/>queryByRole<br/>queryByLabelText<br/>queryByPlaceholderText<br/>queryByAltText<br/>queryByDisplayValue | 用于元素可能不存在                                |
| findBy                       | findAllBy                    | findByText<br/>findByRole<br/>findByLabelText<br/>findByPlaceholderText<br/>findByAltText<br/>findByDisplayValue       | 用于异步元素                                      |

```
LabelText: getByLabelText: **<label for="search" />**
PlaceholderText: getByPlaceholderText: **<input placeholder="Search" />**
AltText: getByAltText: **<img alt="profile" />**
DisplayValue: getByDisplayValue: **<input value="JavaScript" />**
TestId: getByTestId: **<div data-testid='search'>**</div>
```

`fireEvent`

```
fireEvent(node, event)
```

[events API](https://testing-library.com/docs/dom-testing-library/api-events)

`act`

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

`waitFor`

用于异步

```
waitFor(Promise)
```

`screen`

screen的方法继承自queries, queries有的能力都有，此外还增加了debug()的能力.


### 补充

（1） 关于更多自定义的东西，例如render、选择器以及与Jest有的配置，查阅[官方文档](https://testing-library.com/docs/react-testing-library/setup/) 吧，写得很清楚.

（2）对于dom的一些断言，可以添加testing-library库提供的jest-dom/extend-expect来更好得对dom进行断言。

```
//引入
import '@testing-library/jest-dom/extend-expect'
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


### [act](https://reactjs.org/docs/testing-recipes.html#act)

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

### 什么时候得用act

##### 当使用`jest.useFakeTimers()`时

mockfunction 的类型错误

https://www.benmvp.com/blog/using-jest-mock-functions-typescript/

使用[eslint-plugin-testing-library](https://github.com/testing-library/eslint-plugin-testing-library) 去避免没有必要的act包裹

- [When should I use act() in react-testing-library?](https://flyingsquirrel.medium.com/when-should-i-use-act-in-react-testing-library-d7dd22a3340e)
- [](https://github.com/threepointone/react-act-examples/blob/master/sync.md)
- [You Probably Don’t Need act() in Your React Tests](https://javascript.plainenglish.io/you-probably-dont-need-act-in-your-react-tests-2a0bcd2ad65c)
- [React Testing Library Tutorial](https://www.robinwieruch.de/react-testing-library/)