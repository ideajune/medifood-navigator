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

// 레벤슈타인 거리 알고리즘 (두 문자열 간의 유사도 거리 측정)
function getLevenshteinDistance(a: string, b: string): number {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1) // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

const synonyms: Record<string, string> = {
  '돼지고기볶음': '제육볶음',
  '방울토마토': '토마토',
  '군고구마': '고구마',
  '찐고구마': '고구마',
  '잡곡밥': '현미밥',
  '차돌된장찌개': '된장찌개',
  '애플': '사과'
};

export function searchFood(query: string): NutrientInfo | null {
  const normalizedQuery = query.trim().replace(/\s+/g, '');
  
  // 1단계: 동의어 사전을 통한 직접 매칭
  let searchTarget = synonyms[normalizedQuery] || normalizedQuery;

  // 2단계: 정확한 포함 여부(Substring) 확인
  let found = mockFoods.find(food => food.name.replace(/\s+/g, '').includes(searchTarget));
  if (found) return found;

  // 3단계: 퍼지 매칭 (오타 교정 - 레벤슈타인 거리)
  // 거리가 2 이하인 가장 가까운 항목 탐색 (ex: 제육복음 -> 제육볶음 (거리 1))
  let closestFood = null;
  let minDistance = 3; // 3 이상은 오타가 아닐 가능성이 높음 (매칭 안함)
  
  for (const food of mockFoods) {
    const foodName = food.name.replace(/\s+/g, '');
    const dist = getLevenshteinDistance(searchTarget, foodName);
    // 동의어와도 거리 비교
    let minSynonymDist = minDistance;
    for (const [synonym, actualName] of Object.entries(synonyms)) {
      if (actualName === food.name) {
        const sDist = getLevenshteinDistance(searchTarget, synonym);
        if (sDist < minSynonymDist) minSynonymDist = sDist;
      }
    }
    
    const finalDist = Math.min(dist, minSynonymDist);
    if (finalDist < minDistance) {
      minDistance = finalDist;
      closestFood = food;
    }
  }
  
  return closestFood;
}
