import { BufferFloatData } from "../buffer-float-data";
import { Helpers } from "../helpers";

const vertexShader = `#version 300 es
  precision mediump float;

  in vec2 a_unit;
  in vec4 a_transform; // x, y, w, h
  in float a_angle;

  uniform mat3 u_projectionMatrix;

  void main() {
    float w = a_transform[2];
    float h = a_transform[3];

    float oX = w / 2.0;
    float oY = h / 2.0;

    float cosAngle = cos(a_angle);
    float sinAngle = sin(a_angle);

    float m0 = w * cosAngle;
    float m1 = w * sinAngle;
    float m3 = h * -sinAngle;
    float m4 = h * cosAngle;
    float m6 = a_transform.x + oX - oX * cosAngle + sinAngle * oY;
    float m7 = a_transform.y + oY - oX * sinAngle - cosAngle * oY;

    mat3 transformMatrix = mat3(
      m0, m1, 0, 
      m3, m4, 0, 
      m6, m7, 1
    );

    vec3 world = transformMatrix * vec3(a_unit, 1);

    gl_Position = vec4(u_projectionMatrix * world, 1);
  }
`;

const fragmentShader = `#version 300 es
  precision mediump float;

  uniform vec4 u_color;

  out vec4 outputColor;

  void main() {
    outputColor = u_color;
  }
`;

export class RenderRectangles {
  private attribs;
  private transformData = new BufferFloatData();
  private angleData = new BufferFloatData();

  constructor(gl: WebGL2RenderingContext) {
    const program = Helpers.createShaderProgram(gl, vertexShader, fragmentShader);

    if (!program) { throw new Error("Could not create shader program"); }

    const colorLocation = gl.getUniformLocation(program, "u_color");
    const unitAttributeLocation = gl.getAttribLocation(program, "a_unit");
    const projectionMatrixLocation = gl.getUniformLocation(program, "u_projectionMatrix");
    const transformLocation = gl.getAttribLocation(program, "a_transform");
    const angleLocation = gl.getAttribLocation(program, "a_angle");

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const unitBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, unitBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Helpers.createUnitQuad(), gl.STATIC_DRAW);
    gl.vertexAttribPointer(unitAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(unitAttributeLocation);

    const transformBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
    gl.vertexAttribPointer(transformLocation, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(transformLocation, 1);
    gl.enableVertexAttribArray(transformLocation);

    const angleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, angleBuffer);
    gl.vertexAttribPointer(angleLocation, 1, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(angleLocation, 1);
    gl.enableVertexAttribArray(angleLocation);

    gl.bindVertexArray(null);

    this.attribs = {
      program,
      projectionMatrixLocation,
      colorLocation,
      transformBuffer,
      angleBuffer,
      vao
    }
  }

  reset() {
    this.transformData.index = 0;
    this.angleData.index = 0;
  }

  enqueue(x: number, y: number, w: number, h: number, a: number) {
    this.transformData.push(x);
    this.transformData.push(y);
    this.transformData.push(w);
    this.transformData.push(h);

    this.angleData.push(a);
  }

  drawRectangles(gl: WebGL2RenderingContext, clipTransform: Array<number>, color: Array<number>, count: number) {
    if (count === 0) { return; }

    const attribs = this.attribs;
    
    gl.useProgram(attribs.program);
    gl.bindVertexArray(attribs.vao);

    gl.uniformMatrix3fv(attribs.projectionMatrixLocation, false, clipTransform);

    gl.uniform4fv(attribs.colorLocation, color);

    if (this.transformData.changed) {
      gl.bindBuffer(gl.ARRAY_BUFFER, attribs.transformBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.transformData.arr, gl.STATIC_DRAW, 0, count * 4);

      this.transformData.changed = false;
    }

    if (this.angleData.changed) {
      gl.bindBuffer(gl.ARRAY_BUFFER, attribs.angleBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.angleData.arr, gl.STATIC_DRAW, 0, count);

      this.angleData.changed = false;
    }

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, count);

    gl.bindVertexArray(null);

    this.reset();
  }
}