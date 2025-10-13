# react router

## loader

### 只有loader时，来自server
- `useLoaderData`, 指获取到当前`route loader`中的数据。
- `useRouteLoaderData("root" | "routeId")`，获取root loader或者对呀routeId loader的数据
- Layout的loader数据，通过`useRouteLoaderData`获取

### clientLoader和loader同时存在时

- 直接访问时ssr渲染，**如果没加`clientLoader.hydrate`**, clientLoader都不执行（不管加没加`await serverLoader()`)，客户端跳转时才执行，这个时候就相当于只要server loader, props和useLoaderData的数据都是来自loader
- 所以一定要加`clientLoader.hydrate = true as const`，加了也是props和useLoaderData的数据都是来自loader，hydrate后有重新渲染，然后变成了clientLoader的数据
- clientLoader 默认会覆盖 loader 的数据（如果是客户端跳转）
- route Props 只包含clientLoader 的数据，要么合并（如果是客户端跳转）
- useLoaderData 只包含 clientLoader 的数据（如果是客户端跳转）
- **只使用一种loader比较好**

```ts
export async function clientLoader({ context, serverLoader }: Route.ClientLoaderArgs) {
  // 获取服务端 loader 的数据
  const serverData = await serverLoader()
  
  const nonCriticalData = await new Promise<number[]>((resolve) => {
    setTimeout(() => {
      logger.info('nonCriticalData resolved 222')
      resolve([10, 30, 60])
    }, 3000)
  })
  
  // 合并数据而不是覆盖
  return {
    ...serverData,  // 保留服务端数据
    text: 'clientLoader',
    clientLoaderData: nonCriticalData,
  }
}

// 设置 hydrate 为 true
clientLoader.hydrate = true as const
```
