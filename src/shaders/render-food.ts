import { Helpers } from "../helpers";
import { BufferFloatData } from "../buffer-float-data";

const vertexShader = `#version 300 es
  precision highp float;
  precision highp int;

  in vec2 a_unit;
  in vec4 a_transform;

  in float a_accumulator;

  uniform mat3 u_projection;

  out float v_tint;
  out vec2 v_pos;
  out float v_accumulator;
  flat out int v_impacts;

  void main() {
    float r = a_transform.z;

    float x = a_transform.x - r;
    float y = a_transform.y - r;
    float w = r * 2.0;
    float h = r * 2.0;

    mat3 world = mat3(
      w, 0, 0, 
      0, h, 0, 
      x, y, 1
    );

    gl_Position = vec4(u_projection * world * vec3(a_unit, 1), 1);

    v_tint = a_transform.w;
    v_pos = a_unit;
    v_accumulator = a_accumulator;
  }
`;

const fragmentShader = `#version 300 es
  precision highp float;
  precision highp int;

  in vec2 v_pos;
  in float v_tint;
  in float v_accumulator;

  uniform vec4 u_color;
  uniform mat3 u_projection;

  out vec4 outputColor;

  // sine but output is in range of 0.0 to 1.0 instead of -1.0 to 1.0
  float nSin(float theta) {
    return (sin(theta) + 1.0) * 0.5;
  }

  float safeSin(float theta, float freq) {
    float sina = nSin(floor(freq) * theta);
    float sinb = nSin(ceil(freq) * theta);
    float fr = fract(freq);

    return mix(sina, sinb, fr);
  }

  float modulateWaveCount(float theta) {
    float waveDepth = 0.25;

    return waveDepth * safeSin(theta, 8.5 + sin(v_accumulator / 300.0));
  }

  float curve(float theta, float accumulator) {
    // float shakeDistance = 0.1;
    // float shakeFrequency = 200.0;
    // float shake = sin(0. / shakeFrequency) * shakeDistance; // replace 0 with accumulator
    float shake = 0.0;

    float waveCount = 15.0;

    float waveDepthMax = 0.125;
    float waveDepthMin = 0.00;
    float waveDepth = abs(sin(accumulator / 200.0)) * waveDepthMax + waveDepthMin;

    return waveDepth * nSin((theta + shake) * waveCount);
  }

  void main() { 
    vec2 cxy = 2.0 * v_pos - 1.0;
    float r = cxy.x * cxy.x + cxy.y * cxy.y;

    float theta = atan(cxy.y, cxy.x);

    r += curve(theta, v_accumulator);

    float delta = fwidth(r);
    float alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);  
  
    outputColor = u_color * alpha * vec4(1, 1, 1, v_tint);
  }
`;

export class RenderFood {
  private attribs;
  private transformData = new BufferFloatData();
  private accumulatorData = new BufferFloatData();

  constructor(gl: WebGL2RenderingContext) {
    const program = Helpers.createShaderProgram(gl, vertexShader, fragmentShader);

    if (!program) { throw new Error("Could not create shader program"); }

    const unitAttributeLocation = gl.getAttribLocation(program, "a_unit");
    const projectionLocation = gl.getUniformLocation(program, "u_projection");
    const transformLocation = gl.getAttribLocation(program, "a_transform");
    const accumulatorLocation = gl.getAttribLocation(program, "a_accumulator");
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

    const accumulatorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, accumulatorBuffer);
    gl.vertexAttribPointer(accumulatorLocation, 1, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(accumulatorLocation, 1);
    gl.enableVertexAttribArray(accumulatorLocation);

    gl.bindVertexArray(null);

    this.attribs = {
      program,
      transformBuffer,
      accumulatorBuffer,
      unitAttributeLocation,
      projectionLocation,
      transformLocation,
      colorLocation,
      unitBuffer,
      vao
    };
  }

  reset() {
    this.transformData.index = 0;
    this.accumulatorData.index = 0;
  }

  enqueue(x: number, y: number, r: number, a: number, accumulator: number) {
    this.transformData.push(x);
    this.transformData.push(y);
    this.transformData.push(r);
    this.transformData.push(a);

    this.accumulatorData.push(accumulator);
  }

  drawFood(gl: WebGL2RenderingContext, clipTransform: Array<number>, color: Array<number>) {
    const attribs = this.attribs;
    
    gl.useProgram(attribs.program);
    gl.bindVertexArray(attribs.vao);

    gl.uniformMatrix3fv(attribs.projectionLocation, false, clipTransform);
    gl.uniform4fv(attribs.colorLocation, color);

    gl.bindBuffer(gl.ARRAY_BUFFER, attribs.transformBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.transformData.arr, gl.STATIC_DRAW, 0, this.transformData.length);

    gl.bindBuffer(gl.ARRAY_BUFFER, attribs.accumulatorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.accumulatorData.arr, gl.STATIC_DRAW, 0, this.accumulatorData.length);

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, this.transformData.length / 4);

    gl.bindVertexArray(null);

    this.reset();
  }
}