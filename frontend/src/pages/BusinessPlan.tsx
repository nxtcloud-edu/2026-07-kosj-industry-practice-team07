import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Section {
  title: string
  content: string
  isAIGenerated: boolean
  isEdited: boolean
}

// 목업: AI 초안 생성 (나중에 백엔드 API로 교체)
function generateMockDraft(): Section[] {
  return [
    {
      title: '문제 정의',
      content: `중고등학생의 영어 회화 학습 기회는 학원비(월 30~50만원)라는 비용 장벽으로 인해 심각하게 제한되어 있습니다. 특히 비수도권 지역의 학생들은 원어민 강사 접근성이 낮아, 학습 격차가 심화되고 있습니다.\n\n기존 영어 학습 앱(듀오링고, 스픽 등)은 존재하지만, 중고생의 교과과정과 연계된 맞춤형 회화 연습을 제공하는 서비스는 부족한 상황입니다.`,
      isAIGenerated: true,
      isEdited: false,
    },
    {
      title: '해결 방안',
      content: `AI 기반 영어 튜터 앱을 통해 학생들이 시간과 장소에 구애받지 않고 1:1 영어 회화 연습을 할 수 있도록 합니다.\n\n핵심 기능:\n• AI 음성 대화: 교과서 단원별 주제로 자연스러운 영어 대화 연습\n• 발음 피드백: 실시간 발음 분석 및 교정 제안\n• 학습 리포트: 학부모에게 주간 학습 현황 리포트 제공\n• 수준별 맞춤: 학생의 실력에 맞춰 난이도 자동 조절`,
      isAIGenerated: true,
      isEdited: false,
    },
    {
      title: '시장 분석',
      content: `국내 에듀테크 시장은 지속 성장하고 있으며, 특히 AI 기반 어학 학습 분야의 성장세가 두드러집니다.\n\n• 타깃 시장: 중고등학생 약 270만명 중 영어 사교육 참여 학생\n• 경쟁 서비스: 스픽(성인 대상), 듀오링고(범용), AI 튜터(기업 대상) 등 존재\n• 차별점: 중고생 교과과정 연계 + 학부모 리포트 + 저렴한 가격(월 9,900원)\n\n※ 위 수치는 참고용이며, 실제 시장 조사를 통해 검증이 필요합니다.`,
      isAIGenerated: true,
      isEdited: false,
    },
    {
      title: '수익 모델',
      content: `프리미엄 구독 모델(Freemium)을 기본 수익 구조로 설계합니다.\n\n• 무료 플랜: 하루 10분 AI 대화, 기본 발음 피드백\n• 프리미엄 플랜 (월 9,900원): 무제한 대화, 상세 발음 분석, 학부모 리포트, 교과 연계 커리큘럼\n• B2B 모델: 학교/학원 단체 라이선스 (학생당 월 5,000원)\n\n초기에는 B2C 프리미엄 구독으로 시작하고, 이용자 확보 후 B2B로 확장합니다.`,
      isAIGenerated: true,
      isEdited: false,
    },
    {
      title: '팀 구성',
      content: `• 대표/기획: 교육 서비스 기획 경험, 중고생 학습 패턴 이해\n• 개발 (프론트엔드): React Native 모바일 앱 개발\n• 개발 (백엔드/AI): 음성 인식·합성 AI 모델 연동, 서버 구축\n• 콘텐츠: 영어 교육 전문가, 교과과정 연계 스크립트 설계\n\n현재 핵심 개발 인력은 확보되었으며, 콘텐츠 전문가는 MVP 완료 후 영입 예정입니다.`,
      isAIGenerated: true,
      isEdited: false,
    },
  ]
}

export default function BusinessPlan() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    // 2초 딜레이로 AI 생성 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSections(generateMockDraft())
    setGenerated(true)
    setLoading(false)
  }

  const handleContentChange = (index: number, newContent: string) => {
    setSections((prev) =>
      prev.map((section, i) =>
        i === index
          ? { ...section, content: newContent, isEdited: true }
          : section
      )
    )
  }

  const handleDownloadPDF = () => {
    // 브라우저 인쇄 기반 PDF 저장
    const printContent = sections
      .map(
        (s, i) =>
          `<h2 style="margin-top:24px;color:#1a1a1a;">${i + 1}. ${s.title}</h2><p style="white-space:pre-wrap;line-height:1.8;color:#333;">${s.content}</p>`
      )
      .join('')

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>사업계획서</title>
            <style>
              body { font-family: 'Pretendard', system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
              h1 { text-align: center; margin-bottom: 40px; }
              h2 { border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
            </style>
          </head>
          <body>
            <h1>사업계획서</h1>
            ${printContent}
            <p style="margin-top:40px;font-size:12px;color:#999;text-align:center;">
              ※ AI 생성 텍스트가 포함되어 있습니다. 참고용으로만 활용하세요.
            </p>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

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

        {/* 초안 생성 전 */}
        {!generated && !loading && (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-500 mb-4">
              아이디어 진단 결과를 바탕으로 사업계획서 초안을 생성합니다.
            </p>
            <button
              onClick={handleGenerate}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              AI 초안 생성
            </button>
          </div>
        )}

        {/* 로딩 */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="mt-4 text-gray-500">
              AI가 사업계획서 초안을 작성하고 있습니다...
            </p>
            <p className="mt-2 text-sm text-gray-400">
              문제 정의 → 해결 방안 → 시장 분석 → 수익 모델 → 팀 구성
            </p>
          </div>
        )}

        {/* 생성된 섹션들 */}
        {generated && !loading && (
          <>
            <div className="space-y-6">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {index + 1}. {section.title}
                    </h2>
                    <div className="flex gap-2">
                      {section.isAIGenerated && !section.isEdited && (
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                          AI 생성
                        </span>
                      )}
                      {section.isEdited && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                          직접 수정
                        </span>
                      )}
                    </div>
                  </div>
                  <textarea
                    rows={8}
                    value={section.content}
                    onChange={(e) => handleContentChange(index, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y text-sm leading-relaxed"
                  />
                </div>
              ))}
            </div>

            {/* 하단 버튼들 */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleGenerate}
                className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                초안 다시 생성
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition border border-gray-300"
              >
                PDF 다운로드
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-400 text-center">
              ※ AI 생성 텍스트는 참고용입니다. 반드시 직접 검토·수정 후 사용하세요.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
