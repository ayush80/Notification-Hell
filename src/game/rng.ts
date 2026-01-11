// Mulberry32 seeded PRNG
export function createRng(seed: number) {
  let state = seed;
  
  function next(): number {
    state |= 0;
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  
  function nextInt(min: number, max: number): number {
    return Math.floor(next() * (max - min + 1)) + min;
  }
  
  function nextFloat(min: number, max: number): number {
    return next() * (max - min) + min;
  }
  
  function nextBool(probability: number = 0.5): boolean {
    return next() < probability;
  }
  
  function pick<T>(arr: T[]): T {
    return arr[Math.floor(next() * arr.length)];
  }
  
  function getState(): number {
    return state;
  }
  
  function setState(newState: number): void {
    state = newState;
  }
  
  return {
    next,
    nextInt,
    nextFloat,
    nextBool,
    pick,
    getState,
    setState,
  };
}

export type RNG = ReturnType<typeof createRng>;

export function generateSeed(): number {
  return Math.floor(Math.random() * 2147483647);
}

