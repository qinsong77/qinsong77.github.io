---
title: RTL
---

### [act](https://reactjs.org/docs/testing-recipes.html#act)

当写UI测试时，像rendering, user events, or data fetching的任务都会被看作用户与View的交互，
在断言前，
`react-dom/test-utils`提供act方法确保所有这些动作都更新并且作用到dom上

```js
act(() => {
  // render components
});
// make assertions
```

由于react的更新是异步的，


render() , userEvent , fireEvent 都已经被react包裹了
```js
// App.js
import { useState } from "react";

const App = () => {
  const [title, setTitle] = useState("");

  const handleClick = () => {
    setTitle("Clicked"); // act() in RTL render() makes this update happen
  };

  return (
    <>
      <button onClick={handleClick}>Click me</button>
      {title}
    </>
  );
};

// App.test.js
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

it("renders title when clicked", () => {
  render(<App />); // this is wrapped in act()

  userEvent.click(screen.getByRole("button"));

  expect(screen.getByText("Clicked")).toBeInTheDocument();
});
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