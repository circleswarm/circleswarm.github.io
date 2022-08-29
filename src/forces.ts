import { Circle } from "./circle";
import { CenterSpatial } from "./center-spatial";
import { Vec2 } from "./vec2";
import { BoundingSpatial } from "./bounding-spatial";
import { Food } from "./food";
import { GameMap } from "./game-map";
import { Helpers } from "./helpers";

const disperseSpeed = 650;
const moveToCursorSpeed = 420;

let vecCache1 = new Vec2(0, 0);
let vecCache2 = new Vec2(0, 0);
let vecCache3 = new Vec2(0, 0);

function resetForces(c: Circle) {
  c.forceDecayingX *= 0.98;
  c.forceDecayingY *= 0.98;

  c.forceInstantX = 0;
  c.forceInstantY = 0;
}

function applyDamage(c1: Circle, c2: Circle, c1TargetPos: Vec2) {  
  if (c1.parent.swarmID === 0) { return; }

  const dirC1C2 = vecCache2.setToDirectionXY(c1.x, c1.y, c2.x, c2.y);
  const dirC1Target = vecCache3.setToDirectionXY(c1.x, c1.y, c1TargetPos.x, c1TargetPos.y);

  const facing = dirC1C2.dot(dirC1Target);
  const dmgToC2 = c2.parent.swarmID === 0 ? 1000 : c1.damage * facing;

  if (dmgToC2 > 0) {
    c2.health -= dmgToC2;
    c2.mostRecentAttacker = c1.parent;
  }
}

function applyBumpForceToCircle(force: Vec2, c1X: number, c1Y: number, c1R: number, c2X: number, c2Y: number, c2R: number, forceMultiplier: number) {
  const deltaX = c2X - c1X;
  const deltaY = c2Y - c1Y;

  const sumRadius = c1R + c2R;
  const squared = deltaX * deltaX + deltaY * deltaY;
  
  if (squared === 0 || squared > sumRadius * sumRadius) { return false; } // not colliding

  const centerDistance = Math.sqrt(squared);
  const circleDistance = centerDistance - sumRadius;
  
  // const overlapPercentage = Helpers.circleOverlapPercentage(centerDistance, c.r, neighbor.r);

  // const forceAmount = overlapPercentage * 50;
  // const forceAmount = Math.pow(qwer, 1.25);      

  const forceAmount = circleDistance * forceMultiplier; // 2.5 and 3 is decent too

  const aX = deltaX / centerDistance;
  const aY = deltaY / centerDistance;

  force.x += aX * forceAmount;
  force.y += aY * forceAmount;

  return true;
}

function applyBumpForces(c: Circle, targetPos: Vec2, swarmSpatial: CenterSpatial) {
  let forceBumping = vecCache1.reset();

  for (let square of swarmSpatial.retrieve(c)) {
    for (let neighbor of square) {
      if (c === neighbor) { continue; }

      if (applyBumpForceToCircle(forceBumping, c.x, c.y, c.r, neighbor.x, neighbor.y, neighbor.r, 3)) {
        c.parent !== neighbor.parent && applyDamage(c, neighbor, targetPos);
      }
    }
  }

  // forceBumping.cap(maxBumpSpeed);

  c.forceDecayingX += forceBumping.x;
  c.forceDecayingY += forceBumping.y;
}

function applyFoodForces(c: Circle, foodArr: Array<Food>, foodSpatial: BoundingSpatial<Food>) {
  let forceBumping = vecCache1.reset();

  for (let food of foodSpatial.retrieve(c.x, c.y)) {
    if (applyBumpForceToCircle(forceBumping, c.x, c.y, c.r, food.x, food.y, food.radius, 5)) {
      if (c.parent.supplies >= c.parent.circles.length) { continue; } // we're full!

      const amount = 0.01;

      food.radius -= amount;
      c.parent.supplies += amount;

      food.collisions += 1;

      if (food.radius < 20) {
        foodSpatial.remove(food);
        Helpers.removeArrItem(foodArr, food);
      }
    }
  }

  // forceBumping.cap(maxBumpSpeed);

  c.forceDecayingX += forceBumping.x;
  c.forceDecayingY += forceBumping.y;
}

function applyDisperseForce(c: Circle, wMousePos: Vec2, spreading: boolean) {
  if (!spreading) { return; }

  let forceDisperse = vecCache1;

  forceDisperse.setToDirectionXY(wMousePos.x, wMousePos.y, c.x, c.y);
  forceDisperse.scalarMultiply(disperseSpeed);

  c.forceInstantX += forceDisperse.x;
  c.forceInstantY += forceDisperse.y;
}

function applyMoveToTargetForce(c: Circle, wMousePos: Vec2) {
  let forceFollow = vecCache1;
  
  const dist = Helpers.distance(c.x, c.y, wMousePos.x, wMousePos.y);
  const capDist = Math.min(dist, moveToCursorSpeed);

  forceFollow.setToDirectionXY(c.x, c.y, wMousePos.x, wMousePos.y);  
  forceFollow.scalarMultiply(capDist);

  // forceFollow.cap(moveToCursorSpeed);

  c.forceInstantX += forceFollow.x;
  c.forceInstantY += forceFollow.y;
}

// apply cursor force and then spread force?
export function calcForces(map: GameMap, c: Circle, targetPos: Vec2, spreading: boolean) {
  resetForces(c);

  applyBumpForces(c, targetPos, map.swarmSpatial);

  applyFoodForces(c, map.food, map.foodSpatial);

  applyDisperseForce(c, targetPos, spreading);
  c.parent.swarmID !== 0 && applyMoveToTargetForce(c, targetPos);

  // c.forces.cap(500);
}