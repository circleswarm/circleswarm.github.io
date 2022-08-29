export interface AngleBox {
  x: number;
  y: number;
  w: number;
  h: number;
  a: number;
  scripts?: Array<string>;
}

export interface Box {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Point {
  x: number;
  y: number;
  t?: number;
}

export interface MapFile {
  width: number;
  height: number;
  rectangles: Array<AngleBox>;
  curves: Array<Curve>;
}

export interface Curve {
  points: Array<Point>;
  thickness: number;
  precision: number;
}

export interface MaintainsPrevious {
  prevIndexes: Array<number>;
}