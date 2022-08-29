import { CircleEffects } from "./circle";

export class Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;
  a: number;
  prevA: number;

  deltaX: number;
  deltaY: number;

  scripts: Array<string>;
  prevIndexes: Array<number>;
  circleEffects: CircleEffects;

  constructor(x: number, y: number, w: number, h: number, a: number, scripts?: Array<string>) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.a = a;
    this.prevA = a;

    this.deltaX = 0;
    this.deltaY = 0;

    this.scripts = scripts?.map(c => c.toLowerCase()) || [];
    this.prevIndexes = [];
    this.circleEffects = CircleEffects.Melting | CircleEffects.Slow;
  }

  setA(val: number) {
    this.prevA = this.a;

    this.a = val;
  }
}