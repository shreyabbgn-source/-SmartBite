import { UserProfile, LoggedMeal, CanteenFood } from '@/types/nutribot';

export const NUTRITION_DATABASE: CanteenFood[] = [
  { name: "Tea", category: "Hot Beverages", unit: "cup", calories: 40, protein: 2, carbs: 6, fat: 1, isVeg: true },
  { name: "Special Tea", category: "Hot Beverages", unit: "cup", calories: 40, protein: 2, carbs: 6, fat: 1, isVeg: true },
  { name: "Black Tea", category: "Hot Beverages", unit: "cup", calories: 40, protein: 2, carbs: 6, fat: 1, isVeg: true },
  { name: "Lemon Tea", category: "Hot Beverages", unit: "cup", calories: 40, protein: 2, carbs: 6, fat: 1, isVeg: true },
  { name: "Green Tea", category: "Hot Beverages", unit: "cup", calories: 40, protein: 2, carbs: 6, fat: 1, isVeg: true },
  { name: "Filter Coffee", category: "Hot Beverages", unit: "cup", calories: 40, protein: 2, carbs: 6, fat: 1, isVeg: true },
  { name: "NES Coffee", category: "Hot Beverages", unit: "cup", calories: 40, protein: 2, carbs: 6, fat: 1, isVeg: true },
  { name: "Hot Milk", category: "Hot Beverages", unit: "cup", calories: 40, protein: 2, carbs: 6, fat: 1, isVeg: true },
  { name: "Frooti", category: "Cold Beverages", unit: "pack", calories: 120, protein: 3, carbs: 22, fat: 2, isVeg: true },
  { name: "Appy", category: "Cold Beverages", unit: "pack", calories: 120, protein: 3, carbs: 22, fat: 2, isVeg: true },
  { name: "Cold Drinks", category: "Cold Beverages", unit: "glass", calories: 120, protein: 3, carbs: 22, fat: 2, isVeg: true },
  { name: "Cold Coffee", category: "Cold Beverages", unit: "glass", calories: 120, protein: 3, carbs: 22, fat: 2, isVeg: true },
  { name: "Sweet Lassi", category: "Cold Beverages", unit: "glass", calories: 120, protein: 3, carbs: 22, fat: 2, isVeg: true },
  { name: "Mango Lassi", category: "Cold Beverages", unit: "glass", calories: 120, protein: 3, carbs: 22, fat: 2, isVeg: true },
  { name: "Butter Milk", category: "Cold Beverages", unit: "glass", calories: 120, protein: 3, carbs: 22, fat: 2, isVeg: true },
  { name: "Lime Juice", category: "Cold Beverages", unit: "glass", calories: 120, protein: 3, carbs: 22, fat: 2, isVeg: true },
  { name: "Idli Sambar", category: "South Indian Snacks", unit: "plate", calories: 250, protein: 8, carbs: 40, fat: 8, isVeg: true },
  { name: "Masala Idli", category: "South Indian Snacks", unit: "plate", calories: 250, protein: 8, carbs: 40, fat: 8, isVeg: true },
  { name: "Fry Idli", category: "South Indian Snacks", unit: "plate", calories: 250, protein: 8, carbs: 40, fat: 8, isVeg: true },
  { name: "Medu Wada", category: "South Indian Snacks", unit: "plate", calories: 250, protein: 8, carbs: 40, fat: 8, isVeg: true },
  { name: "Dahi Wada", category: "South Indian Snacks", unit: "plate", calories: 250, protein: 8, carbs: 40, fat: 8, isVeg: true },
  { name: "Sabudana Wada", category: "South Indian Snacks", unit: "plate", calories: 250, protein: 8, carbs: 40, fat: 8, isVeg: true },
  { name: "Sabudana Khichdi", category: "South Indian Snacks", unit: "plate", calories: 250, protein: 8, carbs: 40, fat: 8, isVeg: true },
  { name: "Aloo Wada Samber", category: "South Indian Snacks", unit: "plate", calories: 250, protein: 8, carbs: 40, fat: 8, isVeg: true },
  { name: "Upma", category: "Maharashtrian Snacks", unit: "plate", calories: 280, protein: 7, carbs: 35, fat: 12, isVeg: true },
  { name: "Poha", category: "Maharashtrian Snacks", unit: "plate", calories: 280, protein: 7, carbs: 35, fat: 12, isVeg: true },
  { name: "Vada Pav", category: "Maharashtrian Snacks", unit: "piece", calories: 280, protein: 7, carbs: 35, fat: 12, isVeg: true },
  { name: "Misal Pav", category: "Maharashtrian Snacks", unit: "plate", calories: 280, protein: 7, carbs: 35, fat: 12, isVeg: true },
  { name: "Samosa", category: "Maharashtrian Snacks", unit: "piece", calories: 280, protein: 7, carbs: 35, fat: 12, isVeg: true },
  { name: "Samosa Chaat", category: "Maharashtrian Snacks", unit: "plate", calories: 280, protein: 7, carbs: 35, fat: 12, isVeg: true },
  { name: "Bread Pakoda", category: "Maharashtrian Snacks", unit: "piece", calories: 280, protein: 7, carbs: 35, fat: 12, isVeg: true },
  { name: "Kanda Bhajiya", category: "Maharashtrian Snacks", unit: "plate", calories: 280, protein: 7, carbs: 35, fat: 12, isVeg: true },
  { name: "Mix Pakoda", category: "Maharashtrian Snacks", unit: "plate", calories: 280, protein: 7, carbs: 35, fat: 12, isVeg: true },
  { name: "Aloo Pakoda", category: "Maharashtrian Snacks", unit: "plate", calories: 280, protein: 7, carbs: 35, fat: 12, isVeg: true },
  { name: "Cheese Pakoda", category: "Maharashtrian Snacks", unit: "plate", calories: 280, protein: 7, carbs: 35, fat: 12, isVeg: true },
  { name: "Paneer Pakoda", category: "Maharashtrian Snacks", unit: "plate", calories: 280, protein: 7, carbs: 35, fat: 12, isVeg: true },
  { name: "Aloo Paratha", category: "Paratha", unit: "piece", calories: 380, protein: 10, carbs: 45, fat: 18, isVeg: true },
  { name: "Mix Paratha", category: "Paratha", unit: "piece", calories: 380, protein: 10, carbs: 45, fat: 18, isVeg: true },
  { name: "Paneer Paratha", category: "Paratha", unit: "piece", calories: 380, protein: 10, carbs: 45, fat: 18, isVeg: true },
  { name: "Cheese Paratha", category: "Paratha", unit: "piece", calories: 380, protein: 10, carbs: 45, fat: 18, isVeg: true },
  { name: "Chapati", category: "Paratha", unit: "piece", calories: 380, protein: 10, carbs: 45, fat: 18, isVeg: true },
  { name: "Chole Bhature", category: "Special Snacks", unit: "plate", calories: 450, protein: 12, carbs: 55, fat: 20, isVeg: true },
  { name: "Pav Bhaji", category: "Special Snacks", unit: "plate", calories: 450, protein: 12, carbs: 55, fat: 20, isVeg: true },
  { name: "Veg Puff", category: "Special Snacks", unit: "piece", calories: 450, protein: 12, carbs: 55, fat: 20, isVeg: true },
  { name: "Boiled Egg", category: "Egg Dishes", unit: "piece", calories: 220, protein: 14, carbs: 3, fat: 16, isVeg: false },
  { name: "Egg Bhurji", category: "Egg Dishes", unit: "plate", calories: 220, protein: 14, carbs: 3, fat: 16, isVeg: false },
  { name: "Half Fry", category: "Egg Dishes", unit: "piece", calories: 220, protein: 14, carbs: 3, fat: 16, isVeg: false },
  { name: "Full Fry", category: "Egg Dishes", unit: "piece", calories: 220, protein: 14, carbs: 3, fat: 16, isVeg: false },
  { name: "Paneer Bhurji", category: "Paneer Dishes", unit: "plate", calories: 450, protein: 18, carbs: 25, fat: 28, isVeg: true },
  { name: "Mushroom Bhurji", category: "Paneer Dishes", unit: "plate", calories: 450, protein: 18, carbs: 25, fat: 28, isVeg: true },
  { name: "Plain Maggie", category: "Maggie", unit: "plate", calories: 350, protein: 10, carbs: 40, fat: 15, isVeg: true },
  { name: "Masala Maggie", category: "Maggie", unit: "plate", calories: 350, protein: 10, carbs: 40, fat: 15, isVeg: true },
  { name: "Cheese Maggie", category: "Maggie", unit: "plate", calories: 350, protein: 10, carbs: 40, fat: 15, isVeg: true },
  { name: "Paneer Maggie", category: "Maggie", unit: "plate", calories: 350, protein: 10, carbs: 40, fat: 15, isVeg: true },
  { name: "Chicken Maggie", category: "Maggie", unit: "plate", calories: 350, protein: 10, carbs: 40, fat: 15, isVeg: false },
  { name: "Plain Toast", category: "Sandwiches/Toast", unit: "piece", calories: 300, protein: 8, carbs: 35, fat: 14, isVeg: true },
  { name: "Butter Toast", category: "Sandwiches/Toast", unit: "piece", calories: 300, protein: 8, carbs: 35, fat: 14, isVeg: true },
  { name: "Jam Toast", category: "Sandwiches/Toast", unit: "piece", calories: 300, protein: 8, carbs: 35, fat: 14, isVeg: true },
  { name: "Veg Sandwich", category: "Sandwiches/Toast", unit: "piece", calories: 300, protein: 8, carbs: 35, fat: 14, isVeg: true },
  { name: "Cheese Sandwich", category: "Sandwiches/Toast", unit: "piece", calories: 300, protein: 8, carbs: 35, fat: 14, isVeg: true },
  { name: "Grilled Sandwich", category: "Sandwiches/Toast", unit: "piece", calories: 300, protein: 8, carbs: 35, fat: 14, isVeg: true },
  { name: "Paneer Roll", category: "Rolls", unit: "piece", calories: 380, protein: 14, carbs: 40, fat: 18, isVeg: true },
  { name: "Veg Roll", category: "Rolls", unit: "piece", calories: 380, protein: 14, carbs: 40, fat: 18, isVeg: true },
  { name: "Cheese Roll", category: "Rolls", unit: "piece", calories: 380, protein: 14, carbs: 40, fat: 18, isVeg: true },
  { name: "Egg Roll", category: "Rolls", unit: "piece", calories: 380, protein: 14, carbs: 40, fat: 18, isVeg: false },
  { name: "Chicken Roll", category: "Rolls", unit: "piece", calories: 380, protein: 14, carbs: 40, fat: 18, isVeg: false },
  { name: "Veg Manchurian Dry", category: "Chinese Starter", unit: "plate", calories: 320, protein: 8, carbs: 38, fat: 15, isVeg: true },
  { name: "Veg Manchurian Gravy", category: "Chinese Starter", unit: "plate", calories: 320, protein: 8, carbs: 38, fat: 15, isVeg: true },
  { name: "Paneer Chilli", category: "Chinese Starter", unit: "plate", calories: 320, protein: 8, carbs: 38, fat: 15, isVeg: true },
  { name: "Gobi Manchurian", category: "Chinese Starter", unit: "plate", calories: 320, protein: 8, carbs: 38, fat: 15, isVeg: true },
  { name: "Spring Roll", category: "Chinese Starter", unit: "piece", calories: 320, protein: 8, carbs: 38, fat: 15, isVeg: true },
  { name: "Crispy Corn", category: "Chinese Starter", unit: "plate", calories: 320, protein: 8, carbs: 38, fat: 15, isVeg: true },
  { name: "Veg Fried Rice", category: "Chinese Noodles/Rice", unit: "plate", calories: 400, protein: 10, carbs: 55, fat: 16, isVeg: true },
  { name: "Schezwan Rice", category: "Chinese Noodles/Rice", unit: "plate", calories: 400, protein: 10, carbs: 55, fat: 16, isVeg: true },
  { name: "Veg Noodles", category: "Chinese Noodles/Rice", unit: "plate", calories: 400, protein: 10, carbs: 55, fat: 16, isVeg: true },
  { name: "Schezwan Noodles", category: "Chinese Noodles/Rice", unit: "plate", calories: 400, protein: 10, carbs: 55, fat: 16, isVeg: true },
  { name: "Hakka Noodles", category: "Chinese Noodles/Rice", unit: "plate", calories: 400, protein: 10, carbs: 55, fat: 16, isVeg: true },
  { name: "Chicken Fried Rice", category: "Chinese Noodles/Rice", unit: "plate", calories: 450, protein: 18, carbs: 55, fat: 18, isVeg: false },
  { name: "Chicken Noodles", category: "Chinese Noodles/Rice", unit: "plate", calories: 450, protein: 18, carbs: 55, fat: 18, isVeg: false },
  { name: "Veg Soup", category: "Soups", unit: "bowl", calories: 120, protein: 4, carbs: 15, fat: 5, isVeg: true },
  { name: "Tomato Soup", category: "Soups", unit: "bowl", calories: 120, protein: 4, carbs: 15, fat: 5, isVeg: true },
  { name: "Sweet Corn Soup", category: "Soups", unit: "bowl", calories: 120, protein: 4, carbs: 15, fat: 5, isVeg: true },
  { name: "Hot and Sour Soup", category: "Soups", unit: "bowl", calories: 120, protein: 4, carbs: 15, fat: 5, isVeg: true },
  { name: "Manchow Soup", category: "Soups", unit: "bowl", calories: 120, protein: 4, carbs: 15, fat: 5, isVeg: true },
  { name: "Chicken Soup", category: "Soups", unit: "bowl", calories: 150, protein: 12, carbs: 10, fat: 6, isVeg: false },
  { name: "Dal Fry", category: "Punjabi Dishes", unit: "plate", calories: 350, protein: 14, carbs: 45, fat: 12, isVeg: true },
  { name: "Dal Tadka", category: "Punjabi Dishes", unit: "plate", calories: 350, protein: 14, carbs: 45, fat: 12, isVeg: true },
  { name: "Rajma", category: "Punjabi Dishes", unit: "plate", calories: 350, protein: 14, carbs: 45, fat: 12, isVeg: true },
  { name: "Chole", category: "Punjabi Dishes", unit: "plate", calories: 350, protein: 14, carbs: 45, fat: 12, isVeg: true },
  { name: "Mix Veg", category: "Punjabi Dishes", unit: "plate", calories: 350, protein: 14, carbs: 45, fat: 12, isVeg: true },
  { name: "Aloo Gobi", category: "Punjabi Dishes", unit: "plate", calories: 350, protein: 14, carbs: 45, fat: 12, isVeg: true },
  { name: "Paneer Butter Masala", category: "Paneer Dishes", unit: "plate", calories: 450, protein: 18, carbs: 25, fat: 28, isVeg: true },
  { name: "Shahi Paneer", category: "Paneer Dishes", unit: "plate", calories: 450, protein: 18, carbs: 25, fat: 28, isVeg: true },
  { name: "Kadai Paneer", category: "Paneer Dishes", unit: "plate", calories: 450, protein: 18, carbs: 25, fat: 28, isVeg: true },
  { name: "Palak Paneer", category: "Paneer Dishes", unit: "plate", calories: 450, protein: 18, carbs: 25, fat: 28, isVeg: true },
  { name: "Matar Paneer", category: "Paneer Dishes", unit: "plate", calories: 450, protein: 18, carbs: 25, fat: 28, isVeg: true },
  { name: "Butter Chicken", category: "Non-Veg Indian Dishes", unit: "plate", calories: 500, protein: 28, carbs: 20, fat: 32, isVeg: false },
  { name: "Chicken Curry", category: "Non-Veg Indian Dishes", unit: "plate", calories: 500, protein: 28, carbs: 20, fat: 32, isVeg: false },
  { name: "Kadai Chicken", category: "Non-Veg Indian Dishes", unit: "plate", calories: 500, protein: 28, carbs: 20, fat: 32, isVeg: false },
  { name: "Chicken Masala", category: "Non-Veg Indian Dishes", unit: "plate", calories: 500, protein: 28, carbs: 20, fat: 32, isVeg: false },
  { name: "Egg Curry", category: "Non-Veg Indian Dishes", unit: "plate", calories: 350, protein: 18, carbs: 15, fat: 22, isVeg: false },
  { name: "Plain Rice", category: "Rice", unit: "plate", calories: 250, protein: 5, carbs: 50, fat: 2, isVeg: true },
  { name: "Jeera Rice", category: "Rice", unit: "plate", calories: 280, protein: 5, carbs: 52, fat: 5, isVeg: true },
  { name: "Dal Rice", category: "Rice", unit: "plate", calories: 380, protein: 12, carbs: 60, fat: 8, isVeg: true },
  { name: "Curd Rice", category: "Rice", unit: "plate", calories: 300, protein: 8, carbs: 48, fat: 8, isVeg: true },
  { name: "Veg Biryani", category: "Biryani", unit: "plate", calories: 450, protein: 12, carbs: 65, fat: 16, isVeg: true },
  { name: "Paneer Biryani", category: "Biryani", unit: "plate", calories: 500, protein: 18, carbs: 60, fat: 20, isVeg: true },
  { name: "Chicken Biryani", category: "Biryani", unit: "plate", calories: 550, protein: 28, carbs: 60, fat: 22, isVeg: false },
  { name: "Egg Biryani", category: "Biryani", unit: "plate", calories: 480, protein: 18, carbs: 58, fat: 18, isVeg: false },
  { name: "Mutton Biryani", category: "Biryani", unit: "plate", calories: 600, protein: 32, carbs: 58, fat: 28, isVeg: false },
  { name: "Bhel Puri", category: "Bhel/Chaat", unit: "plate", calories: 220, protein: 5, carbs: 38, fat: 6, isVeg: true },
  { name: "Sev Puri", category: "Bhel/Chaat", unit: "plate", calories: 250, protein: 6, carbs: 40, fat: 8, isVeg: true },
  { name: "Dahi Puri", category: "Bhel/Chaat", unit: "plate", calories: 280, protein: 7, carbs: 42, fat: 10, isVeg: true },
  { name: "Pani Puri", category: "Bhel/Chaat", unit: "plate", calories: 200, protein: 4, carbs: 35, fat: 5, isVeg: true },
  { name: "Ragda Pattice", category: "Bhel/Chaat", unit: "plate", calories: 350, protein: 10, carbs: 50, fat: 12, isVeg: true },
  { name: "Gulab Jamun", category: "Sweet", unit: "piece", calories: 150, protein: 2, carbs: 28, fat: 5, isVeg: true },
  { name: "Rasgulla", category: "Sweet", unit: "piece", calories: 120, protein: 2, carbs: 25, fat: 3, isVeg: true },
  { name: "Jalebi", category: "Sweet", unit: "piece", calories: 150, protein: 2, carbs: 30, fat: 5, isVeg: true },
  { name: "Kheer", category: "Sweet", unit: "bowl", calories: 200, protein: 5, carbs: 35, fat: 6, isVeg: true },
  { name: "Ice Cream", category: "Sweet", unit: "scoop", calories: 150, protein: 3, carbs: 20, fat: 7, isVeg: true },
  { name: "Veg Thali", category: "Thali", unit: "plate", calories: 750, protein: 22, carbs: 100, fat: 28, isVeg: true },
  { name: "Non-Veg Thali", category: "Thali", unit: "plate", calories: 850, protein: 35, carbs: 95, fat: 35, isVeg: false },
  { name: "Special Thali", category: "Thali", unit: "plate", calories: 900, protein: 28, carbs: 110, fat: 32, isVeg: true },
];

