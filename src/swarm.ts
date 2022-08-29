import { Circle } from "./circle";
import { Vec2 } from "./vec2";

export class Swarm {
  name: string;
  swarmID: number;
  circles: Array<Circle>;
  centerX: number;
  centerY: number;
  velocityX: number;
  velocityY: number;
  targetPos: Vec2;
  supplies: number;
  spreading: boolean;
  
  constructor(name = "", team = -1) {
    this.name = name;
    this.swarmID = team;
    this.circles = [];
    this.centerX = 0;
    this.centerY = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.targetPos = new Vec2();
    this.supplies = 0;
    this.spreading = false;
  }
}