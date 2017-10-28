export class Fx23StringReader {
  text: string;
  index: number;
  visibleIndex: number;
  lineIndex: number;
  columnIndex: number;
  length: number;
  collectLineInfo: boolean;

  // tslint:disable-next-line: variable-name
  private _prevChar: string|null;
  // tslint:disable-next-line
  private _markIndex: number;

  constructor(text: string) {
    this.text = text;
    this.columnIndex = this.index = this.lineIndex = this.visibleIndex = 0;
    this.length = text.length;

    this.collectLineInfo = false;

    this._prevChar = null;
    this._markIndex = 0;
  }

  hasNext(): boolean {
    return this.index < this.length;
  }

  peek(): string {
    return this.peekOverride();
  }

  next(): string {
    const next = this.nextOverride();
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

  mark(): void {
    this._markIndex = this.index;
  }

  collect(): string {
    if (this._markIndex === this.index) {
      return '';
    }
    return this.text.substring(this._markIndex, this.index);
  }

  nextOverride(): string {
    return this.text.charAt(this.index);
  }

  peekOverride(): string {
    return this.nextOverride();
  }

  /* extension methods */
  collectWhile(predicate: (c: string) => boolean): string {
    this.mark();
    while (this.hasNext() && predicate(this.peek())) {
      this.next();
    }
    return this.collect();
  }

  skipWhile(predicate: (c: string) => boolean): number {
    let count = 0;
    while (this.hasNext() && predicate(this.peek())) {
      this.next();
      count++;
    }
    return count;
  }

  moveToContent(): number {
    return this.skipWhile((c) => {
      return c.trim() === '';
    });
  }

  moveOverNewline(): number {
    if (this.hasNext()) {
      const c = this.peek();
      if (c === '\r') {
        this.next();

        if (this.hasNext() && this.peek() === '\n') {
          this.next();
          return 2;
        }
        return 1;
      } else if (c === '\n') {
        this.next();
        return 1;
      }
    }
    return 0;
  }

  skipLine(): number {
    const re = this.skipWhile((c) => c !== '\n' && c !== '\r');
    this.moveOverNewline();
    return re;
  }

  collectLine() {
    const re = this.collectWhile((c) => c !== '\n' && c !== '\r');
    this.moveOverNewline();
    return re;
  }
}
