# Web Dashboard Skill

---
name: web-dashboard-skill
description: |
  Streamlit과 Plotly를 활용한 금융 데이터 시각화 웹 대시보드 구축 가이드.
  
  사용 시점:
  - Streamlit 웹 애플리케이션 생성 시
  - Plotly 인터랙티브 차트 구현 시
  - 금융 대시보드 레이아웃 설계 시
---

## 기능

### 1. Streamlit 앱 기본 구조

```python
import streamlit as st
import plotly.graph_objects as go
import pandas as pd
import numpy as np

# === 페이지 설정 (반드시 최상단) ===
st.set_page_config(
    page_title="금융시황 대시보드",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# === 제목 및 설명 ===
st.title("📊 글로벌 금융시황 대시보드")
st.markdown("yfinance 기반 실시간 시장 데이터")

# === 사이드바 ===
with st.sidebar:
    st.header("⚙️ 설정")
    # 사용자 입력 위젯

# === 메인 콘텐츠 ===
# 차트 및 데이터 표시
```

### 2. 사용자 입력 위젯

```python
with st.sidebar:
    # === 자산 선택 ===
    available_tickers = {
        '미국 주식': ['SPY', 'QQQ', 'DIA'],
        '한국 주식': ['^KS11', '^KQ11'],
        '채권': ['TLT', 'IEF', 'SHY'],
        '원자재': ['GLD', 'USO']
    }
    
    selected_category = st.selectbox(
        "자산군 선택",
        list(available_tickers.keys())
    )
    
    selected_tickers = st.multiselect(
        "종목 선택",
        available_tickers[selected_category],
        default=available_tickers[selected_category][:2]
    )
    
    # === 기간 선택 ===
    period_options = {
        '1개월': 30,
        '3개월': 90,
        '6개월': 180,
        '1년': 365,
        '3년': 1095
    }
    
    selected_period = st.selectbox(
        "조회 기간",
        list(period_options.keys()),
        index=3  # 기본값: 1년
    )
    
    # === 지표 선택 ===
    show_sma = st.checkbox("이동평균선 표시", value=True)
    show_volume = st.checkbox("거래량 표시", value=False)
```

### 3. 데이터 캐싱

```python
# === 데이터 로딩 함수 (캐싱) ===
@st.cache_data(ttl=3600)  # 1시간 캐시
def load_market_data(tickers, start_date, end_date):
    """yfinance 데이터 로드"""
    import yfinance as yf
    
    data = yf.download(
        tickers, 
        start=start_date, 
        end=end_date,
        progress=False
    )
    
    return data

# 사용 예시
with st.spinner('데이터 로딩 중...'):
    data = load_market_data(
        selected_tickers,
        start_date,
        end_date
    )

if data is not None and not data.empty:
    st.success("데이터 로딩 완료!")
else:
    st.error("데이터를 불러올 수 없습니다.")
    st.stop()
```

### 4. KPI 메트릭 카드

```python
# === 최상단 KPI 표시 ===
col1, col2, col3, col4 = st.columns(4)

# 단일 티커인 경우
if len(selected_tickers) == 1:
    ticker = selected_tickers[0]
    latest_price = prices.iloc[-1]
    prev_price = prices.iloc[-2]
    price_change_pct = ((latest_price - prev_price) / prev_price) * 100
    
    with col1:
        st.metric(
            label=ticker,
            value=f"${latest_price:.2f}",
            delta=f"{price_change_pct:+.2f}%"
        )

# 다중 티커인 경우
else:
    for i, ticker in enumerate(selected_tickers[:4]):
        with [col1, col2, col3, col4][i]:
            latest = prices[ticker].iloc[-1]
            prev = prices[ticker].iloc[-2]
            change = ((latest - prev) / prev) * 100
            
            st.metric(
                label=ticker,
                value=f"${latest:.2f}",
                delta=f"{change:+.2f}%"
            )
```

### 5. Plotly 차트 생성

#### 5.1 가격 차트 (라인 차트)

