var Fx23StringReader = require('./src/main.js').stringReader;

// the string we need to scan
var str = '   abcdef\r\na b c\nMgen123abc';

// initialize the reader
var reader = new Fx23StringReader(str);
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
console.log('Result -> %s', reader.collectWhile(function (c) {
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
reader.skipWhile(function (c) {
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
    console.log('Current char: "%s"\nLine: %d\nColumn: %d\nIndex(without newline): %d\nIndex: %d\n',
          curChar,
          reader.lineIndex + 1,
          reader.columnIndex + 1,
          reader.visibleIndex,
          reader.index);
}
