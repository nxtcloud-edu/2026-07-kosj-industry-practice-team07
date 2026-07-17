import { Link } from 'react-router-dom'

export default function BusinessPlan() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
          ← 홈으로
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📄 사업계획서 작성
        </h1>
        <p className="text-gray-600 mb-8">
          AI가 생성한 초안을 섹션별로 검토하고 수정할 수 있습니다.
        </p>

        <div className="space-y-6">
          {['문제 정의', '해결 방안', '시장 분석', '수익 모델', '팀 구성'].map(
            (section, index) => (
              <div
                key={section}
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {index + 1}. {section}
                  </h2>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                    AI 생성
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder={`${section}에 대한 내용을 작성하거나, AI 생성 버튼을 눌러 초안을 생성하세요.`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            )
          )}
        </div>

        <div className="mt-8 flex gap-4">
          <button className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
            AI 초안 생성
          </button>
          <button className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition border border-gray-300">
            PDF 다운로드
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-400 text-center">
          ※ AI 생성 텍스트는 참고용입니다. 반드시 직접 검토·수정 후 사용하세요.
        </p>
      </div>
    </div>
  )
}
