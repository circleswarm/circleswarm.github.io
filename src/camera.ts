import { Helpers } from "./helpers";

function transformX(m: Array<number>, x: number, y: number) {
  return x * m[0] + y * m[3] + m[6];
}

function transformY(m: Array<number>, x: number, y: number) {
  return x * m[1] + y * m[4] + m[7];
}

export class Camera {
  x = 0; // the center of the camera
  y = 0; // the center of the camera
  viewportWidth = 0;
  viewportHeight = 0;
  zoom = 1;

  Transform: Array<number> = Helpers.createIdentityArray();
  InverseTransform: Array<number> = Helpers.createIdentityArray();
  ClipTransform: Array<number> = Helpers.createIdentityArray();
  ProjectionMatrix: Array<number> = Helpers.createIdentityArray();

  constructor() {
    this.ProjectionMatrix[6] = -1;
    this.ProjectionMatrix[7] = +1;

    this.update();
  }

  screenToWorldX(x: number, y: number) {
    return transformX(this.InverseTransform, x, y);
  }

  screenToWorldY(x: number, y: number) {
    return transformY(this.InverseTransform, x, y);
  }

  worldToScreenX(x: number, y: number) {
    return transformX(this.Transform, x, y);
  }

  worldToScreenY(x: number, y: number) {
    return transformY(this.Transform, x, y);
  }

  sharpFollow(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  smoothFollow(x: number, y: number) {
    this.x = Helpers.smoothFollow(this.x, x, 0.01);
    this.y = Helpers.smoothFollow(this.y, y, 0.01);
  }

  setTransformMatrix(centerX: number, centerY: number) {
    this.Transform[0] = this.zoom;
    this.Transform[4] = this.zoom;
    this.Transform[6] = this.zoom * -this.x + centerX;
    this.Transform[7] = this.zoom * -this.y + centerY;
  }

  setInverseTransformMatrix(centerX: number, centerY: number) {
    this.InverseTransform[0] = 1 / this.zoom;
    this.InverseTransform[4] = 1 / this.zoom;
    this.InverseTransform[6] = -(this.zoom * -this.x + centerX) / this.zoom;
    this.InverseTransform[7] = -(this.zoom * -this.y + centerY) / this.zoom;
  }

  setProjectionMatrix() {
    this.ProjectionMatrix[0] = 2 / this.viewportWidth;
    this.ProjectionMatrix[4] = -2 / this.viewportHeight;
  }

  setClipTransform(centerX: number, centerY: number) {
    this.ClipTransform[0] = (2 * this.zoom) / this.viewportWidth;
    this.ClipTransform[4] = -(2 * this.zoom) / this.viewportHeight;

    this.ClipTransform[6] = (2 * (this.zoom * -this.x + centerX)) / this.viewportWidth - 1;
    this.ClipTransform[7] = -(2 * (this.zoom * -this.y + centerY)) / this.viewportHeight + 1;
  }

  update() {
    let centerX = this.viewportWidth * 0.5;
    let centerY = this.viewportHeight * 0.5;

    this.setTransformMatrix(centerX, centerY);
    this.setInverseTransformMatrix(centerX, centerY);
    this.setProjectionMatrix();
    this.setClipTransform(centerX, centerY);
  }
}