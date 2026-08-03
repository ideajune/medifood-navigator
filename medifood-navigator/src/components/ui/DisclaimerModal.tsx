'use client';
import { useAppStore } from '@/store/useAppStore';
import { ShieldAlert } from 'lucide-react';

export default function DisclaimerModal() {
  const { hasAgreedDisclaimer, setHasAgreedDisclaimer } = useAppStore();

  if (hasAgreedDisclaimer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 bg-red-50 border-b border-red-100 flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-medifood-red flex-shrink-0" />
          <h2 className="text-xl font-bold text-red-900">법적 면책 조항 동의</h2>
        </div>
        <div className="p-6 overflow-y-auto">
          <p className="text-lg text-gray-700 leading-relaxed font-medium">
            본 서비스는 공공 데이터 기반의 <strong>영양학적 참고 자료</strong>이며, 의료 진단이나 치료를 대신할 수 없습니다. 
            <br/><br/>
            특정 질환(암 등) 치료 중이거나 복용 중인 약물이 있는 경우, 섭취 전 반드시 담당 주치의와 상의하십시오.
          </p>
        </div>
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => setHasAgreedDisclaimer(true)}
            className="touch-target w-full bg-medifood-red hover:bg-red-700 text-white font-bold text-lg rounded-xl transition-colors py-4 shadow-md cursor-pointer"
          >
            위 내용을 확인하였으며, 동의합니다
          </button>
        </div>
      </div>
    </div>
  );
}
