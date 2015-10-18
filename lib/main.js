'use strict';
function Fx23StringReader(text) {

    this.text = text;
    this.columnIndex = this.index = this.lineIndex = this.visibleIndex = 0;
    this.length = text.length;

    this.collectLineInfo = false;

    this._prevChar = null;
    this._markIndex = 0;

    /* method */
    this.hasNext = function () {
        return this.index < this.length;
    };

    this.peek = function () {
        return this.peekOverride();
    };

    this.next = function () {
        var next = this.nextOverride();
        if (this.collectLineInfo) {
            switch (next) {
                case '\r':
                    this.lineIndex++;
                    this.columnIndex = 0;
                    break;
                case '\n':
                    if (this._prevChar !== '\r') {
                        this.lineIndex++;
                        this.columnIndex = 0;
                    }
                    break;
                default:
                    this.columnIndex++;
                    this.visibleIndex++;
                    break;
            }
        } // end of if
        this._prevChar = next;
        this.index++;
        return next;
    };

    this.mark = function () {
        this._markIndex = this.index;
    };

    this.collect = function () {
        if (this._markIndex === this.index) {
            return null;
        }
        return this.text.substring(this._markIndex, this.index);
    };

    this.nextOverride = function () {
        return this.text.charAt(this.index);
    };

    this.peekOverride = function () {
        return this.nextOverride();
    };

    /* extension methods */
    this.collectWhile = function (predicate) {
        this.mark();
        while (this.hasNext() && predicate(this.peek())) {
            this.next();
        }
        return this.collect();
    };

    this.skipWhile = function (predicate) {
        var count = 0;
        while (this.hasNext() && predicate(this.peek())) {
            this.next();
            count++;
        }
        return count;
    };

    this.moveToContent = function () {
        return this.skipWhile(function (c) {
            return c.trim() === '';
        });
    };

    this.moveOverNewline = function () {
        if (this.hasNext()) {
            var c = this.peek();
            if (c === '\r') {
                this.next();

                if (this.hasNext() && this.peek() === '\n') {
                    this.next();
                    return 2;
                }
                return 1;
            }
            else if (c === '\n') {
                this.next();
                return 1;
            }
        }
        return 0;
    };

    this.skipLine = function () {
        var re = this.skipWhile(function (c) { return c !== '\n' && c !== '\r'; });
        this.moveOverNewline();
        return re;
    };

    this.collectLine = function () {
        var re = this.collectWhile(function (c) { return c !== '\n' && c !== '\r'; });
        this.moveOverNewline();
        return re;
    };
}

module.exports = {
    stringReader: Fx23StringReader
};
