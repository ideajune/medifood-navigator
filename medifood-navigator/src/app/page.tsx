import SearchBar from '@/components/ui/SearchBar';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center py-20 px-4 sm:px-6 overflow-hidden bg-gray-50">
      {/* Background Abstract Shapes for Premium Feel */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full bg-blue-200/30 blur-[100px]" />
        <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-full bg-teal-200/30 blur-[100px]" />
      </div>

      <div className="w-full max-w-4xl space-y-16 mt-8 z-10">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-blue-900 to-teal-500 bg-clip-text text-transparent pb-2">
            메디푸드 네비게이터
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-medium flex flex-col items-center justify-center gap-1">
            <span>내 몸에 맞는 안전한 한 끼,</span>
            <span>지금 바로 검색해보세요.</span>
          </p>
        </div>

        {/* Glassmorphism Search Container */}
        <div className="bg-white/60 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/50">
          <SearchBar />
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1 */}
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">한눈에 보는 데이터</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              수분과 고형분을 분리한 직관적인 영양 밸런스 차트로 내 몸의 밸런스를 확인하세요.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">AI 주치의 피드백</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              음식의 핵심 성분 효능 및 안전한 섭취 가이드를 제공합니다.
            </p>
          </div>

          {/* Card 3 (추가됨) */}
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="text-3xl mb-4">🛡️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">안전하고 믿을 수 있는</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              식약처 공공데이터 기반으로 검증된 영양 정보만을 바탕으로 분석합니다.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
