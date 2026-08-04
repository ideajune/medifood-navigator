'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import DisclaimerModal from './DisclaimerModal';

export default function SearchBar() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, hasAgreedDisclaimer, setHasAgreedDisclaimer } = useAppStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const proceedToSearch = (query: string) => {
    setSearchQuery(query);
    router.push(`/result?q=${encodeURIComponent(query)}`);
  };

  const handleSearch = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!localQuery.trim()) return;
    
    if (!hasAgreedDisclaimer) {
      setIsModalOpen(true);
    } else {
      proceedToSearch(localQuery);
    }
  };

  const handleAgree = () => {
    setHasAgreedDisclaimer(true);
    setIsModalOpen(false);
    proceedToSearch(localQuery);
  };

  return (
    <>
      <div className="w-full relative mt-8">
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
          placeholder="식재료나 음식 이름을 입력하세요. (예 : 토마토, 제육볶음)"
          className="w-full py-5 pl-6 pr-16 bg-white border-2 border-gray-300 rounded-2xl text-lg font-medium shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
        />
        <button 
          type="button" 
          onClick={() => handleSearch()}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all cursor-pointer z-10"
          aria-label="검색"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>

      <DisclaimerModal 
        isOpen={isModalOpen} 
        onAgree={handleAgree} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
