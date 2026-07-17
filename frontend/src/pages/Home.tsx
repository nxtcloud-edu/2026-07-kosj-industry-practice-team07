import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
          AI 창업 코파일럿
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          아이디어 입력 → AI 진단 → 지원사업 매칭 → 사업계획서 초안까지,<br />
          예비창업자의 "다음 행동"을 안내합니다.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/diagnosis"
            className="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">💡</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Step 1. 아이디어 진단
            </h2>
            <p className="text-sm text-gray-600">
              아이디어를 입력하면 AI가 시장성·경쟁 현황을 분석해 리포트를 제공합니다.
            </p>
          </Link>

          <Link
            to="/matching"
            className="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">🎯</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Step 2. 지원사업 매칭
            </h2>
            <p className="text-sm text-gray-600">
              조건을 입력하면 적합한 정부 지원사업을 매칭 근거와 함께 추천합니다.
            </p>
          </Link>

          <Link
            to="/business-plan"
            className="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">📄</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Step 3. 사업계획서 작성
            </h2>
            <p className="text-sm text-gray-600">
              진단 결과를 바탕으로 사업계획서 초안을 생성하고 편집할 수 있습니다.
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
