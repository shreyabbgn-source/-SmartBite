import { NextRequest, NextResponse } from 'next/server';
import { NUTRITION_DATABASE, processNutriBotMessage } from '@/lib/nutribot/local-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGeminiAPI(prompt: string): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;

  const models = ['gemini-2.0-flash', 'gemini-2.0-flash-lite'];
  
  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) await new Promise(r => setTimeout(r, 2000));
        
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
        }
        
        if (response.status !== 429) break; // only retry on rate limit
      } catch {
        break;
      }
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { message, profile, dailyLog, targetCalories } = await request.json();

    if (!message || !profile) {
      return NextResponse.json(
        { error: 'Message and profile are required' },
        { status: 400 }
      );
    }

    const consumedCalories = (dailyLog || []).reduce((sum: number, m: { calories: number }) => sum + m.calories, 0);
    const remainingCalories = (targetCalories || 2000) - consumedCalories;
    const consumedProtein = (dailyLog || []).reduce((sum: number, m: { protein: number }) => sum + m.protein, 0);

    const menuItems = NUTRITION_DATABASE.map(item => 
      `${item.name} (${item.category}): ${item.calories} cal, ${item.protein}g protein, ${item.carbs}g carbs, ${item.fat}g fat, ${item.isVeg ? 'Veg' : 'Non-Veg'}`
    ).join('\n');

    const loggedMeals = (dailyLog || []).map((m: { foodName: string; quantity: number; calories: number }) => 
      `${m.quantity}x ${m.foodName} (${m.calories} cal)`
    ).join(', ') || 'None';

    const systemPrompt = `You are Campus NutriBot, a certified AI dietician and nutrition expert for a college canteen. You provide professional, science-backed dietary advice tailored to the user's health goals.

USER PROFILE:
- Name: ${profile.name}
- Age: ${profile.age}, Gender: ${profile.gender}
- Weight: ${profile.weight}kg, Height: ${profile.height}cm
- BMI: ${(profile.weight / ((profile.height/100) ** 2)).toFixed(1)}
- Activity Level: ${profile.activityLevel}
- Goal: ${profile.goal} (lose/maintain/gain weight)
- Food Preference: ${profile.foodPreference}

TODAY'S STATS:
- Target Calories: ${targetCalories || 2000}
- Consumed: ${consumedCalories} cal, ${consumedProtein}g protein
- Remaining: ${remainingCalories} cal
- Meals logged: ${loggedMeals}

CANTEEN MENU (use ONLY these items with EXACT calories):
${menuItems}

DIETICIAN GUIDELINES:
1. **Meal Planning**: When asked for meal plans within a calorie budget, create balanced combinations from the menu. Always show exact calories for each item and total.
2. **Macronutrient Balance**: Recommend 25-30% protein, 45-55% carbs, 20-30% fat for balanced meals.
3. **Goal-Based Advice**:
   - Weight Loss: Prioritize protein-rich, low-calorie items. Create deficit-friendly meals.
   - Muscle Gain: High protein options with adequate calories.
   - Maintenance: Balanced variety within target.
4. **Personalized Tips**: Consider their BMI, activity level, and food preference.
5. **Portion Control**: Guide on appropriate quantities.
6. **Timing**: Suggest meal timing for optimal metabolism.

RESPONSE RULES:
1. If user mentions eating/having food, identify EXACT menu items: {"meals": [{"foodName": "exact menu name", "quantity": number}], "message": "response"}
2. For meal plan requests (e.g., "meal under 500 calories"), suggest SPECIFIC menu items that fit the budget with exact calorie breakdown.
3. Always use EXACT item names and calories from the menu above.
4. Be warm, encouraging, and professional like a real dietician.
5. Include actionable advice and explain WHY you're recommending something.

MEAL PLAN FORMAT (when asked):
For a meal plan, structure your response like:
"Here's a balanced meal within [X] calories:
- [Item 1] - [X] cal, [X]g protein
- [Item 2] - [X] cal, [X]g protein
**Total: [X] calories, [X]g protein**
[Brief explanation of why this combination is good for their goal]"

Respond in JSON format: {"meals": [...] or [], "message": "your response"}`;

    const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;
    
    const aiResponse = await callGeminiAPI(fullPrompt);
    
    if (!aiResponse) {
      const fallback = processNutriBotMessage(message, profile, dailyLog || [], targetCalories || 2000);
      return NextResponse.json({
        responseText: fallback.responseText,
        extractedMeals: fallback.extractedMeals
      });
    }
    
    let responseText = '';
    let extractedMeals: { foodName: string; quantity: number }[] = [];

    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        responseText = parsed.message || aiResponse;
        extractedMeals = parsed.meals || [];
        
        extractedMeals = extractedMeals.filter(meal => {
          const found = NUTRITION_DATABASE.find(item => 
            item.name.toLowerCase() === meal.foodName.toLowerCase()
          );
          return found !== undefined;
        });
      } else {
        responseText = aiResponse;
      }
    } catch {
      responseText = aiResponse.replace(/```json|```/g, '').trim();
    }

    return NextResponse.json({
      responseText,
      extractedMeals
    });
  } catch (error) {
    console.error('NutriBot error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
