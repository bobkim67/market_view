// ===== 금융 시황 대시보드 - 메인 스크립트 =====

// ----- 샘플 데이터 정의 -----
// 일간, 주간, 월간 시황 데이터를 담는 객체
const marketData = {

    // === 일간 데이터 ===
    daily: {
        date: "2025년 2월 7일 (금)",
        indices: {
            kospi:  { value: "2,521.92", change: "+18.35", percent: "+0.73%", direction: "up" },
            kosdaq: { value: "731.46",   change: "-3.21",  percent: "-0.44%", direction: "down" },
            usdkrw: { value: "1,452.30", change: "+5.70",  percent: "+0.39%", direction: "up" },
            gold:   { value: "$2,867.50", change: "+12.30", percent: "+0.43%", direction: "up" },
            btc:    { value: "$97,250",  change: "-1,420",  percent: "-1.44%", direction: "down" },
            bond:   { value: "2.68%",    change: "-0.03%p", percent: "",       direction: "down" }
        },
        // 시황 요약 데이터
        summary: [
            { icon: "📈", text: "코스피는 외국인 순매수에 힘입어 상승 마감. 반도체·자동차 업종 강세." },
            { icon: "📉", text: "코스닥은 바이오·엔터테인먼트 업종 약세로 소폭 하락." },
            { icon: "💵", text: "원/달러 환율은 미국 고용지표 호조에 달러 강세 지속." },
            { icon: "🪙", text: "금 가격은 안전자산 수요 증가로 사상 최고치 경신." },
            { icon: "₿",  text: "비트코인은 차익실현 매물 출회로 소폭 하락." }
        ],
        // 섹터별 등락 데이터
        sectors: [
            { name: "반도체",     change: "+1.82%", direction: "up" },
            { name: "자동차",     change: "+1.24%", direction: "up" },
            { name: "2차전지",    change: "+0.65%", direction: "up" },
            { name: "바이오",     change: "-1.13%", direction: "down" },
            { name: "엔터테인먼트", change: "-0.87%", direction: "down" },
            { name: "은행",       change: "+0.42%", direction: "up" },
            { name: "철강",       change: "-0.31%", direction: "down" },
            { name: "건설",       change: "+0.18%", direction: "up" }
        ],
        // 주요 뉴스 데이터
        news: [
            { title: "삼성전자, HBM4 양산 본격화… 주가 3% 상승", tag: "주식", tagClass: "stock" },
            { title: "미국 1월 고용지표 예상 상회… 달러 강세 지속", tag: "환율", tagClass: "forex" },
            { title: "금 가격 사상 최고치 경신, 온스당 $2,867", tag: "경제", tagClass: "economy" },
            { title: "비트코인 10만달러 돌파 실패, 차익실현 매물 출회", tag: "암호화폐", tagClass: "crypto" },
            { title: "한국은행, 기준금리 동결 전망 우세", tag: "채권", tagClass: "bond" }
        ]
    },

    // === 주간 데이터 ===
    weekly: {
        date: "2025년 2월 3일 ~ 2월 7일",
        indices: {
            kospi:  { value: "2,521.92", change: "+45.20", percent: "+1.83%", direction: "up" },
            kosdaq: { value: "731.46",   change: "+8.73",  percent: "+1.21%", direction: "up" },
            usdkrw: { value: "1,452.30", change: "+12.50", percent: "+0.87%", direction: "up" },
            gold:   { value: "$2,867.50", change: "+58.40", percent: "+2.08%", direction: "up" },
            btc:    { value: "$97,250",  change: "+3,820",  percent: "+4.08%", direction: "up" },
            bond:   { value: "2.68%",    change: "-0.08%p", percent: "",       direction: "down" }
        },
        summary: [
            { icon: "📈", text: "코스피 주간 1.83% 상승. 외국인 3거래일 연속 순매수 기록." },
            { icon: "📊", text: "코스닥도 주간 상승 전환. IT·게임 업종 반등 성공." },
            { icon: "💵", text: "원/달러 환율은 주간 12.5원 상승. 트럼프 관세 우려 지속." },
            { icon: "🪙", text: "금 가격 주간 2% 넘게 상승. 지정학적 리스크 확대 영향." },
            { icon: "🌍", text: "글로벌 증시 혼조세. 미국 기술주 강세, 유럽 증시 약세." }
        ],
        sectors: [
            { name: "반도체",     change: "+3.45%", direction: "up" },
            { name: "자동차",     change: "+2.18%", direction: "up" },
            { name: "2차전지",    change: "+1.92%", direction: "up" },
            { name: "바이오",     change: "-0.56%", direction: "down" },
            { name: "엔터테인먼트", change: "+1.34%", direction: "up" },
            { name: "은행",       change: "+0.87%", direction: "up" },
            { name: "철강",       change: "-1.20%", direction: "down" },
            { name: "건설",       change: "-0.43%", direction: "down" }
        ],
        news: [
            { title: "외국인, 코스피 3거래일 연속 순매수… 반도체 집중", tag: "주식", tagClass: "stock" },
            { title: "트럼프, 중국산 제품 추가 관세 예고… 환율 변동성 확대", tag: "환율", tagClass: "forex" },
            { title: "국제 금 가격 주간 2% 상승, 안전자산 선호 뚜렷", tag: "경제", tagClass: "economy" },
            { title: "비트코인 주간 4% 상승, 기관 투자자 유입 지속", tag: "암호화폐", tagClass: "crypto" },
            { title: "국고채 3년물 금리 하락, 금리 인하 기대감 반영", tag: "채권", tagClass: "bond" }
        ]
    },

    // === 월간 데이터 ===
    monthly: {
        date: "2025년 1월",
        indices: {
            kospi:  { value: "2,476.72", change: "-79.63",  percent: "-3.11%", direction: "down" },
            kosdaq: { value: "722.73",   change: "-38.52",  percent: "-5.06%", direction: "down" },
            usdkrw: { value: "1,439.80", change: "+16.20",  percent: "+1.14%", direction: "up" },
            gold:   { value: "$2,809.10", change: "+185.60", percent: "+7.07%", direction: "up" },
            btc:    { value: "$93,430",  change: "-756",     percent: "-0.80%", direction: "down" },
            bond:   { value: "2.76%",    change: "-0.09%p",  percent: "",       direction: "down" }
        },
        summary: [
            { icon: "📉", text: "코스피 월간 3.11% 하락. 미국 관세 불확실성과 외국인 매도세 영향." },
            { icon: "📉", text: "코스닥 월간 5% 넘게 하락. 성장주 전반 약세 지속." },
            { icon: "💵", text: "원/달러 환율 월간 16원 상승. 1,400원대 고착화 우려." },
            { icon: "🪙", text: "금 가격 월간 7% 급등. 중앙은행 금 매입 확대 지속." },
            { icon: "📊", text: "글로벌 시장, AI 테마 지속 강세. 엔비디아 시가총액 사상 최고." }
        ],
        sectors: [
            { name: "반도체",     change: "-2.31%", direction: "down" },
            { name: "자동차",     change: "+0.45%", direction: "up" },
            { name: "2차전지",    change: "-5.67%", direction: "down" },
            { name: "바이오",     change: "-4.12%", direction: "down" },
            { name: "엔터테인먼트", change: "-3.28%", direction: "down" },
            { name: "은행",       change: "+2.15%", direction: "up" },
            { name: "철강",       change: "-1.89%", direction: "down" },
            { name: "건설",       change: "-2.56%", direction: "down" }
        ],
        news: [
            { title: "1월 증시 부진, 외국인 1.2조원 순매도", tag: "주식", tagClass: "stock" },
            { title: "트럼프 취임 후 관세 정책 본격화, 글로벌 무역 긴장", tag: "경제", tagClass: "economy" },
            { title: "원/달러 환율 1,400원대 장기화, 수입물가 상승 우려", tag: "환율", tagClass: "forex" },
            { title: "금 가격 1월 한달 7% 급등, 2025년 강세 전망", tag: "경제", tagClass: "economy" },
            { title: "한국은행 기준금리 3.00%로 인하, 추가 인하 여지 시사", tag: "채권", tagClass: "bond" }
        ]
    }
};

