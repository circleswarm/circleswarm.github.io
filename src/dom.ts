import { Camera } from "./camera";
import { Globals } from "./globals";
import { Helpers } from "./helpers";

export function initializeDOM(camera: Camera) {
  function pointerMoveHandler(e: PointerEvent) {
    Globals.mouseX = e.clientX;
    Globals.mouseY = e.clientY;
  }
  
  function pointerDownHandler() {
    Globals.mouseDown = true;
  }
  
  function pointerUpHandler() {
    Globals.mouseDown = false;
  }
  
  function resizeWindowHandler() {
    let newWidth = document.documentElement.clientWidth;
    let newHeight = document.documentElement.clientHeight;
  
    Globals.webGLCanvas.width = newWidth;
    Globals.webGLCanvas.height = newHeight;
    Globals.webGLContext.viewport(0, 0, newWidth, newHeight);
  
    // const inverseRatio = 1 / window.devicePixelRatio;
    // Globals.webGLCanvas.style["transform"] = `scale(${inverseRatio})`;
  
    camera.viewportWidth = newWidth;
    camera.viewportHeight = newHeight;
  }
  
  function zoomGame(increment: number) {
    camera.zoom = Helpers.clamp(camera.zoom + increment, 0.25, 5);
  }
  
  function mouseWheelHandler(e: WheelEvent) {
    if (!e.ctrlKey) { return; }
  
    e.preventDefault();
  
    const zoomAmount = e.deltaY < 0 ? 0.1 : -0.1;
  
    zoomGame(zoomAmount);
  }
  
  function keyDownHandler(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === "=") {
      zoomGame(0.1);
  
      e.preventDefault();
    }
  
    if (e.ctrlKey && e.key === "-") {
      zoomGame(-0.1);
  
      e.preventDefault();
    }
  }

  function listen() {
    Globals.webGLCanvas.addEventListener("wheel", mouseWheelHandler);

    window.addEventListener("pointermove", pointerMoveHandler);
    window.addEventListener("pointerdown", pointerDownHandler);
    window.addEventListener("pointerup", pointerUpHandler);
    window.addEventListener('resize', resizeWindowHandler);
  
    document.addEventListener("keydown", keyDownHandler);
  
    Helpers.preventRightClick(Globals.webGLCanvas);
  
    resizeWindowHandler();
  }

  listen();
}