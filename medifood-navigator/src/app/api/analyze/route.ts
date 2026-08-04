import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAnalysisFromCache, saveAnalysisToCache } from '@/lib/cache';
const apiKey = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function POST(request: NextRequest) {
  try {
    const { foodData, diseases } = await request.json();

    if (!foodData) {
      return NextResponse.json({ error: '식품 정보가 제공되지 않았습니다.' }, { status: 400 });
    }

    // 캐싱된 데이터(preCalculatedAnalysis 또는 data.json 캐시)가 존재하면 API를 호출하지 않고 캐시 텍스트를 스트리밍 반환
    const cachedText = (await getAnalysisFromCache(foodData.name, diseases || [])) || foodData.preCalculatedAnalysis;
    
    if (cachedText) {
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          // 타이핑 효과 연출을 위해 텍스트를 쪼개어 약간의 지연을 주고 전송 (줄바꿈 포함 매칭)
          const chunks = cachedText.match(/[\s\S]{1,5}/g) || [cachedText];
          for (const chunk of chunks) {
            controller.enqueue(encoder.encode(chunk));
            await new Promise(resolve => setTimeout(resolve, 10)); // 글자당 10ms 지연
          }
          controller.close();
        }
      });
      return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    // API 키가 없으면 더미 데이터 반환 (에러 방지 및 UI 테스트용)
    if (!genAI) {
      const dummyText = `===STEP3===
• (API Key 없음) 테스트 성분(0mg):
  o 기능 테스트: 풍부한 영양소를 함유하고 있습니다.
===STEP4===
• 섭취 주의 대상:
  o API 키 없음: 대상을 분석할 수 없습니다.
• 과다 섭취 부작용:
  o 설정 오류: .env.local 파일에 GEMINI_API_KEY를 설정해주세요.`;
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(dummyText));
          controller.close();
        }
      });
      return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `
당신은 만성질환자를 위한 영양 전문 AI '메디푸드 네비게이터'입니다.
다음 식품의 영양 성분과 사용자의 질환 정보를 바탕으로 안전 섭취 가이드를 작성해주세요.
반드시 아래 지정된 텍스트 형식으로 응답하며, 의료적 확언(진단, 처방)은 절대 금지합니다.

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

[요구사항 및 출력 형식]
반드시 다음 구분자(===STEP3===, ===STEP4===)를 사용하여 답변을 작성하세요. 다른 텍스트나 인삿말은 절대 추가하지 마세요.
계층형 불릿 포인트를 사용할 때는 대분류는 '•', 소분류(상세 설명)는 'o' (알파벳 소문자 o)를 사용하고 들여쓰기를 적용하세요.

===STEP3===
(해당 식품에서 가장 영양학적 가치가 높은 핵심 성분 2~3가지를 선정하여 인체 건강에 미치는 영향을 과학적 근거 기반으로 작성. 반드시 100g당 함량을 표기할 것)
(형식 예시)
• 화조(초피/마조)의 산쇼올(Sanshool) 및 유기화합물:
  o 진통 및 국소 마비 작용: 특유의 얼얼한 맛을 내는 산쇼올 성분은 신경 전달을 완화하여 진통 촉진 및 통증 감소에 기여합니다.
  o 소화기능 활성화: 위산 분비를 촉진하고 장 운동을 자극하여 소화 불량 개선에 도움을 줍니다.

===STEP4===
(섭취 주의 대상 및 과다 섭취 부작용을 나누어 구체적으로 작성)
(형식 예시)
• 섭취 주의 대상:
  o 위염, 위궤양 환자: 강한 자극성 성분이 위점막을 손상시킬 수 있습니다.
• 과다 섭취 부작용:
  o 위장 장애: 복통, 장 경련, 급성 설사가 발생할 수 있습니다.
`;

    const result = await model.generateContentStream(prompt);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullText = '';
        try {
          for await (const chunk of result.stream) {
            const textChunk = chunk.text();
            fullText += textChunk;
            controller.enqueue(encoder.encode(textChunk));
          }
          // 스트림이 끝나면 생성된 전체 텍스트를 캐시에 저장
          saveAnalysisToCache(foodData.name, diseases || [], fullText).catch(console.error);
        } catch (e: any) {
          console.error('Streaming error:', e);
          controller.enqueue(encoder.encode(`\n[ERROR] ${e.message}`));
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
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
