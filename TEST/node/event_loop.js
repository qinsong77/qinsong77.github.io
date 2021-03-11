//
// setTimeout(() => console.log(1));
//
// setImmediate(() => console.log(2));
//
// process.nextTick(() => console.log(3));
//
// Promise.resolve().then(() => console.log(4));
//
// console.log(5);

// 5 3 4 1 2



// process.nextTick(() => console.log(1));
//
// Promise.resolve().then(() => console.log(2));
//
// process.nextTick(() => console.log(3));
//
// Promise.resolve().then(() => {
// 	process.nextTick(() => console.log(0));
// 	console.log(4);
// });

// 输出为 1 3 2 4 0, nextTick队列优先级高于同一轮事件循环中其他microtask队列

process.nextTick(() => console.log(1));

console.log(0);

setTimeout(()=> {
	console.log('timer1');

	Promise.resolve().then(() => {
		console.log('promise1');
	});
}, 0);

process.nextTick(() => console.log(2));

setTimeout(()=> {
	console.log('timer2');

	process.nextTick(() => console.log(3));

	Promise.resolve().then(() => {
		console.log('promise2');
	});
}, 0);

/**
0
1
2
timer1
promise1
timer2
3
promise2
**/
