export interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  stripe_customer_id: string | null;
  subscription_status: "free" | "pro" | "cancelled";
  subscription_id: string | null;
  subscription_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  type: "build" | "quit";
  category: string;
  icon: string;
  plant_type: string;
  habit_group: string | null;
  target_frequency: "daily" | "weekdays" | "custom";
  custom_days: number[];
  is_archived: boolean;
  sort_order: number;
  quit_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  completed: boolean;
  value: number;
  notes: string | null;
  created_at: string;
}

export interface RelapseEvent {
  id: string;
  habit_id: string;
  user_id: string;
  occurred_at: string;
  note: string | null;
  previous_streak: number;
  created_at: string;
}

export interface Milestone {
  id: string;
  habit_id: string;
  user_id: string;
  day_count: number;
  message: string;
  seen: boolean;
  created_at: string;
}

export interface HabitWithStats extends Habit {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  completedToday: boolean;
  plantStage: number;
  logs: HabitLog[];
}

export interface GardenData {
  habits: HabitWithStats[];
  gardenHealth: number;
  gardenName: string;
  totalStreakScore: number;
  hasStorm: boolean;
  groundColor: string;
  ambientType: string;
  lastRelapse: string | null;
  unseenMilestone: Milestone | null;
}
