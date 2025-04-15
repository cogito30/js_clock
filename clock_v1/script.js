function updateClock() {
    const timezone = document.getElementById('timezone');
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: timezone.value }));
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = now.getDay();
    const day = days[dayIndex];
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('date').innerHTML = `${year}-${month}-${date}`;
    document.getElementById('day').innerHTML = `(${day})`;
    document.getElementById('day').style.color = (dayIndex === 6) ? 'blue' : (dayIndex === 0) ? 'red' : '#d1d1d1';
    document.getElementById('time').innerHTML = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock();