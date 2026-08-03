'use client';
import { useAppStore } from '@/store/useAppStore';

const DISEASES = [
  '암', '당뇨', '고혈압', '간 기능 저하', '신장 기능 저하', '위/소화기 약함'
];

export default function DiseaseSelector() {
  const { selectedDiseases, toggleDisease } = useAppStore();

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">현재 보유 중인 질환을 선택해주세요 (다중 선택 가능)</h3>
      <div className="flex flex-wrap gap-3">
        {DISEASES.map((disease) => {
          const isSelected = selectedDiseases.includes(disease);
          return (
            <button
              key={disease}
              onClick={() => toggleDisease(disease)}
              className={`touch-target px-5 py-3 rounded-xl font-bold text-lg transition-all border-2 shadow-sm cursor-pointer ${
                isSelected 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {disease}
            </button>
          );
        })}
      </div>
    </div>
  );
}
