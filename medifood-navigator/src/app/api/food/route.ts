import { NextRequest, NextResponse } from 'next/server';
import { searchFood } from '@/lib/mockData';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: '검색어를 입력해주세요.' }, { status: 400 });
    }

    let foodData = searchFood(query);

    // DB에 없는 경우 Gemini AI를 사용하여 동적 생성 (Fallback)
    if (!foodData) {
      if (!genAI) {
        return NextResponse.json({ error: 'DB에 해당 식품이 없고, AI를 호출할 API 키가 없습니다.' }, { status: 404 });
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
      const prompt = `
당신은 방대한 지식을 가진 영양 데이터베이스입니다.
사용자가 입력한 식품명("${query}")에 대한 100g 당 일반적인 평균 영양 성분을 다음 JSON 형식으로 추정하여 반환하세요.
반드시 마크다운 백틱 문법(\`\`\`)을 제외한 순수 JSON 텍스트만 출력해야 합니다.
수분(water) 함량(g)을 반드시 추정하여 100g 비율에 맞게 작성하세요.

{
  "id": "${query}-ai-generated",
  "name": "${query}",
  "category": "raw",
  "calories": 숫자,
  "carbohydrate": 숫자,
  "protein": 숫자,
  "fat": 숫자,
  "sugar": 숫자,
  "sodium": 숫자,
  "potassium": 숫자,
  "dietaryFiber": 숫자,
  "water": 숫자,
  "vitamins": ["문자열 배열"]
}
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      const match = responseText.match(/\{[\s\S]*\}/);
      let jsonStr = match ? match[0] : responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      try {
        foodData = JSON.parse(jsonStr);
      } catch (e) {
        console.error('AI Food Data Generation Error:', responseText);
        return NextResponse.json({ error: 'AI가 해당 식품의 영양 성분 데이터를 생성하는 데 실패했습니다.' }, { status: 500 });
      }
    }

    return NextResponse.json({ foodData });
  } catch (error: any) {
    console.error('Food API Error:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
