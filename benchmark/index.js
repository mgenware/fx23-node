const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();
const { Fx23StringReader } = require('..');

// generate a long string joined by random numbers ('3234.23:2323:433.3 ...')
let longString = '1';
for (let i = 0; i <= 1000; i++) {
  longString += Math.random() + ':';
}

function testSplit() {
  return longString.split(':')[10];
}

function testFx23() {
  const reader = new Fx23StringReader(longString);
  for (let i = 0; i < 10; i++) {
    reader.skipWhile(c => c !== ':');
    reader.next();
  }
  return reader.collectWhile(c => c !== ':');
}

if (testSplit() !== testFx23()) {
  throw new Error('Got incorrect results');
}

suite.add('split', () => {
  testSplit();
})
  .add('fx23', () => {
    testFx23();
  })
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', () => {
    console.log('Fastest is ' + suite.filter('fastest').map('name'));
  })
  .run({ async: true });
