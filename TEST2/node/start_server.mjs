import { createServer } from 'node:http';

process.nextTick(() => {
  // do something
  console.log("process")
});

setTimeout(() => {
  console.log('setTimeout')
}, 0)

const hostname = '127.0.0.1';
const port = 3000;
const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
