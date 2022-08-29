var ot=Object.defineProperty;var at=(o,t,e)=>t in o?ot(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var i=(o,t,e)=>(at(o,typeof t!="symbol"?t+"":t,e),e);const it=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function e(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerpolicy&&(a.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?a.credentials="include":n.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(n){if(n.ep)return;n.ep=!0;const a=e(n);fetch(n.href,a)}};it();const A=class{static setSeed(t){A.seed=t}static randomUnitFloat(){var t=A.seed+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}static randomFloat(t,e){return A.randomUnitFloat()*(e-t)+t}static randomInt(t,e){return Math.floor(A.randomUnitFloat()*(e-t+1))+t}};let p=A;i(p,"seed",new Date().getTime());class y{constructor(t=0,e=0){i(this,"x");i(this,"y");this.x=t,this.y=e}reset(){return this.x=0,this.y=0,this}set(t){return this.x=t.x,this.y=t.y,this}clone(){return new y(this.x,this.y)}swap(t){const e=this.x,r=this.y;this.x=t.x,this.y=t.y,t.x=e,t.y=r}setXY(t,e){return this.x=t,this.y=e,this}zeroize(){return this.isZero()&&(this.x=0,this.y=0),this}normalize(){let t=this.magnitude();return t!==0&&(this.x/=t,this.y/=t),this}add(t){return this.x+=t.x,this.y+=t.y,this}subtract(t){return this.x-=t.x,this.y-=t.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}divide(t){return this.x/=t.x,this.y/=t.y,this}addXY(t,e){return this.x+=t,this.y+=e,this}subtractXY(t,e){return this.x-=t,this.y-=e,this}scalarSubtract(t){return this.x-=t,this.y-=t,this}scalarMultiply(t){return this.x*=t,this.y*=t,this}scalarDivide(t){return this.x/=t,this.y/=t,this}isZero(){return h.isEffectivelyZero(this.x)&&h.isEffectivelyZero(this.y)}isNonZero(){return!this.isZero()}equals(t,e=1e-5){return!(Math.abs(this.x-t.x)>e||Math.abs(this.y-t.y)>e)}magnitude(){return Math.sqrt(this.x*this.x+this.y*this.y)}distanceWithinRadius(t,e){let r=t.x-this.x,n=t.y-this.y;return r*r+n*n<=e*e}distance(t){let e=t.x-this.x,r=t.y-this.y;return Math.sqrt(e*e+r*r)}direction(t){return this.scalarMultiply(-1).add(t).normalize()}setToDirectionXY(t,e,r,n){return this.x=r-t,this.y=n-e,this.normalize()}setToDirection(t,e){return this.x=e.x-t.x,this.y=e.y-t.y,this.normalize()}cap(t){this.magnitude()>t&&this.normalize().scalarMultiply(t)}dot(t){return this.x*t.x+this.y*t.y}wedge(t){return this.x*t.y-this.y*t.x}rotate(t){let e=h.degreesToRadians(t),r=Math.cos(e),n=Math.sin(e),a=this.x*r-this.y*n,s=this.x*n+this.y*r;return this.x=a,this.y=s,this}}const w=1/60;function st(o,t){let e=0,r=0;l.tickNumber=0;function n(){for(;r>w;)o(),r-=w,l.tickNumber=l.tickNumber+1}function a(){const c=r/w;t(c),requestAnimationFrame(a)}function s(){const c=performance.now(),d=(c-e)/1e3;e=c,r+=d,n()}function u(){const c=["function tick() { postMessage(1); } setInterval(tick, 1);"],d=new Blob(c,{type:"text/javascript"}),m=URL.createObjectURL(d);return new Worker(m)}function f(){const c=u();c.onmessage=s}f(),requestAnimationFrame(a)}const R=class{static get currentTime(){return R.tickNumber*w*1e3}static initialize(){const t=document.querySelector(".webgl-canvas");if(!t)throw new Error("Could not query for WebGL canvas");const e=t.getContext("webgl2",{alpha:!1,desynchronized:!0,antialias:!1,depth:!1,premultipliedAlpha:!1});if(!e)throw new Error("Could not get WebGL context");R.webGLCanvas=t,R.webGLContext=e,e.enable(e.BLEND)}};let l=R;i(l,"webGLCanvas"),i(l,"webGLContext"),i(l,"mouseX",0),i(l,"mouseY",0),i(l,"mouseDown",!1),i(l,"tickNumber",0),i(l,"init",R.initialize());class h{static circlesCollide(t,e,r,n,a,s){const u=n-t,f=a-e,c=r+s;return u*u+f*f<=c*c}static distance(t,e,r,n){const a=r-t,s=n-e;return Math.sqrt(a*a+s*s)}static circleDistance(t,e,r,n,a,s){return h.distance(t,e,n,a)-(r+s)}static vecMagnitude(t,e){return Math.sqrt(t*t+e*e)}static circleRectangleColliding(t,e,r,n,a,s,u){let f=h.clamp(t,n,n+s),c=h.clamp(e,a,a+u),d=f-t,m=c-e;return d*d+m*m<r*r}static rotateX(t,e,r,n,a,s){return r*(t-a)-n*(e-s)+a}static rotateY(t,e,r,n,a,s){return n*(t-a)+r*(e-s)+s}static circleRotatedRectangleCollision(t,e,r,n){let a=t,s=e;if(n.a!==0){const u=Math.cos(n.a),f=Math.sin(n.a);a=h.rotateX(t,e,-u,f,n.x+n.deltaX+n.w/2,n.y+n.deltaY+n.h/2),s=h.rotateY(t,e,-u,f,n.x+n.deltaX+n.w/2,n.y+n.deltaY+n.h/2)}return h.circleRectangleColliding(a,s,r,n.x+n.deltaX,n.y+n.deltaY,n.w,n.h)}static circleOverlapPercentage(t,e,r){return 1-t/(e+r)}static getRectangleBoundingBox(t){const e=t.w,r=t.h,n=Math.abs(Math.cos(t.a)),a=Math.abs(Math.sin(t.a)),s=e*n+r*a,u=e*a+r*n,f=t.x+t.deltaX-(s-e)/2,c=t.y+t.deltaY-(u-r)/2;return{x1:f,y1:c,x2:f+s,y2:c+u}}static getCircleBoundingBox(t,e,r){return{x1:t-r,y1:e-r,x2:t+r,y2:e+r}}static swapRemove(t,e){t[e]=t[t.length-1],t.pop()}static radiansToDegrees(t){return t*(180/Math.PI)}static degreesToRadians(t){return t*(Math.PI/180)}static getRandomDirection(){let t=p.randomFloat(0,2*Math.PI);return new y(Math.cos(t),Math.sin(t))}static preventRightClick(t){t.oncontextmenu=function(e){e.preventDefault()}}static mapFloatRange(t,e,r,n,a){return(t-e)*(a-n)/(r-e)+n}static clamp(t,e,r){return Math.min(Math.max(t,e),r)}static isEffectivelyZero(t){return Math.abs(t)<1e-4}static createShader(t,e,r){const n=t.createShader(e);return n?(t.shaderSource(n,r),t.compileShader(n),t.getShaderParameter(n,t.COMPILE_STATUS)?n:(console.info(t.getShaderInfoLog(n)),t.deleteShader(n),null)):(console.error("Could not create shader"),null)}static createShaderProgram(t,e,r){const n=t.createProgram();if(!n){console.error("Could not create program");return}const a=h.createShader(t,t.VERTEX_SHADER,e),s=h.createShader(t,t.FRAGMENT_SHADER,r);if(!a){console.error("Could not create vertex shader");return}if(!s){console.error("Could not create fragment shader");return}return t.attachShader(n,a),t.attachShader(n,s),t.linkProgram(n),t.getProgramParameter(n,t.LINK_STATUS)?n:(console.info(t.getProgramInfoLog(n)),t.deleteProgram(n),null)}static createUnitQuad(){return new Float32Array([0,0,0,1,1,0,1,0,0,1,1,1])}static createTriangleStripQuad(){return new Float32Array([1,1,-1,1,1,-1,-1,-1])}static create3x3IdentityMatrix(){const t=h.createIdentityArray();return new Float32Array(t)}static createIdentityArray(){return[1,0,0,0,1,0,0,0,1]}static lerp(t,e,r){return(1-r)*t+e*r}static getRandomPointInCircle(t,e,r){let n=r*Math.sqrt(p.randomUnitFloat()),a=p.randomUnitFloat()*2*Math.PI;return new y(t+n*Math.cos(a),e+n*Math.sin(a))}static applyEffectsToCollidingCircles(t,e){const r=t.x,n=t.y,a=t.r;for(let s of e.retrieve(r,n))h.circleRotatedRectangleCollision(r,n,a,s)&&(t.circleEffects|=s.circleEffects)}static isCollidingWithAnyTerrain(t,e,r,n){for(let a of t.retrieve(e,r))if(h.circleRotatedRectangleCollision(e,r,n,a))return a;return!1}static isCollidingWithAnyFood(t,e,r,n){for(const a of t.food)if(h.circlesCollide(e,r,n,a.x,a.y,a.radius))return a;return!1}static calculateFreeLocation(t,e){const r=e*2+25;let n=0,a=0;const s=1e3;for(let u=0;u<s;u++){n=p.randomInt(r,t.width-r),a=p.randomInt(r,t.height-r);const f=h.isCollidingWithAnyTerrain(t.terrainSpatial,n,a,e),c=h.isCollidingWithAnyFood(t,n,a,e);if(!f&&!c)break}return new y(n,a)}static throttleGameMapFunction(t,e){let r=0;return function(n){l.currentTime-r>e&&(t(n),r=l.currentTime)}}static withinTimeBounds(t,e){return l.currentTime-t<=e}static removeArrItem(t,e){for(let r=0;r<t.length;r++)if(t[r]===e){t[r]=t[t.length-1],t.pop();break}}static getHealthBarColor(t){const r=.75*Math.min(1,1-2*(t-.5)),n=.75*Math.min(1,2*t),a=Math.floor(r*255),s=Math.floor(n*255);return`rgb(${a}, ${s}, 0, 1)`}}function U(o,t,e){return t*o[0]+e*o[3]+o[6]}function O(o,t,e){return t*o[1]+e*o[4]+o[7]}class ct{constructor(){i(this,"x",0);i(this,"y",0);i(this,"viewportWidth",0);i(this,"viewportHeight",0);i(this,"scale",1);i(this,"Transform",h.createIdentityArray());i(this,"InverseTransform",h.createIdentityArray());i(this,"ClipTransform",h.createIdentityArray());i(this,"ProjectionMatrix",h.createIdentityArray());this.ProjectionMatrix[6]=-1,this.ProjectionMatrix[7]=1,this.update()}screenToWorldX(t,e){return U(this.InverseTransform,t,e)}screenToWorldY(t,e){return O(this.InverseTransform,t,e)}worldToScreenX(t,e){return U(this.Transform,t,e)}worldToScreenY(t,e){return O(this.Transform,t,e)}sharpFollow(t,e){this.x=t,this.y=e}smoothFollow(t,e){const a=t-this.x,s=e-this.y;this.x=h.lerp(this.x,t+a,.01),this.y=h.lerp(this.y,e+s,.01)}setTransformMatrix(t,e){this.Transform[0]=this.scale,this.Transform[4]=this.scale,this.Transform[6]=this.scale*-this.x+t,this.Transform[7]=this.scale*-this.y+e}setInverseTransformMatrix(t,e){this.InverseTransform[0]=1/this.scale,this.InverseTransform[4]=1/this.scale,this.InverseTransform[6]=-(this.scale*-this.x+t)/this.scale,this.InverseTransform[7]=-(this.scale*-this.y+e)/this.scale}setProjectionMatrix(){this.ProjectionMatrix[0]=2/this.viewportWidth,this.ProjectionMatrix[4]=-2/this.viewportHeight}setClipTransform(t,e){this.ClipTransform[0]=2*this.scale/this.viewportWidth,this.ClipTransform[4]=-(2*this.scale)/this.viewportHeight,this.ClipTransform[6]=2*(this.scale*-this.x+t)/this.viewportWidth-1,this.ClipTransform[7]=-(2*(this.scale*-this.y+e))/this.viewportHeight+1}update(){let t=this.viewportWidth*.5,e=this.viewportHeight*.5;this.setTransformMatrix(t,e),this.setInverseTransformMatrix(t,e),this.setProjectionMatrix(),this.setClipTransform(t,e)}}const Y=8,E=15,ut=100,ht=200,v=32;function ft(o){return Math.max(Math.trunc(o/v),0)}function lt(o){return Math.max(Math.trunc(o/v),0)}function dt(o){return Math.ceil(o/v)}function mt(o){return Math.ceil(o/v)}class W{constructor(t,e){i(this,"grid");i(this,"columnCount");i(this,"EMPTY_ARR",[]);this.grid=new Array;const r=Math.ceil(t/v)+5,n=Math.ceil(e/v)+5;for(let a=0;a<r*n;a++)this.grid.push([]);this.columnCount=r}getIdx(t,e){const r=Math.trunc(t/v);return Math.trunc(e/v)*this.columnCount+r}retrieve(t,e){const r=this.getIdx(t,e);return this.grid[r]||this.EMPTY_ARR}removePrevious(t){for(let e of t.prevIndexes){let r=this.grid[e];for(let n=0;n<r.length;n++)if(r[n]===t){h.swapRemove(r,n);break}}t.prevIndexes.length=0}remove(t){this.removePrevious(t)}add(t,e){this.removePrevious(t);const r=E,n=ft(e.y1-r),a=lt(e.x1-r),s=dt(e.y2+r),u=mt(e.x2+r);for(let f=n;f<=s;f++)for(let c=a;c<=u;c++){const d=f*this.columnCount+c;this.grid[d].push(t),t.prevIndexes.push(d)}}}const _=32,S=[];let x=[[],[],[],[],[],[],[],[],[]];class pt{constructor(t,e){i(this,"grid");i(this,"columnCount");this.grid=new Array;const r=Math.ceil(t/_)+1,n=Math.ceil(e/_)+1;for(let a=0;a<r*n;a++)this.grid.push([]);this.columnCount=r}retrieve(t){const e=this.getIdx(t),r=this.columnCount;return x[0]=this.grid[e-r-1]||S,x[1]=this.grid[e-r]||S,x[2]=this.grid[e-r+1]||S,x[3]=this.grid[e-1]||S,x[4]=this.grid[e],x[5]=this.grid[e+1],x[6]=this.grid[e+r-1],x[7]=this.grid[e+r],x[8]=this.grid[e+r+1],x}getIdx(t){const e=Math.trunc(t.x/_);return Math.trunc(t.y/_)*this.columnCount+e}remove(t){let e=this.grid[t.prevIdx],r=e.length;for(let n=0;n<r;n++)e.pop()}add(t){const e=this.getIdx(t);this.grid[e].push(t),t.prevIdx=e}}var g=(o=>(o[o.None=0]="None",o[o.Slow=1]="Slow",o[o.Melting=2]="Melting",o[o.Fast=4]="Fast",o))(g||{});class q{constructor(t,e,r,n){i(this,"x");i(this,"y");i(this,"prevX");i(this,"prevY");i(this,"vX");i(this,"vY");i(this,"r");i(this,"forceInstantX");i(this,"forceInstantY");i(this,"forceDecayingX");i(this,"forceDecayingY");i(this,"prevIdx");i(this,"parent");i(this,"health");i(this,"maxHealth");i(this,"circleEffects");i(this,"mostRecentAttacker");this.x=t,this.y=e,this.prevX=t,this.prevY=e,this.vX=0,this.vY=0,this.r=r,this.forceInstantX=0,this.forceInstantY=0,this.forceDecayingX=0,this.forceDecayingY=0,this.prevIdx=1,this.parent=n,this.health=100,this.maxHealth=100,this.circleEffects=0,this.mostRecentAttacker=null}get damage(){return this.r/10}}function xt(o){const t=[],e=yt(o.points,o.precision);for(let r=1;r<e.length;r++){const n=e[r],a=e[r-1],s=n.x-a.x,u=n.y-a.y,f=Math.sqrt(s*s+u*u),c=Math.atan2(u,s);t.push({x:(a.x+n.x)/2-f/2,y:(a.y+n.y)/2-o.thickness/2,w:f,h:o.thickness,a:c})}return o.thickness>20&&vt(t),t}function yt(o,t=100){const e=[];t++;for(let r=0;r<t;r++){const n=r/(t-1),a=wt(n,o);a.t=n,e.push(a)}return e}function wt(o,t){const e=t.length-1,r=1-o;let n=t;if(e===0)return t[0];if(e===1)return{x:r*n[0].x+o*n[1].x,y:r*n[0].y+o*n[1].y};if(e<4){let a=r*r,s=o*o,u=0,f=0,c=0,d=0;return e===2?(n=[n[0],n[1],n[2],{x:0,y:0}],u=a,f=r*o*2,c=s):e===3&&(u=a*r,f=a*o*3,c=r*s*3,d=o*s),{x:u*n[0].x+f*n[1].x+c*n[2].x+d*n[3].x,y:u*n[0].y+f*n[1].y+c*n[2].y+d*n[3].y}}for(;t.length>1;){for(let a=0;a<t.length-1;a++)t[a]={x:t[a].x+(t[a+1].x-t[a].x)*o,y:t[a].y+(t[a+1].y-t[a].y)*o};t.splice(t.length-1,1)}return t[0]}function vt(o){let t=o.length;for(let e=1;e<t;e++){const r=o[e-1],n=o[e-0];o.push({x:(r.x+n.x)/2,y:(r.y+n.y)/2,w:(r.w+n.w)/2,h:(r.h+n.h)/2,a:(r.a+n.a)/2})}}class F{constructor(t,e,r,n,a,s){i(this,"x");i(this,"y");i(this,"w");i(this,"h");i(this,"a");i(this,"prevA");i(this,"deltaX");i(this,"deltaY");i(this,"scripts");i(this,"prevIndexes");i(this,"circleEffects");this.x=t,this.y=e,this.w=r,this.h=n,this.a=a,this.prevA=a,this.deltaX=0,this.deltaY=0,this.scripts=(s==null?void 0:s.map(u=>u.toLowerCase()))||[],this.prevIndexes=[],this.circleEffects=g.Melting|g.Slow}setA(t){this.prevA=this.a,this.a=t}}class N{constructor(t){i(this,"team");i(this,"circles");i(this,"targetPos");i(this,"supplies");this.team=t,this.circles=[],this.targetPos=new y,this.supplies=0}}function At(o,t){const e=o*t,r=500;return Math.sqrt(e)/r}class Rt{constructor(t){i(this,"swarms");i(this,"food");i(this,"maxFood");i(this,"swarmSpatial");i(this,"terrainSpatial");i(this,"foodSpatial");i(this,"staticTerrain");i(this,"activeTerrain");i(this,"width");i(this,"height");this.width=t.width,this.height=t.height,this.swarms=[new N(0)],this.food=[],this.maxFood=At(t.width,t.height),this.swarmSpatial=new pt(this.width,this.height),this.terrainSpatial=new W(this.width,this.height),this.foodSpatial=new W(this.width,this.height),this.staticTerrain=[],this.activeTerrain=[],this.createTerrain(t),this.populateTerrainSpatial()}createTerrain(t){for(let e of t.rectangles)e.scripts&&e.scripts.length>0?this.activeTerrain.push(new F(e.x,e.y,e.w,e.h,e.a,e.scripts)):this.staticTerrain.push(new F(e.x,e.y,e.w,e.h,e.a));if(t.curves)for(let e of t.curves){const r=xt(e);for(let n of r)this.staticTerrain.push(new F(n.x,n.y,n.w,n.h,n.a))}}populateTerrainSpatial(){for(let t of this.staticTerrain)this.terrainSpatial.add(t,h.getRectangleBoundingBox(t));for(let t of this.activeTerrain)this.terrainSpatial.add(t,h.getRectangleBoundingBox(t))}spawnNeutrals(){for(let t=0;t<ut;t++){const e=h.calculateFreeLocation(this,200),r=p.randomInt(Y,E),n=h.getRandomPointInCircle(e.x,e.y,100),a=new q(n.x,n.y,r,this.neutrals);this.neutrals.circles.push(a)}}spawnNewTeam(t){const e=h.calculateFreeLocation(this,200),r=new N(t);for(let n=0;n<ht;n++){const a=p.randomInt(Y,E),s=h.getRandomPointInCircle(e.x,e.y,100),u=new q(s.x,s.y,a,r);r.circles.push(u)}this.swarms.push(r)}get neutrals(){return this.swarms[0]}}class T{constructor(){i(this,"arr");i(this,"index");i(this,"changed");this.arr=new Float32Array(8),this.index=0,this.changed=!0}maybeResize(){let t=this.arr;if(this.index<t.length)return;let e=new Float32Array(t.length*2);for(let r=0;r<t.length;r++)e[r]=t[r];this.arr=e}push(t){this.maybeResize(),this.arr[this.index]=t,this.index++,this.changed=!0}get length(){return this.index}}const bt=`#version 300 es
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
`,gt=`#version 300 es
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
`;class Tt{constructor(t){i(this,"attribs");i(this,"transformBuffer",new T);const e=h.createShaderProgram(t,bt,gt);if(!e)throw new Error("Could not create shader program");const r=t.getAttribLocation(e,"a_unit"),n=t.getUniformLocation(e,"u_projection"),a=t.getAttribLocation(e,"u_transform"),s=t.getUniformLocation(e,"u_color"),u=t.createVertexArray();t.bindVertexArray(u);const f=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,f),t.bufferData(t.ARRAY_BUFFER,h.createUnitQuad(),t.STATIC_DRAW),t.vertexAttribPointer(r,2,t.FLOAT,!1,0,0),t.enableVertexAttribArray(r);const c=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,c),t.vertexAttribPointer(a,4,t.FLOAT,!1,0,0),t.vertexAttribDivisor(a,1),t.enableVertexAttribArray(a),t.bindVertexArray(null),this.attribs={program:e,transformBuffer:c,unitAttributeLocation:r,projectionLocation:n,transformLocation:a,colorLocation:s,unitBuffer:f,vao:u}}reset(){this.transformBuffer.index=0}enqueue(t,e,r,n){this.transformBuffer.push(t),this.transformBuffer.push(e),this.transformBuffer.push(r),this.transformBuffer.push(n)}drawCircles(t,e,r){const n=this.attribs;t.useProgram(n.program),t.bindVertexArray(n.vao),t.uniformMatrix3fv(n.projectionLocation,!1,e),t.uniform4fv(n.colorLocation,r),t.bindBuffer(t.ARRAY_BUFFER,n.transformBuffer),t.bufferData(t.ARRAY_BUFFER,this.transformBuffer.arr,t.STATIC_DRAW,0,this.transformBuffer.length),t.drawArraysInstanced(t.TRIANGLES,0,6,this.transformBuffer.length/4),t.bindVertexArray(null),this.reset()}}const Ct=`#version 300 es
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
`,_t=`#version 300 es
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
`;class St{constructor(t){i(this,"attribs");i(this,"transformData",new T);i(this,"accumulatorData",new T);const e=h.createShaderProgram(t,Ct,_t);if(!e)throw new Error("Could not create shader program");const r=t.getAttribLocation(e,"a_unit"),n=t.getUniformLocation(e,"u_projection"),a=t.getAttribLocation(e,"a_transform"),s=t.getAttribLocation(e,"a_accumulator"),u=t.getUniformLocation(e,"u_color"),f=t.createVertexArray();t.bindVertexArray(f);const c=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,c),t.bufferData(t.ARRAY_BUFFER,h.createUnitQuad(),t.STATIC_DRAW),t.vertexAttribPointer(r,2,t.FLOAT,!1,0,0),t.enableVertexAttribArray(r);const d=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,d),t.vertexAttribPointer(a,4,t.FLOAT,!1,0,0),t.vertexAttribDivisor(a,1),t.enableVertexAttribArray(a);const m=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,m),t.vertexAttribPointer(s,1,t.FLOAT,!1,0,0),t.vertexAttribDivisor(s,1),t.enableVertexAttribArray(s),t.bindVertexArray(null),this.attribs={program:e,transformBuffer:d,accumulatorBuffer:m,unitAttributeLocation:r,projectionLocation:n,transformLocation:a,colorLocation:u,unitBuffer:c,vao:f}}reset(){this.transformData.index=0,this.accumulatorData.index=0}enqueue(t,e,r,n,a){this.transformData.push(t),this.transformData.push(e),this.transformData.push(r),this.transformData.push(n),this.accumulatorData.push(a)}drawFood(t,e,r){const n=this.attribs;t.useProgram(n.program),t.bindVertexArray(n.vao),t.uniformMatrix3fv(n.projectionLocation,!1,e),t.uniform4fv(n.colorLocation,r),t.bindBuffer(t.ARRAY_BUFFER,n.transformBuffer),t.bufferData(t.ARRAY_BUFFER,this.transformData.arr,t.STATIC_DRAW,0,this.transformData.length),t.bindBuffer(t.ARRAY_BUFFER,n.accumulatorBuffer),t.bufferData(t.ARRAY_BUFFER,this.accumulatorData.arr,t.STATIC_DRAW,0,this.accumulatorData.length),t.drawArraysInstanced(t.TRIANGLES,0,6,this.transformData.length/4),t.bindVertexArray(null),this.reset()}}const Dt=`#version 300 es
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
`,Mt=`#version 300 es
  precision mediump float;
  
  uniform vec4 u_color;

  out vec4 outputColor;

  void main() {
    outputColor = u_color;
  }
`;class Ft{constructor(t){i(this,"attribs");i(this,"transformData",new T);const e=h.createShaderProgram(t,Dt,Mt);if(!e)throw new Error("Could not create shader program");const r=t.getUniformLocation(e,"u_color"),n=t.getAttribLocation(e,"a_unit"),a=t.getUniformLocation(e,"u_projectionMatrix"),s=t.getAttribLocation(e,"a_transform"),u=t.createVertexArray();t.bindVertexArray(u);const f=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,f),t.bufferData(t.ARRAY_BUFFER,h.createUnitQuad(),t.STATIC_DRAW),t.vertexAttribPointer(n,2,t.FLOAT,!1,0,0),t.enableVertexAttribArray(n);const c=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,c),t.vertexAttribPointer(s,4,t.FLOAT,!1,0,0),t.vertexAttribDivisor(s,1),t.enableVertexAttribArray(s),t.bindVertexArray(null),this.attribs={program:e,projectionMatrixLocation:a,colorLocation:r,transformBuffer:c,vao:u}}enqueue(t,e,r,n){this.transformData.push(t),this.transformData.push(e),this.transformData.push(r),this.transformData.push(n)}buildGrid(t,e,r,n,a,s){let u=r/s,f=n/s;for(let c=0;c<u;c++)this.enqueue(c*s-a,e,a,n);this.enqueue(r,e-a,a,n+a*2);for(let c=0;c<f;c++)this.enqueue(t,c*s-a,r,a);this.enqueue(t-a,n,r+a*2,a)}drawGrid(t,e,r){const n=this.attribs;t.useProgram(n.program),t.bindVertexArray(n.vao),t.uniformMatrix3fv(n.projectionMatrixLocation,!1,e),this.transformData.changed&&(t.bindBuffer(t.ARRAY_BUFFER,this.attribs.transformBuffer),t.bufferData(t.ARRAY_BUFFER,this.transformData.arr,t.STATIC_DRAW,0,this.transformData.length),this.transformData.changed=!1),t.uniform4fv(n.colorLocation,r),t.drawArraysInstanced(t.TRIANGLES,0,6,this.transformData.length/4),t.bindVertexArray(null)}}const Lt=`#version 300 es
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
`,Bt=`#version 300 es
  precision mediump float;

  uniform vec4 u_color;

  out vec4 outputColor;

  void main() {
    outputColor = u_color;
  }
`;class L{constructor(t){i(this,"attribs");i(this,"transformData",new T);i(this,"angleData",new T);const e=h.createShaderProgram(t,Lt,Bt);if(!e)throw new Error("Could not create shader program");const r=t.getUniformLocation(e,"u_color"),n=t.getAttribLocation(e,"a_unit"),a=t.getUniformLocation(e,"u_projectionMatrix"),s=t.getAttribLocation(e,"a_transform"),u=t.getAttribLocation(e,"a_angle"),f=t.createVertexArray();t.bindVertexArray(f);const c=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,c),t.bufferData(t.ARRAY_BUFFER,h.createUnitQuad(),t.STATIC_DRAW),t.vertexAttribPointer(n,2,t.FLOAT,!1,0,0),t.enableVertexAttribArray(n);const d=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,d),t.vertexAttribPointer(s,4,t.FLOAT,!1,0,0),t.vertexAttribDivisor(s,1),t.enableVertexAttribArray(s);const m=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,m),t.vertexAttribPointer(u,1,t.FLOAT,!1,0,0),t.vertexAttribDivisor(u,1),t.enableVertexAttribArray(u),t.bindVertexArray(null),this.attribs={program:e,projectionMatrixLocation:a,colorLocation:r,transformBuffer:d,angleBuffer:m,vao:f}}reset(){this.transformData.index=0,this.angleData.index=0}enqueue(t,e,r,n,a){this.transformData.push(t),this.transformData.push(e),this.transformData.push(r),this.transformData.push(n),this.angleData.push(a)}drawRectangles(t,e,r,n){if(n===0)return;const a=this.attribs;t.useProgram(a.program),t.bindVertexArray(a.vao),t.uniformMatrix3fv(a.projectionMatrixLocation,!1,e),t.uniform4fv(a.colorLocation,r),this.transformData.changed&&(t.bindBuffer(t.ARRAY_BUFFER,a.transformBuffer),t.bufferData(t.ARRAY_BUFFER,this.transformData.arr,t.STATIC_DRAW,0,n*4),this.transformData.changed=!1),this.angleData.changed&&(t.bindBuffer(t.ARRAY_BUFFER,a.angleBuffer),t.bufferData(t.ARRAY_BUFFER,this.angleData.arr,t.STATIC_DRAW,0,n),this.angleData.changed=!1),t.drawArraysInstanced(t.TRIANGLES,0,6,n),t.bindVertexArray(null),this.reset()}}const P=1.025,B=.1,It=[.125,.125,.125*P,1],G=[.25,.25,.25*P,1],Yt=[.145,.145,.145*P,1],Et=[.9,.1,.1,1],Xt=[0,1,0,1],V=[1,1,1,.1],Pt=[.267,.224,.18,1];function kt(o){switch(o){case 0:return V;case 1:return Et;case 2:return Xt;default:return V}}class Ut{constructor(t){i(this,"renderBackground");i(this,"renderStaticRectangles");i(this,"renderActiveRectangles");i(this,"renderCircles");i(this,"renderFood");i(this,"renderGrid");this.renderBackground=new L(t),this.renderStaticRectangles=new L(t),this.renderActiveRectangles=new L(t),this.renderCircles=new Tt(t),this.renderFood=new St(t),this.renderGrid=new Ft(t),t.clearColor(B,B,B,1),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA)}initialize(t){this.renderGrid.buildGrid(0,0,t.width,t.height,3,200),this.renderBackground.enqueue(0,0,t.width,t.height,0);for(const e of t.staticTerrain)this.renderStaticRectangles.enqueue(e.x+e.deltaX,e.y+e.deltaY,e.w,e.h,e.a)}drawGrid(t,e){this.renderBackground.drawRectangles(t,e.ClipTransform,It,1),this.renderGrid.drawGrid(t,e.ClipTransform,Yt)}drawFood(t,e,r){for(const n of e.food)this.renderFood.enqueue(n.x,n.y,n.radius,1,n.accumulator);this.renderFood.drawFood(t,r.ClipTransform,Pt)}drawTerrain(t,e,r,n){this.renderStaticRectangles.drawRectangles(t,r.ClipTransform,G,e.staticTerrain.length);for(const a of e.activeTerrain)this.renderActiveRectangles.enqueue(a.x+a.deltaX,a.y+a.deltaY,a.w,a.h,h.lerp(a.prevA,a.a,n));this.renderActiveRectangles.drawRectangles(t,r.ClipTransform,G,e.activeTerrain.length)}drawSwarms(t,e,r,n){for(const a of e.swarms){for(let s of a.circles){const u=h.lerp(s.prevX,s.x,n),f=h.lerp(s.prevY,s.y,n);this.renderCircles.enqueue(u,f,s.r,s.health/s.maxHealth)}this.renderCircles.drawCircles(t,r.ClipTransform,kt(a.team))}}renderScene(t,e,r,n){t.clear(t.COLOR_BUFFER_BIT),this.drawGrid(t,r),this.drawTerrain(t,e,r,n),this.drawFood(t,e,r),this.drawSwarms(t,e,r,n)}}let j=0,z=0;const Ot=document.querySelector(".supplies-label"),Wt=document.querySelector(".leaderboard-entries"),H=document.querySelector(".supplies-progress-inner");function Z(o){if(o===j)return;const t=Wt.children[0],e=t.children[0],r=t.children[1];e.textContent="You",r.textContent=o.toString(),j=o}function qt(o){return o>=.9?"Full":o>=.6?"Satisfied":o>=.25?"Hungry":o>=.1?"Starving":"Dying"}function Nt(o){if(o.team!==1)return;const t=o.supplies,e=o.circles.length,r=t/e;t!==z&&(Ot.textContent=qt(r).toString(),H.style.width=r*100+"%",H.style.backgroundColor=h.getHealthBarColor(r),z=t)}const Gt=650,Vt=420;let D=new y(0,0),jt=new y(0,0),zt=new y(0,0);function Ht(o){o.forceDecayingX*=.98,o.forceDecayingY*=.98,o.forceInstantX=0,o.forceInstantY=0}function Zt(o,t,e){if(o.parent.team===0)return;const r=jt.setToDirectionXY(o.x,o.y,t.x,t.y),n=zt.setToDirectionXY(o.x,o.y,e.x,e.y),a=r.dot(n),s=t.parent.team===0?1e3:o.damage*a;s>0&&(t.health-=s,t.mostRecentAttacker=o.parent)}function $(o,t,e,r,n,a,s,u){const f=n-t,c=a-e,d=r+s,m=f*f+c*c;if(m===0||m>d*d)return!1;const M=Math.sqrt(m),k=(M-d)*u,rt=f/M,nt=c/M;return o.x+=rt*k,o.y+=nt*k,!0}function $t(o,t,e){let r=D.reset();for(let n of e.retrieve(o))for(let a of n)o!==a&&$(r,o.x,o.y,o.r,a.x,a.y,a.r,3)&&o.parent!==a.parent&&Zt(o,a,t);o.forceDecayingX+=r.x,o.forceDecayingY+=r.y}function Qt(o,t,e){let r=D.reset();for(let n of e.retrieve(o.x,o.y))if($(r,o.x,o.y,o.r,n.x,n.y,n.radius,5)){if(o.parent.supplies>=o.parent.circles.length)continue;const a=.01;n.radius-=a,o.parent.supplies+=a,n.collisions+=1,n.radius<20&&(e.remove(n),h.removeArrItem(t,n))}o.forceDecayingX+=r.x,o.forceDecayingY+=r.y}function Kt(o,t){if(o.parent.team!==1||!l.mouseDown)return;let e=D;e.setToDirectionXY(t.x,t.y,o.x,o.y),e.scalarMultiply(Gt),o.forceInstantX+=e.x,o.forceInstantY+=e.y}function Jt(o,t){let e=D;const r=h.distance(o.x,o.y,t.x,t.y),n=Math.min(r,Vt);e.setToDirectionXY(o.x,o.y,t.x,t.y),e.scalarMultiply(n),o.forceInstantX+=e.x,o.forceInstantY+=e.y}function te(o,t,e){Ht(t),$t(t,e,o.swarmSpatial),Qt(t,o.food,o.foodSpatial),Kt(t,e),t.parent.team!==0&&Jt(t,e)}function ee(o){return o.setA(o.a+.01),!0}function re(o){return o.w+=0,!0}function ne(o){return o.deltaY=Math.sin(l.currentTime/300)*100,!0}const oe={rotate:ee,scale:re,moveupdown:ne};class ae{constructor(t,e,r){i(this,"x");i(this,"y");i(this,"radius");i(this,"prevIndexes");i(this,"collisions");i(this,"accumulator");this.x=t,this.y=e,this.radius=r,this.prevIndexes=[],this.collisions=0,this.accumulator=0}}const I=600;function ie(o){for(let t of o.activeTerrain)for(let e of t.scripts){let r=oe[e];r&&r(t)&&o.terrainSpatial.add(t,h.getRectangleBoundingBox(t))}}function se(o){for(const t of o.swarms)for(let e of t.circles)o.swarmSpatial.remove(e);for(const t of o.swarms)for(let e of t.circles)o.swarmSpatial.add(e)}function ce(o){for(const t of o.swarms)for(let e of t.circles){te(o,e,t.targetPos),e.vX=e.forceInstantX+e.forceDecayingX,e.vY=e.forceInstantY+e.forceDecayingY;const r=h.vecMagnitude(e.vX,e.vY);r>I&&r!==0&&(e.vX=e.vX/r*I,e.vY=e.vY/r*I),e.circleEffects&g.Slow&&(e.vX*=.1,e.vY*=.1)}}function ue(o){for(const t of o.swarms)for(let e of t.circles)e.prevX=e.x,e.prevY=e.y,e.x+=e.vX*w,e.y+=e.vY*w,e.circleEffects=g.None,h.applyEffectsToCollidingCircles(e,o.terrainSpatial)}function he(o){for(const t of o.swarms)for(let e of t.circles){const r=e.r,n=e.r,a=o.width-e.r,s=o.height-e.r;e.x<r&&(e.x=r,e.prevX=r,e.forceDecayingX=0),e.y<n&&(e.y=n,e.prevY=n,e.forceDecayingY=0),e.x>a&&(e.x=a,e.prevX=a,e.forceDecayingX=0),e.y>s&&(e.y=s,e.prevY=s,e.forceDecayingY=0)}}function Q(o,t){const e=h.calculateFreeLocation(o,200);t.x=e.x,t.y=e.y,t.prevX=e.x,t.prevY=e.y,t.forceInstantX=0,t.forceInstantY=0,t.forceDecayingX=0,t.forceDecayingY=0,t.vX=0,t.vY=0}function fe(o){for(const t of o.swarms)if(!(t.team!==0&&t.circles.length<=1))for(let e=t.circles.length-1;e>=0;e--){const r=t.circles[e];r.health<=0&&r.mostRecentAttacker&&(h.swapRemove(t.circles,e),r.health=r.maxHealth*.5,r.mostRecentAttacker.circles.push(r),r.parent=r.mostRecentAttacker,o.neutrals===r.mostRecentAttacker&&Q(o,r),r.mostRecentAttacker=null)}}function le(o,t,e){let r=0,n=0,a=0,s=0,u=o.circles.length;for(let f of o.circles)r+=h.lerp(f.prevX,f.x,e),n+=h.lerp(f.prevY,f.y,e),a+=f.vX,s+=f.vY;u!==0&&(r/=u,n/=u,a/=u,s/=u),t.smoothFollow(r+a/3,n+s/3),t.update()}function de(o,t){const e=t.circles.pop();e.r=10,e.parent=o.neutrals,o.neutrals.circles.push(e),Q(o,e)}function me(o,t){const e=t.circles.length,r=t.circles[e-1],n=.06*w,a=e*n;r.r-=a,r.r<1&&de(o,t)}function pe(o){for(let t=1;t<o.swarms.length;t++){const e=o.swarms[t];e.supplies-=e.circles.length*.006*w,e.supplies<0&&(e.supplies=0,e.circles.length>1&&me(o,e)),Nt(e),e.team===1&&Z(e.circles.length)}}function xe(o){for(;o.food.length<o.maxFood;){const t=p.randomInt(50,125),e=125,r=h.calculateFreeLocation(o,t+e),n=new ae(r.x,r.y,t);o.food.push(n),o.foodSpatial.add(n,h.getCircleBoundingBox(r.x,r.y,t))}}function ye(o){for(let t of o.swarms)if(!(t.supplies<=0))for(let e of t.circles)e.r<Y&&(e.r+=.01)}function we(o,t,e,r){const n=t.screenToWorldX(e,r),a=t.screenToWorldY(e,r);o.targetPos.setXY(n,a)}function ve(o){for(let t of o.food)t.collisions=0}function Ae(o){const t=Math.abs(Math.sin((o-50)/200)),e=Math.abs(Math.sin(o/200)),r=e-t>0?-1:1;return e>.033?50*r:0}function Re(o,t){return t===0?Ae(o):t>25?1500:t>10?1e3:t>5?500:50}function be(o){for(let t of o.food)t.accumulator+=Re(t.accumulator,t.collisions)*w}function ge(o){const t=o.neutrals;for(const e of o.swarms)for(let r of e.circles)r.circleEffects&g.Melting?(r.health=Math.max(r.health-1,0),r.mostRecentAttacker=t):r.health=Math.min(r.health+1,r.maxHealth)}const Te=h.throttleGameMapFunction(ge,100);function Ce(o){function t(c){l.mouseX=c.clientX,l.mouseY=c.clientY}function e(){l.mouseDown=!0}function r(){l.mouseDown=!1}function n(){let c=document.documentElement.clientWidth,d=document.documentElement.clientHeight;l.webGLCanvas.width=c,l.webGLCanvas.height=d,l.webGLContext.viewport(0,0,c,d),o.viewportWidth=c,o.viewportHeight=d}function a(c){o.scale=h.clamp(o.scale+c,.25,5)}function s(c){if(!c.ctrlKey)return;c.preventDefault();const d=c.deltaY<0?.1:-.1;a(d)}function u(c){c.ctrlKey&&c.key==="="&&(a(.1),c.preventDefault()),c.ctrlKey&&c.key==="-"&&(a(-.1),c.preventDefault())}function f(){l.webGLCanvas.addEventListener("wheel",s),window.addEventListener("pointermove",t),window.addEventListener("pointerdown",e),window.addEventListener("pointerup",r),window.addEventListener("resize",n),document.addEventListener("keydown",u),h.preventRightClick(l.webGLCanvas),n()}f()}const K=6058,J=3766,tt=[{x:761,y:2265,w:100,h:100,a:-1.047,scripts:[]},{x:433,y:824,w:675,h:22,a:0,scripts:[]},{x:433,y:842,w:37,h:677,a:0,scripts:[]},{x:1081,y:836,w:26,h:696,a:0,scripts:[]},{x:2546,y:2173,w:651,h:705,a:.698,scripts:[]},{x:3835,y:590,w:794,h:116,a:.349,scripts:[]},{x:4327,y:2876,w:1182,h:92,a:-.349,scripts:[]},{x:4015,y:645,w:100,h:782,a:.349,scripts:[]},{x:5269,y:1678,w:788,h:36,a:0,scripts:[]},{x:761,y:3034,w:100,h:700,a:0,scripts:[]}],et=[{points:[{x:2087,y:473},{x:2402,y:669},{x:3008,y:630},{x:3020,y:308}],thickness:25,precision:25},{points:[{x:1094.01,y:1527},{x:1090.01,y:1615},{x:1274.01,y:1723},{x:2075.01,y:1318}],thickness:23,precision:25}];var _e={width:K,height:J,rectangles:tt,curves:et},Se=Object.freeze(Object.defineProperty({__proto__:null,width:K,height:J,rectangles:tt,curves:et,default:_e},Symbol.toStringTag,{value:"Module"}));let b=null;const C={movement:[]};function De(o,t,e,r){const n=new ArrayBuffer(20),a=new Int32Array(n);return a[0]=1,a[1]=o,a[2]=t,a[3]=e,a[4]=r,n}function Me(o){const t=new Int32Array(o);return{type:t[0],tick:t[1],player:t[2],x:t[3],y:t[4]}}function Fe(o){switch(new Int32Array(o)[0]){case 1:C.movement.push(Me(o));break}}function Le(){const o=[];if(C.movement.length===0)return o;for(;C.movement.length>0&&C.movement[0].tick<=l.tickNumber;){const t=C.movement.shift();o.push(t)}return o}function Be(o,t,e,r){const n=De(o,t,e,r);b==null||b.send(n)}function Ie(){b=new WebSocket("ws://127.0.0.1:12345/testing"),b.binaryType="arraybuffer",b.addEventListener("message",o=>{Fe(o.data)})}class Ye{constructor(){i(this,"camera");i(this,"map");i(this,"renderer");i(this,"initialize",()=>{Ce(this.camera),this.renderer.initialize(this.map),this.map.spawnNeutrals(),this.map.spawnNewTeam(1)});i(this,"update",()=>{xe(this.map),pe(this.map),ye(this.map),we(this.getMySwarm(),this.camera,l.mouseX,l.mouseY),ie(this.map),se(this.map),ve(this.map),ce(this.map),be(this.map),ue(this.map),he(this.map),fe(this.map),Te(this.map),Z(this.getMySwarm().circles.length)});i(this,"render",t=>{le(this.getMySwarm(),this.camera,t),this.renderer.renderScene(l.webGLContext,this.map,this.camera,t)});i(this,"getMySwarm",()=>this.map.swarms[1]);this.camera=new ct,this.map=new Rt(Se),this.renderer=new Ut(l.webGLContext)}maybeCaptureInput(){const t=this.camera.screenToWorldX(l.mouseX,l.mouseY),e=this.camera.screenToWorldY(l.mouseX,l.mouseY);Be(l.tickNumber+10,1,t,e)}processIncomingPackets(){for(let t of Le()){const e=this.map.swarms.find(r=>r.team===t.player);e&&(e.targetPos.x=t.x,e.targetPos.y=t.y)}}}p.setSeed(6);const X=new Ye;X.initialize();st(X.update,X.render);Ie();
