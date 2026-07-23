import { createContext, useContext, useState, type ReactNode } from 'react'
import type { DiagnoseResponse, MatchResponse } from '../api/client'

// 아이디어 입력 데이터
export interface IdeaInput {
  idea: string
  target: string
  problem: string
}

// 매칭 입력 데이터
export interface MatchInput {
  age: number
  region: string
  field: string
  stage: string
}

interface AppState {
  // Step 1: 아이디어 입력 + 진단 결과
  ideaInput: IdeaInput | null
  diagnosisResult: DiagnoseResponse | null

  // Step 2: 매칭 입력 + 매칭 결과
  matchInput: MatchInput | null
  matchResult: MatchResponse | null

  // 현재 스텝 (1: 진단, 2: 매칭, 3: 계획서)
  currentStep: number
}

interface AppContextType extends AppState {
  setIdeaInput: (input: IdeaInput) => void
  setDiagnosisResult: (result: DiagnoseResponse) => void
  setMatchInput: (input: MatchInput) => void
  setMatchResult: (result: MatchResponse) => void
  setCurrentStep: (step: number) => void
  reset: () => void
}

const initialState: AppState = {
  ideaInput: null,
  diagnosisResult: null,
  matchInput: null,
  matchResult: null,
  currentStep: 1,
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState)

  const setIdeaInput = (input: IdeaInput) => {
    setState((prev) => ({ ...prev, ideaInput: input }))
  }

  const setDiagnosisResult = (result: DiagnoseResponse) => {
    setState((prev) => ({ ...prev, diagnosisResult: result, currentStep: 2 }))
  }

  const setMatchInput = (input: MatchInput) => {
    setState((prev) => ({ ...prev, matchInput: input }))
  }

  const setMatchResult = (result: MatchResponse) => {
    setState((prev) => ({ ...prev, matchResult: result, currentStep: 3 }))
  }

  const setCurrentStep = (step: number) => {
    setState((prev) => ({ ...prev, currentStep: step }))
  }

  const reset = () => {
    setState(initialState)
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        setIdeaInput,
        setDiagnosisResult,
        setMatchInput,
        setMatchResult,
        setCurrentStep,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