function findFoodItem(query: string): CanteenFood | null {
  const normalizedQuery = query.toLowerCase().trim();
  
  let exactMatch = NUTRITION_DATABASE.find(
    item => item.name.toLowerCase() === normalizedQuery
  );
  if (exactMatch) return exactMatch;
  
  const commonAliases: Record<string, string[]> = {
    'idli': ['idli sambar', 'masala idli', 'fry idli'],
    'dosa': ['masala dosa', 'plain dosa', 'rava dosa'],
    'biryani': ['veg biryani', 'chicken biryani', 'egg biryani', 'paneer biryani', 'mutton biryani'],
    'paratha': ['aloo paratha', 'paneer paratha', 'mix paratha', 'cheese paratha'],
    'maggi': ['plain maggie', 'masala maggie', 'cheese maggie', 'paneer maggie', 'chicken maggie'],
    'noodles': ['veg noodles', 'hakka noodles', 'schezwan noodles', 'chicken noodles'],
    'rice': ['plain rice', 'jeera rice', 'veg fried rice', 'schezwan rice'],
    'soup': ['veg soup', 'tomato soup', 'sweet corn soup', 'hot and sour soup', 'manchow soup', 'chicken soup'],
    'sandwich': ['veg sandwich', 'cheese sandwich', 'grilled sandwich'],
    'roll': ['paneer roll', 'veg roll', 'cheese roll', 'egg roll', 'chicken roll'],
    'lassi': ['sweet lassi', 'mango lassi'],
    'tea': ['tea', 'special tea', 'black tea', 'lemon tea', 'green tea'],
    'coffee': ['filter coffee', 'nes coffee', 'cold coffee'],
    'wada': ['medu wada', 'dahi wada', 'sabudana wada', 'aloo wada samber'],
    'pakoda': ['bread pakoda', 'kanda bhajiya', 'mix pakoda', 'aloo pakoda', 'cheese pakoda', 'paneer pakoda'],
    'paneer': ['paneer butter masala', 'shahi paneer', 'kadai paneer', 'palak paneer', 'matar paneer', 'paneer chilli', 'paneer bhurji'],
    'chicken': ['butter chicken', 'chicken curry', 'kadai chicken', 'chicken masala'],
    'dal': ['dal fry', 'dal tadka'],
    'thali': ['veg thali', 'non-veg thali', 'special thali'],
  };
  
  for (const [alias, menuNames] of Object.entries(commonAliases)) {
    if (normalizedQuery.includes(alias)) {
      const found = NUTRITION_DATABASE.find(item => 
        menuNames.some(name => item.name.toLowerCase() === name)
      );
      if (found) return found;
    }
  }
  
  let partialMatch = NUTRITION_DATABASE.find(
    item => item.name.toLowerCase().includes(normalizedQuery) || 
            normalizedQuery.includes(item.name.toLowerCase())
  );
  if (partialMatch) return partialMatch;
  
  const words = normalizedQuery.split(/\s+/);
  for (const word of words) {
    if (word.length > 3) {
      const match = NUTRITION_DATABASE.find(
        item => item.name.toLowerCase().includes(word)
      );
      if (match) return match;
    }
  }
  
  return null;
}

