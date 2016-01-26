var Fx23StringReader = require('../lib/main').stringReader;
var assert = require('assert');

describe('suite 1', function() {
    it('spec 1', function() {
        var str = '   abcdef\r\na b c\nMgen123abc';

        // initialize the reader
        var reader = new Fx23StringReader(str);
        // counts lineIndex and columnIndex during each read operation
        reader.collectLineInfo = true;

        reader.moveToContent();
        assert.equal(reader.peek(), 'a');
        assert.equal(reader.lineIndex, 0);
        assert.equal(reader.columnIndex, 3);
        assert.equal(reader.visibleIndex, 3);
        assert.equal(reader.index, 3);

        assert.equal(reader.collectWhile(function (c) {
            return c != 'e';
        }), 'abcd');
        assert.equal(reader.peek(), 'e');
        assert.equal(reader.lineIndex, 0);
        assert.equal(reader.columnIndex, 7);
        assert.equal(reader.visibleIndex, 7);
        assert.equal(reader.index, 7);

        assert.equal(reader.collectLine(), 'ef');
        assert.equal(reader.peek(), 'a');
        assert.equal(reader.lineIndex, 1);
        assert.equal(reader.columnIndex, 0);
        assert.equal(reader.visibleIndex, 9);
        assert.equal(reader.index, 11);

        reader.skipLine();
        assert.equal(reader.peek(), 'M');
        assert.equal(reader.lineIndex, 2);
        assert.equal(reader.columnIndex, 0);
        assert.equal(reader.visibleIndex, 14);
        assert.equal(reader.index, 17);

        reader.skipWhile(function (c) {
            return isNaN(c);
        });
        assert.equal(reader.peek(), '1');
        assert.equal(reader.lineIndex, 2);
        assert.equal(reader.columnIndex, 4);
        assert.equal(reader.visibleIndex, 18);
        assert.equal(reader.index, 21);

        assert.equal(reader.collectWhile(function (c) {
            return !isNaN(c);
        }), '123');
        assert.equal(reader.peek(), 'a');
        assert.equal(reader.lineIndex, 2);
        assert.equal(reader.columnIndex, 7);
        assert.equal(reader.visibleIndex, 21);
        assert.equal(reader.index, 24);

        reader.mark();
        while (reader.hasNext()) {
            reader.next();
        }
        assert.equal(reader.collect(), 'abc');
        assert.equal(reader.hasNext(), false);
    });
});
