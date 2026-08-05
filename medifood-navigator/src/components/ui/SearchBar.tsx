'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, Camera, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import DisclaimerModal from './DisclaimerModal';
import VisionConfirmModal from './VisionConfirmModal';
import { compressImage } from '@/lib/imageUtils';

export default function SearchBar() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, hasAgreedDisclaimer, setHasAgreedDisclaimer } = useAppStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Vision AI States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [visionModalOpen, setVisionModalOpen] = useState(false);
  const [detectedFoodName, setDetectedFoodName] = useState('');
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [usageCount, setUsageCount] = useState(0);

  useEffect(() => {
    // 오늘 날짜 구하기 (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    const savedDate = localStorage.getItem('visionUsageDate');
    const savedCount = localStorage.getItem('visionUsageCount');
    
    if (savedDate !== today) {
      // 날짜가 바뀌었으면 카운트 초기화
      localStorage.setItem('visionUsageDate', today);
      localStorage.setItem('visionUsageCount', '0');
      setUsageCount(0);
    } else {
      setUsageCount(parseInt(savedCount || '0', 10));
    }
  }, []);

  const handleCameraClick = () => {
    setLimitModalOpen(true);
  };

  const handleLimitConfirm = () => {
    if (usageCount >= 15) {
      setLimitModalOpen(false);
      return;
    }
    
    setLimitModalOpen(false);
    
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem('visionUsageCount', newCount.toString());
    
    fileInputRef.current?.click();
  };

  const proceedToSearch = (query: string) => {
    setSearchQuery(query);
    router.push(`/result?q=${encodeURIComponent(query)}`);
  };

  const handleSearch = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!localQuery.trim()) {
      alert('검색하실 식재료나 음식 이름을 입력해주세요!');
      return;
    }
    
    if (!hasAgreedDisclaimer) {
      setIsModalOpen(true);
    } else {
      proceedToSearch(localQuery);
    }
  };

  const handleAgree = () => {
    setHasAgreedDisclaimer(true);
    setIsModalOpen(false);
    
    // Check if we were trying to search a vision result or standard text search
    if (detectedFoodName) {
      proceedToSearch(detectedFoodName);
      setDetectedFoodName(''); // Reset
    } else {
      proceedToSearch(localQuery);
    }
  };

  // Image upload and Vision AI processing
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      
      // 1. 이미지 압축 (클라이언트)
      const base64Image = await compressImage(file);

      // 2. Vision API 호출
      const response = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Image }),
      });

      if (!response.ok) {
        let errorMessage = 'API 요청 실패';
        try {
          const errorData = await response.json();
          if (errorData.error) errorMessage = errorData.error;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (data.foodName) {
        setDetectedFoodName(data.foodName);
        setVisionModalOpen(true);
      } else {
        alert('사진에서 음식을 인식하지 못했습니다. 다시 촬영해주세요.');
      }
    } catch (error: any) {
      console.error('Vision API Error:', error);
      alert(error.message || '이미지 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsAnalyzing(false);
      // Reset input value to allow uploading the same file again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleVisionConfirm = () => {
    setVisionModalOpen(false);
    setLocalQuery(detectedFoodName); // 검색창에 결과 세팅
    
    if (!hasAgreedDisclaimer) {
      setIsModalOpen(true);
    } else {
      proceedToSearch(detectedFoodName);
      setDetectedFoodName(''); // Reset
    }
  };

  const handleVisionCancel = () => {
    setVisionModalOpen(false);
    setDetectedFoodName('');
  };

  return (
    <>
      <div className="w-full flex flex-col gap-4 mt-8">
        <textarea
          rows={2}
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return; // 한글 타이핑 중 엔터 중복 방지
            // Shift + Enter는 줄바꿈 허용, 일반 Enter는 검색 실행
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSearch();
            }
          }}
          placeholder={"식재료나 음식 이름을 입력하세요.\n(예 : 토마토, 제육볶음)"}
          className="w-full py-4 px-6 bg-white border-2 border-gray-300 rounded-2xl text-xl font-bold shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all placeholder:text-gray-400 placeholder:text-base sm:placeholder:text-lg placeholder:font-medium resize-none"
          disabled={isAnalyzing}
        />
        
        {/* 하단 액션 버튼 영역 */}
        <div className="flex items-center gap-3 w-full">
          {/* 일반 텍스트 검색 버튼 */}
          <button 
            type="button" 
            onClick={() => handleSearch()}
            className="flex-1 py-4 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
            aria-label="검색"
            disabled={isAnalyzing}
          >
            <Search className="w-6 h-6" />
            <span className="font-bold text-lg">텍스트 검색</span>
          </button>

          {/* 사진 검색(카메라) 버튼 */}
          <button
            type="button"
            onClick={handleCameraClick}
            className="flex-1 py-4 flex items-center justify-center gap-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 active:bg-amber-300 active:scale-95 transition-all cursor-pointer relative shadow-sm"
            title="사진으로 검색하기"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="font-bold text-lg">분석 중...</span>
              </>
            ) : (
              <>
                <div className="relative">
                  <Camera className="w-6 h-6" />
                  {/* 프리미엄 기능 암시 왕관 아이콘 */}
                  <span className="absolute -top-2 -right-3 text-sm">👑</span>
                </div>
                <span className="font-bold text-lg">사진 검색</span>
              </>
            )}
          </button>
        </div>

        {/* 숨겨진 파일 입력창 */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      <DisclaimerModal 
        isOpen={isModalOpen} 
        onAgree={handleAgree} 
        onClose={() => setIsModalOpen(false)} 
      />

      <VisionConfirmModal
        isOpen={visionModalOpen}
        detectedFoodName={detectedFoodName}
        onConfirm={handleVisionConfirm}
        onCancel={handleVisionCancel}
      />

      {/* 한도 초과 안내 모달 */}
      {limitModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
              사진 검색 기능 안내
            </h3>
            
            <div className="text-gray-600 mb-6 text-center leading-relaxed whitespace-pre-wrap">
              {usageCount >= 15 ? (
                <>무료 제공 횟수를<br/>모두 소진하셨습니다.<br/><br/>더 많은 분석 기능은<br/>내일 다시 이용해 주세요.</>
              ) : (
                <>사진 분석 기능은 무료 사용자의 경우<br/><b>하루 3회</b> 한도로 제공됩니다.<br/><span className="text-sm text-blue-500">(현재 베타 테스트 보너스 적용 중!)</span><br/><br/>현재 남은 횟수: <span className="text-blue-600 font-bold">{15 - usageCount}회</span><br/>계속하시겠습니까?</>
              )}
            </div>
            
            {usageCount >= 15 ? (
              <button
                onClick={() => setLimitModalOpen(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors"
              >
                확인
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setLimitModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleLimitConfirm}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                >
                  계속하기
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
