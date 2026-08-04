'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ShieldAlert, X } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onAgree: () => void;
  onClose: () => void;
}

export default function DisclaimerModal({ isOpen, onAgree, onClose }: DisclaimerModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh] relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-700 bg-white rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-5 bg-red-50 border-b border-red-100 flex items-center gap-3 pr-12">
          <ShieldAlert className="w-6 h-6 text-medifood-red flex-shrink-0" />
          <h2 className="text-lg font-bold text-red-900">법적 면책 조항 동의</h2>
        </div>
        <div className="p-5 overflow-y-auto">
          <p className="text-base text-gray-700 leading-relaxed font-medium">
            본 서비스는 공공 데이터 기반의 <strong>영양학적 참고 자료</strong>이며, 의료 진단이나 치료를 대신할 수 없습니다. 
            <br/><br/>
            특정 질환(암 등) 치료 중이거나 복용 중인 약물이 있는 경우, 섭취 전 반드시 담당 주치의와 상의하십시오.
          </p>
        </div>
        <div className="p-5 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onAgree}
            className="w-full h-auto min-h-[48px] flex items-center justify-center bg-medifood-red hover:bg-red-700 text-white font-bold text-base rounded-xl transition-colors py-3 px-4 shadow-md cursor-pointer break-keep"
          >
            확인 및 동의합니다
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
