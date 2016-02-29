'use strict';
class Fx23StringReader {
    constructor(text) {
        this.text = text;
        this.columnIndex = this.index = this.lineIndex = this.visibleIndex = 0;
        this.length = text.length;

        this.collectLineInfo = false;

        this._prevChar = null;
        this._markIndex = 0;
    }

    hasNext() {
        return this.index < this.length;
    }

    peek() {
        return this.peekOverride();
    }

    next() {
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
    }

    mark() {
        this._markIndex = this.index;
    }

    collect() {
        if (this._markIndex === this.index) {
            return null;
        }
        return this.text.substring(this._markIndex, this.index);
    }

    nextOverride() {
        return this.text.charAt(this.index);
    }

    peekOverride() {
        return this.nextOverride();
    }

    /* extension methods */
    collectWhile(predicate) {
        this.mark();
        while (this.hasNext() && predicate(this.peek())) {
            this.next();
        }
        return this.collect();
    }

    skipWhile(predicate) {
        var count = 0;
        while (this.hasNext() && predicate(this.peek())) {
            this.next();
            count++;
        }
        return count;
    }

    moveToContent() {
        return this.skipWhile(function (c) {
            return c.trim() === '';
        });
    }

    moveOverNewline() {
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
    }

    skipLine() {
        var re = this.skipWhile(function (c) { return c !== '\n' && c !== '\r'; });
        this.moveOverNewline();
        return re;
    }

    collectLine() {
        var re = this.collectWhile(function (c) { return c !== '\n' && c !== '\r'; });
        this.moveOverNewline();
        return re;
    }
}

module.exports = {
    stringReader: Fx23StringReader
};
