const decoder = new TextDecoder();
const encoder = new TextEncoder();

const readableStream = new ReadableStream({
  start(controller) {
    const text = "Stream me!";
    controller.enqueue(encoder.encode(text));
    controller.close();
  },
});

const transformStream = new TransformStream({
  transform(chunk, controller) {
    const text = decoder.decode(chunk);
    console.log(text)
    controller.enqueue(encoder.encode(text.toUpperCase()));
  },
});

const writableStream = new WritableStream({
  write(chunk) {
    console.log(decoder.decode(chunk));
  },
});

readableStream
  .pipeThrough(transformStream)
  .pipeTo(writableStream); // STREAM ME!
