export const HABIT_CATEGORIES = [
  { value: "health", label: "Health", icon: "❤️" },
  { value: "fitness", label: "Fitness", icon: "💪" },
  { value: "mindfulness", label: "Mindfulness", icon: "🧘" },
  { value: "productivity", label: "Productivity", icon: "⚡" },
  { value: "substance", label: "Quit Substance", icon: "🚫" },
  { value: "digital", label: "Digital Wellness", icon: "📵" },
  { value: "social", label: "Social", icon: "🤝" },
  { value: "learning", label: "Learning", icon: "📚" },
  { value: "self-care", label: "Self Care", icon: "🛁" },
  { value: "other", label: "Other", icon: "✨" },
] as const;

export const HABIT_GROUPS = [
  { value: "morning", label: "Morning", icon: "🌅" },
  { value: "afternoon", label: "Afternoon", icon: "☀️" },
  { value: "evening", label: "Evening", icon: "🌙" },
  { value: "fitness", label: "Fitness", icon: "🏋️" },
  { value: "wellness", label: "Wellness", icon: "🧠" },
  { value: "none", label: "No Group", icon: "📌" },
] as const;

export const HABIT_ICONS = [
  "🌱", "💪", "📚", "🧘", "🏃", "🚫", "💧", "🦷", "📵",
  "✍️", "🎨", "🎵", "🧹", "💤", "🥗", "💊", "🙏", "🌅",
  "🧠", "❤️", "🚭", "🍃", "⚡", "🎯", "✨",
] as const;

export const PLANT_TYPES = [
  { value: "fern", label: "Fern", description: "Classic & resilient", pro: false },
  { value: "sunflower", label: "Sunflower", description: "Bright & cheerful", pro: true },
  { value: "cherry_blossom", label: "Cherry Blossom", description: "Serene & elegant", pro: true },
  { value: "oak", label: "Oak Tree", description: "Strong & enduring", pro: true },
  { value: "cactus", label: "Cactus", description: "Tough & minimal", pro: true },
  { value: "bamboo", label: "Bamboo", description: "Flexible & fast", pro: true },
] as const;

export const FREE_HABIT_LIMIT = 3;
