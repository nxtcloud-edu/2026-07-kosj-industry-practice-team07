import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { matchApi, type MatchResponse } from '../api/client'
import ErrorMessage from '../components/ErrorMessage'

export default function Matching() {
  const navigate = useNavigate()
  const { matchInput, setMatchInput, setMatchResult, matchResult } = useApp()

  const [age, setAge] = useState(matchInput?.age?.toString() || '')
  const [region, setRegion] = useState(matchInput?.region || '')
  const [field, setField] = useState(matchInput?.field || '')
  const [stage, setStage] = useState(matchInput?.stage || '')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<MatchResponse | null>(matchResult)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await runMatch()
  }

  const runMatch = async () => {
    if (!age || !region || !field || !stage) return
    setLoading(true)
    setResults(null)
    setError(null)
    try {
      const response = await matchApi({ age: Number(age), region, field, stage })
      setResults(response)
      setMatchInput({ age: Number(age), region, field, stage })
      setMatchResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : '서버 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Step 2</p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">지원사업 매칭</h1>
        <p className="text-sm text-gray-600 mt-2">조건을 입력하면 자격 부합 지원사업을 필터링하고 매칭 이유를 설명합니다.</p>
      </div>

      {!results && !loading && (
        <button
          type="button"
          onClick={() => { setAge('23'); setRegion('세종'); setField('교육'); setStage('예비') }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-semibold text-blue-700 transition"
        >
          ⚡ 데모 시나리오 채우기
        </button>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">나이</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="23"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">지역</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition">
              <option value="">선택</option>
              <option value="서울">서울</option>
              <option value="세종">세종</option>
              <option value="대전">대전</option>
              <option value="경기">경기</option>
              <option value="부산">부산</option>
              <option value="인천">인천</option>
              <option value="대구">대구</option>
              <option value="광주">광주</option>
              <option value="울산">울산</option>
              <option value="강원">강원</option>
              <option value="충북">충북</option>
              <option value="충남">충남</option>
              <option value="전북">전북</option>
              <option value="전남">전남</option>
              <option value="경북">경북</option>
              <option value="경남">경남</option>
              <option value="제주">제주</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">분야</label>
            <select value={field} onChange={(e) => setField(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition">
              <option value="">선택</option>
              <option value="IT">IT / 소프트웨어</option>
              <option value="교육">교육</option>
              <option value="헬스케어">헬스케어</option>
              <option value="커머스">커머스</option>
              <option value="콘텐츠">콘텐츠</option>
              <option value="제조">제조</option>
              <option value="농업">농업 / 식품</option>
              <option value="환경">환경 / 에너지</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">창업 단계</label>
            <select value={stage} onChange={(e) => setStage(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition">
              <option value="">선택</option>
              <option value="예비">예비 창업자</option>
              <option value="초기">초기 (1년 미만)</option>
              <option value="성장">성장기 (1~3년)</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !age || !region || !field || !stage}
          className="w-full py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? '매칭 중...' : '매칭 시작'}
        </button>
      </form>

      {error && <ErrorMessage message={error} onRetry={runMatch} />}

      {loading && (
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-sm text-gray-700 font-medium">조건에 맞는 사업을 찾고 있습니다...</span>
        </div>
      )}

      {results !== null && !loading && (
        <div className="mt-10">
          {results.results.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-orange-50 border border-orange-200">
              <p className="text-sm font-semibold text-gray-800 mb-1">매칭 결과가 없습니다</p>
              <p className="text-sm text-gray-600">조건을 변경해서 다시 시도해보세요.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-gray-700 font-semibold">
                  매칭 결과 <span className="text-blue-600">{results.totalCount}건</span>
                </p>
              </div>

              {results.note && (
                <p className="text-xs text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">{results.note}</p>
              )}

              <div className="space-y-4">
                {results.results.map((item, index) => (
                  <div key={index} className="p-5 rounded-xl border border-gray-200 bg-white hover:border-blue-300 transition">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{item.program.name}</h3>
                        <p className="text-xs text-gray-600 mt-0.5">{item.program.organization}</p>
                      </div>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                        최대 {item.program.maxFunding}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">마감: {item.program.deadline}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {item.matchReasons.map((reason, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md font-medium border border-emerald-200">
                          ✓ {reason}
                        </span>
                      ))}
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-xs font-semibold text-blue-600 mb-1">AI 분석</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{item.aiExplanation}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/business-plan')}
                className="w-full mt-6 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                다음: 사업계획서 작성
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
