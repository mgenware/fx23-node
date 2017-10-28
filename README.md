# Fx23

[![Build Status](https://travis-ci.org/mgenware/fx23-node.svg?branch=master)](http://travis-ci.org/mgenware/fx23-node)
[![npm version](https://badge.fury.io/js/fx23.svg)](https://badge.fury.io/js/fx23)
[![Node.js Version](http://img.shields.io/node/v/fx23.svg)](https://nodejs.org/en/)

Text scanner, available in [Node.js](https://github.com/mgenware/fx23-node), [C#](https://github.com/mgenware/fx23-csharp) and [Objective-C](https://github.com/mgenware/fx23-objc).

Installation:
```sh
# yarn
yarn add fx23
# npm
npm install fx23 --save
```

Run tests:
```sh
# yarn
yarn test
# npm
npm test
```

# API
## Fx23StringReader Class (Core Members)
### Properties
* `collectLineInfo` counts lineIndex and columnIndex during each read operation, default is false.
* `index` the index position of current character.
* `columnIndex` zero-based column number of current character at current line.
* `lineIndex` zero-based line number of current character.
* `visibleIndex` the index position of current character without newline characters.
* `length` total length of the string.

### Methods
* `hasNext` returns false if no more character to read.
* `peek` returns the next character without moving the internal index.
* `next` returns the next character and move the internal index forward.
* `mark` marks a flag at current position.
* `collect` returns a sub-string from last marked position to current position.
* `nextOverride` implementated by subclass.
* `peekOverride` implementated by subclass.

## Fx23StringReader Class (Extension Members)
These methods are built onto the core members.
### Methods
* `collectWhile` moves forward while condition is true, and returns the string scanned.
* `skipWhile` moves forward while condition is true.
* `moveToContent` moves to next non-whitespace character.
* `skipLine` moves to next line.
* `collectLine` moves to next line and returns current line.

# Example
```javascript
// ES6+
const { Fx23StringReader } = require('fx23');

// the string we need to scan
const str = '   abcdef\r\na b c\nMgen123abc';

// initialize the reader
const reader = new Fx23StringReader(str);
// counts lineIndex and columnIndex during each read operation
reader.collectLineInfo = true;

console.log('Move to content');
reader.moveToContent();
printInfo(reader);
/*
 Reader position:
 "   abcdef\r\na b c\nMgen123abc"
  ---|------ - ------ ----------

 Output:
 Move to content
 Current char: 'a'
 Line: 1
 Column: 4
 Index(without newline): 3
 Index: 3

 */

console.log('Read until "e"');
console.log('Result -> %s', reader.collectWhile((c) => {
  return c != 'e';
}));
printInfo(reader);
/*
 Reader position:
 "   abcdef\r\na b c\nMgen123abc"
  ---====|-- - ------ ----------

 Output:
 Read until 'e'
 Result -> abcd
 Current char: "e"
 Line: 1
 Column: 8
 Index(without newline): 7
 Index: 7
 */

console.log('Get remaining characters in current line');
console.log('Result -> %s', reader.collectLine());
printInfo(reader);
/*
 Reader position:
 "   abcdef\r\na b c\nMgen123abc"
  -------==- - |----- ----------

 Output:
 Get remaining characters in current line
 Result -> ef
 Current char: 'a'
 Line: 2
 Column: 1
 Index(without newline): 9
 Index: 11

 */

console.log('Skip the whole line');
reader.skipLine();
printInfo(reader);
/*
 Reader position:
 "   abcdef\r\na b c\nMgen123abc"
  ---------- - ------ |---------

 Output:
 Skip the whole line
 Current char: 'M'
 Line: 3
 Column: 1
 Index(without newline): 14
 Index: 17

 */

console.log('Skip to first number');
reader.skipWhile((c) => {
  return isNaN(c);
});
printInfo(reader);
/*
 Reader position:
 "   abcdef\r\na b c\nMgen123abc"
  ---------- - ------ ----|-----

 Output:
 Skip to first number
 Current char: '1'
 Line: 3
 Column: 5
 Index(without newline): 18
 Index: 21

 */

console.log('Read all numbers');
console.log(reader.collectWhile(function (c) {
  return !isNaN(c);
}));
printInfo(reader);
/*
 Reader position:
 "   abcdef\r\na b c\nMgen123abc"
  ---------------------------|--

 Output:
 Read all numbers
 123
 Current char: 'a'
 Line: 3
 Column: 8
 Index(without newline): 21
 Index: 24

 */

console.log('Read to end using mark and collect');
reader.mark();
while (reader.hasNext()) {
  reader.next();
}
console.log('Result -> %s', reader.collect());
/*
 Reader position:
 "   abcdef\r\na b c\nMgen123abc"
  ---------------------------===

 Output:
 Result -> abc

 */

function printInfo(reader) {
  var curChar;
  if (reader.hasNext()) {
    curChar = reader.peek();
  } else {
    curChar = 'End of string';
  }
  console.log("Current char: '%s'\nLine: %d\nColumn: %d\nIndex(without newline): %d\nIndex: %d\n",
    curChar,
    reader.lineIndex + 1,
    reader.columnIndex + 1,
    reader.visibleIndex,
    reader.index);
}
```

# License
[MIT](LICENSE)
