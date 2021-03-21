var promisesAplusTests = require('promises-aplus-tests')
const promise = require('./promise')
promisesAplusTests(promise, function (err) {
	// All done; output is in the console. Or check `err` for number of failures.
})
