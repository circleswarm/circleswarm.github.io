import { startGameLoop } from "./game-loop";
import { Random } from "./random";
import { Scene } from "./scene";
import { establishWebsocket, incoming } from "./ws";
import { deserialize } from "./game-deserializer";
import { Helpers } from "./helpers";
import { Globals } from "./globals";

function onStartScreen() {
  return document.querySelector(".start-container")?.classList.contains("active");
}

function waitForGameStart() {
  if (!maybeNewRoomHandler() && !maybeJoinExistingRoomHandler()) {
    requestAnimationFrame(waitForGameStart);
  }
}

function initializeGame(seed: number) {
  Random.setSeed(seed);

  const scene = new Scene();
  scene.initialize();

  startGameLoop(scene.update, scene.render);

  return scene;
}

function maybeNewRoomHandler() {
  if (incoming.newRoom.length === 0) { 
    return false;
  }

  changeUI();

  const packet = incoming.newRoom[0];

  history.replaceState(null, "", packet.roomName);
  Globals.MY_SWARM_ID = packet.swarmID;

  incoming.newRoom.length = 0;

  const scene = initializeGame(6);
  scene.newRoomSpawn(getPlayerName(), Globals.MY_SWARM_ID);

  return true;
}

function maybeJoinExistingRoomHandler() {
  if (incoming.gameState.length === 0) { 
    return false;
  }

  changeUI();

  let gameState = incoming.gameState[0];

  incoming.gameState.length = 0;

  let scene = initializeGame(6);

  deserialize(scene.map, gameState.buffer);

  scene.existingRoomSpawn(getPlayerName(), Globals.MY_SWARM_ID);

  return true;
}

function getPlayerName() {
  return (document.querySelector(".player-name") as HTMLInputElement).value || "You";
}

function changeUI() {
  document.querySelector(".start-container")?.classList.remove("active");
  document.querySelector(".game-container")?.classList.add("active");
}

function transitionToGame() {
  establishWebsocket(getPlayerName(), parseURLRoomName());
  waitForGameStart();
}

function handlePlayClick() {
  onStartScreen() && transitionToGame();
}

function handleEnterPress(e: KeyboardEvent) {
  onStartScreen() && e.key === "Enter" && transitionToGame();
}

function parseURLRoomName() {
  return Helpers.maybeTrimStartingSlash(window.location.pathname).toLocaleLowerCase().trim() || "";
}

document.querySelector(".button-play")?.addEventListener("click", handlePlayClick);
document.addEventListener("keydown", handleEnterPress);