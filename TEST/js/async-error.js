async function test12() {
  try {
    const res = await new Promise((resolve) => {
      setTimeout(() => resolve(2), 2000)
      // throw new Error(`error:${2222}`)
    })
      .then((res) => {
        if (res === 2) {
          throw new Error(`error:${res}`)
        }
        console.log('1111')
        return res
      })
      .catch((e) => {
        // 无论是`promise`内部抛出的错误还是`then`里抛出的错误，都会在这里catch
        console.log('catch e')
        console.log(e)
        return 'error text'
      })
    console.log('return')
    return res
  } catch (e) {
    // 这里catch不了
    console.log('e0')
    console.log(e)
  }
}
test12().then((res) => {
  console.log(res) // undefined
})
async function test() {
  try {
    const res = await new Promise((resolve) => {
      setTimeout(() => resolve(2), 2000)
      throw new Error(`error:${2222}`)
    }).then((res) => {
      if (res === 2) {
        throw new Error(`error:${res}`)
      }
      return res
    })
    console.log('res: ' + res)
    return res
  } catch (e) {
    console.log('e0')
    console.log(e)
  }
  return 'final return'
}

// test().then((res) => {
//   console.log(res) // final return
// }).catch((e) => {
//   console.log('eee: ', e)
// })

/*
  会输出 catch e, try catch中不会输出
  如果删除了promise catch 会输出e0
 */
// test()
async function test2() {
  try {
    await test()
  } catch (e) {
    console.log('e2')
    console.log(e)
  }
}

// test2()

async function test3() {
  const res = await test().catch((e) => {
    console.log('e3')
    console.log(e)
  })
  console.log('res:' + res)
  return 3
}

//test3()
