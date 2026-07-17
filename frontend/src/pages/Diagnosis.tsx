import { useState } from 'react'
import { Link } from 'react-router-dom'

interface DiagnosisResult {
  strengths: string[]
  risks: string[]
  suggestions: string[]
  summary: string
}

// 목업: 나중에 백엔드 API 호출로 교체
function getMockDiagnosis(idea: string, target: string, _problem: string): DiagnosisResult {
  return {
    summary: `"${idea}" 아이디어에 대한 AI 진단 결과입니다.`,
    strengths: [
      `${target}을(를) 타깃으로 한 명확한 사용자 정의`,
      '교육 분야 AI 서비스 시장이 지속 성장 중',
      '비용 장벽을 낮추는 접근으로 사회적 가치 확보 가능',
    ],
    risks: [
      '유사 서비스(뤼튼 영어, 스픽 등)가 이미 시장에 다수 존재',
      '중고생 타깃의 경우 결제 주체(학부모)와 사용자가 분리됨',
      '콘텐츠 품질 신뢰성 확보에 초기 비용 발생 가능',
    ],
    suggestions: [
      '타깃을 더 좁혀보세요 (예: 중학생 영어 말하기 → 중1 영어 발음 교정)',
      '기존 서비스 대비 차별점을 한 줄로 정리해보세요',
      '학부모 설득 포인트(비용 절감, 학습 리포트)를 함께 설계하면 유리합니다',
    ],
  }
}

export default function Diagnosis() {
  const [idea, setIdea] = useState('')
  const [target, setTarget] = useState('')
  const [problem, setProblem] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idea.trim() || !target.trim() || !problem.trim()) return

    setLoading(true)
    setResult(null)

    // 목업: 1.5초 딜레이로 AI 응답 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const diagnosis = getMockDiagnosis(idea, target, problem)
    setResult(diagnosis)
    setLoading(false)
  }

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              아이디어 한 줄 설명
            </label>
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
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
              value={target}
              onChange={(e) => setTarget(e.target.value)}
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
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="예: 비용 부담으로 영어 회화 연습 기회가 부족한 학생들에게 저렴한 AI 튜터를 제공"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !idea.trim() || !target.trim() || !problem.trim()}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '분석 중...' : 'AI 진단 시작'}
          </button>
        </form>

        {/* 로딩 */}
        {loading && (
          <div className="mt-10 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="mt-3 text-gray-500">AI가 아이디어를 분석하고 있습니다...</p>
          </div>
        )}

        {/* 진단 결과 */}
        {result && (
          <div className="mt-10 space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700 font-medium">{result.summary}</p>
            </div>

            {/* 강점 */}
            <div className="p-6 bg-green-50 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">✅ 강점</h3>
              <ul className="space-y-2">
                {result.strengths.map((item, i) => (
                  <li key={i} className="text-green-700 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 리스크 */}
            <div className="p-6 bg-red-50 rounded-xl border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-3">⚠️ 리스크</h3>
              <ul className="space-y-2">
                {result.risks.map((item, i) => (
                  <li key={i} className="text-red-700 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 보완 제안 */}
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 보완 제안</h3>
              <ul className="space-y-2">
                {result.suggestions.map((item, i) => (
                  <li key={i} className="text-blue-700 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 다음 단계 */}
            <div className="flex gap-4">
              <Link
                to="/matching"
                className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition text-center"
              >
                지원사업 매칭으로 →
              </Link>
            </div>

            <p className="text-xs text-gray-400 text-center">
              ※ 본 분석은 참고용이며, 실제 시장 데이터와 차이가 있을 수 있습니다. 투자·사업 결정의 근거로 사용하지 마세요.
            </p>
          </div>
        )}

        {!result && !loading && (
          <p className="mt-6 text-xs text-gray-400 text-center">
            ※ 본 분석은 참고용이며, 실제 투자·사업 결정의 근거로 사용하지 마세요.
          </p>
        )}
      </div>
    </div>
  )
}
