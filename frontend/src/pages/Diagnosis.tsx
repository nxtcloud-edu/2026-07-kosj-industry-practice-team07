import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { diagnoseApi, type DiagnoseResponse } from '../api/client'
import ErrorMessage from '../components/ErrorMessage'

export default function Diagnosis() {
  const navigate = useNavigate()
  const { ideaInput, setIdeaInput, setDiagnosisResult, diagnosisResult } = useApp()

  const [idea, setIdea] = useState(ideaInput?.idea || '')
  const [target, setTarget] = useState(ideaInput?.target || '')
  const [problem, setProblem] = useState(ideaInput?.problem || '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DiagnoseResponse | null>(diagnosisResult)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await runDiagnosis()
  }

  const runDiagnosis = async () => {
    if (!idea.trim() || !target.trim() || !problem.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const response = await diagnoseApi({ idea, target, problem })
      setResult(response)
      setIdeaInput({ idea, target, problem })
      setDiagnosisResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : '서버 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Step 1</p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">아이디어 진단</h1>
        <p className="text-sm text-gray-600 mt-2">아이디어를 입력하면 AI가 시장성, 경쟁 현황, 타깃 적합성을 분석합니다.</p>
      </div>

      {!result && !loading && (
        <button
          type="button"
          onClick={() => {
            setIdea('중고생 대상 AI 영어 튜터 앱')
            setTarget('영어 학원을 다닐 여건이 안 되는 중고등학생')
            setProblem('비용 부담으로 영어 회화 연습 기회가 부족한 학생들에게 AI 기반 1:1 영어 대화 연습을 저렴하게 제공')
          }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-semibold text-blue-700 transition"
        >
          ⚡ 데모 시나리오 채우기
        </button>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">아이디어 한 줄 설명</label>
          <input
            type="text"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="예: 중고생 대상 AI 영어 튜터 앱"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">타깃 고객</label>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="예: 영어 학원을 다닐 여건이 안 되는 중고등학생"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">해결하려는 문제</label>
          <textarea
            rows={3}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="예: 비용 부담으로 영어 회화 연습 기회가 부족한 학생들에게 저렴한 AI 튜터를 제공"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !idea.trim() || !target.trim() || !problem.trim()}
          className="w-full py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? '분석 중...' : 'AI 진단 시작'}
        </button>
      </form>

      {error && <ErrorMessage message={error} onRetry={runDiagnosis} />}

      {loading && (
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-sm text-gray-700 font-medium">AI가 분석하고 있습니다...</span>
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-5">
          <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-gray-800 leading-relaxed font-medium">{result.summary}</p>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 bg-emerald-500 rounded-full" />
              <span className="text-sm font-bold text-gray-900">강점</span>
            </div>
            <ul className="space-y-2.5">
              {result.strengths.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 leading-relaxed pl-4 border-l-2 border-emerald-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 bg-orange-500 rounded-full" />
              <span className="text-sm font-bold text-gray-900">리스크</span>
            </div>
            <ul className="space-y-2.5">
              {result.risks.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 leading-relaxed pl-4 border-l-2 border-orange-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-sm font-bold text-gray-900">보완 제안</span>
            </div>
            <ul className="space-y-2.5">
              {result.suggestions.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 leading-relaxed pl-4 border-l-2 border-blue-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => navigate('/matching')}
            className="w-full py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            다음: 지원사업 매칭
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <p className="text-xs text-gray-500 text-center">
            ※ 본 분석은 참고용이며 실제 시장 데이터와 차이가 있을 수 있습니다.
          </p>
        </div>
      )}
    </div>
  )
}