```python
# === 가격 추이 차트 ===
fig_price = go.Figure()

for ticker in selected_tickers:
    fig_price.add_trace(go.Scatter(
        x=prices.index,
        y=prices[ticker] if len(selected_tickers) > 1 else prices,
        name=ticker,
        mode='lines',
        line=dict(width=2),
        hovertemplate='<b>%{fullData.name}</b><br>' +
                      '날짜: %{x|%Y-%m-%d}<br>' +
                      '가격: $%{y:.2f}<br>' +
                      '<extra></extra>'
    ))

# 이동평균선 추가 (옵션)
if show_sma:
    sma_20 = prices.rolling(window=20).mean()
    for ticker in selected_tickers:
        fig_price.add_trace(go.Scatter(
            x=sma_20.index,
            y=sma_20[ticker] if len(selected_tickers) > 1 else sma_20,
            name=f'{ticker} SMA(20)',
            mode='lines',
            line=dict(width=1, dash='dash'),
            opacity=0.7
        ))

fig_price.update_layout(
    title="주가 추이",
    xaxis_title="날짜",
    yaxis_title="가격 (USD)",
    hovermode='x unified',
    height=500,
    template='plotly_white',
    legend=dict(
        orientation="h",
        yanchor="bottom",
        y=1.02,
        xanchor="right",
        x=1
    )
)

st.plotly_chart(fig_price, use_container_width=True)
```

#### 5.2 수익률 비교 차트

```python
# === 정규화 수익률 (시작점 100 기준) ===
normalized = (prices / prices.iloc[0]) * 100

fig_returns = go.Figure()

for ticker in selected_tickers:
    fig_returns.add_trace(go.Scatter(
        x=normalized.index,
        y=normalized[ticker] if len(selected_tickers) > 1 else normalized,
        name=ticker,
        mode='lines',
        line=dict(width=2)
    ))

# 기준선 추가
fig_returns.add_hline(
    y=100, 
    line_dash="dash", 
    line_color="gray",
    annotation_text="시작점"
)

fig_returns.update_layout(
    title="수익률 비교 (시작점 = 100)",
    xaxis_title="날짜",
    yaxis_title="누적 수익률 지수",
    hovermode='x unified',
    height=500,
    template='plotly_white'
)

st.plotly_chart(fig_returns, use_container_width=True)
```

#### 5.3 상관관계 히트맵

```python
# === 상관계수 매트릭스 ===
correlation = daily_returns.corr()

fig_corr = go.Figure(data=go.Heatmap(
    z=correlation.values,
    x=correlation.columns,
    y=correlation.columns,
    colorscale='RdBu',
    zmid=0,
    text=correlation.values,
    texttemplate='%{text:.2f}',
    textfont={"size": 12},
    colorbar=dict(title="상관계수")
))

fig_corr.update_layout(
    title="자산 간 상관관계",
    height=500,
    template='plotly_white'
)

st.plotly_chart(fig_corr, use_container_width=True)
```

### 6. 데이터 테이블 표시

```python
# === 통계 요약 테이블 ===
st.subheader("📈 통계 요약")

summary_data = []
for ticker in selected_tickers:
    # 단일/다중 티커 처리
    ticker_prices = prices[ticker] if len(selected_tickers) > 1 else prices
    ticker_returns = daily_returns[ticker] if len(selected_tickers) > 1 else daily_returns
    
    total_return = (ticker_prices.iloc[-1] / ticker_prices.iloc[0] - 1) * 100
    volatility = ticker_returns.std() * np.sqrt(252) * 100
    sharpe = (total_return - 4) / volatility  # 무위험 4% 가정
    
    # MDD 계산
    cumulative = (1 + ticker_returns).cumprod()
    running_max = cumulative.cummax()
    drawdown = (cumulative - running_max) / running_max
    max_dd = drawdown.min() * 100
    
    summary_data.append({
        '종목': ticker,
        '현재가': f"${ticker_prices.iloc[-1]:.2f}",
        '총 수익률': f"{total_return:.2f}%",
        '연변동성': f"{volatility:.2f}%",
        '샤프비율': f"{sharpe:.2f}",
        '최대낙폭': f"{max_dd:.2f}%"
    })

summary_df = pd.DataFrame(summary_data)

# 스타일링된 테이블
st.dataframe(
    summary_df,
    use_container_width=True,
    hide_index=True
)
```

### 7. 탭 레이아웃

