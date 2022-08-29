export class Food {
  x: number;
  y: number;
  radius: number;
  prevIndexes: Array<number>;
  collisions: number;
  accumulator: number;

  constructor(x: number, y: number, amount: number) {
    this.x = x;
    this.y = y;
    this.radius = amount;
    this.prevIndexes = [];
    this.collisions = 0;
    this.accumulator = 0;
  }
}