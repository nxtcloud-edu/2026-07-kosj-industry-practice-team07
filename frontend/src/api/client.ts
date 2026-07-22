/**
 * 백엔드 API 클라이언트
 *
 * 사용법:
 *   import { diagnosApi, matchApi, planApi } from '../api/client'
 *
 * 환경변수:
 *   VITE_API_URL — 백엔드 서버 주소 (기본: http://localhost:8000)
 *   .env.local 에 설정하거나, Vercel 환경변수에 등록
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ──────────────────────────────────────────────
// 타입 정의
// ──────────────────────────────────────────────

export interface DiagnoseRequest {
  idea: string
  target: string
  problem: string
}

export interface DiagnoseResponse {
  strengths: string[]
  risks: string[]
  suggestions: string[]
  summary: string
}

export interface MatchRequest {
  age: number
  region: string
  field: string
  stage: string
}

export interface ProgramConditions {
  ageRange: number[]
  regions: string[]
  fields: string[]
  stages: string[]
}

export interface ProgramInfo {
  id: number
  name: string
  organization: string
  deadline: string
  maxFunding: string
  conditions: ProgramConditions
}

export interface MatchResultItem {
  program: ProgramInfo
  matchReasons: string[]
  aiExplanation: string
}

export interface MatchResponse {
  results: MatchResultItem[]
  totalCount: number
  note: string
}

export interface PlanRequest {
  idea: string
  target: string
  problem: string
  diagnosisSummary?: string
}

export interface PlanSection {
  title: string
  content: string
  isAIGenerated: boolean
}

export interface PlanResponse {
  sections: PlanSection[]
  disclaimer: string
}

// ──────────────────────────────────────────────
// API 함수
// ──────────────────────────────────────────────

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: '서버 오류' }))
    throw new Error(error.detail || error.error || `HTTP ${res.status}`)
  }

  return res.json()
}

/** 아이디어 진단 API */
export async function diagnoseApi(data: DiagnoseRequest): Promise<DiagnoseResponse> {
  return post<DiagnoseResponse>('/api/diagnose', data)
}

/** 지원사업 매칭 API */
export async function matchApi(data: MatchRequest): Promise<MatchResponse> {
  return post<MatchResponse>('/api/match', data)
}

/** 사업계획서 초안 생성 API */
export async function planApi(data: PlanRequest): Promise<PlanResponse> {
  return post<PlanResponse>('/api/plan', data)
}
