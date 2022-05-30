---
title: RTL
layout: BlogLayout
---

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