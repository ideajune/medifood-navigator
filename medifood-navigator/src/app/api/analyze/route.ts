import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchFood } from '@/lib/mockData';

const apiKey = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function POST(request: NextRequest) {
  try {
    const { query, diseases } = await request.json();

    if (!query) {
      return NextResponse.json({ error: '검색어를 입력해주세요.' }, { status: 400 });
    }

    const foodData = searchFood(query);

    if (!foodData) {
      return NextResponse.json({ error: 'DB에서 해당 식품을 찾을 수 없습니다.' }, { status: 404 });
    }

    // Gemini API 호출 준비
    if (!genAI) {
      // API 키가 없으면 더미 데이터 반환 (에러 방지 및 UI 테스트용)
      return NextResponse.json({
        foodData,
        analysis: {
          step1: {
            nutritionTable: {
              "칼로리(kcal)": foodData.calories.toString(),
              "수분(g)": foodData.water.toString(),
              "탄수화물(g)": foodData.carbohydrate.toString(),
              "단백질(g)": foodData.protein.toString(),
              "지방(g)": foodData.fat.toString(),
              "당류(g)": foodData.sugar.toString(),
              "나트륨(mg)": foodData.sodium.toString(),
              "칼륨(mg)": foodData.potassium.toString()
            },
            solidContentCalculation: `총 고형분 함량 = 100g - ${foodData.water}g = ${100 - foodData.water}g`
          },
          step2: {
            percentages: {
              "탄수화물": "0%", "단백질": "0%", "지방": "0%"
            }
          },
          step3: ['(API Key 없음) 풍부한 영양소를 함유하고 있습니다.'],
          step4: {
            targets: "API 키가 없어 대상을 분석할 수 없습니다.",
            sideEffects: ".env.local 파일에 GEMINI_API_KEY를 설정해주세요."
          }
        }
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `
당신은 만성질환자를 위한 영양 전문 AI '메디푸드 네비게이터'입니다.
다음 식품의 영양 성분과 사용자의 질환 정보를 바탕으로 안전 섭취 가이드를 작성해주세요.
반드시 JSON 형식으로만 응답해야 하며, 의료적 확언(진단, 처방)은 절대 금지합니다.

[식품 정보]
- 이름: ${foodData.name}
- 상태: ${foodData.category === 'raw' ? '생것(원물)' : '조리됨'}
- 100g 당 영양성분: 칼로리 ${foodData.calories}kcal, 탄수화물 ${foodData.carbohydrate}g, 단백질 ${foodData.protein}g, 지방 ${foodData.fat}g, 당류 ${foodData.sugar}g, 식이섬유 ${foodData.dietaryFiber}g, 나트륨 ${foodData.sodium}mg, 칼륨 ${foodData.potassium}mg, 비타민: ${foodData.vitamins.join(', ')}${foodData.lycopene ? `, 라이코펜 ${foodData.lycopene}mg` : ''}

[사용자 질환 (다중 선택)]
- ${diseases && diseases.length > 0 ? diseases.join(', ') : '해당 없음 (일반인)'}

[분석 지침: ⚠️제한 우선주의(Restriction First) 엄격 적용⚠️]
Tier 1 (치명적 장애 - 신장/간): 고단백, 고칼륨 무조건 제한.
Tier 2 (급성 수치 변화 - 당뇨): 당류, 고탄수화물 섭취 주의 (혈당 스파이크).
Tier 3 (만성 수치 변화 - 고혈압): 나트륨 섭취 주의.
Tier 4 (체력/면역력 - 암): Tier 1~3과 상충 시 제한 사항을 무조건 우선시함.

[요구사항]
Step 1: 입력된 영양 성분을 기반으로 필수 항목(칼로리, 수분, 탄수화물, 단백질, 지방, 당류, 포화지방, 트랜스지방, 콜레스테롤, 나트륨, 비타민, 식이섬유, 칼륨, 기타)에 대한 표 데이터를 생성하고, '총 고형분 함량 = 100g - 수분(g)' 공식을 적용한 계산 결과를 포함하세요.
Step 2: Step 1의 고형분 함량을 기준으로 각 영양소가 차지하는 백분율(%)을 직접 계산하여 반환하세요.
Step 3: 영양학적 가치가 높은 핵심 성분 2~3가지를 선정하여 건강에 미치는 영향을 간결한 불릿 포인트로 반환하세요. (반드시 성분명 뒤에 100g 당 함량을 괄호 속에 표기할 것. 예: 성분명(00mg) - 효능 설명)
Step 4: 섭취 주의 대상과 과다 섭취 시 발생할 수 있는 주요 부작용을 구체적으로 반환하세요.

[출력 JSON 포맷]
{
  "step1": {
    "nutritionTable": {
      "칼로리(kcal)": "0",
      "수분(g)": "0",
      "탄수화물(g)": "0",
      "단백질(g)": "0",
      "지방(g)": "0",
      "당류(g)": "0",
      "나트륨(mg)": "0",
      "칼륨(mg)": "0",
      "식이섬유(g)": "0",
      "기타": "0"
    },
    "solidContentCalculation": "총 고형분 함량 = 100g - 0g = 100g"
  },
  "step2": {
    "percentages": {
      "탄수화물(g)": "0%",
      "단백질(g)": "0%",
      "지방(g)": "0%",
      "기타": "0%"
    }
  },
  "step3": [
    "성분명(함량) - 핵심 성분 효능 1",
    "성분명(함량) - 핵심 성분 효능 2"
  ],
  "step4": {
    "targets": "섭취 주의 대상: 특정 질환 보유자 등 상세 설명",
    "sideEffects": "과다 섭취 부작용: 혈당 상승 등 상세 설명"
  }
}

- JSON 포맷 외의 텍스트(마크다운 백틱 등)는 절대로 출력하지 마세요.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // JSON 추출 (마크다운 및 텍스트 섞임 방어)
    const match = responseText.match(/\{[\s\S]*\}/);
    let jsonStr = match ? match[0] : responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let analysis;
    try {
      analysis = JSON.parse(jsonStr);
    } catch (e) {
      console.error('JSON Parsing Error:', e, responseText);
      return NextResponse.json({ error: 'AI 응답 파싱 실패. 원본: ' + responseText.slice(0, 100) + '...' }, { status: 500 });
    }

    return NextResponse.json({
      foodData,
      analysis
    });
    
  } catch (error: any) {
    console.error('Analyze API Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // 429 Too Many Requests (무료 API 할당량 초과) 처리
    if (errorMessage.includes('429 Too Many Requests') || errorMessage.includes('Quota exceeded')) {
      return NextResponse.json({ error: 'AI 분석 요청이 너무 많습니다. 약 1분 후에 다시 시도해주세요. (무료 API 할당량 초과)' }, { status: 429 });
    }

    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다. (상세: ' + errorMessage + ')' }, { status: 500 });
  }
}
