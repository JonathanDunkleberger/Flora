/**
 * Sprite mapping for Sprout Lands pixel art assets.
 * Maps habit colors → creature sprite colors,
 * and provides paths for creatures at each evolution stage.
 */

export type CreatureColor = "default" | "red" | "blue" | "green" | "brown";

/**
 * Map habit hex color to the closest creature sprite color.
 * 10 habit colors → 5 creature colors.
 */
const COLOR_MAP: Record<string, CreatureColor> = {
  "#6366f1": "blue",     // indigo → blue
  "#ec4899": "red",      // pink → red
  "#f59e0b": "default",  // amber → default (yellow)
  "#10b981": "green",    // emerald → green
  "#3b82f6": "blue",     // blue → blue
  "#8b5cf6": "blue",     // violet → blue
  "#ef4444": "red",      // red → red
  "#14b8a6": "green",    // teal → green
  "#f97316": "brown",    // orange → brown
  "#06b6d4": "blue",     // cyan → blue
};

export function getCreatureColor(hexColor: string): CreatureColor {
  return COLOR_MAP[hexColor?.toLowerCase()] || "default";
}

/**
 * Returns the public path to the creature sprite for a given stage and color.
 *
 * Stages:
 *   0 = Egg
 *   1 = Baby chick
 *   2 = Chicken (adult)
 *   3 = Baby cow
 *   4 = Adult cow
 */
export function getCreatureSprite(stage: number, color: CreatureColor): string {
  const prefixes = ["egg", "baby", "chicken", "cow_baby", "cow"];
  const prefix = prefixes[Math.min(Math.max(stage, 0), 4)];
  return `/sprites/creatures/${prefix}_${color}.png`;
}

/**
 * Display size (px) for each creature stage.
 * Scaled up from pixel art originals for clear rendering.
 */
export const CREATURE_SIZES: Record<number, number> = {
  0: 48,  // egg
  1: 48,  // baby chick
  2: 64,  // chicken
  3: 72,  // baby cow
  4: 80,  // adult cow
};

/**
 * Shop/world item sprite paths.
 * Falls back to null if not found.
 */
const SHOP_SPRITE_MAP: Record<string, string> = {
  // Landscape
  "pond": "/sprites/world/stone_large.png",  // placeholder — no pond in pack
  "bridge": "/sprites/shop/bridge.png",
  "bench": "/sprites/shop/picnic.png",       // picnic blanket as bench
  "fence": "/sprites/shop/fence.png",
  "stone-path": "/sprites/world/stone_small.png",
  // Trees
  "sakura": "/sprites/world/tree_large.png",
  "pine": "/sprites/world/tree_medium.png",
  "willow": "/sprites/world/big_tree.png",
  "oak": "/sprites/world/tree_large.png",
  // Flowers
  "tulips": "/sprites/world/flower_pink.png",
  "sunflowers": "/sprites/world/flower_yellow.png",
  "roses": "/sprites/world/flower_pink.png",
  "lavender": "/sprites/world/flower_blue.png",
  // Decorations
  "lantern": "/sprites/shop/sign.png",       // signpost
  "mushrooms": "/sprites/world/mushroom_red.png",
  "rock-garden": "/sprites/world/stone_large.png",
  "birdhouse": "/sprites/shop/well.png",     // well as birdhouse
  // New items from the pack
  "well": "/sprites/shop/well.png",
  "boat": "/sprites/shop/boat.png",
  "sign": "/sprites/shop/sign.png",
  "picnic": "/sprites/shop/picnic.png",
  "bush": "/sprites/world/bush.png",
  "stump": "/sprites/world/stump.png",
  "flower_pink": "/sprites/world/flower_pink.png",
  "flower_blue": "/sprites/world/flower_blue.png",
  "flower_yellow": "/sprites/world/flower_yellow.png",
  "mushroom_red": "/sprites/world/mushroom_red.png",
  "mushroom_purple": "/sprites/world/mushroom_purple.png",
  "mushroom_blue": "/sprites/world/mushroom_blue.png",
  "stone_small": "/sprites/world/stone_small.png",
  "stone_large": "/sprites/world/stone_large.png",
  "butterfly": "/sprites/world/butterfly.png",
  "big_tree": "/sprites/world/big_tree.png",
  "tree_sapling": "/sprites/world/tree_sapling.png",
  "tree_small": "/sprites/world/tree_small.png",
};

export function getShopSprite(itemId: string): string | null {
  return SHOP_SPRITE_MAP[itemId] || null;
}
