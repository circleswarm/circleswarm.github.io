import { Camera } from "./camera";
import { CIRCLE_MAX_HEALTH } from "./constants";
import { GameMap } from "./game-map";
import { Helpers } from "./helpers";
import { PALETTE_COLORS } from "./palette";
import { RenderCircles } from "./shaders/render-circles";
import { RenderFood } from "./shaders/render-food";
import { RenderGrid } from "./shaders/render-grid";
import { RenderRectangles } from "./shaders/render-rectangles";
import { Swarm } from "./swarm";

const BLUISH = 1.025;
const FOG = 0.1;
const COLOR_BG = [ 0.125, 0.125, 0.125 * BLUISH, 1 ];
const COLOR_TERRAIN = [ 0.25, 0.25, 0.25 * BLUISH, 1 ];
const COLOR_GRID = [ 0.145, 0.145, 0.145 * BLUISH, 1 ];

// const COLOR_RED = [ 0.9, 0.10, 0.10, 1 ];
// const COLOR_GREEN = [ 0, 1, 0, 1 ];
const COLOR_GREY = [ 1, 1, 1, 0.1 ];

const COLOR_FOOD = [ 0.267, 0.224, 0.18, 1.0 ];

// const SWARM_COLORS = [
//   COLOR_GREY,
//   COLOR_RED,
//   COLOR_GREEN
// ];

function getSwarmColor(team: number) {
  if (team === 0) {
    return COLOR_GREY;
  } else {
    return PALETTE_COLORS[team % PALETTE_COLORS.length];
  }
}

export class Renderer {
  private renderBackground: RenderRectangles;
  private renderStaticRectangles: RenderRectangles;
  private renderActiveRectangles: RenderRectangles;
  private renderCircles: RenderCircles;
  private renderFood: RenderFood;
  private renderGrid: RenderGrid;

  constructor(gl: WebGL2RenderingContext) {
    this.renderBackground = new RenderRectangles(gl);
    this.renderStaticRectangles = new RenderRectangles(gl);
    this.renderActiveRectangles = new RenderRectangles(gl);
    this.renderCircles = new RenderCircles(gl);
    this.renderFood = new RenderFood(gl);
    this.renderGrid = new RenderGrid(gl);

    gl.clearColor(FOG, FOG, FOG, 1);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  initialize(map: GameMap) {
    this.renderGrid.buildGrid(0, 0, map.width, map.height, 3, 200);

    this.renderBackground.enqueue(0, 0, map.width, map.height, 0);

    for (const r of map.staticTerrain) {
      this.renderStaticRectangles.enqueue(r.x + r.deltaX, r.y + r.deltaY, r.w, r.h, r.a);
    }
  }

  drawGrid(gl: WebGL2RenderingContext, camera: Camera) {
    this.renderBackground.drawRectangles(gl, camera.ClipTransform, COLOR_BG, 1);
    this.renderGrid.drawGrid(gl, camera.ClipTransform, COLOR_GRID);
  }

  drawFood(gl: WebGL2RenderingContext, map: GameMap, camera: Camera) {
    for (const food of map.food) {
      this.renderFood.enqueue(food.x, food.y, food.radius, 1, food.accumulator);
    }

    this.renderFood.drawFood(gl, camera.ClipTransform, COLOR_FOOD);
  }

  drawTerrain(gl: WebGL2RenderingContext, map: GameMap, camera: Camera, alpha: number) {
    this.renderStaticRectangles.drawRectangles(gl, camera.ClipTransform, COLOR_TERRAIN, map.staticTerrain.length);

    for (const r of map.activeTerrain) {
      this.renderActiveRectangles.enqueue(r.x + r.deltaX, r.y + r.deltaY, r.w, r.h, Helpers.lerp(r.prevA, r.a, alpha));
    }
    
    this.renderActiveRectangles.drawRectangles(gl, camera.ClipTransform, COLOR_TERRAIN, map.activeTerrain.length);
  }

  drawSwarm(gl: WebGL2RenderingContext, swarm: Swarm, camera: Camera, alpha: number) {
    for (let c of swarm.circles) {
      const interX = Helpers.lerp(c.prevX, c.x, alpha);
      const interY = Helpers.lerp(c.prevY, c.y, alpha);

      this.renderCircles.enqueue(interX, interY, c.r, c.health / CIRCLE_MAX_HEALTH);
    }
    
    this.renderCircles.drawCircles(gl, camera.ClipTransform, getSwarmColor(swarm.swarmID));
  }

  drawSwarms(gl: WebGL2RenderingContext, map: GameMap, camera: Camera, alpha: number) {
    for (const swarm of map.neutralsPlusPlayers) {
      this.drawSwarm(gl, swarm, camera, alpha);
    }
  }

  getFloatingNamesContainer(): Array<HTMLDivElement> {
    const floatingNames = document.querySelector(".floating-names") as HTMLDivElement;

    if (!floatingNames) { return []; }

    let result = [];

    for (let i = 0; i < floatingNames.children.length; i++) {
      result.push(floatingNames.children[i] as HTMLDivElement);
    }

    return result;
  }

  calculateSwarmTop(swarm: Swarm, alpha: number) {
    let minY = 9999999999;

    for (let c of swarm.circles) {
      const lerpY = Helpers.lerp(c.prevY, c.y, alpha);

      if (lerpY < minY) {
        minY = lerpY;
      }
    }

    return minY;
  }

  updateNamePositions(map: GameMap, camera: Camera, alpha: number) {
    const floatingNames = this.getFloatingNamesContainer();

    for (let player of map.players) {
      const nameElem = floatingNames.find(c => parseInt(c.dataset["swarm"] || "0") === player.swarmID);
      if (!nameElem) { continue; }
      
      nameElem.style.transform = `translate3d(-50%, -100%, 0) scale(${camera.zoom})`;

      const minY = this.calculateSwarmTop(player, alpha) - 25;

      const x = camera.worldToScreenX(player.centerX, minY);
      const y = camera.worldToScreenY(player.centerX, minY);

      // const prevX = parseFloat(nameElem.style.left) || 0;
      // const prevY = parseFloat(nameElem.style.top) || 0;

      // const newX = Helpers.smoothFollow(prevX, x, 0.1);
      // const newY = Helpers.smoothFollow(prevY, y, 0.1);  

      nameElem.style.left = x + "px";
      nameElem.style.top = y + "px";
    }
  }

  renderScene(gl: WebGL2RenderingContext, map: GameMap, camera: Camera, alpha: number) {
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.drawGrid(gl, camera);
    this.drawTerrain(gl, map, camera, alpha);
    this.drawFood(gl, map, camera);
    this.drawSwarms(gl, map, camera, alpha);

    this.updateNamePositions(map, camera, alpha);
  }
}