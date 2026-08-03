import { NextRequest, NextResponse } from 'next/server';
import { searchFood } from '@/lib/mockData';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: '검색어를 입력해주세요.' }, { status: 400 });
    }

    const foodData = searchFood(query);

    if (!foodData) {
      return NextResponse.json({ error: 'DB에서 해당 식품을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ foodData });
  } catch (error: any) {
    console.error('Food API Error:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
