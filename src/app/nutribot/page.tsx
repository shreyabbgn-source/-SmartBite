"use client";

import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { NutriBotChat } from '@/components/NutriBotChat';
import { NutritionTracker } from '@/components/NutritionTracker';
import { ProfileForm } from '@/components/ProfileForm';
import { UserProfile, ActivityLevel, Goal, LoggedMeal, CalorieDetails } from '@/types/nutribot';
import { calculateDetailedRequirements } from '@/lib/nutribot/nutritionService';
import { NUTRITION_DATABASE } from '@/lib/nutribot/local-ai';
import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';

export default function NutriBotPage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Student',
    age: 21,
    gender: 'male',
    weight: 72,
    height: 178,
    activityLevel: ActivityLevel.MODERATE,
    goal: Goal.MAINTAIN,
    foodPreference: 'veg'
  });

  const [dailyLog, setDailyLog] = useState<LoggedMeal[]>([]);
  const [calorieDetails, setCalorieDetails] = useState<CalorieDetails>({
    bmr: 0, tdee: 0, target: 0, adjustment: 0, multiplier: 1
  });

  useEffect(() => {
    setCalorieDetails(calculateDetailedRequirements(profile));
  }, [profile]);

  const handleLogMeals = useCallback((extractedMeals: { foodName: string; quantity: number }[]) => {
    const newLoggedItems: LoggedMeal[] = [];
    
    extractedMeals.forEach(item => {
      const food = NUTRITION_DATABASE.find(f => 
        f.name.toLowerCase() === item.foodName.toLowerCase() ||
        item.foodName.toLowerCase().includes(f.name.toLowerCase()) ||
        f.name.toLowerCase().includes(item.foodName.toLowerCase())
      );
      
      if (food) {
        const qty = Number(item.quantity) || 1;
        newLoggedItems.push({
          id: Math.random().toString(36).substr(2, 9) + Date.now() + Math.random(),
          foodName: food.name,
          quantity: qty,
          unit: food.unit,
          calories: Math.round(food.calories * qty),
          protein: Number((food.protein * qty).toFixed(1)),
          carbs: Number((food.carbs * qty).toFixed(1)),
          fat: Number((food.fat * qty).toFixed(1)),
          timestamp: Date.now()
        });
      }
    });
    
    if (newLoggedItems.length > 0) {
      setDailyLog(prev => {
        const existingKeys = new Set(
          prev.map(m => `${m.foodName.toLowerCase()}-${m.quantity}-${Math.floor(m.timestamp / 5000)}`)
        );
        const filteredNew = newLoggedItems.filter(
          m => !existingKeys.has(`${m.foodName.toLowerCase()}-${m.quantity}-${Math.floor(m.timestamp / 5000)}`)
        );
        return filteredNew.length > 0 ? [...prev, ...filteredNew] : prev;
      });
    }
  }, []);

  const handleRemoveMeal = (id: string) => {
    setDailyLog(prev => prev.filter(meal => meal.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-[#FFFDF5] via-[#FFF5E6] to-[#FFFDF5]">
        <section className="container py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-bold mb-4">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Nutrition Assistant</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Campus{" "}
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-rose-600 bg-clip-text text-transparent">
                NutriBot
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Your personal AI nutritionist to track meals, get recommendations, and achieve your health goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <NutriBotChat 
                profile={profile}
                dailyLog={dailyLog}
                onLogMeals={handleLogMeals}
                calorieDetails={calorieDetails}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <NutritionTracker 
                dailyLog={dailyLog}
                calorieDetails={calorieDetails}
                onRemoveMeal={handleRemoveMeal}
              />
              <ProfileForm profile={profile} onUpdate={setProfile} />
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
