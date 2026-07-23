import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { planApi, type PlanResponse } from '../api/client'
import ErrorMessage from '../components/ErrorMessage'

interface EditableSection {
  title: string
  content: string
  isAIGenerated: boolean
  isEdited: boolean
}

export default function BusinessPlan() {
  const { ideaInput, diagnosisResult } = useApp()

  const [sections, setSections] = useState<EditableSection[]>([])
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [disclaimer, setDisclaimer] = useState('')

  const [manualIdea, setManualIdea] = useState(ideaInput?.idea || '')
  const [manualTarget, setManualTarget] = useState(ideaInput?.target || '')
  const [manualProblem, setManualProblem] = useState(ideaInput?.problem || '')

  const hasContext = !!ideaInput && !!diagnosisResult

  const handleGenerate = async () => {
    const idea = hasContext ? ideaInput.idea : manualIdea
    const target = hasContext ? ideaInput.target : manualTarget
    const problem = hasContext ? ideaInput.problem : manualProblem
    if (!idea.trim() || !target.trim() || !problem.trim()) return

    setLoading(true)
    setError(null)
    try {
      const response: PlanResponse = await planApi({
        idea, target, problem,
        diagnosisSummary: diagnosisResult?.summary || undefined,
      })
      setSections(response.sections.map((s) => ({
        title: s.title, content: s.content, isAIGenerated: s.isAIGenerated, isEdited: false,
      })))
      setDisclaimer(response.disclaimer)
      setGenerated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '서버 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleContentChange = (index: number, newContent: string) => {
    setSections((prev) => prev.map((s, i) => i === index ? { ...s, content: newContent, isEdited: true } : s))
  }

  const handleDownloadPDF = () => {
    const printContent = sections
      .map((s, i) => `<h2 style="margin-top:32px;font-size:16px;color:#111;border-bottom:1px solid #ddd;padding-bottom:8px;">${i + 1}. ${s.title}</h2><p style="white-space:pre-wrap;line-height:1.9;color:#333;font-size:13px;">${s.content}</p>`)
      .join('')
    const w = window.open('', '_blank')
    if (w) {
      w.document.write(`<html><head><title>사업계획서</title><style>body{font-family:system-ui,sans-serif;max-width:700px;margin:48px auto;padding:24px;}h1{text-align:center;font-size:22px;margin-bottom:48px;}</style></head><body><h1>사업계획서</h1>${printContent}<p style="margin-top:48px;font-size:11px;color:#888;text-align:center;">${disclaimer}</p></body></html>`)
      w.document.close()
      w.print()
    }
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Step 3</p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">사업계획서 작성</h1>
        <p className="text-sm text-gray-600 mt-2">AI가 생성한 초안을 섹션별로 검토하고 수정할 수 있습니다.</p>
      </div>

      {hasContext && !generated && !loading && (
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs font-bold text-blue-700 mb-2">✓ 이전 단계 데이터 자동 반영</p>
          <p className="text-sm text-gray-700"><span className="font-semibold">아이디어:</span> {ideaInput.idea}</p>
          <p className="text-sm text-gray-700"><span className="font-semibold">타깃:</span> {ideaInput.target}</p>
        </div>
      )}

      {!hasContext && !generated && !loading && (
        <div className="mb-6 space-y-3 p-5 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-700 font-medium mb-2">아이디어 정보를 입력해주세요</p>
          <input type="text" value={manualIdea} onChange={(e) => setManualIdea(e.target.value)} placeholder="아이디어"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition" />
          <input type="text" value={manualTarget} onChange={(e) => setManualTarget(e.target.value)} placeholder="타깃 고객"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition" />
          <textarea rows={2} value={manualProblem} onChange={(e) => setManualProblem(e.target.value)} placeholder="해결하려는 문제"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition resize-none" />
        </div>
      )}

      {!generated && !loading && (
        <button onClick={handleGenerate}
          disabled={hasContext ? false : !manualIdea.trim() || !manualTarget.trim() || !manualProblem.trim()}
          className="w-full py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          AI 사업계획서 초안 생성
        </button>
      )}

      {error && <ErrorMessage message={error} onRetry={handleGenerate} />}

      {loading && (
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-sm text-gray-700 font-medium">사업계획서를 작성하고 있습니다...</span>
          </div>
          <p className="mt-3 text-xs text-gray-500">문제 정의 → 해결 방안 → 시장 분석 → 수익 모델 → 팀 구성</p>
        </div>
      )}

      {generated && !loading && (
        <>
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div key={index} className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
                  <span className="text-sm font-bold text-gray-800">{index + 1}. {section.title}</span>
                  {section.isEdited ? (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">수정됨</span>
                  ) : section.isAIGenerated ? (
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">AI 생성</span>
                  ) : null}
                </div>
                <textarea
                  rows={7}
                  value={section.content}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  className="w-full px-5 py-4 text-sm text-gray-800 leading-relaxed outline-none resize-y focus:bg-blue-50/30 transition border-0"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button onClick={() => { setGenerated(false); setSections([]) }}
              className="py-3.5 text-sm font-semibold text-gray-700 rounded-xl border border-gray-300 hover:bg-gray-50 transition">
              다시 생성
            </button>
            <button onClick={handleDownloadPDF}
              className="py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition">
              PDF 저장
            </button>
          </div>

          {disclaimer && <p className="mt-4 text-xs text-gray-500 text-center">{disclaimer}</p>}
        </>
      )}
    </div>
  )
}