function extractFoodsFromMessage(message: string): { foodName: string; quantity: number }[] {
  const meals: { foodName: string; quantity: number }[] = [];
  const lowerMessage = message.toLowerCase();
  
  for (const item of NUTRITION_DATABASE) {
    const itemLower = item.name.toLowerCase();
    if (lowerMessage.includes(itemLower)) {
      const quantityMatch = lowerMessage.match(new RegExp(`(\\d+)\\s*(?:plate|piece|cup|bowl|glass)?\\s*(?:of\\s+)?${itemLower.replace(/\s+/g, '\\s*')}`, 'i'));
      const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
      meals.push({ foodName: item.name, quantity });
    }
  }
  
  if (meals.length === 0) {
    const commonAliases: Record<string, string> = {
      'idli': 'Idli Sambar',
      'dosa': 'Masala Dosa',
      'biryani': 'Veg Biryani',
      'paratha': 'Aloo Paratha',
      'maggi': 'Plain Maggie',
      'noodles': 'Veg Noodles',
      'rice': 'Plain Rice',
      'soup': 'Veg Soup',
      'sandwich': 'Veg Sandwich',
      'roll': 'Veg Roll',
      'lassi': 'Sweet Lassi',
      'tea': 'Tea',
      'coffee': 'Filter Coffee',
      'wada': 'Medu Wada',
      'vada': 'Medu Wada',
      'pakoda': 'Mix Pakoda',
      'samosa': 'Samosa',
      'poha': 'Poha',
      'upma': 'Upma',
      'pav bhaji': 'Pav Bhaji',
      'chole bhature': 'Chole Bhature',
      'thali': 'Veg Thali',
      'dal': 'Dal Fry',
      'rajma': 'Rajma',
      'chole': 'Chole',
      'manchurian': 'Veg Manchurian Dry',
      'paneer': 'Paneer Butter Masala',
      'egg': 'Boiled Egg',
      'bhel': 'Bhel Puri',
      'puri': 'Pani Puri',
    };
    
    for (const [alias, menuName] of Object.entries(commonAliases)) {
      if (lowerMessage.includes(alias)) {
        const quantityMatch = lowerMessage.match(new RegExp(`(\\d+)\\s*(?:plate|piece|cup|bowl|glass)?\\s*(?:of\\s+)?${alias}`, 'i')) ||
                             lowerMessage.match(new RegExp(`(\\d+)\\s*${alias}`, 'i'));
        const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
        meals.push({ foodName: menuName, quantity });
        break;
      }
    }
  }
  
  return meals;
}

