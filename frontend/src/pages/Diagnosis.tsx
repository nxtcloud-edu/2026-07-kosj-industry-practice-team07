import { Link } from 'react-router-dom'

export default function Diagnosis() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
          ← 홈으로
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          💡 아이디어 진단
        </h1>
        <p className="text-gray-600 mb-8">
          아이디어를 입력하면 AI가 시장성, 경쟁 현황, 타깃 적합성을 분석합니다.
        </p>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              아이디어 한 줄 설명
            </label>
            <input
              type="text"
              placeholder="예: 중고생 대상 AI 영어 튜터 앱"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              타깃 고객
            </label>
            <input
              type="text"
              placeholder="예: 영어 학원을 다닐 여건이 안 되는 중고등학생"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              해결하려는 문제
            </label>
            <textarea
              rows={3}
              placeholder="예: 비용 부담으로 영어 회화 연습 기회가 부족한 학생들에게 저렴한 AI 튜터를 제공"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            AI 진단 시작
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-400 text-center">
          ※ 본 분석은 참고용이며, 실제 투자·사업 결정의 근거로 사용하지 마세요.
        </p>
      </div>
    </div>
  )
}
