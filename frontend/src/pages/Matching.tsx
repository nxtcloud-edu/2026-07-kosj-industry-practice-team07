import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Program {
  id: number
  name: string
  organization: string
  deadline: string
  maxFunding: string
  conditions: {
    ageRange: [number, number]
    regions: string[]
    fields: string[]
    stages: string[]
  }
}

interface MatchResult {
  program: Program
  matchReasons: string[]
  aiExplanation: string
}

// 목업 지원사업 DB (10~20개 중 샘플)
const programsDB: Program[] = [
  {
    id: 1,
    name: '청년창업사관학교',
    organization: '중소벤처기업부',
    deadline: '2026.08.15',
    maxFunding: '1억원',
    conditions: {
      ageRange: [19, 39],
      regions: ['서울', '세종', '대전', '경기', '부산'],
      fields: ['IT', '교육', '헬스케어', '커머스', '콘텐츠'],
      stages: ['예비', '초기'],
    },
  },
  {
    id: 2,
    name: '예비창업패키지',
    organization: '창업진흥원',
    deadline: '2026.08.30',
    maxFunding: '5,000만원',
    conditions: {
      ageRange: [19, 45],
      regions: ['서울', '세종', '대전', '경기', '부산'],
      fields: ['IT', '교육', '헬스케어', '커머스', '콘텐츠'],
      stages: ['예비'],
    },
  },
  {
    id: 3,
    name: '세종시 청년창업 지원사업',
    organization: '세종창업진흥원',
    deadline: '2026.09.01',
    maxFunding: '3,000만원',
    conditions: {
      ageRange: [19, 34],
      regions: ['세종'],
      fields: ['IT', '교육', '콘텐츠'],
      stages: ['예비', '초기'],
    },
  },
  {
    id: 4,
    name: 'K-Startup 에듀테크 특화 프로그램',
    organization: '과학기술정보통신부',
    deadline: '2026.08.20',
    maxFunding: '7,000만원',
    conditions: {
      ageRange: [19, 45],
      regions: ['서울', '세종', '대전', '경기', '부산'],
      fields: ['IT', '교육'],
      stages: ['예비', '초기', '성장'],
    },
  },
  {
    id: 5,
    name: '대학생 창업유망팀 300',
    organization: '교육부',
    deadline: '2026.07.31',
    maxFunding: '2,000만원',
    conditions: {
      ageRange: [19, 29],
      regions: ['서울', '세종', '대전', '경기', '부산'],
      fields: ['IT', '교육', '헬스케어', '커머스', '콘텐츠'],
      stages: ['예비'],
    },
  },
  {
    id: 6,
    name: '소셜벤처 육성사업',
    organization: '한국사회적기업진흥원',
    deadline: '2026.09.15',
    maxFunding: '4,000만원',
    conditions: {
      ageRange: [19, 45],
      regions: ['서울', '세종', '대전', '경기', '부산'],
      fields: ['교육', '헬스케어'],
      stages: ['예비', '초기'],
    },
  },
  {
    id: 7,
    name: '지역혁신 청년창업 지원',
    organization: '중소벤처기업부',
    deadline: '2026.08.10',
    maxFunding: '3,500만원',
    conditions: {
      ageRange: [19, 39],
      regions: ['세종', '대전'],
      fields: ['IT', '교육', '헬스케어', '커머스'],
      stages: ['예비', '초기'],
    },
  },
  {
    id: 8,
    name: '디지털 헬스케어 창업 지원',
    organization: '보건복지부',
    deadline: '2026.09.30',
    maxFunding: '8,000만원',
    conditions: {
      ageRange: [19, 45],
      regions: ['서울', '경기', '대전'],
      fields: ['헬스케어'],
      stages: ['초기', '성장'],
    },
  },
  {
    id: 9,
    name: '콘텐츠 스타트업 지원사업',
    organization: '문화체육관광부',
    deadline: '2026.08.25',
    maxFunding: '5,000만원',
    conditions: {
      ageRange: [19, 39],
      regions: ['서울', '세종', '대전', '경기', '부산'],
      fields: ['콘텐츠'],
      stages: ['예비', '초기'],
    },
  },
  {
    id: 10,
    name: '초기창업패키지',
    organization: '창업진흥원',
    deadline: '2026.08.05',
    maxFunding: '1억원',
    conditions: {
      ageRange: [19, 45],
      regions: ['서울', '세종', '대전', '경기', '부산'],
      fields: ['IT', '교육', '헬스케어', '커머스', '콘텐츠'],
      stages: ['초기'],
    },
  },
]