function getRecommendations(
  profile: UserProfile, 
  remainingCalories: number,
  dailyLog: LoggedMeal[]
): CanteenFood[] {
  let items = [...NUTRITION_DATABASE];
  
  if (profile.foodPreference === 'veg') {
    items = items.filter(item => item.isVeg);
  } else if (profile.foodPreference === 'non-veg') {
    items = items.filter(item => !item.isVeg);
  }
  
  items = items.filter(item => item.calories <= remainingCalories);
  
  if (profile.goal === 'lose') {
    items.sort((a, b) => (a.calories / Math.max(a.protein, 1)) - (b.calories / Math.max(b.protein, 1)));
  } else if (profile.goal === 'gain') {
    items.sort((a, b) => b.calories - a.calories);
  } else {
    items.sort((a, b) => b.protein - a.protein);
  }
  
  const loggedNames = dailyLog.map(m => m.foodName.toLowerCase());
  items = items.filter(item => !loggedNames.includes(item.name.toLowerCase()));
  
  return items.slice(0, 5);
}

function generateGreeting(profile: UserProfile): string {
  const hour = new Date().getHours();
  let timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return `${timeGreeting}, ${profile.name}! I'm your Campus NutriBot - your personal AI dietician. How can I help you with your nutrition today?`;
}

