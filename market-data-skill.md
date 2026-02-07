# Market Data Skill

---
name: market-data-skill
description: |
  yfinance API를 활용한 금융 시장 데이터 수집 및 분석 가이드.
  
  사용 시점:
  - 주식, 지수, ETF 가격 데이터 조회 시
  - 수익률, 변동성, 상관관계 계산 시
  - 기술적 지표 (이동평균, RSI) 생성 시
---

## 기능

### 1. yfinance 데이터 수집

**기본 사용법:**
```python
import yfinance as yf

# 단일 티커
ticker = yf.Ticker("AAPL")
hist = ticker.history(period="1y")

# 다중 티커
data = yf.download(['SPY', 'QQQ', 'IEF'], 
                   start='2023-01-01', 
                   end='2024-01-01',
                   progress=False)
```

**주요 티커 심볼:**
- 미국 주식: SPY (S&P500), QQQ (NASDAQ), DIA (Dow)
- 미국 지수: ^GSPC (S&P500), ^IXIC (NASDAQ), ^DJI (Dow)
- 한국: ^KS11 (KOSPI), ^KQ11 (KOSDAQ)
- 채권: TLT (장기채), IEF (중기채), SHY (단기채)
- 환율: USDKRW=X, EURUSD=X
- 원자재: GLD (금), USO (원유)

### 2. 수익률 계산

```python
import pandas as pd
import numpy as np

# === 일간 수익률 ===
prices = data['Adj Close']
daily_returns = prices.pct_change().dropna()

# === 누적 수익률 ===
cumulative_returns = (1 + daily_returns).cumprod() - 1

# === 기간별 수익률 ===
# 1개월 (21 거래일)
monthly_return = (prices.iloc[-1] / prices.iloc[-21] - 1) * 100

# 1년
annual_return = (prices.iloc[-1] / prices.iloc[0] - 1) * 100

# === 연율화 수익률 ===
days = len(daily_returns)
annualized_return = (1 + cumulative_returns.iloc[-1]) ** (252 / days) - 1
```

### 3. 변동성 계산

```python
# === 역사적 변동성 (연율화) ===
volatility_annual = daily_returns.std() * np.sqrt(252)

# === 롤링 변동성 (30일) ===
rolling_vol = daily_returns.rolling(window=30).std() * np.sqrt(252)

# === 샤프 비율 ===
risk_free_rate = 0.04  # 4% 가정
sharpe_ratio = (annualized_return - risk_free_rate) / volatility_annual
```

### 4. 기술적 지표

```python
# === 이동평균 ===
sma_20 = prices.rolling(window=20).mean()
sma_50 = prices.rolling(window=50).mean()
sma_200 = prices.rolling(window=200).mean()
ema_20 = prices.ewm(span=20, adjust=False).mean()

# === RSI (Relative Strength Index) ===
def calculate_rsi(prices, period=14):
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

rsi = calculate_rsi(prices)

# === 볼린저 밴드 ===
bb_middle = prices.rolling(window=20).mean()
bb_std = prices.rolling(window=20).std()
bb_upper = bb_middle + (bb_std * 2)
bb_lower = bb_middle - (bb_std * 2)
```

### 5. 상관관계 분석

```python
# === 상관계수 매트릭스 ===
correlation_matrix = daily_returns.corr()

# === 특정 기간 상관관계 ===
recent_corr = daily_returns.tail(60).corr()  # 최근 60일

# === 롤링 상관관계 ===
rolling_corr = daily_returns['SPY'].rolling(window=60).corr(daily_returns['QQQ'])
```

### 6. 최대 낙폭 (MDD)

```python
# === Maximum Drawdown ===
cumulative = (1 + daily_returns).cumprod()
running_max = cumulative.cummax()
drawdown = (cumulative - running_max) / running_max
max_drawdown = drawdown.min()

# MDD 발생 시점 찾기
mdd_idx = drawdown.idxmin()
peak_idx = cumulative[:mdd_idx].idxmax()
```