```python
# === 탭으로 콘텐츠 분리 ===
tab1, tab2, tab3, tab4 = st.tabs([
    "📊 가격 차트", 
    "📈 수익률 비교", 
    "🔥 상관관계", 
    "📋 통계"
])

with tab1:
    st.plotly_chart(fig_price, use_container_width=True)
    
with tab2:
    st.plotly_chart(fig_returns, use_container_width=True)
    
with tab3:
    if len(selected_tickers) > 1:
        col1, col2 = st.columns([2, 1])
        with col1:
            st.plotly_chart(fig_corr, use_container_width=True)
        with col2:
            st.dataframe(correlation, use_container_width=True)
    else:
        st.info("상관관계는 2개 이상의 종목 선택 시 표시됩니다.")
    
with tab4:
    st.dataframe(summary_df, use_container_width=True)
```

### 8. 다운로드 기능

```python
# === CSV 다운로드 ===
@st.cache_data
def convert_df_to_csv(df):
    return df.to_csv(index=True).encode('utf-8')

csv_data = convert_df_to_csv(prices)

st.download_button(
    label="📥 가격 데이터 다운로드 (CSV)",
    data=csv_data,
    file_name=f"market_data_{datetime.now().strftime('%Y%m%d')}.csv",
    mime="text/csv"
)
```

## 완전한 예제

```python
import streamlit as st
import plotly.graph_objects as go
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# === 페이지 설정 ===
st.set_page_config(
    page_title="금융시황",
    page_icon="📊",
    layout="wide"
)

st.title("📊 글로벌 금융시황 대시보드")

# === 사이드바 ===
with st.sidebar:
    st.header("⚙️ 설정")
    
    tickers = st.multiselect(
        "종목 선택",
        ['SPY', 'QQQ', '^GSPC', '^IXIC', '^KS11'],
        default=['SPY', 'QQQ']
    )
    
    period_days = st.selectbox(
        "기간",
        [30, 90, 180, 365],
        format_func=lambda x: f"{x}일",
        index=3
    )

# === 데이터 로딩 ===
@st.cache_data(ttl=3600)
def load_data(tickers, days):
    end = datetime.now()
    start = end - timedelta(days=days)
    return yf.download(tickers, start=start, end=end, progress=False)

if not tickers:
    st.warning("최소 1개 이상의 종목을 선택하세요.")
    st.stop()

with st.spinner('데이터 로딩 중...'):
    data = load_data(tickers, period_days)

if data.empty:
    st.error("데이터를 불러올 수 없습니다.")
    st.stop()

# === 데이터 처리 ===
prices = data['Adj Close']
daily_returns = prices.pct_change().dropna()

# === KPI 카드 ===
cols = st.columns(min(len(tickers), 4))
for i, ticker in enumerate(tickers[:4]):
    with cols[i]:
        current = prices[ticker].iloc[-1] if len(tickers) > 1 else prices.iloc[-1]
        prev = prices[ticker].iloc[-2] if len(tickers) > 1 else prices.iloc[-2]
        change = ((current - prev) / prev) * 100
        
        st.metric(
            label=ticker,
            value=f"${current:.2f}",
            delta=f"{change:+.2f}%"
        )

# === 차트 ===
st.subheader("가격 추이")

fig = go.Figure()
for ticker in tickers:
    fig.add_trace(go.Scatter(
        x=prices.index,
        y=prices[ticker] if len(tickers) > 1 else prices,
        name=ticker,
        mode='lines'
    ))

fig.update_layout(
    xaxis_title="날짜",
    yaxis_title="가격",
    hovermode='x unified',
    height=500,
    template='plotly_white'
)

st.plotly_chart(fig, use_container_width=True)

# === 통계 ===
st.subheader("통계 요약")

stats = []
for ticker in tickers:
    ticker_prices = prices[ticker] if len(tickers) > 1 else prices
    ticker_returns = daily_returns[ticker] if len(tickers) > 1 else daily_returns
    
    total_return = (ticker_prices.iloc[-1] / ticker_prices.iloc[0] - 1) * 100
    vol = ticker_returns.std() * np.sqrt(252) * 100
    
    stats.append({
        '종목': ticker,
        '총 수익률': f"{total_return:.2f}%",
        '변동성': f"{vol:.2f}%"
    })

st.dataframe(pd.DataFrame(stats), use_container_width=True, hide_index=True)
```

## 주의사항

1. **페이지 설정**: 항상 파일 최상단에 `st.set_page_config()` 배치
2. **캐싱**: 데이터 로딩 함수에 `@st.cache_data` 사용
3. **에러 처리**: 빈 DataFrame, 선택되지 않은 종목 등 체크
4. **단일/다중 티커**: 조건 분기로 처리
5. **progress=False**: yfinance 다운로드 시 필수
