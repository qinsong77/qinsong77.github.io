const fs = require('fs');

const readFileThunk = (filename) => {
  return (callback) => {
    fs.readFile(filename, callback)
  }
}

function * gen () {
  const data1 = yield readFileThunk('1.text')
  console.log(data1.toString())
  const data2 = yield readFileThunk('2.text')
  console.log(data2.toString())
}

const g = gen();

g.next()
  .value((err, data1) => {
    console.log(err)
    console.log(data1.toString())
    g.next(data1).value((err, data2) => {
      g.next(data2);
    })
  })
