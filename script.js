function updateClock() {
    const now = new Date();

    // 요일 목록 (한국어)
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

    // 시간, 분, 초 포맷
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // 날짜 포맷
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');

    // DOM 업데이트
    document.getElementById('day').textContent = days[now.getDay()];
    document.getElementById('date').textContent = `${year}.${month}.${date}`;
    document.getElementById('time').textContent = `${hours} : ${minutes} : ${seconds}`;
    document.getElementById('zone').textContent = 'KST (UTC+9)';
}

// 처음 실행 + 1초마다 갱신
updateClock();
setInterval(updateClock, 1000);
