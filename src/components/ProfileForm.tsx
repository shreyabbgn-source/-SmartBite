"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Activity, Target, Utensils } from 'lucide-react';
import { UserProfile, ActivityLevel, Goal } from '@/types/nutribot';
import { ACTIVITY_LEVEL_LABELS, GOAL_LABELS } from '@/lib/nutribot/constants';

interface ProfileFormProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

export function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const handleChange = (field: keyof UserProfile, value: string | number) => {
    onUpdate({ ...profile, [field]: value });
  };

  return (
    <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl shadow-orange-100/50 rounded-3xl overflow-hidden">
      <CardHeader className="border-b bg-gradient-to-r from-violet-500 to-purple-500 text-white py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <User className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Your Profile</CardTitle>
            <p className="text-xs text-white/80">Personalize your nutrition goals</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Age</Label>
            <Input
              type="number"
              value={profile.age}
              onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
              className="rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Gender</Label>
            <Select value={profile.gender} onValueChange={(v) => handleChange('gender', v)}>
              <SelectTrigger className="rounded-xl h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Weight (kg)</Label>
            <Input
              type="number"
              value={profile.weight}
              onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
              className="rounded-xl h-11"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Height (cm)</Label>
            <Input
              type="number"
              value={profile.height}
              onChange={(e) => handleChange('height', parseInt(e.target.value) || 0)}
              className="rounded-xl h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
            <Activity className="h-3.5 w-3.5" /> Activity Level
          </Label>
          <Select value={profile.activityLevel} onValueChange={(v) => handleChange('activityLevel', v as ActivityLevel)}>
            <SelectTrigger className="rounded-xl h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ACTIVITY_LEVEL_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
            <Target className="h-3.5 w-3.5" /> Goal
          </Label>
          <Select value={profile.goal} onValueChange={(v) => handleChange('goal', v as Goal)}>
            <SelectTrigger className="rounded-xl h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(GOAL_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
            <Utensils className="h-3.5 w-3.5" /> Food Preference
          </Label>
          <Select value={profile.foodPreference} onValueChange={(v) => handleChange('foodPreference', v as 'veg' | 'non-veg' | 'egg')}>
            <SelectTrigger className="rounded-xl h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="veg">Vegetarian</SelectItem>
              <SelectItem value="egg">Eggetarian</SelectItem>
              <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
