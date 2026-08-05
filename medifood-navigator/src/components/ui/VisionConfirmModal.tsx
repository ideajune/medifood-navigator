'use client';
import { X, Check } from 'lucide-react';

interface VisionConfirmModalProps {
  isOpen: boolean;
  detectedFoodName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function VisionConfirmModal({ isOpen, detectedFoodName, onConfirm, onCancel }: VisionConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">AI 사진 인식 완료 📸</h2>
        
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6 text-center">
          <p className="text-gray-600 mb-2">AI가 인식한 음식은</p>
          <p className="text-3xl font-black text-blue-600 break-keep">
            "{detectedFoodName}"
          </p>
          <p className="text-gray-600 mt-2">입니다.</p>
        </div>

        <p className="text-center text-gray-600 font-medium mb-6">
          이 음식으로 영양 분석을 진행할까요?
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 flex items-center justify-center gap-2 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
            아니요, 다시 입력할게요
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 flex items-center justify-center gap-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            <Check className="w-5 h-5" />
            네, 진행합니다
          </button>
        </div>
      </div>
    </div>
  );
}
