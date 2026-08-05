import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return NextResponse.json({ error: '이미지 데이터가 제공되지 않았습니다.' }, { status: 400 });
    }

    if (!genAI) {
      return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    // Base64 문자열에서 헤더(data:image/jpeg;base64,) 제거
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = "이 사진에 있는 메인 음식이 무엇인지 한국어로 음식 이름만 정확하게 단답형으로 답변해줘. (예: 제육볶음, 바나나, 김치찌개) 여러 음식이 있다면 가장 비중이 큰 메인 요리 하나만 골라줘.";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      }
    ]);

    const text = result.response.text().trim();
    
    // 혹시 모를 마크다운이나 특수문자 제거
    const cleanFoodName = text.replace(/[*#]/g, '').trim();

    return NextResponse.json({ foodName: cleanFoodName });
    
  } catch (error: any) {
    console.error('Vision API Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('429 Too Many Requests') || errorMessage.includes('quota') || errorMessage.includes('Quota exceeded')) {
      return NextResponse.json({ 
        error: '현재 연결된 Gemini API 키의 무료 사용량이 모두 소진되었습니다(Quota Exceeded). 유료 키로 교체하거나 내일 다시 시도해주세요.' 
      }, { status: 429 });
    }

    return NextResponse.json({ error: '서버 오류: ' + errorMessage }, { status: 500 });
  }
}
