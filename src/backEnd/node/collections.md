# collections

## Library
- [Lottie](https://airbnb.io/lottie/#/) parses Adobe After Effects **animations** exported as **JSON** with Bodymovin and renders them natively on mobile and on the web!

## Node

- [t3](https://github.com/t3-oss/create-t3-app) The best way to start a full-stack, typesafe Next.js app
- [Blitz](https://blitzjs.com/) Blitz picks up where Next.js leaves off, providing battle-tested libraries and conventions for shipping and scaling world wide applications.
- [redwoodjs](https://redwoodjs.com/) the full-stack JavaScript application framework. Batteries, backend, React, conventions, and opinions included.

- [Effect](https://effect.website/docs/introduction) Effect is a powerful TypeScript library designed to help developers easily create complex, synchronous, and asynchronous programs.

- [tRPC](https://trpc.io/) Move Fast and Break Nothing. End-to-end typesafe APIs made easy.
  tRPC 是一个基于 TypeScript 的远程过程调用框架，旨在简化客户端与服务端之间的通信过程，并提供高效的类型安全。它允许您使用类似本地函数调用的方式来调用远程函数，同时自动处理序列化和反序列化、错误处理和通信协议等底层细节。

#### tRPC缺点：

首先不如传统的 RESTFUL 来的直观，假设现在在服务端定义了一个服务，那么只能通过`@trpc/client` 创建客户端进行调用。虽然也能用 `http` 的形式，但调用的很不优雅。

RPC 框架通常是可以跨语言进行调用的，比如 `gRPC` 框架，然而tRPC 目前只能在 Typescript 项目中进行调用, 学习成本与项目成本偏高，tRPC 对整个全栈项目的技术要求比较高，并且限定于 typescript

### node日志

- [pino](https://github.com/pinojs/pino)
  - [极致日志记录：Pino 为你带来的性能与便利性](https://mp.weixin.qq.com/s/ZXyu4Bgr3ysl2OP0kG_fgQ)

### ORM

- [drizzle](https://orm.drizzle.team/)
- [prisma](https://www.prisma.io/docs/orm/overview/introduction/what-is-prisma)

## Free mock api

- [DummyJSON](https://dummyjson.com/) it can login and get token
- [pokeapi](https://pokeapi.co/docs/v2)
- [article-Free API – 90+ Public APIs For Testing No Key](https://apipheny.io/free-api/#apis-without-key)
- [MockLib](https://www.mocklib.com/)

## Keeping noticing

### signals

- https://github.com/preactjs/signals

### bun

### serverless

“_Serverless architectures are application designs that incorporate third-party “Backend as a Service” (BaaS) services, and/or that include custom code run in managed, ephemeral containers on a “Functions as a Service” (FaaS) platform._”
