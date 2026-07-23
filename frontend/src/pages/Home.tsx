import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Home() {
  const { reset } = useApp()

  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <span className="text-base font-bold tracking-tight text-gray-900">
            StartUp Copilot
          </span>
          <div className="flex items-center gap-6">
            <Link to="/checklist" className="text-sm text-gray-700 hover:text-gray-900 transition font-medium">
              체크리스트
            </Link>
            <Link
              to="/diagnosis"
              onClick={reset}
              className="text-sm font-semibold text-white bg-blue-600 px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
            >
              시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* 히어로 */}
      <section className="pt-40 pb-24 px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-blue-600 mb-5 tracking-wide">
            AI 기반 창업 지원 플랫폼
          </p>
          <h1 className="text-[3.2rem] leading-[1.15] font-bold text-gray-900 tracking-tight mb-6">
            아이디어부터<br />
            사업계획서까지
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed mb-10">
            진단, 매칭, 작성. 세 단계로 예비창업자의<br />
            막연한 아이디어를 구체적인 행동으로 바꿉니다.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/diagnosis"
              onClick={reset}
              className="px-7 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:-translate-y-px"
            >
              무료로 시작하기
            </Link>
            <Link
              to="/checklist"
              className="px-7 py-3.5 text-gray-700 text-sm font-semibold rounded-xl border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              준비 가이드
            </Link>
          </div>
        </div>
      </section>

      {/* 3단계 */}
      <section className="pb-32 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-xs font-bold text-blue-600">01</span>
              <h3 className="text-lg font-bold text-gray-900 mt-3 mb-3">아이디어 진단</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                시장성과 경쟁 현황을 AI가 분석합니다. 강점, 리스크, 개선 방향을 리포트로 제공합니다.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-xs font-bold text-blue-600">02</span>
              <h3 className="text-lg font-bold text-gray-900 mt-3 mb-3">지원사업 매칭</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                나이, 지역, 분야 조건으로 정부 지원사업을 필터링합니다. 매칭 근거를 함께 보여줍니다.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-xs font-bold text-blue-600">03</span>
              <h3 className="text-lg font-bold text-gray-900 mt-3 mb-3">사업계획서 작성</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                진단 결과를 바탕으로 5개 섹션의 초안을 생성합니다. 직접 수정하고 PDF로 저장할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-8 flex items-center justify-between">
          <span className="text-xs text-gray-500">© 2026 StartUp Copilot</span>
          <span className="text-xs text-gray-500">AI 결과는 참고용이며 전문 컨설팅을 대체하지 않습니다</span>
        </div>
      </footer>
    </div>
  )
}
