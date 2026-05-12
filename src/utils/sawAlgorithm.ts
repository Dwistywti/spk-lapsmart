import { Laptop, Weights } from '../types';

export interface RankedLaptop extends Laptop {
  score: number;
  normalized: {
    ram: number;
    storage: number;
    processor: number;
    display: number;
  };
}

// Maintaining this alias for backward compatibility with some components
export type SAWResult = { laptop: Laptop; score: number; normalized: any };

export const calculateSAW = (laptops: Laptop[], weights: Weights): RankedLaptop[] => {
  if (!laptops || laptops.length === 0) return [];

  // 1. Calculate effective processor scores for current set
  const laptopsWithProc = laptops.map(l => {
    // If coreNum/threadsNum exist, calculate fresh score, otherwise use stored processorScore
    const procScore = (l.coreNum && l.threadsNum) 
      ? (l.coreNum * 0.6 + l.threadsNum * 0.4) 
      : (l.processorScore || 0);
    return { ...l, effectiveProc: procScore };
  });

  // 2. Find Max values for normalization (Benefit criteria)
  const maxValues = {
    ram: Math.max(...laptops.map(l => l.ram || 1)),
    storage: Math.max(...laptops.map(l => l.storage || 1)),
    processor: Math.max(...laptopsWithProc.map(l => l.effectiveProc || 1)),
    display: Math.max(...laptops.map(l => l.display || 1)),
  };

  // 3. Normalize and calculate preference
  const results: RankedLaptop[] = laptopsWithProc.map(l => {
    const normalized = {
      ram: (l.ram || 0) / (maxValues.ram || 1),
      storage: (l.storage || 0) / (maxValues.storage || 1),
      processor: (l.effectiveProc || 0) / (maxValues.processor || 1),
      display: (l.display || 0) / (maxValues.display || 1),
    };

    // Vi = sum(wj * rij)
    const score = 
      (normalized.ram * weights.ram) +
      (normalized.storage * weights.storage) +
      (normalized.processor * weights.processor) +
      (normalized.display * weights.display);

    const { effectiveProc, ...laptopData } = l as any;

    return {
      ...laptopData,
      processorScore: Number(effectiveProc.toFixed(1)),
      normalized,
      score: Number((score * 10).toFixed(2)) // Scale to 10 for better visual range
    };
  });

  // 4. Sort by score descending
  return results.sort((a, b) => b.score - a.score);
};
