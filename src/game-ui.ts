import { GameMap } from "./game-map";
import { Globals } from "./globals";
import { Helpers } from "./helpers";
import { Swarm } from "./swarm";

let suppliesCount = 0;

const suppliesStringDIV = document.querySelector(".supplies-label") as HTMLDivElement;
const leaderboardEntriesDIV = document.querySelector(".leaderboard-entries") as HTMLDivElement;
const suppliesProgressInnerDIV = document.querySelector(".supplies-progress-inner") as HTMLDivElement;

// memoize
function updateLeaderboardEntry(index: number, playerName: string, playerScore: string) {
  const entry = leaderboardEntriesDIV.children[index];

  const entryName = entry.children[0];
  const entryValue = entry.children[1];

  entryName.textContent = playerName;
  entryValue.textContent = playerScore;
}

function swarmPredicate(s1: Swarm, s2: Swarm) {
  return s2.circles.length - s1.circles.length;
}

export function updateLeaderboard(map: GameMap) {
  Helpers.predicateInsertionSort(map.players, swarmPredicate);

  for (let i = 0; i < 10; i++) {
    let player = map.players[i];

    if (player) {
      updateLeaderboardEntry(i, player.name, player.circles.length.toString());
    } else {
      updateLeaderboardEntry(i, "", "");
    }
  }
}

function getHungerString(percentage: number) {
  if (percentage >= 0.90) {
    return "Full";
  } else if (percentage >= 0.60) {
    return "Satisfied";
  } else if (percentage >= 0.25) {
    return "Hungry";
  } else if (percentage >= 0.10) {
    return "Starving";
  } else {
    return "Dying";
  }
}

export function maybeUpdateSupplies(swarm: Swarm) {
  if (swarm.swarmID !== Globals.MY_SWARM_ID) { return; }

  const supplies = swarm.supplies;
  const swarmCount = swarm.circles.length;
  const percentage = supplies / swarmCount;

  if (supplies !== suppliesCount) {
    suppliesStringDIV.textContent = getHungerString(percentage).toString();

    suppliesProgressInnerDIV.style.width = (percentage * 100) + "%";
    suppliesProgressInnerDIV.style.backgroundColor = Helpers.getHealthBarColor(percentage);

    suppliesCount = supplies;
  }
}