function createMealPlan(budget: number, profile: UserProfile): string {
  const isVegOnly = profile.foodPreference === 'veg';
  const items = NUTRITION_DATABASE
    .filter(item => (isVegOnly ? item.isVeg : true) && item.calories <= budget && item.calories >= 50)
    .sort((a, b) => b.protein - a.protein);
  
  if (items.length === 0) {
    return `I couldn't find suitable items under ${budget} calories. Try a higher budget or check our beverages section.`;
  }
  
  const mealCombos: { items: CanteenFood[]; totalCal: number; totalProtein: number }[] = [];
  
  for (let i = 0; i < items.length; i++) {
    const item1 = items[i];
    if (item1.calories <= budget) {
      mealCombos.push({ items: [item1], totalCal: item1.calories, totalProtein: item1.protein });
      
      for (let j = i + 1; j < items.length; j++) {
        const item2 = items[j];
        if (item1.calories + item2.calories <= budget) {
          mealCombos.push({
            items: [item1, item2],
            totalCal: item1.calories + item2.calories,
            totalProtein: item1.protein + item2.protein
          });
          
          for (let k = j + 1; k < Math.min(items.length, j + 10); k++) {
            const item3 = items[k];
            if (item1.calories + item2.calories + item3.calories <= budget) {
              mealCombos.push({
                items: [item1, item2, item3],
                totalCal: item1.calories + item2.calories + item3.calories,
                totalProtein: item1.protein + item2.protein + item3.protein
              });
            }
          }
        }
      }
    }
    if (mealCombos.length > 50) break;
  }
  
  let bestCombo = mealCombos[0];
  if (profile.goal === 'lose') {
    bestCombo = mealCombos.sort((a, b) => {
      const scoreA = a.totalProtein / Math.max(a.totalCal, 1);
      const scoreB = b.totalProtein / Math.max(b.totalCal, 1);
      return scoreB - scoreA;
    })[0];
  } else if (profile.goal === 'gain') {
    bestCombo = mealCombos.sort((a, b) => b.totalCal - a.totalCal)[0];
  } else {
    bestCombo = mealCombos.sort((a, b) => {
      const closenessA = Math.abs(budget * 0.9 - a.totalCal);
      const closenessB = Math.abs(budget * 0.9 - b.totalCal);
      return closenessA - closenessB;
    })[0];
  }
  
  if (!bestCombo) {
    return `Couldn't create a meal plan under ${budget} calories. Please try a different budget.`;
  }
  
  let response = `**Meal Plan Under ${budget} Calories** (${isVegOnly ? 'Veg' : 'All options'})\n\n`;
  bestCombo.items.forEach((item, i) => {
    response += `${i + 1}. **${item.name}** - ${item.calories} cal, ${item.protein}g protein\n`;
  });
  response += `\n**Total: ${bestCombo.totalCal} calories, ${bestCombo.totalProtein}g protein**\n\n`;
  
  if (profile.goal === 'lose') {
    response += `This combination maximizes protein (${bestCombo.totalProtein}g) while staying under your budget - great for satiety and muscle preservation during weight loss!`;
  } else if (profile.goal === 'gain') {
    response += `This gives you ${bestCombo.totalCal} calories with good protein - ideal for muscle building!`;
  } else {
    response += `A balanced combination that fits your calorie target with ${bestCombo.totalProtein}g of protein.`;
  }
  
  return response;
}

