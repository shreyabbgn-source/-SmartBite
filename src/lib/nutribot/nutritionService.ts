import { UserProfile, CalorieDetails, ActivityLevel, Goal } from '@/types/nutribot';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  [ActivityLevel.SEDENTARY]: 1.2,
  [ActivityLevel.LIGHT]: 1.375,
  [ActivityLevel.MODERATE]: 1.55,
  [ActivityLevel.ACTIVE]: 1.725,
  [ActivityLevel.VERY_ACTIVE]: 1.9
};

const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  [Goal.LOSE]: -500,
  [Goal.MAINTAIN]: 0,
  [Goal.GAIN]: 300
};

export function calculateBMR(profile: UserProfile): number {
  if (profile.gender === 'male') {
    return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  }
  return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
}

export function calculateDetailedRequirements(profile: UserProfile): CalorieDetails {
  const bmr = calculateBMR(profile);
  const multiplier = ACTIVITY_MULTIPLIERS[profile.activityLevel];
  const tdee = Math.round(bmr * multiplier);
  const adjustment = GOAL_ADJUSTMENTS[profile.goal];
  const target = Math.round(tdee + adjustment);

  return { bmr: Math.round(bmr), tdee, target, adjustment, multiplier };
}

export function getMacroTargets(targetCalories: number): { protein: number; carbs: number; fat: number } {
  return {
    protein: Math.round((targetCalories * 0.25) / 4),
    carbs: Math.round((targetCalories * 0.50) / 4),
    fat: Math.round((targetCalories * 0.25) / 9)
  };
}
