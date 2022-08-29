import { Helpers } from "../helpers";
import { BufferFloatData } from "../buffer-float-data";

const vertexShader = `#version 300 es
  precision highp float;

  in vec2 a_unit;

  uniform mat3 u_projection;
  
  in vec4 u_transform;

  out float v_tint;
  out float v_radius;
  out vec2 v_pos;

  void main() {
    v_pos = a_unit;

    float r = u_transform.z;

    float x = u_transform.x - r;
    float y = u_transform.y - r;
    float w = r * 2.0;
    float h = r * 2.0;

    mat3 world = mat3(
      w, 0, 0, 
      0, h, 0, 
      x, y, 1
    );

    gl_Position = vec4(u_projection * world * vec3(a_unit, 1), 1);

    v_radius = r;
    v_tint = u_transform.w;
  }
`;

const fragmentShader = `#version 300 es
  precision highp float;

  in vec2 v_pos;
  in float v_radius;
  in float v_tint;

  uniform vec4 u_color;
  uniform mat3 u_projection;

  out vec4 outputColor;

  void main() { 
    vec2 cxy = 2.0 * v_pos - 1.0;
    float r = cxy.x * cxy.x + cxy.y * cxy.y;

    float delta = fwidth(r);
    float alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);
  
    outputColor = u_color * alpha * vec4(1, 1, 1, v_tint);
  }
`;

export class RenderCircles {
  private attribs;
  private transformBuffer = new BufferFloatData();

  constructor(gl: WebGL2RenderingContext) {
    const program = Helpers.createShaderProgram(gl, vertexShader, fragmentShader);

    if (!program) { throw new Error("Could not create shader program"); }

    const unitAttributeLocation = gl.getAttribLocation(program, "a_unit");
    const projectionLocation = gl.getUniformLocation(program, "u_projection");
    const transformLocation = gl.getAttribLocation(program, "u_transform");
    const colorLocation = gl.getUniformLocation(program, "u_color");
    
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
      transformBuffer,
      unitAttributeLocation,
      projectionLocation,
      transformLocation,
      colorLocation,
      unitBuffer,
      vao
    };
  }

  reset() {
    this.transformBuffer.index = 0;
  }

  enqueue(x: number, y: number, r: number, a: number) {
    this.transformBuffer.push(x);
    this.transformBuffer.push(y);
    this.transformBuffer.push(r);
    this.transformBuffer.push(a);
  }

  drawCircles(gl: WebGL2RenderingContext, clipTransform: Array<number>, color: Array<number>) {
    const attribs = this.attribs;
    
    gl.useProgram(attribs.program);
    gl.bindVertexArray(attribs.vao);

    gl.uniformMatrix3fv(attribs.projectionLocation, false, clipTransform);
    gl.uniform4fv(attribs.colorLocation, color);

    gl.bindBuffer(gl.ARRAY_BUFFER, attribs.transformBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.transformBuffer.arr, gl.STATIC_DRAW, 0, this.transformBuffer.length);

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, this.transformBuffer.length / 4);

    gl.bindVertexArray(null);

    this.reset();
  }
}