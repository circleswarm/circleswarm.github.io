import { Helpers } from "./helpers";

export class Vec2 {  
  x: number;
  y: number;

	constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  reset() {
    this.x = 0;
    this.y = 0;

    return this;
  }

  set(v: Vec2) {
    this.x = v.x;
    this.y = v.y;

    return this;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  swap(v: Vec2) {
    const tempX = this.x;
    const tempY = this.y;

    this.x = v.x;
    this.y = v.y;

    v.x = tempX;
    v.y = tempY;
  }

  setXY(x: number, y: number) {
    this.x = x;
    this.y = y;

    return this;
  }

  normalize() {
    let magnitude = this.magnitude();

    if (magnitude !== 0) {
      this.x /= magnitude;
      this.y /= magnitude;
    }

    return this;
  }

  add(v: Vec2) {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  subtract(v: Vec2) {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }
  
  multiply(v: Vec2) {
    this.x *= v.x;
    this.y *= v.y;

    return this;
  }

  divide(v: Vec2) {
    this.x /= v.x;
    this.y /= v.y;

    return this;
  }

  addXY(x: number, y: number) {
    this.x += x;
    this.y += y;
    
    return this;
  }

  subtractXY(x: number, y: number) {
    this.x -= x;
    this.y -= y;

    return this;
  }

  scalarSubtract(val: number) {
    this.x -= val;
    this.y -= val;

    return this;
  }

  scalarMultiply(val: number) {
    this.x *= val;
    this.y *= val;

    return this;
  }

  scalarDivide(val: number) {
    this.x /= val;
    this.y /= val;

    return this;
  }

  isZero() {
    return Helpers.isEffectivelyZero(this.x) && Helpers.isEffectivelyZero(this.y);
  }

  isNonZero() {
    return !this.isZero();
  }

	equals(v: Vec2, threshold = 0.00001): boolean {
		if (Math.abs(this.x - v.x) > threshold) {
			return false;
		}

		if (Math.abs(this.y - v.y) > threshold) {
			return false;
		}

		return true;
	}

	magnitude(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  distanceWithinRadius(v: Vec2, radius: number) {
    let x = v.x - this.x;
		let y = v.y - this.y;
    
		return x * x + y * y <= radius * radius;
  }

	distance(v: Vec2): number {
    let x = v.x - this.x;
		let y = v.y - this.y;
    
		return Math.sqrt(x * x + y * y);
  }

  direction(v: Vec2): Vec2 {
    return this.scalarMultiply(-1).add(v).normalize();
  }

  setToDirectionXY(x1: number, y1: number, x2: number, y2: number) {
    this.x = x2 - x1;
    this.y = y2 - y1;
    
    return this.normalize();
  }

  setToDirection(v1: Vec2, v2: Vec2) {
    this.x = v2.x - v1.x;
    this.y = v2.y - v1.y;
    
    return this.normalize();
  }

  cap(max: number) {
    if (this.magnitude() > max) {
      this.normalize().scalarMultiply(max);
    }
  }

  dot(v: Vec2): number {
    return this.x * v.x + this.y * v.y;
  }

  // the magnitude (aka length) of the cross product
  wedge(v: Vec2) {
    return this.x * v.y - this.y * v.x;
  }

  rotate(degrees: number): Vec2 {
    let theta = Helpers.degreesToRadians(degrees);
	
    let cs = Math.cos(theta);
    let sn = Math.sin(theta);
    
    let px = this.x * cs - this.y * sn; 
    let py = this.x * sn + this.y * cs;

    this.x = px;
    this.y = py;

    return this;
  }
}