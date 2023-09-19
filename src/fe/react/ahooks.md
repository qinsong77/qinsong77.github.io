---
title: ahooks解析
---


## State

### usePrevious
保存上一次状态的 Hook。

```ts
import { useRef } from 'react';

export type ShouldUpdateFunc<T> = (prev: T | undefined, next: T) => boolean;

const defaultShouldUpdate = <T>(a?: T, b?: T) => a !== b;

function usePrevious<T>(
  state: T,
  shouldUpdate: ShouldUpdateFunc<T> = defaultShouldUpdate,
): T | undefined {
  const prevRef = useRef<T>();
  const curRef = useRef<T>();

  if (shouldUpdate(curRef.current, state)) {
    prevRef.current = curRef.current;
    curRef.current = state;
  }

  return prevRef.current;
}

export default usePrevious;

```
应该是传入的state是由useState定义的，当state变化，函数组件必然重新运行，usePrevious也会重新运行。

#### 另一个版本

```ts
import { useEffect, useRef } from 'react'

const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>()
  
  useEffect(()=> {
    ref.current = value
  })
  
  return ref.current;
}
```
当state变化， `useEffect` 是副作用，所以会先执行 `return` ，返回的是上一次的值，然后再执行 `useEffect`，`ref.current`变化不会导致重新render。

### useSetState 

```ts
import { useCallback, useState } from 'react';
import { isFunction } from '../utils';

export type SetState<S extends Record<string, any>> = <K extends keyof S>(
  state: Pick<S, K> | null | ((prevState: Readonly<S>) => Pick<S, K> | S | null),
) => void;

const useSetState = <S extends Record<string, any>>(
  initialState: S | (() => S),
): [S, SetState<S>] => {
  const [state, setState] = useState<S>(initialState);

  const setMergeState = useCallback((patch) => {
    setState((prevState) => {
      const newState = isFunction(patch) ? patch(prevState) : patch;
      return newState ? { ...prevState, ...newState } : prevState;
    });
  }, []);

  return [state, setMergeState];
};

export default useSetState;
```
