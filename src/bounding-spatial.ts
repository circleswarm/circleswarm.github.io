import { CIRCLE_MAX_RADIUS } from "./constants";
import { Helpers } from "./helpers";
import { Box, MaintainsPrevious } from "./interfaces";

const CELL_SIZE = 32;

function getN(y: number) { return Math.max(Math.trunc(y / CELL_SIZE), 0); }
function getW(x: number) { return Math.max(Math.trunc(x / CELL_SIZE), 0); }

function getS(y: number) { return Math.ceil(y / CELL_SIZE); }
function getE(x: number) { return Math.ceil(x / CELL_SIZE); }

export class BoundingSpatial<T extends MaintainsPrevious> {
  private grid: Array<Array<T>>;
  private columnCount: number;
  private EMPTY_ARR: Array<T> = [];

  constructor(mapWidth: number, mapHeight: number) {
    this.grid = new Array<Array<T>>();

    const columnCount = Math.ceil(mapWidth / CELL_SIZE) + 5;
    const rowCount = Math.ceil(mapHeight / CELL_SIZE) + 5;

    for (let i = 0; i < columnCount * rowCount; i++) {
      this.grid.push([]);
    }

    this.columnCount = columnCount;
  }

  private getIdx(x: number, y: number) {
    const col = Math.trunc(x / CELL_SIZE);
    const row = Math.trunc(y / CELL_SIZE);

    return row * this.columnCount + col;
  }

  retrieve(x: number, y: number): Array<T> {
    const idx = this.getIdx(x, y);

    return this.grid[idx] || this.EMPTY_ARR;
  }

  private removePrevious(entity: T) {
    for (let idx of entity.prevIndexes) {
      let prevSquare = this.grid[idx];

      for (let i = 0; i < prevSquare.length; i++) {
        let c = prevSquare[i];
  
        if (c === entity) {
          Helpers.swapRemove(prevSquare, i);
          
          break;
        }
      }
    }

    entity.prevIndexes.length = 0;
  }

  remove(entity: T) {
    this.removePrevious(entity);
  }

  add(entity: T, bb: Box) {
    this.removePrevious(entity);

    const padding = CIRCLE_MAX_RADIUS;

    const n = getN(bb.y1 - padding);
    const w = getW(bb.x1 - padding);
    const s = getS(bb.y2 + padding);
    const e = getE(bb.x2 + padding);

    for (let row = n; row <= s; row++) {
      for (let col = w; col <= e; col++) {
        const idx = row * this.columnCount + col;

        this.grid[idx].push(entity);

        entity.prevIndexes.push(idx);
      }
    }
  }
}