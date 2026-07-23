import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import type { ReactNode } from 'react'

const steps = [
  { path: '/diagnosis', label: '진단', number: 1 },
  { path: '/matching', label: '매칭', number: 2 },
  { path: '/business-plan', label: '계획서', number: 3 },
]

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { currentStep, reset } = useApp()
  const currentPath = location.pathname

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <Link to="/" onClick={reset} className="text-base font-bold tracking-tight text-gray-900 hover:text-blue-600 transition">
            StartUp Copilot
          </Link>
          <div className="flex items-center gap-1">
            {steps.map((step, index) => {
              const isActive = currentPath === step.path
              const isCompleted = step.number < currentStep
              const isAccessible = step.number <= currentStep

              return (
                <div key={step.path} className="flex items-center">
                  {index > 0 && (
                    <div className={`w-6 h-0.5 mx-1 rounded ${isCompleted ? 'bg-blue-400' : 'bg-gray-200'}`} />
                  )}
                  {isAccessible ? (
                    <Link
                      to={step.path}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : isCompleted
                            ? 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                            : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        isActive ? 'bg-white/30 text-white' : isCompleted ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {isCompleted ? '✓' : step.number}
                      </span>
                      {step.label}
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-400 cursor-not-allowed">
                      <span className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center bg-gray-100 text-gray-400">
                        {step.number}
                      </span>
                      {step.label}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </header>

      <main className="pt-28 pb-20 px-8">
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </main>

      <footer className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-6 text-center text-xs text-gray-500">
          ※ AI 분석 결과는 참고용이며, 투자·사업 결정의 근거로 사용하지 마세요.
        </div>
      </footer>
    </div>
  )
}
