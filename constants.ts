import { Cylinder } from './types';

// Machine keys: 'bobst1', 'bobst2', 'indien'
export const CYLINDER_DATA: Cylinder[] = [
  {
    "nom": "Cylindre 80 Dents (Z80)",
    "dim_mm_A": 254.00,
    "dents_B": 80,
    "num_C": "Z80",
    "machines": ["indien"]
  },
  {
    "nom": "Cylindre 88 Dents (Z88)",
    "dim_mm_A": 279.40,
    "dents_B": 88,
    "num_C": "Z88",
    "machines": ["indien"]
  },
  {
    "nom": "Cylindre 96 Dents (Z96)",
    "dim_mm_A": 304.80,
    "dents_B": 96,
    "num_C": "Z96",
    "machines": ["indien"]
  },
  {
    "nom": "Cylindre 144 Dents (Z144)",
    "dim_mm_A": 457.20,
    "dents_B": 144,
    "num_C": "Z144",
    "machines": ["bobst2"]
  },
  {
    "nom": "Cylindre 112 Dents (Z112)",
    "dim_mm_A": 355.60,
    "dents_B": 112,
    "num_C": "Z112",
    "machines": ["bobst1"]
  },
  {
    "nom": "Cylindre 100 Dents (Z100)",
    "dim_mm_A": 317.50,
    "dents_B": 100,
    "num_C": "Z100",
    "machines": ["bobst2"]
  },
  {
    "nom": "Cylindre 160 Dents (Z160)",
    "dim_mm_A": 508.00,
    "dents_B": 160,
    "num_C": "Z160",
    "machines": ["bobst1", "bobst2"]
  },
  {
    "nom": "Cylindre 120 Dents (Z192)",
    "dim_mm_A": 609.60,
    "dents_B": 192,
    "num_C": "Z192",
    "machines": ["bobst1", "bobst2"]
  },
  {
    "nom": "Cylindre 116 Dents (Z116)",
    "dim_mm_A": 368.3,
    "dents_B": 116,
    "num_C": "Z116",
    "machines": ["bobst1"]
  },
  {
    "nom": "Cylindre 110 Dents (Z110)",
    "dim_mm_A": 349.25,
    "dents_B": 110,
    "num_C": "Z110",
    "machines": ["bobst1"]
  },
  {
    "nom": "Cylindre 168 Dents (Z168)",
    "dim_mm_A": 533.40,
    "dents_B": 168,
    "num_C": "Z168",
    "machines": ["bobst2"]
  },
  {
    "nom": "Cylindre 84 Dents (Z84)",
    "dim_mm_A": 266.70,
    "dents_B": 84,
    "num_C": "Z84",
    "machines": ["indien"]
  },
  {
    "nom": "Cylindre 128 Dents (Z128)",
    "dim_mm_A": 406.40,
    "dents_B": 128,
    "num_C": "Z128",
    "machines": ["indien"]
  }
];

export const MACHINES = {
  bobst1: "Bobst 01",
  bobst2: "Bobst 02",
  indien: "Indien"
};
