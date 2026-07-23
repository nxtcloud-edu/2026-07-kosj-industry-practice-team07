interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const isColdStart =
    message.includes('Failed to fetch') ||
    message.includes('NetworkError') ||
    message.includes('Load failed') ||
    message.includes('서버 오류')

  return (
    <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200">
      <div className="flex items-start gap-3">
        <span className="text-red-500 text-lg mt-0.5">⚠</span>
        <div className="flex-1">
          {isColdStart ? (
            <>
              <p className="text-sm font-semibold text-gray-800">서버가 준비 중입니다</p>
              <p className="text-sm text-gray-600 mt-1">무료 서버는 절전 모드에서 깨어나는 데 30초~1분 정도 걸립니다. 잠시 후 다시 시도해주세요.</p>
            </>
          ) : (
            <p className="text-sm text-gray-700">{message}</p>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
            >
              ↻ 다시 시도
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
