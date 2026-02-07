# 🎯 금융시황 조회 시스템 - Claude Code Agent

yfinance 기반 글로벌 금융시장 데이터를 실시간으로 조회하고 분석하는 Streamlit 웹 대시보드 시스템입니다.

## 📊 시스템 개요

**대상 사용자:** 퇴직연금/사모 OCIO 펀드 매니저

**핵심 기능:**
- yfinance를 통한 글로벌 시장 데이터 수집 (주식, 지수, ETF, 채권, 환율)
- 수익률, 변동성, 상관관계 등 투자 지표 계산
- Streamlit + Plotly 기반 인터랙티브 대시보드
- 실시간 KPI 모니터링 및 차트 시각화

## 📁 파일 구조

```
.
├── financial-dashboard-agent.md          # Main Orchestrator
├── market-data-agent.md                  # 데이터 수집 Agent
├── dashboard-builder-agent.md            # 대시보드 Agent
├── market-data-skill.md                  # yfinance 데이터 가이드
├── web-dashboard-skill.md                # Streamlit 대시보드 가이드
└── README.md                             # 이 파일
```

## 🚀 Claude Code에서 사용하기

### 1. 프로젝트 생성

```bash
# 프로젝트 디렉토리 생성
mkdir financial-dashboard
cd financial-dashboard
```

### 2. 파일 배치

다운로드한 파일들을 다음과 같이 배치:

```
financial-dashboard/
├── .claud/
│   ├── agent.md                          # financial-dashboard-agent.md
│   ├── subagents/
│   │   ├── market-data-agent.md
│   │   └── dashboard-builder-agent.md
│   └── skills/
│       ├── market-data-skill/
│       │   └── SKILL.md                  # market-data-skill.md
│       └── web-dashboard-skill/
│           └── SKILL.md                  # web-dashboard-skill.md
```

### 3. Claude Code 실행

```bash
claude
```

### 4. 대시보드 생성 요청

프롬프트 예시:

```
"S&P500, NASDAQ, KOSPI를 비교하는 금융시황 대시보드를 만들어줘.
1년 치 데이터로 가격 차트, 수익률 비교, 상관관계를 보여주는 Streamlit 앱이 필요해."
```

```
"미국 주요 지수 대시보드 만들어줘"
```

```
"글로벌 자산배분 모니터링 대시보드 만들어줘.
미국주식(SPY), 선진국(EFA), 이머징(EEM), 채권(AGG), 금(GLD) 포함.
상관관계와 변동성 분석도 보여줘."
```

### 5. 앱 실행

```bash
# 패키지 설치
pip install streamlit plotly yfinance pandas numpy

# Streamlit 앱 실행
streamlit run market_dashboard.py
```

브라우저가 자동으로 열리며 `http://localhost:8501`에서 대시보드를 확인할 수 있습니다.

## 💡 주요 기능

### 데이터 수집 (Market Data Agent)
- yfinance를 통한 시장 데이터 다운로드
- 주식, 지수, ETF, 채권, 환율 지원
- 수익률, 변동성, 샤프비율 계산
- 이동평균, RSI, 볼린저밴드 등 기술적 지표
- 상관관계 분석
- 최대 낙폭(MDD) 계산

### 대시보드 (Dashboard Builder Agent)
- KPI 메트릭 카드 (가격, 수익률, 변동성)
- 가격 추이 차트 (Plotly 인터랙티브)
- 수익률 비교 차트 (정규화)
- 상관관계 히트맵
- 통계 요약 테이블
- CSV 다운로드 기능

## 🎨 커스터마이징

### 티커 추가

사이드바에서 종목 선택 또는 코드 수정:

```python
tickers = ['SPY', 'QQQ', '새로운티커']
```

### 기간 변경

```python
period_options = {
    '2주': 14,
    '5년': 1825,
    # 추가 옵션
}
```

### 차트 스타일

```python
fig.update_layout(
    template='plotly_dark',  # 다크 모드
    font=dict(size=14)
)
```

## 📋 지원 티커 심볼

**미국 주식:**
- SPY (S&P500 ETF)
- QQQ (NASDAQ ETF)
- DIA (Dow Jones ETF)

**미국 지수:**
- ^GSPC (S&P 500)
- ^IXIC (NASDAQ)
- ^DJI (Dow Jones)

**한국:**
- ^KS11 (KOSPI)
- ^KQ11 (KOSDAQ)

**채권:**
- TLT (장기채)
- IEF (중기채)
- SHY (단기채)

**환율:**
- USDKRW=X (달러/원)
- EURUSD=X (유로/달러)

**원자재:**
- GLD (금)
- USO (원유)

## 🛠️ 기술 스택

- **Python 3.8+**
- **Streamlit**: 웹 대시보드 프레임워크
- **Plotly**: 인터랙티브 차트
- **yfinance**: 금융 데이터 수집
- **Pandas**: 데이터 처리
- **NumPy**: 수치 계산

## 📝 코드 작성 스타일

이 시스템은 **선형적이고 읽기 쉬운 코드**를 생성합니다:

```python
# ✅ 선호하는 패턴
# === 데이터 수집 ===
data = yf.download('SPY', start='2023-01-01', end='2024-01-01')

# === 수익률 계산 ===
returns = data['Adj Close'].pct_change()
cumulative = (1 + returns).cumprod() - 1

# === 변동성 계산 ===
volatility = returns.std() * np.sqrt(252)
```

**핵심 원칙:**
- 함수는 재사용 또는 순수 계산에만 사용
- 시간 흐름을 명확하게 (위→아래)
- 섹션 주석으로 구분
- 과도한 모듈화 지양

## ⚠️ 주의사항

1. **네트워크 연결**: yfinance는 인터넷 연결 필요
2. **데이터 제한**: yfinance 무료 버전 사용 (실시간 지연 가능)
3. **캐싱**: 동일 데이터 재요청 시 1시간 캐시 활용
4. **에러 처리**: 잘못된 티커, 빈 데이터 등 자동 처리

## 🤝 기여

이 시스템은 Claude Code Agent 기반으로 동작하며, 필요에 따라 Agent와 Skill을 수정하여 기능을 확장할 수 있습니다.

## 📞 문의

- Claude Code 문서: https://docs.anthropic.com
- yfinance 문서: https://github.com/ranaroussi/yfinance
- Streamlit 문서: https://docs.streamlit.io

---

**준비 완료! 금융시황 조회 시스템을 시작하세요.** 🚀