// 규칙 기반 매칭 함수
function matchPrograms(
  age: number,
  region: string,
  field: string,
  stage: string
): MatchResult[] {
  const matched: MatchResult[] = []

  for (const program of programsDB) {
    const reasons: string[] = []
    const { conditions } = program

    const ageMatch = age >= conditions.ageRange[0] && age <= conditions.ageRange[1]
    const regionMatch = conditions.regions.includes(region)
    const fieldMatch = conditions.fields.includes(field)
    const stageMatch = conditions.stages.includes(stage)

    if (ageMatch) reasons.push(`나이 조건 충족 (${conditions.ageRange[0]}~${conditions.ageRange[1]}세)`)
    if (regionMatch) reasons.push(`지역 조건 일치 (${region})`)
    if (fieldMatch) reasons.push(`분야 조건 일치 (${field})`)
    if (stageMatch) reasons.push(`창업 단계 일치 (${stage})`)

    if (ageMatch && regionMatch && fieldMatch && stageMatch) {
      const explanations: string[] = [
        `${program.name}은(는) ${program.organization}에서 운영하는 지원사업입니다.`,
        `귀하의 조건(${age}세, ${region}, ${field} 분야, ${stage} 단계)이 모두 부합합니다.`,
        `최대 ${program.maxFunding}까지 지원 가능하며, 신청 마감일은 ${program.deadline}입니다.`,
      ]

      matched.push({
        program,
        matchReasons: reasons,
        aiExplanation: explanations.join(' '),
      })
    }
  }

  return matched.slice(0, 5) // 최대 5건
}

export default function Matching() {
  const [age, setAge] = useState('')
  const [region, setRegion] = useState('')
  const [field, setField] = useState('')
  const [stage, setStage] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<MatchResult[] | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!age || !region || !field || !stage) return

    setLoading(true)
    setResults(null)

    // 매칭 시뮬레이션 (1초 딜레이)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const matched = matchPrograms(Number(age), region, field, stage)
    setResults(matched)
    setLoading(false)
  }

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                나이
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="예: 23"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                지역
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
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
              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
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
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">선택</option>
                <option value="예비">예비 창업자</option>
                <option value="초기">초기 창업자 (1년 미만)</option>
                <option value="성장">성장기 (1~3년)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !age || !region || !field || !stage}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '매칭 중...' : '매칭 시작'}
          </button>
        </form>

        {/* 로딩 */}
        {loading && (
          <div className="mt-10 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="mt-3 text-gray-500">조건에 맞는 지원사업을 찾고 있습니다...</p>
          </div>
        )}

        {/* 매칭 결과 */}
        {results !== null && !loading && (
          <div className="mt-10">
            {results.length === 0 ? (
              <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200 text-center">
                <p className="text-yellow-800 font-medium mb-2">매칭 결과가 없습니다.</p>
                <p className="text-yellow-700 text-sm">
                  조건을 완화해보세요. 지역이나 분야를 변경하면 더 많은 사업을 찾을 수 있습니다.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  매칭 결과 ({results.length}건)
                </h2>
                <div className="space-y-4">
                  {results.map((result) => (
                    <div
                      key={result.program.id}
                      className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {result.program.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {result.program.organization}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          최대 {result.program.maxFunding}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mb-3">
                        마감일: {result.program.deadline}
                      </p>

                      {/* 매칭 근거 태그 */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {result.matchReasons.map((reason, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded"
                          >
                            ✓ {reason}
                          </span>
                        ))}
                      </div>

                      {/* AI 설명 */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
                            AI 설명
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {result.aiExplanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 다음 단계 */}
                <div className="mt-8 flex gap-4">
                  <Link
                    to="/business-plan"
                    className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition text-center"
                  >
                    사업계획서 작성으로 →
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
