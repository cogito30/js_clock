const DateTime = luxon.DateTime;
const timezoneSelect = document.getElementById('timezone-select');

function updateClock() {
    const selectedZone = timezoneSelect.value;
    const now = DateTime.now().setZone(selectedZone);

    // 요일 목록 (한국어)
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

    // 시간, 분, 초 포맷
    const hours = now.toFormat('HH');
    const minutes = now.toFormat('mm');
    const seconds = now.toFormat('ss');

    // 날짜 포맷
    const dateStr = now.toFormat('yyyy.MM.dd');
    const dayStr = days[now.weekday % 7]; // Luxon: 1=Monday, 7=Sunday

    // DOM 업데이트
    document.getElementById('day').textContent = dayStr;
    document.getElementById('date').textContent = dateStr;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
    document.getElementById('zone').textContent = selectedZone;
}

const toggleBtn = document.getElementById('toggle-mode');
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});

// 처음 실행 + 1초마다 갱신
updateClock();
setInterval(updateClock, 1000);

const fullscreenBtn = document.getElementById('fullscreen-btn');

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
            alert(`전체화면 전환 실패: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});