function generateNutritionInfo(food: CanteenFood): string {
  return `**${food.name}** (${food.category})
- Calories: ${food.calories} kcal
- Protein: ${food.protein}g
- Carbs: ${food.carbs}g
- Fat: ${food.fat}g
- Type: ${food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}`;
}

function generateMealFeedback(
  meals: { foodName: string; quantity: number }[], 
  profile: UserProfile,
  remainingCalories: number
): string {
  if (meals.length === 0) return "";
  
  let totalCalories = 0;
  let totalProtein = 0;
  const details: string[] = [];
  
  for (const meal of meals) {
    const food = findFoodItem(meal.foodName);
    if (food) {
      const cal = food.calories * meal.quantity;
      const prot = food.protein * meal.quantity;
      totalCalories += cal;
      totalProtein += prot;
      details.push(`${meal.quantity}x ${food.name}: ${cal} cal, ${prot}g protein`);
    }
  }
  
  let feedback = `Logged: ${details.join(', ')}\n\n`;
  feedback += `Total: ${totalCalories} calories, ${totalProtein}g protein\n`;
  
  const newRemaining = remainingCalories - totalCalories;
  if (newRemaining < 0) {
    feedback += `\nYou've exceeded your daily target by ${Math.abs(newRemaining)} calories. Consider lighter options for your next meal.`;
  } else if (newRemaining < 300) {
    feedback += `\nYou have ${newRemaining} calories left today. Consider a light snack or beverage.`;
  } else {
    feedback += `\nYou have ${newRemaining} calories remaining for the day.`;
  }
  
  if (profile.goal === 'lose' && totalCalories > 500) {
    feedback += "\n\nTip: For weight loss, try splitting this into smaller portions.";
  } else if (profile.goal === 'gain' && totalProtein < 15) {
    feedback += "\n\nTip: For muscle gain, add protein-rich items like paneer or eggs.";
  }
  
  return feedback;
}

