const { AsyncLocalStorage } = require('node:async_hooks')
const { EventEmitter } = require('events')

const emitter = new EventEmitter()
const store = { id: 1 }
const asyncLocalStorage = new AsyncLocalStorage()

emitter.on('my-event', () => {
  asyncLocalStorage.enterWith(store)
})
emitter.on('my-event', () => {
  asyncLocalStorage.getStore() // Returns the same object
  console.log(asyncLocalStorage.getStore())
})

console.log(asyncLocalStorage.getStore()) // Returns undefined
emitter.emit('my-event')
console.log(asyncLocalStorage.getStore() )// Returns the same object