// ----- 현재 선택된 기간을 저장하는 변수 -----
let currentPeriod = "daily";

// ===== 대시보드 데이터 렌더링 함수 =====
// 선택된 기간에 해당하는 데이터를 화면에 표시합니다
function renderDashboard(period) {
    // 해당 기간의 데이터 가져오기
    const data = marketData[period];

    // 날짜 표시 업데이트
    document.getElementById("currentDate").textContent = data.date;

    // --- 주요 지수 카드 업데이트 ---
    updateCard("kospi", data.indices.kospi);
    updateCard("kosdaq", data.indices.kosdaq);
    updateCard("usdkrw", data.indices.usdkrw);
    updateCard("gold", data.indices.gold);
    updateCard("btc", data.indices.btc);
    updateCard("bond", data.indices.bond);

    // --- 시황 요약 렌더링 ---
    renderSummary(data.summary);

    // --- 섹터별 등락 렌더링 ---
    renderSectors(data.sectors);

    // --- 주요 뉴스 렌더링 ---
    renderNews(data.news);

    // --- 마지막 업데이트 시간 표시 ---
    document.getElementById("lastUpdate").textContent = getFormattedNow();
}

// ===== 개별 카드 업데이트 함수 =====
// 지수 카드의 값과 등락 정보를 업데이트합니다
function updateCard(id, indexData) {
    // 카드의 값 업데이트
    const valueElement = document.getElementById(id + "-value");
    valueElement.textContent = indexData.value;

    // 카드의 등락률 업데이트
    const changeElement = document.getElementById(id + "-change");

    // 등락 방향에 따라 표시할 텍스트 구성
    let changeText = indexData.change;
    if (indexData.percent) {
        changeText += " (" + indexData.percent + ")";
    }
    changeElement.textContent = changeText;

    // 등락 방향에 따라 CSS 클래스 설정 (상승: 빨강, 하락: 파랑)
    changeElement.className = "card-change " + indexData.direction;
}

