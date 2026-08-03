import DisclaimerModal from '@/components/ui/DisclaimerModal';
import SearchBar from '@/components/ui/SearchBar';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6">
      <DisclaimerModal />
      
      <div className="w-full max-w-3xl space-y-12 mt-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-blue-900 tracking-tight">
            메디푸드 네비게이터
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            공공데이터 기반 맞춤형 식단 안전 가이드
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <SearchBar />
        </div>
      </div>
    </main>
  );
}
