'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import SolidContentChart from '@/components/ui/SolidContentChart';
import { useAppStore } from '@/store/useAppStore';
import type { NutrientInfo } from '@/lib/mockData';

interface AnalysisData {
  step1: {
    nutritionTable: Record<string, string>;
    solidContentCalculation: string;
  };
  step2: {
    percentages: Record<string, string>;
  };
  step3: string[];
  step4: {
    targets: string;
    sideEffects: string;
  };
}

interface ApiResponse {
  foodData?: NutrientInfo;
  analysis?: AnalysisData;
  error?: string;
}

function SearchResultContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { selectedDiseases } = useAppStore();

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) {
      setError('검색어가 없습니다.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query, diseases: selectedDiseases }),
        });
        
        const result: ApiResponse = await res.json();
        
        if (!res.ok) {
          setError(result.error || '오류가 발생했습니다.');
        } else {
          setData(result);
        }
      } catch (err) {
        setError('서버와 통신할 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, selectedDiseases]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-xl font-bold text-gray-700 text-center">
          메디푸드 AI가 <strong>"{query}"</strong> 영양 데이터를 분석 중입니다...
        </p>
      </div>
    );
  }

  if (error || !data?.foodData) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8 text-center py-20">
        <AlertTriangle className="w-16 h-16 text-medifood-red mx-auto mb-4" />
        <h1 className="text-3xl font-black text-gray-900">결과를 찾을 수 없습니다</h1>
        <p className="text-xl text-gray-600">{error}</p>
        <div className="mt-8">
          <Link href="/" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-2xl touch-target hover:bg-blue-700 transition-colors">
            다시 검색하기
          </Link>
        </div>
      </div>
    );
  }

  const { foodData, analysis } = data;

  const chartData = [
    { name: '탄수화물', value: foodData.carbohydrate || 0, color: '#f59e0b' },
    { name: '단백질', value: foodData.protein || 0, color: '#3b82f6' },
    { name: '지방', value: foodData.fat || 0, color: '#ef4444' },
    { name: '당류', value: foodData.sugar || 0, color: '#8b5cf6' },
    { name: '식이섬유', value: foodData.dietaryFiber || 0, color: '#10b981' },
    { name: '칼륨', value: (foodData.potassium || 0) / 1000, color: '#6366f1' },
    { name: '나트륨', value: (foodData.sodium || 0) / 1000, color: '#ec4899' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-20">
      <header className="flex items-center gap-4 border-b border-gray-200 pb-6">
        <Link href="/" className="touch-target text-gray-500 hover:text-gray-900 transition-colors flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100">
          <ArrowLeft className="w-7 h-7" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-gray-900">
            <span className="text-blue-600">"{foodData.name}"</span> 분석 결과
          </h1>
          <p className="text-lg text-gray-500 mt-2">
            적용된 질환 필터: {selectedDiseases.length > 0 ? selectedDiseases.join(', ') : '해당 없음'}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: 기본 영양 성분 */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">1. 기본 영양 성분 (100g 기준)</h2>
          <div className="space-y-3 text-lg text-gray-700">
            {analysis && analysis.step1 && Object.entries(analysis.step1.nutritionTable).map(([key, val]) => (
              <div key={key} className="flex justify-between border-b border-gray-50 pb-2">
                <span>{key}</span> <strong>{val}</strong>
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <span className="font-bold text-blue-700">고형분 계산</span> 
              <strong className="text-blue-700">{analysis?.step1?.solidContentCalculation}</strong>
            </div>
          </div>
        </section>

        {/* Step 2: 고형분 분석 (원형 차트) */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">2. 수분 제외 고형분 분석 (2D Pie Chart)</h2>
          <div className="flex-1 flex items-center justify-center min-h-[250px]">
            <SolidContentChart data={chartData} />
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 3: 핵심 효능 */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">3. 핵심 성분 효능</h2>
          <ul className="list-disc pl-5 space-y-3 text-lg text-gray-700">
            {analysis?.step3?.map((efficacy, idx) => (
              <li key={idx}>{efficacy}</li>
            ))}
          </ul>
        </section>

        {/* Step 4: 섭취 주의사항 */}
        <section className="bg-orange-50 border-orange-200 p-6 rounded-3xl shadow-sm border h-full">
          <div className="flex items-center gap-2 mb-4 border-b border-orange-200 pb-2">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-orange-900">
              4. 단점 및 섭취 시 주의사항
            </h2>
          </div>
          <div className="space-y-4 text-lg">
            <div className="space-y-2">
              <p className="text-orange-800 font-bold">⚠️ 섭취 주의 대상</p>
              <p className="text-orange-700 leading-relaxed">{analysis?.step4?.targets}</p>
            </div>
            <div className="space-y-2 pt-2 border-t border-orange-200 border-dashed">
              <p className="text-orange-800 font-bold">⚠️ 과다 섭취 부작용</p>
              <p className="text-orange-700 leading-relaxed">{analysis?.step4?.sideEffects}</p>
            </div>
          </div>
        </section>
      </div>

      {/* 법적 컴플라이언스 (면책 조항) */}
      <div className="mt-12 p-6 bg-gray-100 rounded-2xl text-gray-500 text-sm sm:text-base leading-relaxed border border-gray-200">
        <h3 className="font-bold text-gray-700 mb-2">⚠️ 의학적 면책 조항 (Disclaimer)</h3>
        <p>
          본 서비스는 식약처 등의 공공 데이터를 기반으로 제공되는 영양학적 참고 자료이며, 어떠한 경우에도 <strong>의료 진단이나 치료를 대신할 수 없습니다.</strong><br/>
          특정 질환(암, 당뇨, 고혈압, 신장/간 질환 등) 치료 중이거나 복용 중인 약물이 있는 경우, 본 정보에 의존하기 전에 <strong>반드시 담당 주치의 또는 임상 영양사와 상의하십시오.</strong>
        </p>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <Suspense fallback={
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <div className="text-xl font-bold text-gray-600">분석 준비 중...</div>
        </div>
      }>
        <SearchResultContent />
      </Suspense>
    </main>
  );
}
