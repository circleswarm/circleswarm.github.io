import { Helpers } from "./helpers";

export class MyDataView {
  private byteOffset: number;
  private dv: DataView;
  private littleEndian: boolean;
  private textDecoder: TextDecoder;
  private textEncoder: TextEncoder;

  constructor(buffer: ArrayBuffer, littleEndian = true) {
    this.byteOffset = 0;
    this.dv = new DataView(buffer);
    this.littleEndian = littleEndian;
    this.textDecoder = new TextDecoder();
    this.textEncoder = new TextEncoder();
  }

  get buffer() {
    return this.dv.buffer;
  }

  getI32() {
    const value = this.dv.getInt32(this.byteOffset, this.littleEndian);

    this.byteOffset += 4;

    return value;
  }

  getF32() {
    const value = this.dv.getFloat32(this.byteOffset, this.littleEndian);

    this.byteOffset += 4;

    return value;
  }

  getI64() {
    let bufferView = new Uint8Array(this.dv.buffer, this.byteOffset, 8);

    const value = Helpers.uint8ArrayToNum(bufferView);

    this.byteOffset += 8;

    return value;
  }

  getStr() {
    const len = this.dv.getInt32(this.byteOffset, this.littleEndian);

    this.byteOffset += 4;

    let nameBuffer = new Uint8Array(this.dv.buffer, this.byteOffset, len);

    this.byteOffset += len;

    return this.textDecoder.decode(nameBuffer);
  }

  setI32(value: number) {
    this.dv.setInt32(this.byteOffset, value, this.littleEndian);
    this.byteOffset += 4;
  }

  setF32(value: number) {
    this.dv.setFloat32(this.byteOffset, value, this.littleEndian);
    this.byteOffset += 4;
  }

  setI64(value: number) {
    let arr = Helpers.numToUint8Array(value);

    let bufferView = new Uint8Array(this.dv.buffer, this.byteOffset, 8);
  
    for (let i = 0; i < 8; i++) {
      bufferView[i] = arr[i];
    }

    this.byteOffset += 8;
  }

  setStr(value: string) {
    const bytes = this.textEncoder.encode(value);

    const len = bytes.length;

    this.dv.setInt32(this.byteOffset, len, this.littleEndian);

    this.byteOffset += 4;

    const textBuffer = new Uint8Array(this.dv.buffer, this.byteOffset, len);

    for (let i = 0; i < len; i++) {
      textBuffer[i] = bytes[i];
    }

    this.byteOffset += len;
  }
}