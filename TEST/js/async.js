function spawn(genF) {
	return new Promise(function(resolve, reject) {
		const gen = genF();
		function step(nextF) {
			let next;
			try {
				next = nextF();
			} catch(e) {
				return reject(e);
			}
			if(next.done) {
				return resolve(next.value);
			}
			Promise.resolve(next.value).then(function(v) {
				step(function() { return gen.next(v); });
			}, function(e) {
				step(function() { return gen.throw(e); });
			});
		}
		step(function() { return gen.next(undefined); });
	});
}

function timeout(ms) {
	return new Promise((resolve => {
		setTimeout(resolve,ms)
	}))
}
async function asyncPrint(value, ms) {
	await timeout(ms);
	console.log(value);
}

function fn(value, ms) {
	return spawn(function* () {
		yield timeout(ms)
		console.log(value);
	});
}

// asyncPrint('hello world', 2000);
fn('hello world', 2000);
