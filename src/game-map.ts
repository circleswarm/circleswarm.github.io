import { BoundingSpatial } from "./bounding-spatial";
import { CenterSpatial } from "./center-spatial";
import { Circle } from "./circle";
import { CIRCLE_MAX_RADIUS, CIRCLE_MIN_RADIUS, STARTING_NEUTRALS_COUNT, STARTING_SWARM_COUNT } from "./constants";
import { getRectanglesFromCurve } from "./curves";
import { Food } from "./food";
import { Helpers } from "./helpers";
import { MapFile } from "./interfaces";
import { Random } from "./random";
import { Rectangle } from "./rectangle";
import { Swarm } from "./swarm";

function calculateMaxFood(mapWidth: number, mapHeight: number) {
  const area = mapWidth * mapHeight;
  const factor = 500;

  return Math.sqrt(area) / factor;
}

export class GameMap {
  neutralsPlusPlayers: Array<Swarm>;
  players: Array<Swarm>;
  neutrals: Swarm;

  food: Array<Food>;
  maxFood: number;
  swarmSpatial: CenterSpatial;
  terrainSpatial: BoundingSpatial<Rectangle>;
  foodSpatial: BoundingSpatial<Food>;
  staticTerrain: Array<Rectangle>;
  activeTerrain: Array<Rectangle>;
  width: number;
  height: number;

  constructor(mapFile: MapFile) {
    this.width = mapFile.width;
    this.height = mapFile.height;

    this.neutrals = new Swarm("Neutrals", 0);

    this.neutralsPlusPlayers = [];
    this.players = [];
    this.food = [];
    this.maxFood = calculateMaxFood(mapFile.width, mapFile.height);
    this.swarmSpatial = new CenterSpatial(this.width, this.height);
    this.terrainSpatial = new BoundingSpatial<Rectangle>(this.width, this.height);
    this.foodSpatial = new BoundingSpatial<Food>(this.width, this.height);
    this.staticTerrain = [];
    this.activeTerrain = [];
    
    this.createTerrain(mapFile);    
    this.populateTerrainSpatial();
  }

  private createTerrain(mapFile: MapFile) {
    for (let t of mapFile.rectangles) {
      if (t.scripts && t.scripts.length > 0) {
        this.activeTerrain.push(new Rectangle(t.x, t.y, t.w, t.h, t.a, t.scripts));
      } else {
        this.staticTerrain.push(new Rectangle(t.x, t.y, t.w, t.h, t.a));
      }
    }
  
    if (mapFile.curves) {
      for (let curve of mapFile.curves) {
        const rects = getRectanglesFromCurve(curve);
    
        for (let r of rects) {
          this.staticTerrain.push(new Rectangle(r.x, r.y, r.w, r.h, r.a));
        }
      }
    }
  }

  private populateTerrainSpatial() {
    for (let r of this.staticTerrain) {
      this.terrainSpatial.add(r, Helpers.getRectangleBoundingBox(r));
    }

    for (let r of this.activeTerrain) {
      this.terrainSpatial.add(r, Helpers.getRectangleBoundingBox(r));
    }
  }

  public spawnNeutrals() {
    let neutrals = new Swarm("Neutrals", 0);

    for (let i = 0; i < STARTING_NEUTRALS_COUNT; i++) {
      const spawnPos = Helpers.calculateFreeLocation(this, 200);
      const cirR = Random.randomInt(CIRCLE_MIN_RADIUS, CIRCLE_MAX_RADIUS);
      const pos = Helpers.getRandomPointInCircle(spawnPos.x, spawnPos.y, 100);

      const newCircle = new Circle(pos.x, pos.y, cirR, this.neutrals);

      neutrals.circles.push(newCircle);
    }

    this.neutrals = neutrals;

    this.neutralsPlusPlayers.unshift(neutrals);
  }

  // maybe it should find team number automatically and return it?

  public spawnNewTeam(name: string, team: number) {
    const spawnPos = Helpers.calculateFreeLocation(this, 200);

    const newTeamSwarm = new Swarm(name, team);

    for (let i = 0; i < STARTING_SWARM_COUNT; i++) {
      const cirR = Random.randomInt(CIRCLE_MIN_RADIUS, CIRCLE_MAX_RADIUS);
      const pos = Helpers.getRandomPointInCircle(spawnPos.x, spawnPos.y, 100);

      const newCircle = new Circle(pos.x, pos.y, cirR, newTeamSwarm);
      newTeamSwarm.circles.push(newCircle);

      newTeamSwarm.supplies = newTeamSwarm.circles.length;
    }

    this.players.push(newTeamSwarm);
    this.neutralsPlusPlayers.push(newTeamSwarm);    

    Helpers.createFloatingName(name, team);
  }
}