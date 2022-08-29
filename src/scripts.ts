import { Globals } from "./globals";
import { Rectangle } from "./rectangle";

// returns whether or not the shape changed in any way
// if so, we should re-compute spatial
type StrToFnEffects = {
  [key: string]: (rect: Rectangle) => boolean;
};

function rotate(rect: Rectangle) {
  rect.setA(rect.a + 0.01);

  return true;
}

function scale(rect: Rectangle) {
  rect.w += 0;

  return true;
}

function moveupdown(rect: Rectangle) {
  rect.deltaY = Math.sin(Globals.currentTime / 300) * 100;

  return true;
}

export const scriptsMapping: StrToFnEffects = {
  "rotate": rotate,
  "scale": scale,
  "moveupdown": moveupdown
};