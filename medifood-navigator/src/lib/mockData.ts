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
  preCalculatedAnalysis?: string; // 사전 캐싱된 AI 분석 결과
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
    preCalculatedAnalysis: `===STEP3===
• 토마토의 라이코펜(2.57mg) 및 항산화 성분:
  o 심혈관 보호: 강력한 항산화 작용으로 혈관 내 노폐물 축적을 막고 혈류 개선에 도움을 줍니다.
  o 면역력 강화: 비타민 C와 시너지 효과를 내어 신체 면역 기능 유지에 기여합니다.
• 풍부한 칼륨(237mg):
  o 혈압 안정: 체내 과잉 나트륨을 배출시켜 혈압 강하 및 부종 완화에 도움을 줍니다.
===STEP4===
• 섭취 주의 대상:
  o 만성 신장 질환자: 칼륨 배설 능력이 저하되어 있으므로 고칼륨 식품 섭취를 주의해야 합니다.
  o 역류성 식도염 환자: 산성이 강해 공복 섭취 시 위 점막을 자극할 수 있습니다.
• 과다 섭취 부작용:
  o 소화 불량: 다량 섭취 시 설사 및 위장 장애를 유발할 수 있습니다.`
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
    preCalculatedAnalysis: `===STEP3===
• 돼지고기의 단백질(16.5g) 및 비타민 B1:
  o 에너지 대사 활성화: 비타민 B1이 풍부하여 피로 회복 및 체력 증진에 탁월한 효과가 있습니다.
  o 근육 유지: 고품질의 동물성 단백질이 근육 손실 방지 및 조직 재생을 돕습니다.
===STEP4===
• 섭취 주의 대상:
  o 고혈압 및 심혈관 질환자: 100g당 650mg의 높은 나트륨과 포화지방이 혈압을 상승시킬 수 있습니다.
  o 당뇨 환자: 양념에 포함된 당류(8.5g)가 혈당 스파이크를 유발할 수 있습니다.
• 과다 섭취 부작용:
  o 체중 증가: 칼로리(220kcal)와 지방(10.8g) 함량이 높아 비만을 초래할 수 있습니다.`
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
    preCalculatedAnalysis: `===STEP3===
• 사과의 수용성 식이섬유(2.4g, 펙틴):
  o 장 건강 개선: 유익균 증식을 돕고 변비를 예방하여 장내 환경을 쾌적하게 만듭니다.
  o 콜레스테롤 저하: 혈중 LDL 콜레스테롤 흡수를 방해하여 심혈관 질환 예방에 기여합니다.
• 과당 및 포도당(당류 10.4g):
  o 즉각적인 에너지 공급: 빠른 뇌 활성화 및 피로 해소에 도움을 줍니다.
===STEP4===
• 섭취 주의 대상:
  o 당뇨 환자: 단당류 함량이 높아 공복이나 늦은 밤 섭취 시 혈당 스파이크 위험이 큽니다.
  o 과민성 대장 증후군(IBS) 환자: 포드맵(FODMAP) 성분이 가스를 유발할 수 있습니다.
• 과다 섭취 부작용:
  o 위산 과다: 늦은 밤 섭취 시 유기산이 위점막을 자극해 속쓰림을 유발할 수 있습니다.`
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
    preCalculatedAnalysis: `===STEP3===
• 고구마의 복합 탄수화물(29.5g) 및 식이섬유(3.1g):
  o 안정적인 혈당 관리: 쌀밥에 비해 혈당 지수(GI)가 낮아 에너지를 천천히 지속적으로 공급합니다.
  o 소화 촉진: 얄라핀(Jalapin) 성분과 식이섬유가 결합해 변비 해소에 탁월합니다.
• 고함량 칼륨(429mg) 및 비타민:
  o 부종 제거: 나트륨 배출을 촉진하고 혈압을 안정화합니다.
===STEP4===
• 섭취 주의 대상:
  o 만성 신장 질환자: 매우 높은 칼륨 함량(429mg)으로 인해 신장에 치명적인 부담을 줄 수 있습니다. (절대 주의)
  o 당뇨 환자: 군고구마로 조리 시 수분이 날아가고 당도가 압축되어 혈당이 급상승할 수 있습니다.
• 과다 섭취 부작용:
  o 장내 가스 유발: 소화 과정에서 이상 발효가 일어나 복부 팽만감을 초래할 수 있습니다.`
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
    preCalculatedAnalysis: `===STEP3===
• 현미의 복합 탄수화물(32.5g) 및 식이섬유(2.2g):
  o 대사 증후군 예방: 백미보다 GI 지수가 낮아 식후 혈당의 급격한 상승을 방지합니다.
  o 심혈관 건강: 풍부한 식이섬유가 혈중 콜레스테롤을 억제합니다.
• 비타민 B군 복합체:
  o 신경계 안정화: 에너지 대사를 돕고 피로 회복 및 신경 기능 안정에 필수적입니다.
===STEP4===
• 섭취 주의 대상:
  o 소화 기능 저하자 및 위장 질환자: 거친 표면(강층)으로 인해 소화 불량이나 위경련이 발생할 수 있습니다.
• 과다 섭취 부작용:
  o 미네랄 흡수 방해: 현미의 피틴산(Phytic acid) 성분이 과다할 경우 철분, 칼슘 등의 흡수를 저해할 수 있습니다.`
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
    preCalculatedAnalysis: `===STEP3===
• 콩(대두) 발효 식물성 단백질(4.1g):
  o 면역력 증진 및 항암: 발효 과정에서 생성되는 이소플라본과 펩타이드가 항산화 및 항암 효과를 나타냅니다.
  o 간 기능 보조: 양질의 아미노산이 간 해독 작용을 지원합니다.
===STEP4===
• 섭취 주의 대상:
  o 고혈압 및 신장 질환자: 100g당 무려 850mg의 나트륨이 포함되어 있어 혈압 상승 및 신장 무리를 초래합니다. (Tier 1, 3 제한 우선)
• 과다 섭취 부작용:
  o 수분 정체 및 부종: 극도의 나트륨 과다로 인해 체액 저류 현상과 강한 갈증을 유발할 수 있습니다.`
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
