export enum ActivityLevel {
  SEDENTARY = 'sedentary',
  LIGHT = 'light',
  MODERATE = 'moderate',
  ACTIVE = 'active',
  VERY_ACTIVE = 'very_active'
}

export enum Goal {
  LOSE = 'lose',
  MAINTAIN = 'maintain',
  GAIN = 'gain'
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  foodPreference: 'veg' | 'non-veg' | 'egg';
}

export interface LoggedMeal {
  id: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface CalorieDetails {
  bmr: number;
  tdee: number;
  target: number;
  adjustment: number;
  multiplier: number;
}

export interface CanteenFood {
  name: string;
  category: string;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isVeg: boolean;
}
