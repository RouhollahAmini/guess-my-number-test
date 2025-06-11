'use strict';

Object.assign(window, {
    mysteryNumber: document.getElementById('mysteryNumber'),
    guessInput: document.getElementById('guessInput'),
    checkBtn: document.getElementById('checkBtn'),
    resetBtn: document.getElementById('resetBtn'),
    gameMessage: document.getElementById('gameMessage'),
    messageBox: document.getElementById('messageBox'),
    score: document.getElementById('score'),
    highScore: document.getElementById('highScore'),
    attempts: document.getElementById('attempts'),
});

const highestNumberLimit = 20;
let secretNumber;
let scoreNumber = 20;
let highScoreNumber = 0;
let attemptsNumber = 0;

// فانکشن برای تولید عدد تصادفی جدید
function generateNewSecretNumber() {
    secretNumber = Math.floor(Math.random() * highestNumberLimit) + 1;
    console.log('New secret number:', secretNumber);
    return secretNumber;
}

// شروع بازی با عدد تصادفی
generateNewSecretNumber();

function shakeElement(element) {
    element.classList.add('animate-shake');
    setTimeout(() => element.classList.remove('animate-shake'), 300);
}

const messageBehaviors = {
    normal: ['text-blue-600', 'dark:text-blue-400', 'font-bold'],
    success: ['success', 'font-bold'],
    error: ['error', 'font-bold'],
    warning: ['warning', 'font-bold']
};

function showMessage(element, message, type, reset = true) {
    element.textContent = message;
    if (reset) {
        // element.classList.remove(...messageBehaviors);
        element.classList.remove(...Object.values(messageBehaviors).flat());
    }
    if (messageBehaviors[type]) {
        element.classList.add(...messageBehaviors[type]);
    }
}

function resetGuessInput() {
    guessInput.value = '';
}

function disableGuessing() {
    guessInput.disabled = true;
    checkBtn.disabled = true;
}

function enableGuessing() {
    guessInput.disabled = false;
    checkBtn.disabled = false;
}

function decreaseScore() {
    scoreNumber--;
    score.textContent = scoreNumber;
}

function increaseAttempts() {
    attemptsNumber++;
    attempts.textContent = attemptsNumber;
}

function handleWin() {
    showMessage(messageBox, 'عالی بود، درست حدس زدی 🏆', 'success');
    shakeElement(messageBox);
    mysteryNumber.textContent = secretNumber;
    disableGuessing();
    resetBtn.focus();

    if(highScoreNumber < scoreNumber){
        highScoreNumber = scoreNumber;
        highScore.textContent = highScoreNumber;
    }
}

function handleWrongGuess(guess) {
    if (scoreNumber > 1) {
        // if user input is empty
        if (!guess) {
            showMessage(messageBox, 'لطفا عددی وارد کنید ⛔', 'error');
            shakeElement(messageBox);
            resetGuessInput();
            decreaseScore();
        }
        if (guess > secretNumber) {
            showMessage(messageBox, 'خیلی زیاده، عدد کمتری امتحان کن ⬇', 'warning');
            shakeElement(messageBox);
            resetGuessInput();
            decreaseScore();
            increaseAttempts();
        }
        if (guess < secretNumber && guess > 0) {
            showMessage(messageBox, 'خیلی کمه، عدد بیشتری امتحان کن ⬆', 'warning');
            shakeElement(messageBox);
            resetGuessInput();
            decreaseScore();
            increaseAttempts();
        }
    } else {
        showMessage(messageBox, 'باختی!', 'error');
        shakeElement(messageBox);
        disableGuessing();
        decreaseScore();
        resetBtn.focus();
    }
}

["click", "keypress"].forEach(event =>
    resetBtn.addEventListener(event, resetGame)
);

function resetGame() {
    // تولید عدد تصادفی جدید
    generateNewSecretNumber();
    resetGuessInput();

    mysteryNumber.textContent = '?';

    scoreNumber = 20;
    score.textContent = scoreNumber;
    attemptsNumber = 0;
    attempts.textContent = attemptsNumber;
    showMessage(messageBox, 'بازی را از ابتدا شروع کنید', 'error');
    shakeElement(messageBox);
    enableGuessing();
    guessInput.focus();

};

function checkGuess() {
    let guessNumber = Number(guessInput.value);
    console.log(guessNumber, 'how are you');
    if (guessNumber === secretNumber) {
        handleWin();
    }
    else {
        handleWrongGuess(guessNumber);
    }
}

guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkBtn.click();
    }
});

checkBtn.addEventListener('click', () => {
    console.log(Number(guessInput.value));
    checkGuess();
});

document.addEventListener('DOMContentLoaded', () => {
    guessInput.focus();
})