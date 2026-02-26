// Garden health calculation
export interface GardenState {
  healthLevel: number; // 0-4
  healthName: string;
  totalStreakScore: number;
  hasStorm: boolean; // true if relapse in last 24h
  groundColor: string;
  ambientType: "none" | "subtle" | "butterflies" | "fireflies" | "magical";
}

const HEALTH_TIERS = [
  { level: 0, name: "Barren", min: 0, ground: "#C4A882", ambient: "none" as const },
  { level: 1, name: "Sprouting", min: 6, ground: "#A8C686", ambient: "subtle" as const },
  { level: 2, name: "Growing", min: 21, ground: "#7CB342", ambient: "butterflies" as const },
  { level: 3, name: "Thriving", min: 51, ground: "#558B2F", ambient: "fireflies" as const },
  { level: 4, name: "Paradise", min: 101, ground: "#33691E", ambient: "magical" as const },
];

export function calculateGardenState(
  streakScores: number[],
  lastRelapseTime: string | null
): GardenState {
  const totalStreakScore = streakScores.reduce((sum, s) => sum + s, 0);

  // Determine health tier
  let tier = HEALTH_TIERS[0];
  for (const t of HEALTH_TIERS) {
    if (totalStreakScore >= t.min) tier = t;
  }

  // Check for storm (relapse in last 24h)
  let hasStorm = false;
  if (lastRelapseTime) {
    const relapseDate = new Date(lastRelapseTime);
    const hoursSince = (Date.now() - relapseDate.getTime()) / (1000 * 60 * 60);
    hasStorm = hoursSince < 24;
  }

  return {
    healthLevel: tier.level,
    healthName: tier.name,
    totalStreakScore,
    hasStorm,
    groundColor: tier.ground,
    ambientType: hasStorm ? "none" : tier.ambient,
  };
}

// Deterministic plant position on isometric grid based on habit index
export function getPlantPosition(index: number, totalPlants: number) {
  // Arrange in a spiral-ish pattern on a 4x4 grid
  const positions = [
    { col: 2, row: 2 }, // center
    { col: 1, row: 1 },
    { col: 3, row: 1 },
    { col: 1, row: 3 },
    { col: 3, row: 3 },
    { col: 2, row: 0 },
    { col: 0, row: 2 },
    { col: 2, row: 4 },
    { col: 4, row: 2 },
    { col: 0, row: 0 },
    { col: 4, row: 0 },
    { col: 0, row: 4 },
  ];
  void totalPlants; // used for future dynamic layouts
  return positions[index % positions.length];
}
