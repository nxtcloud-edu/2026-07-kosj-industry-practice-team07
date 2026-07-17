import { Link } from 'react-router-dom'

export default function Matching() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
          ← 홈으로
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎯 지원사업 매칭
        </h1>
        <p className="text-gray-600 mb-8">
          조건을 입력하면 규칙 기반으로 자격 부합 지원사업을 필터링하고, AI가 매칭 이유를 설명합니다.
        </p>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                나이
              </label>
              <input
                type="number"
                placeholder="예: 23"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                지역
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                <option value="">선택</option>
                <option value="서울">서울</option>
                <option value="세종">세종</option>
                <option value="대전">대전</option>
                <option value="경기">경기</option>
                <option value="부산">부산</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                분야
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                <option value="">선택</option>
                <option value="IT">IT / 소프트웨어</option>
                <option value="교육">교육</option>
                <option value="헬스케어">헬스케어</option>
                <option value="커머스">커머스</option>
                <option value="콘텐츠">콘텐츠</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                창업 단계
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                <option value="">선택</option>
                <option value="예비">예비 창업자</option>
                <option value="초기">초기 창업자 (1년 미만)</option>
                <option value="성장">성장기 (1~3년)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            매칭 시작
          </button>
        </form>
      </div>
    </div>
  )
}
