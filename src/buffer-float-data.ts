export class BufferFloatData {
  arr: Float32Array;
  index: number;
  changed: boolean;

  constructor() {
    this.arr = new Float32Array(8);
    this.index = 0;
    this.changed = true;
  }

  maybeResize() {
    let curArr = this.arr;

    if (this.index < curArr.length) {
      return;
    }

    let newArr = new Float32Array(curArr.length * 2);

    for (let i = 0; i < curArr.length; i++) {
      newArr[i] = curArr[i];
    }

    this.arr = newArr;
  }

  push(val: number) {
    this.maybeResize();

    this.arr[this.index] = val;

    this.index++;

    this.changed = true;
  }

  get length() {
    return this.index;
  }
}