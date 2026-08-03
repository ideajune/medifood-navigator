export interface NutrientInfo {
  name: string;
  category: 'raw' | 'cooked';
  calories: number; // kcal (100g 기준)
  water: number; // g
  carbohydrate: number; // g
  protein: number; // g
  fat: number; // g
  sugar: number; // g
  dietaryFiber: number; // g
  potassium: number; // mg
  sodium: number; // mg
  vitamins: string[];
  lycopene?: number; // mg (토마토 등 특정 식품용)
}

export const mockFoods: NutrientInfo[] = [
  {
    name: '토마토',
    category: 'raw',
    calories: 18,
    water: 94.5,
    carbohydrate: 3.9,
    protein: 0.9,
    fat: 0.2,
    sugar: 2.6,
    dietaryFiber: 1.2,
    potassium: 237, // 칼륨 수치가 높음
    sodium: 5,
    vitamins: ['비타민 C', '비타민 A', '비타민 K'],
    lycopene: 2.57,
  },
  {
    name: '제육볶음',
    category: 'cooked',
    calories: 220,
    water: 60.5,
    carbohydrate: 15.2,
    protein: 16.5, // 고단백
    fat: 10.8,
    sugar: 8.5,
    dietaryFiber: 2.1,
    potassium: 350,
    sodium: 650, // 고나트륨
    vitamins: ['비타민 B1', '비타민 B6'],
  },
  {
    name: '사과',
    category: 'raw',
    calories: 52,
    water: 85.6,
    carbohydrate: 13.8,
    protein: 0.3,
    fat: 0.2,
    sugar: 10.4, // 당류가 비교적 높음
    dietaryFiber: 2.4,
    potassium: 107,
    sodium: 1,
    vitamins: ['비타민 C'],
  },
  {
    name: '고구마',
    category: 'raw',
    calories: 128,
    water: 68.5,
    carbohydrate: 29.5,
    protein: 1.4,
    fat: 0.2,
    sugar: 4.2,
    dietaryFiber: 3.1,
    potassium: 429,
    sodium: 12,
    vitamins: ['비타민 A', '비타민 C', '비타민 E'],
  },
  {
    name: '현미밥',
    category: 'cooked',
    calories: 153,
    water: 64.2,
    carbohydrate: 32.5,
    protein: 3.2,
    fat: 1.1,
    sugar: 0.2,
    dietaryFiber: 2.2,
    potassium: 75,
    sodium: 2,
    vitamins: ['비타민 B1', '비타민 B2', '비타민 B6'],
  },
  {
    name: '된장찌개',
    category: 'cooked',
    calories: 55,
    water: 87.5,
    carbohydrate: 5.2,
    protein: 4.1,
    fat: 2.1,
    sugar: 0.5,
    dietaryFiber: 1.8,
    potassium: 150,
    sodium: 850,
    vitamins: ['비타민 B12', '비타민 E'],
  }
];

export function searchFood(query: string): NutrientInfo | null {
  const normalizedQuery = query.trim().replace(/\s+/g, '');
  
  // 간단한 동의어 처리(Fuzzy 매칭 흉내)
  let searchTarget = normalizedQuery;
  if (normalizedQuery === '돼지고기볶음') {
    searchTarget = '제육볶음';
  } else if (normalizedQuery === '방울토마토') {
    searchTarget = '토마토';
  } else if (normalizedQuery === '군고구마' || normalizedQuery === '찐고구마') {
    searchTarget = '고구마';
  } else if (normalizedQuery === '잡곡밥') {
    searchTarget = '현미밥';
  } else if (normalizedQuery === '차돌된장찌개') {
    searchTarget = '된장찌개';
  }

  const found = mockFoods.find(food => food.name.replace(/\s+/g, '').includes(searchTarget));
  return found || null;
}
