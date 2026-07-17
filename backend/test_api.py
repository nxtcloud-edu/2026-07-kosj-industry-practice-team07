"""API 동작 테스트 스크립트"""
import json
from urllib.request import urlopen, Request

BASE = "http://127.0.0.1:8000"


def post(path, data):
    req = Request(
        f"{BASE}{path}",
        data=json.dumps(data).encode(),
        headers={"Content-Type": "application/json"},
    )
    resp = urlopen(req)
    return resp.status, json.loads(resp.read())


# 1. Health
print("=" * 50)
print("[1] GET /health")
resp = urlopen(f"{BASE}/health")
print(f"  Status: {resp.status}")
print(f"  Body: {json.loads(resp.read())}")

# 2. 매칭 API
print("\n" + "=" * 50)
print("[2] POST /api/match")
status, result = post("/api/match", {
    "age": 23,
    "region": "세종",
    "field": "IT",
    "stage": "예비",
})
print(f"  Status: {status}")
print(f"  Total: {result['totalCount']}")
print(f"  Note: {result['note']}")
for m in result["results"]:
    print(f"    - {m['program']['name']} | {m['matchReasons'][0]}")

# 3. 진단 API (폴백 모드)
print("\n" + "=" * 50)
print("[3] POST /api/diagnose (fallback)")
status, result = post("/api/diagnose", {
    "idea": "중고생 대상 AI 영어 튜터 앱",
    "target": "중학생 1~3학년",
    "problem": "학원비 부담 없이 개인화된 영어 회화 연습이 필요함",
})
print(f"  Status: {status}")
print(f"  Summary: {result['summary']}")
print(f"  Strengths: {len(result['strengths'])}개")
print(f"  Risks: {len(result['risks'])}개")
print(f"  Suggestions: {len(result['suggestions'])}개")

# 4. 사업계획서 API (폴백 모드)
print("\n" + "=" * 50)
print("[4] POST /api/plan (fallback)")
status, result = post("/api/plan", {
    "idea": "중고생 대상 AI 영어 튜터 앱",
    "target": "중학생 1~3학년",
    "problem": "학원비 부담 없이 개인화된 영어 회화 연습이 필요함",
    "diagnosisSummary": "개인화 교육 수요 증가, 유사 서비스 다수",
})
print(f"  Status: {status}")
print(f"  Sections: {len(result['sections'])}개")
for s in result["sections"]:
    print(f"    - {s['title']} (AI: {s['isAIGenerated']})")
print(f"  Disclaimer: {result['disclaimer']}")

print("\n" + "=" * 50)
print("모든 API 테스트 통과!")
