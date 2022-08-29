import { Circle } from "./circle";

const CELL_SIZE: number = 32;
const EMPTY_ARR: Array<Circle> = [];

let arrCache: Array<Array<Circle>> = [
  [], [], [],
  [], [], [],
  [], [], []
];

export class CenterSpatial {
  private grid: Array<Array<Circle>>;
  private columnCount: number;

  constructor(mapWidth: number, mapHeight: number) {
    this.grid = new Array<Array<Circle>>();

    const columnCount = Math.ceil(mapWidth / CELL_SIZE) + 1;
    const rowCount = Math.ceil(mapHeight / CELL_SIZE) + 1;

    for (let i = 0; i < columnCount * rowCount; i++) {
      this.grid.push([]);
    }

    this.columnCount = columnCount;
  }

  // Return all the squares we MIGHT be in
  retrieve(entity: Circle): Array<Array<Circle>> {
    const idx = this.getIdx(entity);
    const cc = this.columnCount;

    arrCache[0] = this.grid[idx - cc - 1] || EMPTY_ARR;
    arrCache[1] = this.grid[idx - cc] || EMPTY_ARR;
    arrCache[2] = this.grid[idx - cc + 1] || EMPTY_ARR;

    arrCache[3] = this.grid[idx - 1] || EMPTY_ARR;
    arrCache[4] = this.grid[idx];
    arrCache[5] = this.grid[idx + 1];
    
    arrCache[6] = this.grid[idx + cc - 1];
    arrCache[7] = this.grid[idx + cc];
    arrCache[8] = this.grid[idx + cc + 1];

    return arrCache;
  }

  private getIdx(entity: Circle) {
    const col = Math.trunc(entity.x / CELL_SIZE);
    const row = Math.trunc(entity.y / CELL_SIZE);

    return row * this.columnCount + col;
  }

  remove(entity: Circle) {
    let prevSquare = this.grid[entity.prevIdx];

    let len = prevSquare.length;

    for (let i = 0; i < len; i++) {
      prevSquare.pop();
    }
  }

  add(entity: Circle) {      
    const idx = this.getIdx(entity);

    this.grid[idx].push(entity);

    entity.prevIdx = idx;
  }
}