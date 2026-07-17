"""
지원사업 데이터 로드 유틸리티
MVP 단계에서는 JSON 파일을 직접 로드하여 사용.
추후 SQLite/PostgreSQL로 전환 가능.
"""

import json
from pathlib import Path
from typing import List

# data/programs.json 경로
DATA_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "programs.json"


def load_programs() -> List[dict]:
    """지원사업 목록을 JSON 파일에서 로드"""
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


# 서버 시작 시 한 번 로드하여 메모리에 캐싱
programs_db: List[dict] = load_programs()
