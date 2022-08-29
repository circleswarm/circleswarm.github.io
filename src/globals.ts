import { PHYSICS_TIMESTEP } from "./game-loop";

export abstract class Globals {
  public static webGLCanvas: HTMLCanvasElement;
  public static webGLContext: WebGL2RenderingContext;

  public static mouseX: number = 0;
  public static mouseY: number = 0;
  public static mouseDown: boolean = false;

  public static tickNumber: number = 0;

  public static MY_SWARM_ID: number = -1;

  public static get currentTime() {
    return Globals.tickNumber * PHYSICS_TIMESTEP * 1000;
  }

  // @ts-ignore
  private static init = Globals.initialize();

  public static initialize() {
    const glCanvas = document.querySelector(".webgl-canvas") as HTMLCanvasElement;
    if (!glCanvas) { throw new Error("Could not query for WebGL canvas"); }

    const glContext = glCanvas.getContext("webgl2", { 
      alpha: false,
      desynchronized: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: false
    });
    if (!glContext) { throw new Error("Could not get WebGL context"); }
    
    glContext.enable(glContext.BLEND);

    Globals.webGLCanvas = glCanvas;
    Globals.webGLContext = glContext;
  }
}