console.time()
const fs = require('fs')

const file = fs.createWriteStream('./big.txt')

for(let i = 0; i <= 5000000;i++) {
	file.write('test');
}
file.end();
console.timeEnd()
