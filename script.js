/* 시계모드 */
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



// 처음 실행 + 1초마다 갱신
updateClock();
setInterval(updateClock, 1000);

/* 토글버튼 */
const toggleBtn = document.getElementById('toggle-mode');
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});

/* 전체화면 모드 */
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

/* 타이머모드 */
let countdownInterval;
let remainingSeconds = 0;
let isPaused = false;

const modeToggleBtn = document.getElementById('mode-toggle');
const clockMode = document.getElementById('clock-mode');
const timerMode = document.getElementById('timer-mode');

modeToggleBtn.addEventListener('click', () => {
    const isClockVisible = clockMode.style.display !== 'none';
    clockMode.style.display = isClockVisible ? 'none' : 'block';
    timerMode.style.display = isClockVisible ? 'block' : 'none';
    modeToggleBtn.textContent = isClockVisible ? '🕒 시계 모드' : '⏳ 타이머 모드';

    // 타이머 초기화 시 자동 정지
    clearInterval(countdownInterval);
    document.getElementById('timer-display').textContent = '00:00:00';
});

document.getElementById('start-btn').addEventListener('click', () => {
    if (!isPaused) {
        const h = parseInt(document.getElementById('timer-hours').value) || 0;
        const m = parseInt(document.getElementById('timer-minutes').value) || 0;
        const s = parseInt(document.getElementById('timer-seconds').value) || 0;
        remainingSeconds = h * 3600 + m * 60 + s;
    }

    if (remainingSeconds > 0) {
        isPaused = false;
        countdownInterval = setInterval(() => {
            if (remainingSeconds <= 0) {
                clearInterval(countdownInterval);
                alert('⏰ 타이머 완료!');
                return;
            }

            remainingSeconds--;
            const hrs = String(Math.floor(remainingSeconds / 3600)).padStart(2, '0');
            const mins = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(2, '0');
            const secs = String(remainingSeconds % 60).padStart(2, '0');

            document.getElementById('timer-display').textContent = `${hrs}:${mins}:${secs}`;
        }, 1000);
    }
});

document.getElementById('pause-btn').addEventListener('click', () => {
    isPaused = true;
    clearInterval(countdownInterval);
});

document.getElementById('reset-btn').addEventListener('click', () => {
    clearInterval(countdownInterval);
    remainingSeconds = 0;
    isPaused = false;
    document.getElementById('timer-display').textContent = '00:00:00';
});

/* 프레셋 버튼 */
const presetButtons = document.querySelectorAll('.preset');

presetButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const minutes = parseInt(btn.getAttribute('data-minutes'), 10);
        const totalSeconds = minutes * 60;

        document.getElementById('timer-hours').value = Math.floor(totalSeconds / 3600);
        document.getElementById('timer-minutes').value = Math.floor((totalSeconds % 3600) / 60);
        document.getElementById('timer-seconds').value = totalSeconds % 60;

        // 바로 시작하고 싶으면 아래 두 줄을 추가
        // isPaused = false;
        // document.getElementById('start-btn').click();
    });
});

/* 뽀모도로 모드 */
let isPomodoro = false;
let isFocusTime = true;
let pomodoroInterval;
let pomodoroRemaining = 0;
let focusDuration = 25 * 60; // 25분
let breakDuration = 5 * 60; // 5분
let longBreakDuration = 15 * 60;
let longBreakCycle = 4;
let pomodoroCount = 0;

const pomodoroToggle = document.getElementById('pomodoro-toggle');

pomodoroToggle.addEventListener('click', () => {
    isPomodoro = !isPomodoro;

    if (isPomodoro) {
        switchToPomodoroMode();
    } else {
        exitPomodoroMode();
    }
});

function switchToPomodoroMode() {
    alert(`🍅 뽀모도로 모드 시작!\n${Math.floor(focusDuration/3600)}시간 ${focusDuration%3600/60}분 집중 후 ${Math.floor(breakDuration/3600)}시간 ${breakDuration/60}분 휴식이 반복됩니다.`);

    // 시계 숨기고 타이머 표시
    clockMode.style.display = 'none';
    timerMode.style.display = 'block';
    modeToggleBtn.textContent = '🕒 시계 모드';

    isFocusTime = true;
    startPomodoroSession(focusDuration);
}

function exitPomodoroMode() {
    alert('🍅 뽀모도로 모드 종료');
    clearInterval(pomodoroInterval);
    document.getElementById('timer-display').textContent = '00:00:00';
}

function startPomodoroSession(duration) {
    pomodoroRemaining = duration;
    updatePomodoroDisplay();

    clearInterval(pomodoroInterval);
    pomodoroInterval = setInterval(() => {
        pomodoroRemaining--;

        if (pomodoroRemaining <= 0) {
            clearInterval(pomodoroInterval);
            isFocusTime = !isFocusTime;

            if (!isFocusTime) {
                pomodoroCount++;
            }
            
            const nextDuration = isFocusTime
                ? focusDuration
                : (pomodoroCount % longBreakCycle === 0 ? longBreakDuration : breakDuration);
            const msg = isFocusTime ? '🧠 다시 집중 시간입니다!' : '☕ 휴식 시간입니다!';
            alert(msg);

            startPomodoroSession(nextDuration);
        } else {
            updatePomodoroDisplay();
        }
    }, 1000);
}

function updatePomodoroDisplay() {
    const hrs = String(Math.floor(pomodoroRemaining / 3600)).padStart(2, '0');
    const mins = String(Math.floor((pomodoroRemaining % 3600) / 60)).padStart(2, '0');
    const secs = String(pomodoroRemaining % 60).padStart(2, '0');
    document.getElementById('timer-display').textContent = `${hrs}:${mins}:${secs}`;
}

/* 뽀모도로 설정 */ 

document.getElementById('open-settings').addEventListener('click', () => {
    document.getElementById('settings-modal').style.display = 'block';
});

document.getElementById('close-settings').addEventListener('click', () => {
    document.getElementById('settings-modal').style.display = 'none';
});

document.getElementById('save-settings').addEventListener('click', () => {
    const focus = parseInt(document.getElementById('focus-duration-input').value, 10);
    const shortBreak = parseInt(document.getElementById('short-break-input').value, 10);
    const longBreak = parseInt(document.getElementById('long-break-input').value, 10);
    const cycle = parseInt(document.getElementById('long-break-cycle-input').value, 10);

    focusDuration = focus * 60;
    breakDuration = shortBreak * 60;
    longBreakDuration = longBreak * 60;
    longBreakCycle = cycle;

    // ✅ localStorage 저장
    localStorage.setItem('pomodoroSettings', JSON.stringify({
        focus,
        shortBreak,
        longBreak,
        cycle
    }));

    alert('✅ 설정이 저장되었습니다!');
    document.getElementById('settings-modal').style.display = 'none';
});

// 초기 실행시 추가
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('pomodoroSettings');
    if (saved) {
        const settings = JSON.parse(saved);

        // 값 적용
        focusDuration = settings.focus * 60;
        breakDuration = settings.shortBreak * 60;
        longBreakDuration = settings.longBreak * 60;
        longBreakCycle = settings.cycle;

        // 입력창에도 반영
        document.getElementById('focus-duration-input').value = settings.focus;
        document.getElementById('short-break-input').value = settings.shortBreak;
        document.getElementById('long-break-input').value = settings.longBreak;
        document.getElementById('long-break-cycle-input').value = settings.cycle;
    }
});
