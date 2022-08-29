import { Globals } from "./globals";

export const PHYSICS_TIMESTEP = 1 / 60;

/*

currentTime is in milliseconds
prevTime is in milliseconds

remainingTime is in seconds
deltaTime is in seconds
PHYSICS_TIMESTEP is in seconds

*/

export function startGameLoop(userPhysics: () => void, userRender: (alpha: number) => void) {
  let prevTime = performance.now();
  let timeAccumulator = 0;

  Globals.tickNumber = 0;

  function executePhysics() {
    while (timeAccumulator > PHYSICS_TIMESTEP) {
      userPhysics();
  
      timeAccumulator -= PHYSICS_TIMESTEP;

      Globals.tickNumber = Globals.tickNumber + 1;
    }
  }

  function renderGame() {
    const alpha = timeAccumulator / PHYSICS_TIMESTEP;
  
    userRender(alpha);
  
    requestAnimationFrame(renderGame);
  }
  
  function gameLoop() { // draw based on delta since last frame, not fps  
    const currTime = performance.now();
  
    const deltaTime = (currTime - prevTime) / 1000; // elapsed is in milliseconds, but delta time should be in seconds

    prevTime = currTime;

    timeAccumulator += deltaTime;
  
    executePhysics();
  }

  function createTickWorker() {
    const fnStr = [ "function tick() { postMessage(1); } setInterval(tick, 1);" ];
    const jsBlob = new Blob(fnStr, { type: "text/javascript" });
    const workerURL = URL.createObjectURL(jsBlob);

    return new Worker(workerURL);
  }

  function beginPhysicsLoop() {
    const intervalWorker = createTickWorker();
    
    intervalWorker.onmessage = gameLoop;
  }

  beginPhysicsLoop();
  requestAnimationFrame(renderGame);
}