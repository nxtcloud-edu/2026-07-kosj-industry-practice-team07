"""
매칭 정확도 검증 — 조건 조합 5종 테스트
각 케이스의 기대 결과를 수동으로 정의하고, 실제 매칭 결과와 비교합니다.
"""

import json
from urllib.request import urlopen, Request

BASE = "http://127.0.0.1:8000"


def post_match(age, region, field, stage):
    data = json.dumps({"age": age, "region": region, "field": field, "stage": stage}).encode()
    req = Request(f"{BASE}/api/match", data=data, headers={"Content-Type": "application/json"})
    resp = urlopen(req)
    return json.loads(resp.read())


# ──────────────────────────────────────────────
# 테스트 케이스 정의 (조건 → 기대 매칭 ID 목록)
# ──────────────────────────────────────────────

test_cases = [
    {
        "name": "케이스1: 23세/세종/IT/예비 (대표 시나리오 — 민준)",
        "input": {"age": 23, "region": "세종", "field": "IT", "stage": "예비"},
        "expected_ids": [1, 2, 3, 4, 5, 7, 13, 19],
        # 1. 청년창업사관학교 (19~39, 세종O, IT O, 예비O)
        # 2. 예비창업패키지 (19~45, 세종O, IT O, 예비O)
        # 3. 세종시 청년창업 (19~34, 세종O, IT O, 예비O)
        # 4. K-Startup 에듀테크 (19~45, 세종O, IT O, 예비O)
        # 5. 대학생 창업유망팀 (19~29, 세종O, IT O, 예비O)
        # 7. 지역혁신 청년창업 (19~39, 세종O, IT O, 예비O)
        # 13. AI·빅데이터 (19~45, 세종O, IT O, 예비O)
        # 19. 스마트 농업·식품 (19~45, 세종O, IT O, 예비O)
    },
    {
        "name": "케이스2: 40세/부산/헬스케어/성장",
        "input": {"age": 40, "region": "부산", "field": "헬스케어", "stage": "성장"},
        "expected_ids": [15],
        # 15. 여성 창업 성장패키지 (19~49, 부산O, 헬스케어O, 성장O)
        # 8번 디지털 헬스케어: 부산 미포함 → X
    },
    {
        "name": "케이스3: 25세/서울/콘텐츠/예비",
        "input": {"age": 25, "region": "서울", "field": "콘텐츠", "stage": "예비"},
        "expected_ids": [1, 2, 5, 9, 11, 18],
        # 1. 청년창업사관학교 (서울O, 콘텐츠O, 예비O, 25세O)
        # 2. 예비창업패키지 (서울O, 콘텐츠O, 예비O)
        # 5. 대학생 창업유망팀 (서울O, 콘텐츠O, 예비O, 25세O)
        # 9. 콘텐츠 스타트업 (서울O, 콘텐츠O, 예비O, 25세O)
        # 11. 서울시 청년 스타트업 (서울O, 콘텐츠O, 예비O, 25세O)
        # 18. 문화콘텐츠 신진작가 (서울O, 콘텐츠O, 예비O, 19~34)
    },
    {
        "name": "케이스4: 30세/대전/IT/초기",
        "input": {"age": 30, "region": "대전", "field": "IT", "stage": "초기"},
        "expected_ids": [1, 4, 7, 10, 13, 16, 19],
        # 1. 청년창업사관학교 (대전O, IT O, 초기O, 19~39)
        # 4. K-Startup 에듀테크 (대전O, IT O, 초기O)
        # 7. 지역혁신 청년창업 (대전O, IT O, 초기O, 19~39)
        # 10. 초기창업패키지 (대전O, IT O, 초기O)
        # 13. AI·빅데이터 (대전O, IT O, 초기O)
        # 16. 대전 과학기술 (대전O, IT O, 초기O)
        # 19. 스마트 농업·식품 (대전O, IT O, 초기O)
    },
    {
        "name": "케이스5: 35세/경기/커머스/예비",
        "input": {"age": 35, "region": "경기", "field": "커머스", "stage": "예비"},
        "expected_ids": [1, 2],
        # 1. 청년창업사관학교 (경기O, 커머스O, 예비O, 19~39)
        # 2. 예비창업패키지 (경기O, 커머스O, 예비O)
        # 5번: 19~29 → 35세 X
        # 14번: 19~34 → 35세 X
    },
]


# ──────────────────────────────────────────────
# 테스트 실행
# ──────────────────────────────────────────────

def run_tests():
    print("=" * 60)
    print("매칭 정확도 검증 — 조건 조합 5종")
    print("=" * 60)

    total_pass = 0

    for i, case in enumerate(test_cases, 1):
        inp = case["input"]
        result = post_match(inp["age"], inp["region"], inp["field"], inp["stage"])
        actual_ids = [m["program"]["id"] for m in result["results"]]
        expected = sorted(case["expected_ids"])

        # 최대 5건 반환이므로 expected도 상위 5건까지만 비교
        expected_top5 = expected[:5]
        actual_sorted = sorted(actual_ids)

        # 정확도: actual이 expected에 포함되는 비율
        correct = [x for x in actual_ids if x in expected]
        accuracy = len(correct) / max(len(actual_ids), 1) * 100

        passed = set(actual_ids).issubset(set(expected))
        status = "✅ PASS" if passed else "⚠️ CHECK"
        if passed:
            total_pass += 1

        print(f"\n[{i}] {case['name']}")
        print(f"    입력: {inp}")
        print(f"    기대 (전체): {expected}")
        print(f"    실제 (최대5): {actual_ids}")
        print(f"    정확도: {accuracy:.0f}% ({len(correct)}/{len(actual_ids)}건 일치)")
        print(f"    결과: {status}")

    print("\n" + "=" * 60)
    print(f"총 결과: {total_pass}/5 통과")
    if total_pass >= 4:
        print("→ 매칭 정확도 80% 이상 달성! ✅")
    else:
        print("→ 매칭 로직 또는 데이터 수정 필요 ⚠️")
    print("=" * 60)


if __name__ == "__main__":
    run_tests()
