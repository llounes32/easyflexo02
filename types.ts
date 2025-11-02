export interface Cylinder {
  nom: string;
  dim_mm_A: number;
  dents_B: number;
  num_C: string;
  machines: string[]; // e.g., ['bobst1', 'indien']
}

export interface CalculationResult {
  nom: string;
  dimA: number;
  etiquettes: number; // Corresponds to 'I' in the logic
  largeurUtilisee: number; // Corresponds to 'J' in the logic
  chute: number; // Corresponds to 'K' in the logic
}
