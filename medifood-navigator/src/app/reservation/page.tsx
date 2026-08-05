'use client';
import Link from 'next/link';
import { ArrowLeft, User, Phone, MessageSquare, CheckCircle, Loader2, Users } from 'lucide-react';
import { useState } from 'react';

export default function ReservationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      age: formData.get('age'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("예약 신청이 성공적으로 접수되었습니다. 곧 연락드리겠습니다!");
        window.history.back();
      } else {
        const errorData = await response.json();
        alert(`오류가 발생했습니다: ${errorData.error || '다시 시도해주세요.'}`);
      }
    } catch (error) {
      console.error(error);
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* 상단 네비게이션 */}
      <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center">
          <Link href="/result" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800 ml-2">상담 예약하기</h1>
        </div>
      </header>

      {/* 폼 영역 */}
      <div className="flex-1 w-full max-w-2xl mx-auto p-4 sm:p-6 py-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 overflow-hidden relative">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">1:1 식단 컨설팅 예약</h2>
            <p className="text-gray-600">
              신청을 남겨주시면 2영업일 내에 전문 상담사가 연락드립니다.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 이름 입력 */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                이름 (실명) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full py-4 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  placeholder="홍길동"
                />
              </div>
            </div>

            {/* 연락처 입력 */}
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                연락처 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  pattern="[0-9]*"
                  className="w-full py-4 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  placeholder="01012345678 (숫자만 입력)"
                />
              </div>
            </div>

            {/* 연령대 입력 */}
            <div>
              <label htmlFor="age" className="block text-sm font-bold text-gray-700 mb-2">
                연령대 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  id="age"
                  name="age"
                  required
                  defaultValue=""
                  className="w-full py-4 pl-12 pr-10 bg-gray-50 border border-gray-200 rounded-2xl text-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-colors appearance-none"
                >
                  <option value="" disabled>연령대를 선택해주세요</option>
                  <option value="20대 이하">20대 이하</option>
                  <option value="30대">30대</option>
                  <option value="40대">40대</option>
                  <option value="50대">50대</option>
                  <option value="60대">60대</option>
                  <option value="70대 이상">70대 이상</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* 상담 내용 입력 */}
            <div>
              <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                사전 문의 내용 (선택)
              </label>
              <div className="relative">
                <div className="absolute top-4 left-4 pointer-events-none">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full py-4 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-2xl text-base focus:outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none"
                  placeholder="궁금한 점이나 특별히 관리할 질환을 적어주세요."
                />
              </div>
            </div>

            {/* 개인정보 동의 */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <input
                type="checkbox"
                id="privacy"
                required
                className="mt-1 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="privacy" className="text-sm text-gray-600 leading-relaxed">
                (필수) 상담 목적의 개인정보(이름, 연락처) 수집 및 이용에 동의합니다.
              </label>
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-5 text-white text-lg font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  처리 중...
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  상담 예약 신청하기
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </main>
  );
}
