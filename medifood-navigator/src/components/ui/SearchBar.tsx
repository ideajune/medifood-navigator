'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export default function SearchBar() {
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useAppStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localQuery.trim()) return;
    
    setSearchQuery(localQuery);
    router.push(`/result?q=${encodeURIComponent(localQuery)}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full relative mt-8">
      <input
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder="식품 원물이나 음식 이름을 입력하세요 (예: 토마토, 제육볶음)"
        className="w-full touch-target py-5 pl-6 pr-16 bg-white border-2 border-gray-300 rounded-2xl text-lg font-medium shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
      />
      <button 
        type="submit" 
        className="absolute right-3 top-1/2 -translate-y-1/2 touch-target bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
        aria-label="검색"
      >
        <Search className="w-6 h-6" />
      </button>
    </form>
  );
}
