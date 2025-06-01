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
const secretNumber = Math.floor(Math.random() * highestNumberLimit) + 1;
let scoreNumber = 20;
let highScore = 0;
let attempts = 0;

console.log(secretNumber);

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

function decreaseScore(){
    scoreNumber--;
    score.textContent = scoreNumber;
}

function handleWin(){
    showMessage(messageBox, 'عالی بود، درست حدس زدی 🏆', 'success');
    shakeElement(messageBox);
    disableGuessing();
    resetBtn.focus();
}

function handleWrongGuess(guess){
    if(guess > highestNumberLimit || guess < 1){
        showMessage(messageBox, 'عدد وارد شده خارج از محدوده است', 'error');
        shakeElement(messageBox);
        resetGuessInput();
    }
    if (guess > secretNumber){
        showMessage(messageBox, 'خیلی زیاده، عدد کمتری امتحان کن ⬇', 'warning');
        shakeElement(messageBox);
        resetGuessInput();
        decreaseScore();
    }
    else if( guess < secretNumber){
        showMessage(messageBox, 'خیلی کمه، عدد بیشتری امتحان کن ⬆', 'warning');
        shakeElement(messageBox);
        resetGuessInput();
        decreaseScore();
    }
}

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