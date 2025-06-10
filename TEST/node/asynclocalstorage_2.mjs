import { AsyncLocalStorage } from 'node:async_hooks'

const asyncLocalStorage = new AsyncLocalStorage()

for (let requestId = 0; requestId < 10; requestId++) {
  asyncLocalStorage.run(requestId, () => {
    f()
    console.log('for loop requestId', asyncLocalStorage.getStore())
  })
}

function f() {
  x()
  console.log('f() requestId', asyncLocalStorage.getStore())
}

function x() {
  console.log('x() requestId', asyncLocalStorage.getStore())

  setTimeout(() => {
    console.log('x() setTimeoutrequestId', asyncLocalStorage.getStore())
  })
}
