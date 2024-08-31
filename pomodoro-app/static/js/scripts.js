let timer;
let minutes = 25;
let seconds = 0;
let isPaused = false;
let mode = 'pomodoro';  // Default mode
let pomodoroCount = 0;
let isAutomated = false;

const timerElement = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const pomodoroButton = document.getElementById('pomodoro');
const shortBreakButton = document.getElementById('short-break');
const longBreakButton = document.getElementById('long-break');
const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const beepSound = document.getElementById('beep-sound');
const stopBeepButton = document.getElementById('stop-beep');
const pomodoroCountElement = document.getElementById('pomodoro-count');
const automatedCheckbox = document.getElementById('automated');
const customTimersDiv = document.getElementById('custom-timers');
const customPomodoroInput = document.getElementById('custom-pomodoro');
const customShortBreakInput = document.getElementById('custom-short-break');
const customLongBreakInput = document.getElementById('custom-long-break');

function updateTimer() {
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function countdown() {
    if (seconds === 0) {
        if (minutes === 0) {
            clearInterval(timer);
            beepSound.play();
            stopBeepButton.style.display = 'inline-block';
            if (isAutomated) {
                handleSessionCompletion();
            }
            return;
        } else {
            minutes--;
            seconds = 59;
        }
    } else {
        seconds--;
    }
    updateTimer();
}

function handleSessionCompletion() {
    if (mode === 'pomodoro') {
        pomodoroCount++;
        pomodoroCountElement.textContent = pomodoroCount;
        if (pomodoroCount % 4 === 0) {
            // After four pomodoros, take a long break
            startLongBreak();
        } else {
            // Otherwise, take a short break
            startShortBreak();
        }
    } else {
        // If in break mode, go back to Pomodoro mode
        startPomodoro();
    }
}

function startPomodoro() {
    mode = 'pomodoro';
    if (isAutomated) {
        minutes = 25;
    } else {
        minutes = parseInt(customPomodoroInput.value);
    }
    seconds = 0;
    updateTimer();
    timer = setInterval(countdown, 1000);
}

function startShortBreak() {
    mode = 'short-break';
    if (isAutomated) {
        minutes = 5;
    } else {
        minutes = parseInt(customShortBreakInput.value);
    }
    seconds = 0;
    updateTimer();
    timer = setInterval(countdown, 1000);
}

function startLongBreak() {
    mode = 'long-break';
    if (isAutomated) {
        minutes = 15;
    } else {
        minutes = parseInt(customLongBreakInput.value);
    }
    seconds = 0;
    updateTimer();
    timer = setInterval(countdown, 1000);
}

function stopBeep() {
    beepSound.pause();
    beepSound.currentTime = 0;
    stopBeepButton.style.display = 'none';
}

startButton.addEventListener('click', () => {
    if (!isPaused) {
        startPomodoro();
    } else {
        timer = setInterval(countdown, 1000);
        isPaused = false;
    }
});

pauseButton.addEventListener('click', () => {
    clearInterval(timer);
    isPaused = true;
});

resetButton.addEventListener('click', () => {
    clearInterval(timer);
    isPaused = false;
    updateTimer();
});

pomodoroButton.addEventListener('click', () => {
    mode = 'pomodoro';
    startPomodoro();
});

shortBreakButton.addEventListener('click', () => {
    mode = 'short-break';
    startShortBreak();
});

longBreakButton.addEventListener('click', () => {
    mode = 'long-break';
    startLongBreak();
});

stopBeepButton.addEventListener('click', stopBeep);

addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const listItem = document.createElement('li');
        listItem.className = 'task-item';
        listItem.innerHTML = `
            <span>${taskText}</span>
            <button class="complete-btn btn">Complete</button>
            <button class="incomplete-btn btn" style="display: none;">Incomplete</button>
            <button class="delete-btn btn">Delete</button>
        `;
        taskList.appendChild(listItem);
        taskInput.value = '';
    }
});

taskList.addEventListener('click', (event) => {
    const target = event.target;
    const listItem = target.closest('li');
    if (target.classList.contains('complete-btn')) {
        listItem.classList.add('completed');
        target.style.display = 'none';
        listItem.querySelector('.incomplete-btn').style.display = 'inline-block';
    } else if (target.classList.contains('incomplete-btn')) {
        listItem.classList.remove('completed');
        target.style.display = 'none';
        listItem.querySelector('.complete-btn').style.display = 'inline-block';
    } else if (target.classList.contains('delete-btn')) {
        taskList.removeChild(listItem);
    }
});

automatedCheckbox.addEventListener('change', (event) => {
    isAutomated = event.target.checked;
    if (isAutomated) {
        customTimersDiv.style.display = 'none';
    } else {
        customTimersDiv.style.display = 'block';
    }
});
