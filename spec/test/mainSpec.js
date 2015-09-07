var Fx23StringReader = require('../../src/main').stringReader;

describe('suite 1', function() {
  it("spec 1", function() {
    var str = '   abcdef\r\na b c\nMgen123abc';
    
    // initialize the reader
    var reader = new Fx23StringReader(str);
    // counts lineIndex and columnIndex during each read operation
    reader.collectLineInfo = true;

    reader.moveToContent();
    expect(reader.peek()).toBe('a');
    expect(reader.lineIndex).toBe(0);
    expect(reader.columnIndex).toBe(3);
    expect(reader.visibleIndex).toBe(3);
    expect(reader.index).toBe(3);

    expect(reader.collectWhile(function (c) {
        return c != 'e';
    })).toBe('abcd');
    expect(reader.peek()).toBe('e');
    expect(reader.lineIndex).toBe(0);
    expect(reader.columnIndex).toBe(7);
    expect(reader.visibleIndex).toBe(7);
    expect(reader.index).toBe(7);

    expect(reader.collectLine()).toBe('ef');
    expect(reader.peek()).toBe('a');
    expect(reader.lineIndex).toBe(1);
    expect(reader.columnIndex).toBe(0);
    expect(reader.visibleIndex).toBe(9);
    expect(reader.index).toBe(11);
    
    reader.skipLine();
    expect(reader.peek()).toBe('M');
    expect(reader.lineIndex).toBe(2);
    expect(reader.columnIndex).toBe(0);
    expect(reader.visibleIndex).toBe(14);
    expect(reader.index).toBe(17);
    
    reader.skipWhile(function (c) {
        return isNaN(c);
    });
    expect(reader.peek()).toBe('1');
    expect(reader.lineIndex).toBe(2);
    expect(reader.columnIndex).toBe(4);
    expect(reader.visibleIndex).toBe(18);
    expect(reader.index).toBe(21);
    
    expect(reader.collectWhile(function (c) {
        return !isNaN(c);
    })).toBe('123');
    expect(reader.peek()).toBe('a');
    expect(reader.lineIndex).toBe(2);
    expect(reader.columnIndex).toBe(7);
    expect(reader.visibleIndex).toBe(21);
    expect(reader.index).toBe(24);
    
    reader.mark();
    while (reader.hasNext()) {
        reader.next();
    }
    expect(reader.collect()).toBe('abc');
    expect(reader.hasNext()).toBe(false);
  });
});