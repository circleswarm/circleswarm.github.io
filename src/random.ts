// https://stackoverflow.com/a/47593316/962155
export class Random {
  static seed = new Date().getTime();

  static setSeed(seed: number) {
    Random.seed = seed;
  }

  // Between 0.0 and 1.0
  static randomUnitFloat() {
    var t = Random.seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  static randomFloat(min: number, max: number) {
    return Random.randomUnitFloat() * (max - min) + min;
  }
  
  // Inclusive on both bounds
  static randomInt(min: number, max: number) {
    return Math.floor(Random.randomUnitFloat() * (max - min + 1)) + min;
  }
}