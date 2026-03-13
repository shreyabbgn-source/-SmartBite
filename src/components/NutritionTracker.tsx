"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Flame, Apple, Beef, Droplets, TrendingUp, TrendingDown, Minus, Trash2 } from 'lucide-react';
import { LoggedMeal, CalorieDetails } from '@/types/nutribot';
import { getMacroTargets } from '@/lib/nutribot/nutritionService';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface NutritionTrackerProps {
  dailyLog: LoggedMeal[];
  calorieDetails: CalorieDetails;
  onRemoveMeal: (id: string) => void;
}

export function NutritionTracker({ dailyLog, calorieDetails, onRemoveMeal }: NutritionTrackerProps) {
  const macroTargets = getMacroTargets(calorieDetails.target);
  
  const consumed = {
    calories: dailyLog.reduce((sum, m) => sum + m.calories, 0),
    protein: dailyLog.reduce((sum, m) => sum + m.protein, 0),
    carbs: dailyLog.reduce((sum, m) => sum + m.carbs, 0),
    fat: dailyLog.reduce((sum, m) => sum + m.fat, 0)
  };

  const remaining = calorieDetails.target - consumed.calories;
  const calorieProgress = Math.min((consumed.calories / calorieDetails.target) * 100, 100);

  const getProgressColor = (current: number, target: number) => {
    const percent = (current / target) * 100;
    if (percent < 50) return 'bg-emerald-500';
    if (percent < 80) return 'bg-amber-500';
    if (percent <= 100) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl shadow-orange-100/50 rounded-3xl overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Daily Progress</CardTitle>
              <p className="text-xs text-white/80">Target: {calorieDetails.target} cal</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#e2e8f0" strokeWidth="12" fill="none" />
                <circle
                  cx="64" cy="64" r="56"
                  stroke={calorieProgress > 100 ? '#ef4444' : '#f97316'}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(calorieProgress / 100) * 352} 352`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-slate-800">{consumed.calories}</span>
                <span className="text-xs text-slate-500 font-medium">/ {calorieDetails.target} cal</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              {remaining > 0 ? (
                <>
                  <TrendingDown className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-bold text-emerald-600">{remaining} cal remaining</span>
                </>
              ) : remaining === 0 ? (
                <>
                  <Minus className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-bold text-amber-600">Target reached!</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-bold text-red-600">{Math.abs(remaining)} cal over</span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-2xl">
              <Beef className="h-5 w-5 mx-auto text-blue-500 mb-1" />
              <p className="text-xs text-slate-500 font-medium">Protein</p>
              <p className="text-lg font-black text-slate-800">{consumed.protein.toFixed(0)}g</p>
              <p className="text-xs text-slate-400">/ {macroTargets.protein}g</p>
              <Progress 
                value={(consumed.protein / macroTargets.protein) * 100} 
                className="h-1.5 mt-2" 
              />
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-2xl">
              <Apple className="h-5 w-5 mx-auto text-amber-500 mb-1" />
              <p className="text-xs text-slate-500 font-medium">Carbs</p>
              <p className="text-lg font-black text-slate-800">{consumed.carbs.toFixed(0)}g</p>
              <p className="text-xs text-slate-400">/ {macroTargets.carbs}g</p>
              <Progress 
                value={(consumed.carbs / macroTargets.carbs) * 100} 
                className="h-1.5 mt-2" 
              />
            </div>
            <div className="text-center p-3 bg-rose-50 rounded-2xl">
              <Droplets className="h-5 w-5 mx-auto text-rose-500 mb-1" />
              <p className="text-xs text-slate-500 font-medium">Fat</p>
              <p className="text-lg font-black text-slate-800">{consumed.fat.toFixed(0)}g</p>
              <p className="text-xs text-slate-400">/ {macroTargets.fat}g</p>
              <Progress 
                value={(consumed.fat / macroTargets.fat) * 100} 
                className="h-1.5 mt-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl shadow-orange-100/50 rounded-3xl overflow-hidden">
        <CardHeader className="border-b py-4 px-6">
          <CardTitle className="text-lg font-bold text-slate-800">Today's Meals</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {dailyLog.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Apple className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No meals logged yet</p>
              <p className="text-sm">Tell NutriBot what you ate!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              <AnimatePresence>
                {dailyLog.map((meal) => (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{meal.foodName}</span>
                        <Badge variant="secondary" className="text-xs">x{meal.quantity}</Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        {meal.calories} cal • P:{meal.protein}g • C:{meal.carbs}g • F:{meal.fat}g
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-slate-400 hover:text-red-500"
                      onClick={() => onRemoveMeal(meal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
