import { useState } from 'react'

interface CheckItem {
  id: number
  title: string
  description: string
}

const items: CheckItem[] = [
  { id: 1, title: '아이디어 구체화', description: '"누구의, 어떤 문제를, 어떻게 해결"을 한 문장으로 정리' },
  { id: 2, title: '시장·경쟁 조사', description: '유사 서비스 3~5개 비교 및 차별점 정리' },
  { id: 3, title: '지원사업 탐색', description: '나이·지역·분야 조건에 맞는 공고 확인' },
  { id: 4, title: '사업계획서 초안', description: '문제-해결-시장-수익-팀 5섹션 구조로 작성' },
  { id: 5, title: '피드백 받기', description: '주변 3명 이상에게 공유하고 피드백 반영' },
  { id: 6, title: '지원서 제출', description: '마감 2일 전까지 서류 확인 후 제출' },
]

export default function Checklist() {
  const [checked, setChecked] = useState<Set<number>>(new Set())

  const toggle = (id: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const progress = Math.round((checked.size / items.length) * 100)

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">Guide</p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">창업 준비 체크리스트</h1>
        <p className="text-sm text-gray-600 mt-2">아이디어부터 지원서 제출까지 6단계로 정리했습니다.</p>
      </div>

      {/* 진행률 */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-sm font-bold text-gray-700">{checked.size}/{items.length}</span>
      </div>

      {/* 리스트 */}
      <div className="space-y-2">
        {items.map((item) => {
          const done = checked.has(item.id)
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition border ${
                done ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition ${
                done ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
              }`}>
                {done && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${done ? 'text-blue-700 line-through' : 'text-gray-900'}`}>
                  {item.title}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">{item.description}</p>
              </div>
              <span className="text-xs font-bold text-gray-400">{String(item.id).padStart(2, '0')}</span>
            </button>
          )
        })}
      </div>

      <p className="mt-8 text-xs text-gray-500 text-center">
        ※ 개인 상황에 따라 순서나 내용이 달라질 수 있습니다.
      </p>
    </div>
  )
}
