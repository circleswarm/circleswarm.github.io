import { BufferFloatData } from "../buffer-float-data";
import { Helpers } from "../helpers";

const vertexShader = `#version 300 es
  precision mediump float;

  in vec2 a_unit;
  in vec4 a_transform; // x, y, w, h

  uniform mat3 u_projectionMatrix;

  void main() {
    float x = a_transform.x;
    float y = a_transform.y;

    float w = a_transform[2];
    float h = a_transform[3];

    mat3 transformMatrix = mat3(
      w, 0, 0, 
      0, h, 0, 
      x, y, 1
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

export class RenderGrid {
  private attribs;
  private transformData = new BufferFloatData();

  constructor(gl: WebGL2RenderingContext) {
    const program = Helpers.createShaderProgram(gl, vertexShader, fragmentShader);

    if (!program) { throw new Error("Could not create shader program"); }

    const colorLocation = gl.getUniformLocation(program, "u_color");
    const unitAttributeLocation = gl.getAttribLocation(program, "a_unit");
    const projectionMatrixLocation = gl.getUniformLocation(program, "u_projectionMatrix");
    const transformLocation = gl.getAttribLocation(program, "a_transform");

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

    gl.bindVertexArray(null);

    this.attribs = {
      program,
      projectionMatrixLocation,
      colorLocation,
      transformBuffer,
      vao
    };
  }

  private enqueue(x: number, y: number, w: number, h: number) {
    this.transformData.push(x);
    this.transformData.push(y);
    this.transformData.push(w);
    this.transformData.push(h);
  }

  buildGrid(baseX: number, baseY: number, mapWidth: number, mapHeight: number, lineSize: number, gap: number) {
    let cc = mapWidth / gap;
    let rc = mapHeight / gap;

    for (let x = 0; x < cc; x++) {
      this.enqueue(x * gap - lineSize, baseY, lineSize, mapHeight);
    }

    this.enqueue(mapWidth, baseY - lineSize, lineSize, mapHeight + lineSize * 2);

    for (let y = 0; y < rc; y++) {
      this.enqueue(baseX, y * gap - lineSize, mapWidth, lineSize);
    }

    this.enqueue(baseX - lineSize, mapHeight, mapWidth + lineSize * 2, lineSize);
  }

  drawGrid(gl: WebGL2RenderingContext, clipTransform: Array<number>, color: Array<number>) {
    const attribs = this.attribs;
    
    gl.useProgram(attribs.program);
    gl.bindVertexArray(attribs.vao);

    gl.uniformMatrix3fv(attribs.projectionMatrixLocation, false, clipTransform);

    if (this.transformData.changed) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.attribs.transformBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.transformData.arr, gl.STATIC_DRAW, 0, this.transformData.length);

      this.transformData.changed = false;
    }

    gl.uniform4fv(attribs.colorLocation, color);

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, this.transformData.length / 4);

    gl.bindVertexArray(null);
  }
}