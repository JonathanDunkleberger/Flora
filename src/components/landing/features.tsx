export function FeaturesSection() {
  const features = [
    {
      icon: "🏡",
      title: "Your Life Garden",
      description: "Each habit is a plant. Your garden reflects your collective progress. Watch it grow from barren to paradise.",
    },
    {
      icon: "✅",
      title: "Build & Quit",
      description: "Start good habits AND break bad ones. Replace the bad with good — your garden shows both.",
    },
    {
      icon: "🌱",
      title: "Plants That Grow",
      description: "From seed to full bloom across 8 stages. Each day you check in, your plant grows. Skip a day, and it shows.",
    },
    {
      icon: "⛈️",
      title: "Honest Relapse Tracking",
      description: "Relapse? Your plant withers one stage and a storm rolls through. Growth isn't linear — tomorrow your garden heals.",
    },
    {
      icon: "🏷️",
      title: "Habit Stacks",
      description: "Group habits into Morning, Evening, Fitness stacks. Check in by group for faster daily reviews.",
    },
    {
      icon: "🎯",
      title: "Meaningful Milestones",
      description: "Hit 3, 7, 30, 90, 365 days — get personalized messages that actually resonate. No generic \"good job!\"",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800">Not just a habit tracker.</h2>
          <p className="text-slate-500 mt-2">A living, breathing reflection of your progress.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="bg-cream-50 rounded-2xl p-6 border border-bloom-100">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-slate-800 mb-1">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