// ===== 시황 요약 렌더링 함수 =====
// 시황 요약 항목들을 HTML로 생성하여 화면에 표시합니다
function renderSummary(summaryList) {
    // 시황 요약 컨테이너 가져오기
    const container = document.getElementById("summaryContent");

    // HTML 문자열 생성
    let html = "";
    for (let i = 0; i < summaryList.length; i++) {
        const item = summaryList[i];
        html += '<div class="summary-item">';
        html += '  <span class="summary-icon">' + item.icon + '</span>';
        html += '  <span>' + item.text + '</span>';
        html += '</div>';
    }

    // 컨테이너에 HTML 삽입
    container.innerHTML = html;
}

// ===== 섹터별 등락 렌더링 함수 =====
// 섹터 데이터를 카드 형태로 화면에 표시합니다
function renderSectors(sectorList) {
    // 섹터 그리드 컨테이너 가져오기
    const container = document.getElementById("sectorGrid");

    // HTML 문자열 생성
    let html = "";
    for (let i = 0; i < sectorList.length; i++) {
        const sector = sectorList[i];
        html += '<div class="sector-item">';
        html += '  <span class="sector-name">' + sector.name + '</span>';
        html += '  <span class="sector-change ' + sector.direction + '">' + sector.change + '</span>';
        html += '</div>';
    }

    // 컨테이너에 HTML 삽입
    container.innerHTML = html;
}

// ===== 주요 뉴스 렌더링 함수 =====
// 뉴스 데이터를 리스트 형태로 화면에 표시합니다
function renderNews(newsList) {
    // 뉴스 리스트 컨테이너 가져오기
    const container = document.getElementById("newsList");

    // HTML 문자열 생성
    let html = "";
    for (let i = 0; i < newsList.length; i++) {
        const news = newsList[i];
        html += '<li class="news-item">';
        html += '  <span class="news-title">' + news.title + '</span>';
        html += '  <span class="news-tag ' + news.tagClass + '">' + news.tag + '</span>';
        html += '</li>';
    }

    // 컨테이너에 HTML 삽입
    container.innerHTML = html;
}

// ===== 현재 시간 포맷팅 함수 =====
// "2025년 2월 7일 15:30:00" 형식으로 현재 시간을 반환합니다
function getFormattedNow() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 월은 0부터 시작하므로 1 더하기
    const day = now.getDate();
    const hours = String(now.getHours()).padStart(2, "0");   // 두 자리로 맞추기
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return year + "년 " + month + "월 " + day + "일 " + hours + ":" + minutes + ":" + seconds;
}

// ===== 탭 버튼 클릭 이벤트 설정 =====
// 기간 선택 탭 버튼에 클릭 이벤트를 연결합니다
function setupTabButtons() {
    // 모든 탭 버튼 가져오기
    const tabButtons = document.querySelectorAll(".tab-button");

    // 각 버튼에 클릭 이벤트 추가
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].addEventListener("click", function () {
            // 모든 탭에서 active 클래스 제거
            for (let j = 0; j < tabButtons.length; j++) {
                tabButtons[j].classList.remove("active");
            }

            // 클릭한 탭에 active 클래스 추가
            this.classList.add("active");

            // 선택한 기간 저장 (data-period 속성에서 가져오기)
            currentPeriod = this.getAttribute("data-period");

            // 대시보드 데이터 다시 렌더링
            renderDashboard(currentPeriod);
        });
    }
}

// ===== 페이지 로드 시 초기화 =====
// 페이지가 완전히 로드된 후 실행됩니다
window.addEventListener("DOMContentLoaded", function () {
    // 탭 버튼 이벤트 설정
    setupTabButtons();

    // 초기 데이터 렌더링 (일간 데이터로 시작)
    renderDashboard("daily");
});
