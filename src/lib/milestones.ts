// Template-based milestone messages — no AI needed for MVP
// These are specific to habit categories for maximum impact

interface MilestoneTemplate {
  days: number;
  buildMessages: Record<string, string>;
  quitMessages: Record<string, string>;
  defaultBuild: string;
  defaultQuit: string;
}

const TEMPLATES: MilestoneTemplate[] = [
  {
    days: 3,
    buildMessages: {
      fitness: "Three days in. Your muscles are already starting to remember what they're capable of.",
      mindfulness: "Three days of showing up for yourself. That's not nothing — that's a foundation.",
      learning: "Three days of learning. Your brain is literally building new connections right now.",
      "self-care": "Three days of taking care of yourself. You're proving you're worth the effort.",
    },
    quitMessages: {
      substance: "72 hours clean. The hardest window is closing. Your body is already thanking you.",
      digital: "Three days of freedom from the screen. Notice how much time you actually have?",
    },
    defaultBuild: "Three days in a row. That's not luck — that's a choice you keep making. Keep choosing.",
    defaultQuit: "Three days strong. Every hour gets a little easier. You're doing this.",
  },
  {
    days: 7,
    buildMessages: {
      fitness: "One full week. Your body is adapting. The soreness is turning into strength.",
      mindfulness: "Seven days of practice. You're not just meditating — you're rewiring how you respond to stress.",
      learning: "A week of consistent learning. You know more today than you did seven days ago. That compounds.",
      health: "Seven days of prioritizing your health. That's not a streak — it's becoming who you are.",
    },
    quitMessages: {
      substance: "One week clean. Cravings peak around now, and you're still standing. That takes real strength.",
      digital: "A full week free. Your attention span is already starting to recover. Keep going.",
    },
    defaultBuild: "One week. Seven days of showing up. You've proven this isn't a fluke.",
    defaultQuit: "Seven days clean. The first week is the hardest, and you just finished it.",
  },
  {
    days: 14,
    buildMessages: {
      fitness: "Two weeks. This is where casual interest becomes real commitment. You're committed.",
      mindfulness: "Fourteen days. The practice is starting to feel less like effort and more like breathing.",
    },
    quitMessages: {
      substance: "Two weeks. The acute withdrawal is behind you. What you're building now is genuine freedom.",
      digital: "Fourteen days of digital freedom. Your brain's dopamine receptors are genuinely healing.",
    },
    defaultBuild: "Two weeks straight. Most people quit by day 4. You're not most people.",
    defaultQuit: "Fourteen days free. You've survived the hardest part. The rest is momentum.",
  },
  {
    days: 30,
    buildMessages: {
      fitness: "Thirty days. A full month of moving your body. This isn't a phase anymore — it's your life.",
      mindfulness: "One month of practice. People around you are probably noticing a calmer version of you.",
      learning: "A month of learning. You've put in the kind of quiet work that separates dreamers from doers.",
    },
    quitMessages: {
      substance: "One month clean. Thirty days ago this felt impossible. Look at you now.",
      digital: "Thirty days free. You've reclaimed roughly 60+ hours of your life this month. Think about that.",
    },
    defaultBuild: "One month. Thirty days of choosing this. You've turned a decision into a habit.",
    defaultQuit: "Thirty days. A full month of freedom. What felt like sacrifice is becoming normal.",
  },
  {
    days: 60,
    buildMessages: {},
    quitMessages: {
      substance: "Sixty days. Two months clean. The version of you that started this would be proud of who you are now.",
    },
    defaultBuild: "Sixty days. Two full months. This habit is woven into who you are now.",
    defaultQuit: "Sixty days of freedom. This isn't willpower anymore — this is who you've become.",
  },
  {
    days: 90,
    buildMessages: {},
    quitMessages: {
      substance: "Ninety days. Three months clean. In recovery, they call this a turning point. Believe it.",
    },
    defaultBuild: "Ninety days. Three months. Your garden is blooming because you showed up. Every. Single. Day.",
    defaultQuit: "Three months free. Ninety days of choosing yourself over the craving. That's power.",
  },
  {
    days: 180,
    buildMessages: {},
    quitMessages: {},
    defaultBuild: "Six months. Half a year. You've built something most people only talk about.",
    defaultQuit: "Six months clean. Half a year of freedom. You're living proof that change is possible.",
  },
  {
    days: 365,
    buildMessages: {},
    quitMessages: {},
    defaultBuild: "One year. 365 days. Your garden has been growing for an entire year. That's extraordinary.",
    defaultQuit: "One full year free. 365 days. You did the impossible and made it look like a garden growing.",
  },
];

export function getMilestoneMessage(
  days: number,
  habitType: "build" | "quit",
  category: string
): string | null {
  const template = TEMPLATES.find((t) => t.days === days);
  if (!template) return null;

  if (habitType === "build") {
    return template.buildMessages[category] || template.defaultBuild;
  } else {
    return template.quitMessages[category] || template.defaultQuit;
  }
}
