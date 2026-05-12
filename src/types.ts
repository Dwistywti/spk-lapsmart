export type Role = "admin" | "user";

export interface Criterion {
  id: string;
  name: string;
  type: "benefit" | "cost";
  weight: number;
}

export interface Laptop {
  id: string;
  brand: string;
  model: string;
  price: number; 
  ram: number;   
  storage: number; 
  processor: string;
  processorScore: number; 
  display: number; 
  rating: number;
  image?: string;
  description: string;
  // Raw fields from dataset for calculations
  threadsNum?: number;
  coreNum?: number;
}

export interface CategoryWeights {
  [key: string]: any; // Use any to allow any Weights type
}

export const CATEGORIES = ["Gaming", "Office/Work", "Student", "Programming", "Content Creator"] as const;
export type Category = typeof CATEGORIES[number];

export const CATEGORY_WEIGHTS: CategoryWeights = {
  "Gaming": { ram: 0.2, storage: 0.15, processor: 0.45, display: 0.2 },
  "Office/Work": { ram: 0.25, storage: 0.25, processor: 0.25, display: 0.25 },
  "Student": { ram: 0.25, storage: 0.3, processor: 0.2, display: 0.25 },
  "Programming": { ram: 0.35, storage: 0.15, processor: 0.4, display: 0.1 },
  "Content Creator": { ram: 0.2, storage: 0.2, processor: 0.3, display: 0.3 },
};
