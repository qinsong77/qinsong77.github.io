# Next.js - latest(v14)

## RSC与SSR、SSG

SSG是后端**编译时**方案。使用SSG的业务，后端代码在编译时会生成HTML（通常会被上传CDN）。当前端发起请求后，后端（或CDN）始终会返回编译生成的HTML。

RSC与SSR则都是后端**运行时**方案。也就是说，他们都是前端发起请求后，后端对请求的实时响应。根据请求参数不同，可以作出不同响应。

同为后端运行时方案，RSC与SSR的区别主要体现在输出产物：

- 类似于SSG，SSR的输出产物是HTML，浏览器可以直接解析
- RSC会流式输出一种类JSON的数据结构，由前端的React相关插件解析

## SSG

## SSR

在`app`路由下，只要我们的组件是使用 `async` 进行了修饰的，都会默认开启SSR.

## ISR

SSG 的优点就是快，部署不需要服务器，任何静态服务空间都可以部署，而缺点也是因为静态，不能动态渲染，每添加一篇博客，就需要重新构建。所以有了`ISR`，**增量静态生成**，可以在一定时间后重新生成静态页面，不需要手动处理。

app路由实现ISR，需要利用到`fetch`的缓存策略，在请求接口的时候，添加参数`revalidate`，来指定接口的缓存时间，让它在一定时间过后重新发起请求。

```tsx
export default async function PokemonName({
  params
}: {
  params: { name: string }
}) {
  const { name } = params
  // revalidate表示在指定的秒数内缓存请求，和pages目录中revalidate配置相同
  const res = await fetch('http://localhost:3000/api/pokemon?name=' + name, {
    next: { revalidate: 60, tags: ['collection'] },
    headers: { 'Content-Type': 'application/json' }
  })

  return <p>...</p>
}
```

但是在通常情况下，静态页面更新实际上没有那么频繁，但是有些情况有需要连续更新（发布博客有错别字），这个时候其实需要一种能手动更新的策略，来发布指定的静态页面。

### On-demand Revalidation（按需增量生成）

NextJS提供了更新静态页面的方法，可以在 `app` 目录下新建一个 `app/api/revalidate/route.ts`接口，用于实现触发增量更新的接口。

为了区分需要更新的页面，可以在调接口的时候传入更新的页面路径，也可以传入在fetch请求中指定的`collection`变量。

```ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

// 手动更新页面
export async function GET(request: NextRequest) {
  // 保险起见，这里可以设置一个安全校验，防止接口被非法调用 simple way, 不能设置为NEXT_PUBLIC_xx，会被打包到浏览器可访问
  if (request.query.secret !== process.env.UPDATE_SSG_SECRET) {
    return NextResponse.json(
      { data: error, message: 'Invalid token' },
      {
        status: 401
      }
    )
  }
  const path = request.nextUrl.searchParams.get('path') || '/pokemon/[name]'

  // 这里可以匹配fetch请求中指定的collection变量
  const collection =
    request.nextUrl.searchParams.get('collection') || 'collection'

  // 触发更新
  revalidatePath(path)
  revalidateTag(collection)

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
    cache: 'no-store'
  })
}
```

如果数据库中的内容有修改，访问`http://localhost:3000/api/revalidate?path=/pokemon/Charmander`, 就可以实现`/pokemon/Charmander`这个路由的手动更新。

### 兜底策略

静态页面在生成期间，如果用户访问对应路由会报错，这时需要有一个兜底策略来防止这种情况发生。

Next.js在组件中指定了`dynamicParams`的值（true默认），当`dynamicParams`设置为true时，当请求尚未生成的路由段时，页面将通过SSR这种方式来进行渲染。

```js
export const dynamicParams = true
```

## ENV

- 默认情况下，环境变量只能在`server`端获取
- 以`NEXT_PUBLIC_`开始的环境变量，会在打包的时候替换成固定的值。一定要按这种格式获取`process.env.[variable]`，variable不能是dynamic的
- 非`NEXT_PUBLIC_`会保留原始的代码，比如打包后的代码也是`process.env.DB_PASSWORD`

load Order

1. `process.env`
2. `.env.$(NODE_ENV).local`
3. `.env.local (Not checked when NODE_ENV is test.)`
4. `.env.$(NODE_ENV)`
5. `.env`

`.env` 文件会如果有会被打包进去， local文件不会