export function processNutriBotMessage(
  message: string,
  profile: UserProfile,
  dailyLog: LoggedMeal[],
  targetCalories: number
): { responseText: string; extractedMeals: { foodName: string; quantity: number }[] } {
  const lowerMessage = message.toLowerCase().trim();
  const consumedCalories = dailyLog.reduce((sum, m) => sum + m.calories, 0);
  const remainingCalories = targetCalories - consumedCalories;
  const consumedProtein = dailyLog.reduce((sum, m) => sum + m.protein, 0);
  
  if (/^(hi|hello|hey|namaste|good\s*(morning|afternoon|evening))/.test(lowerMessage)) {
    return {
      responseText: generateGreeting(profile),
      extractedMeals: []
    };
  }
  
  const mealPlanMatch = lowerMessage.match(/meal\s*(?:plan)?\s*(?:under|within|below|less\s*than|for|of)?\s*(\d+)\s*(?:cal|calories|kcal)?/i) ||
                        lowerMessage.match(/(\d+)\s*(?:cal|calories|kcal)\s*(?:meal|food|diet|plan)/i) ||
                        lowerMessage.match(/under\s*(\d+)\s*(?:cal|calories)/i);
  if (mealPlanMatch) {
    const budget = parseInt(mealPlanMatch[1]);
    const mealPlan = createMealPlan(budget, profile);
    return { responseText: mealPlan, extractedMeals: [] };
  }
  
  if (/recommend|suggest|what\s*(should|can)\s*i\s*(eat|have|order)|hungry|looking\s*for/.test(lowerMessage)) {
    const recommendations = getRecommendations(profile, remainingCalories, dailyLog);
    
    if (recommendations.length === 0) {
      return {
        responseText: `You've almost reached your calorie limit (${remainingCalories} cal remaining). Consider just a beverage like Green Tea (40 cal) or Lime Juice (120 cal).`,
        extractedMeals: []
      };
    }
    
    let response = `Based on your ${profile.goal} goal and ${remainingCalories} cal remaining, I recommend:\n\n`;
    recommendations.forEach((item, i) => {
      response += `${i + 1}. **${item.name}** - ${item.calories} cal, ${item.protein}g protein ${item.isVeg ? '(Veg)' : '(Non-Veg)'}\n`;
    });
    
    if (profile.goal === 'lose') {
      response += "\nThese are protein-rich, lower-calorie options to keep you full!";
    } else if (profile.goal === 'gain') {
      response += "\nThese calorie-dense options will help you reach your goals!";
    }
    
    return { responseText: response, extractedMeals: [] };
  }
  
  if (/calories|nutrition|info|details|about/.test(lowerMessage)) {
    const cleanedQuery = lowerMessage
      .replace(/calories|nutrition|info|details|about|in|for|of|the|what|how|many|is|are/gi, ' ')
      .trim();
    
    for (const item of NUTRITION_DATABASE) {
      if (lowerMessage.includes(item.name.toLowerCase())) {
        return {
          responseText: generateNutritionInfo(item),
          extractedMeals: []
        };
      }
    }
    
    const found = findFoodItem(cleanedQuery);
    if (found) {
      return {
        responseText: generateNutritionInfo(found),
        extractedMeals: []
      };
    }
    
    const words = cleanedQuery.split(/\s+/).filter(w => w.length > 2);
    for (const word of words) {
      const match = findFoodItem(word);
      if (match) {
        return {
          responseText: generateNutritionInfo(match),
          extractedMeals: []
        };
      }
    }
    
    return {
      responseText: "I couldn't find that item. Try asking about specific dishes like 'calories in Veg Biryani' or 'nutrition info for Paneer Paratha'.",
      extractedMeals: []
    };
  }
  
  if (/status|progress|how\s*(am\s*i|much)|today|summary|remaining/.test(lowerMessage)) {
    const percentage = Math.round((consumedCalories / targetCalories) * 100);
    let response = `**Today's Progress:**\n`;
    response += `- Calories: ${consumedCalories}/${targetCalories} (${percentage}%)\n`;
    response += `- Protein: ${consumedProtein}g\n`;
    response += `- Meals logged: ${dailyLog.length}\n`;
    response += `- Remaining: ${remainingCalories} cal\n\n`;
    
    if (percentage < 30) {
      response += "You're just getting started! Make sure to fuel up properly.";
    } else if (percentage < 70) {
      response += "Good progress! You're on track.";
    } else if (percentage < 100) {
      response += "Almost there! Choose your remaining meals wisely.";
    } else {
      response += "You've reached your calorie target for today!";
    }
    
    return { responseText: response, extractedMeals: [] };
  }
  
  if (/breakfast|lunch|dinner|snack|evening/.test(lowerMessage)) {
    const hour = new Date().getHours();
    let mealType = "snack";
    let suggestions: CanteenFood[] = [];
    
    if (lowerMessage.includes('breakfast') || (hour >= 6 && hour < 11)) {
      mealType = "breakfast";
      suggestions = NUTRITION_DATABASE.filter(item => 
        ['South Indian Snacks', 'Maharashtrian Snacks', 'Paratha', 'Hot Beverages'].includes(item.category) &&
        (profile.foodPreference !== 'veg' || item.isVeg) &&
        item.calories <= remainingCalories
      ).slice(0, 5);
    } else if (lowerMessage.includes('lunch') || (hour >= 11 && hour < 15)) {
      mealType = "lunch";
      suggestions = NUTRITION_DATABASE.filter(item => 
        ['Thali', 'Biryani', 'Rice', 'Punjabi Dishes'].includes(item.category) &&
        (profile.foodPreference !== 'veg' || item.isVeg) &&
        item.calories <= remainingCalories
      ).slice(0, 5);
    } else if (lowerMessage.includes('dinner') || (hour >= 18 && hour < 22)) {
      mealType = "dinner";
      suggestions = NUTRITION_DATABASE.filter(item => 
        ['Chinese Noodles/Rice', 'Punjabi Dishes', 'Paneer Dishes', 'Biryani'].includes(item.category) &&
        (profile.foodPreference !== 'veg' || item.isVeg) &&
        item.calories <= remainingCalories
      ).slice(0, 5);
    } else {
      mealType = "snack";
      suggestions = NUTRITION_DATABASE.filter(item => 
        ['Bhel/Chaat', 'Special Snacks', 'Cold Beverages', 'Maggie'].includes(item.category) &&
        (profile.foodPreference !== 'veg' || item.isVeg) &&
        item.calories <= remainingCalories
      ).slice(0, 5);
    }
    
    let response = `**${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Suggestions:**\n\n`;
    suggestions.forEach((item, i) => {
      response += `${i + 1}. ${item.name} - ${item.calories} cal, ${item.protein}g protein\n`;
    });
    
    return { responseText: response, extractedMeals: [] };
  }
  
  if (/high\s*protein|protein\s*rich|muscle|gym/.test(lowerMessage)) {
    const proteinItems = NUTRITION_DATABASE
      .filter(item => (profile.foodPreference !== 'veg' || item.isVeg) && item.calories <= remainingCalories)
      .sort((a, b) => b.protein - a.protein)
      .slice(0, 5);
    
    let response = "**High Protein Options:**\n\n";
    proteinItems.forEach((item, i) => {
      response += `${i + 1}. ${item.name} - ${item.protein}g protein, ${item.calories} cal\n`;
    });
    
    return { responseText: response, extractedMeals: [] };
  }
  
  if (/low\s*calorie|diet|light|healthy/.test(lowerMessage)) {
    const lightItems = NUTRITION_DATABASE
      .filter(item => (profile.foodPreference !== 'veg' || item.isVeg) && item.calories < 300)
      .sort((a, b) => a.calories - b.calories)
      .slice(0, 5);
    
    let response = "**Low Calorie Options:**\n\n";
    lightItems.forEach((item, i) => {
      response += `${i + 1}. ${item.name} - ${item.calories} cal\n`;
    });
    
    return { responseText: response, extractedMeals: [] };
  }
  
  const extractedMeals = extractFoodsFromMessage(message);
  if (extractedMeals.length > 0) {
    const feedback = generateMealFeedback(extractedMeals, profile, remainingCalories);
    return { responseText: feedback, extractedMeals };
  }
  
  if (/^(had|ate|eaten|eating|having|ordered|got)\s+/.test(lowerMessage)) {
    return {
      responseText: "I couldn't identify the food item. Please mention specific dishes from our menu like 'I had Veg Biryani' or 'ate 2 samosas'.",
      extractedMeals: []
    };
  }
  
  return {
    responseText: `I can help you with:
- **Log meals**: "I had Veg Biryani" or "ate 2 samosas"
- **Get recommendations**: "What should I eat?" or "suggest lunch"
- **Check nutrition**: "Calories in Paneer Paratha"
- **Track progress**: "How am I doing today?"
- **Find options**: "High protein food" or "Low calorie snacks"

What would you like to know?`,
    extractedMeals: []
  };
}
