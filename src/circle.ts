import { Swarm } from "./swarm";

export const enum CircleEffects {
  None = 0,
  Slow = 1 << 0,
  Melting = 1 << 1,
  Fast = 1 << 2,
}

export class Circle {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vX: number;
  vY: number;
  r: number;

  forceInstantX: number;
  forceInstantY: number;
  forceDecayingX: number;
  forceDecayingY: number;

  prevIdx: number;
  parent: Swarm;

  health: number;
  circleEffects: CircleEffects;
  mostRecentAttacker: Swarm | null;

  constructor(x: number, y: number, r: number, parent: Swarm) {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.vX = 0;
    this.vY = 0;
    this.r = r;

    this.forceInstantX = 0;
    this.forceInstantY = 0;
    this.forceDecayingX = 0;
    this.forceDecayingY = 0;

    this.prevIdx = 1;
    this.parent = parent;

    this.health = 100;
    this.circleEffects = CircleEffects.None;
    this.mostRecentAttacker = null;
  }

  get damage() {
    return this.r / 10;
  }
}