比如`DB_PASSWORD="123" NEXT_PUBLIC_API_URL="1231" node dist/standalone/server.js`启动服务，DB_PASSWORD="123"优先级最高，但NEXT_PUBLIC_API_URL不会变，还是打包时的替换值

## Data fetch

- [How to fetch data in React [2024]](https://www.robinwieruch.de/react-fetching-data/)

#### (RSC) 数据获取

- 特点：在服务器端执行，直接返回HTML给客户端，并且是 Streaming UI。
- 适用场景：使用支持RSC的框架（如Next.js）。
- 优势：避免客户端-服务器通信往返，直接访问服务器端数据源。

```tsx
import { getPosts } from '@/features/post/queries/get-posts'

const PostsPage = async () => {
  const posts = await getPosts()

  return (
    <div>
      <h1>React Server Component</h1>

      <ul>{posts?.map((post) => <li key={post.id}>{post.title}</li>)}</ul>
    </div>
  )
}

export default PostsPage
```

#### React Query

在client, 即RCC组件中使用

- 特点：客户端数据获取，提供hooks用于数据获取、缓存和更新。
- 适用场景：客户端渲染的React应用（SPA）。
- 优势：处理缓存、竞态条件和陈旧数据
- 不能实现stream ui(也不用提，本身就是client发起请求的)

这里的`getPosts`和服务端的有所区别：要使用a remote API over HTTP / endpoint

```tsx
export const getPosts = async () => {
  const response = await fetch('/api/posts')
  return response.json()
}
```

而RSC就可以直接访问数据库：

```ts
export const getPosts = async () => {
  return await db.query('SELECT * FROM posts')
}
```

---

```tsx
'use client'

import { getPosts } from '@/features/post/queries/get-posts'
import { useQuery } from '@tanstack/react-query'

const PostsPage = () => {
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts
  })

  return (
    <div>
      <h1>React Query</h1>

      <ul>{posts?.map((post) => <li key={post.id}>{post.title}</li>)}</ul>
    </div>
  )
}

export default PostsPage
```

#### RSC + RCC

- 特点：服务器端获取初始数据，客户端继续使用React Query获取数据。初始化时是 streaming ui
- 适用场景：需要初始数据快速加载和客户端无限滚动等高级数据获取模式。
- 优势：结合服务器端和客户端数据获取的优势。

```tsx
import { getPosts } from '@/features/post/queries/get-posts'
import { PostList } from './_components/post-list'

const PostsPage = async () => {
  const posts = await getPosts()

  return (
    <div>
      <h1>React Server Component + React Query</h1>

      <PostList initialPosts={posts} />
    </div>
  )
}

export default PostsPage
```

---

```tsx
'use client'

import { getPosts } from '@/features/post/queries/get-posts'
import { Post } from '@/features/post/types'
import { useQuery } from '@tanstack/react-query'

type PostListProps = {
  initialPosts: Post[]
}

const PostList = ({ initialPosts }: PostListProps) => {
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    initialData: initialPosts
  })

  return <ul>{posts?.map((post) => <li key={post.id}>{post.title}</li>)}</ul>
}

export { PostList }
```

**可以用Server Actions, 在server和client重复使用，这样就不用反复声明了**，但要注意鉴权如果接口需要的话

**也可以从RSC中传入一个promise到RCC,当作init promise, 并用`Suspense` wrap RCC, 也能实现streaming UI，并且client也能update data**

> 但 client update promise时，组件也会fallback 到最近的`Suspense`，组件就会消失而显示Suspense 的fallback，可以通过 [useTransition](https://19.react.dev/reference/react/useTransition), refer: [Preventing unwanted loading indicators ](https://19.react.dev/reference/react/useTransition#preventing-unwanted-loading-indicators)

```ts
// in RCC
const [promise, setPromise] = useState(initPromise)
const data = use(promise)
// update promise to get new data due to some user interaction
const onClick = () => {
  setPromise()
}
```

#### use Api

`use(Promise)`

- 允许将Promise从服务器组件传递到客户端组件。
- 适用场景：需要在客户端组件中解析服务器组件的异步操作。
- 优势：避免阻塞服务器组件的渲染，也能实现streaming UI。
- 也可以将Promise管理为state，更新promise 重新获取数据
- use会找最近的`Suspense`组件显示`fallback`

```tsx
import { Suspense } from 'react'
import { getPosts } from '@/features/post/queries/get-posts'
import { PostList } from './_components/post-list'

const PostsPage = () => {
  const postsPromise = getPosts()

  return (
    <div>
      <h1>use(Promise) RSC</h1>

      <Suspense>
        <PostList promisedPosts={postsPromise} />
      </Suspense>
    </div>
  )
}

export default PostsPage
```

---

```tsx
'use client'

import { use } from 'react'
import { Post } from '@/features/post/types'

type PostListProps = {
  promisedPosts: Promise<Post[]>
}

const PostList = ({ promisedPosts }: PostListProps) => {
  const posts = use(promisedPosts)

  return <ul>{posts?.map((post) => <li key={post.id}>{post.title}</li>)}</ul>
}

export { PostList }
```

Another example:

```tsx
const UseHookExample = () => {
  const [findPetsByStatusPromise, setFindPetsByStatusPromise] = useState(() =>
    findPetsByStatus({ status: undefined })
  )
  return (
    <div>
      <h3 className="my-2">Find Pets By Status</h3>
      <Select
        onValueChange={(value: FindPetsByStatusStatus) => {
          setFindPetsByStatusPromise(findPetsByStatus({ status: value }))
        }}
      >
        <SelectTrigger className="w-[230px]">
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            {Object.entries(FindPetsByStatusStatus).map(([key, text]) => (
              <SelectItem value={key} key={key}>
                {text}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Separator className="mt-4" />
      <Suspense
        fallback={
          <p className="my-4 text-sm text-muted-foreground">loading...</p>
        }
      >
        <PetsStatusList findPetsByStatusPromise={findPetsByStatusPromise} />
      </Suspense>
    </div>
  )
}

const PetsStatusList = ({
  findPetsByStatusPromise: initP
}: {
  findPetsByStatusPromise: ReturnType<typeof findPetsByStatus>
}) => {
  const [counter, setCounter] = useState(0)
  // 也可以内部自己管理promise
  // const [findPetsByStatusPromise, setFindPetsByStatusPromise] = useState(initP)
  const resp = use(findPetsByStatusPromise)
  return (
    <div>
      <Button
        onClick={() =>
          // 自己更新
          setFindPetsByStatusPromise(
            findPetsByStatusPromise({ status: FindPetsByStatusStatus.sold })
          )
        }
      >
        update
      </Button>
      {resp.map(({ name, status, photoUrls }) => (
        <ul className="my-2 gap-1 py-2" key={name}>
          <li>name: {name}</li>
          <li>status: {status}</li>
          <li className="text-sm text-muted-foreground">
            photoUrls: {photoUrls.join(',')}
          </li>
        </ul>
      ))}
      <p>counter: {counter}</p>
      <Button onClick={() => setCounter(counter + 1)}>add</Button>
    </div>
  )
}
```

#### tRPC

tRPC 类型安全数据获取

- 特点：提供类型安全的API层。
- 适用场景：需要类型安全的全栈解决方案。
- 优势：避免运行时错误，提升开发体验。

### Streaming Server Rendering with Suspense

想要streaming一定要加Suspense，如果不在对应的async 组件套suspense，会一直冒泡到上层去找Suspense，可能就没有streaming的效果

rcc引入 rsc

rsc和rcc交叉的组件，是怎么渲染的 nested component

react use和 Suspense

- https://react.dev/reference/react/Suspense
- https://react.dev/reference/react/use
- https://react.dev/reference/react/useDeferredValue

## Chore

#### NextJS 代理服务器阻塞了SSE的流式数据传输

SSE 与 WebSocket 作用相似，都是建立浏览器与服务器之间的通信渠道，然后服务器向浏览器推送信息。WebSocket 更强大和灵活。因为它是全双工通道，可以双向通信；SSE 是单向通道，只能服务器向浏览器发送，因为流信息本质上就是下载。

解决办法：服务端接口的 Response Header 内通过设置Cache-Control 为 no-cache, no-transform

`revalidatePath`是在server action使用

## 原理

- [How Do Server Actions Work in NextJS?](https://codelynx.dev/posts/how-work-server-actions)

## Libraries

- [nuqs](https://github.com/47ng/nuqs) Type-safe search params state manager for Next.js - Like React.useState, but stored in the URL query string.
- [next-safe-action](https://github.com/TheEdoRan/next-safe-action) Type safe and validated Server Actions in your Next.js project.
