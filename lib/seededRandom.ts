type SeedPart = string | number | boolean | null | undefined;

export function seedFromParts(...parts: SeedPart[]): number {
  let hash = 2166136261;

  for (const part of parts) {
    const value = String(part ?? '');
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
  }

  return hash >>> 0 || 1;
}

export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0 || 1;

  return () => {
    state += 0x6d2b79f5;
    let next = Math.imul(state ^ (state >>> 15), 1 | state);
    next ^= next + Math.imul(next ^ (next >>> 7), 61 | next);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