## 예제

### 예제 1: S&P500 1년 분석

```python
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# === 설정 ===
ticker = 'SPY'
end_date = datetime.now()
start_date = end_date - timedelta(days=365)

# === 데이터 수집 ===
data = yf.download(ticker, start=start_date, end=end_date, progress=False)
prices = data['Adj Close']

# === 수익률 분석 ===
daily_returns = prices.pct_change().dropna()
total_return = (prices.iloc[-1] / prices.iloc[0] - 1) * 100
annual_vol = daily_returns.std() * np.sqrt(252) * 100

# === 이동평균 ===
sma_50 = prices.rolling(window=50).mean()
sma_200 = prices.rolling(window=200).mean()

# === 결과 출력 ===
print(f"총 수익률: {total_return:.2f}%")
print(f"연율화 변동성: {annual_vol:.2f}%")
print(f"현재 가격: ${prices.iloc[-1]:.2f}")
print(f"50일 이평: ${sma_50.iloc[-1]:.2f}")
print(f"200일 이평: ${sma_200.iloc[-1]:.2f}")
```

### 예제 2: 다중 자산 비교

```python
# === 설정 ===
tickers = ['SPY', 'QQQ', 'IEF', 'GLD']  # 주식, 기술주, 채권, 금
end_date = datetime.now()
start_date = end_date - timedelta(days=365)

# === 데이터 수집 ===
data = yf.download(tickers, start=start_date, end=end_date, progress=False)
prices = data['Adj Close']

# === 정규화 (시작점 100 기준) ===
normalized_prices = (prices / prices.iloc[0]) * 100

# === 수익률 및 변동성 ===
daily_returns = prices.pct_change().dropna()
total_returns = (prices.iloc[-1] / prices.iloc[0] - 1) * 100
annual_volatility = daily_returns.std() * np.sqrt(252) * 100

# === 상관관계 ===
correlation = daily_returns.corr()

# === 결과 테이블 ===
summary = pd.DataFrame({
    '총 수익률 (%)': total_returns,
    '연변동성 (%)': annual_volatility,
    '샤프비율': (total_returns - 4) / annual_volatility  # 무위험 4% 가정
})

print(summary)
print("\n상관관계:")
print(correlation)
```

## 에러 처리

```python
import yfinance as yf

def safe_download(ticker, start, end):
    """안전한 데이터 다운로드"""
    try:
        data = yf.download(ticker, start=start, end=end, progress=False)
        if data.empty:
            print(f"경고: {ticker} 데이터가 비어있습니다.")
            return None
        return data
    except Exception as e:
        print(f"오류: {ticker} 다운로드 실패 - {str(e)}")
        return None

# 사용 예시
result = safe_download('INVALID_TICKER', '2023-01-01', '2024-01-01')
if result is not None:
    # 데이터 처리
    prices = result['Adj Close']
```

## 데이터 캐싱 (선택적)

```python
import pickle
from pathlib import Path

# === 캐시 저장 ===
cache_dir = Path('cache')
cache_dir.mkdir(exist_ok=True)

cache_file = cache_dir / f"{ticker}_{start_date}_{end_date}.pkl"

if cache_file.exists():
    # 캐시에서 로드
    with open(cache_file, 'rb') as f:
        data = pickle.load(f)
    print("캐시에서 로드됨")
else:
    # 새로 다운로드
    data = yf.download(ticker, start=start_date, end=end_date, progress=False)
    with open(cache_file, 'wb') as f:
        pickle.dump(data, f)
    print("데이터 다운로드 완료")
```

## 주의사항

1. **progress=False**: yfinance 다운로드 시 항상 설정 (Streamlit 호환)
2. **데이터 검증**: 항상 빈 DataFrame 체크
3. **날짜 형식**: ISO 형식 ('YYYY-MM-DD') 또는 datetime 객체 사용
4. **연율화**: 거래일 기준 252일 사용
5. **NaN 처리**: dropna() 또는 fillna() 적절히 사용
