class GuessGameController {
    constructor() {
        // Game state
        this.state = {
            secretNumber: 0,
            score: 20,
            highScore: this.getStoredHighScore(),
            attempts: 0,
            isActive: true,
            language: this.getStoredLanguage(),
            theme: this.getStoredTheme()
        };

        // DOM elements
        this.elements = this.initElements();
        
        // Translations
        this.translations = this.initTranslations();
        
        // Initialize game
        this.init();
    }

    initElements() {
        return {
            // Game elements
            mysteryNumber: document.getElementById('mysteryNumber'),
            guessInput: document.getElementById('guessInput'),
            checkBtn: document.getElementById('checkBtn'),
            resetBtn: document.getElementById('resetBtn'),
            gameMessage: document.getElementById('gameMessage'),
            messageBox: document.getElementById('messageBox'),
            score: document.getElementById('score'),
            highScore: document.getElementById('highScore'),
            attempts: document.getElementById('attempts'),
            
            // Modal elements
            modalOverlay: document.getElementById('modalOverlay'),
            helpBtn: document.getElementById('helpBtn'),
            closeModal: document.getElementById('closeModal'),
            startBtn: document.getElementById('startBtn'),
            
            // Desktop control elements
            langToggle: document.getElementById('langToggle'),
            langText: document.getElementById('langText'),
            themeToggle: document.getElementById('themeToggle'),
            backBtn: document.getElementById('backBtn'),
            
            // Mobile elements
            menuBtn: document.getElementById('menuBtn'),
            sidebarOverlay: document.getElementById('sidebarOverlay'),
            sidebar: document.getElementById('sidebar'),
            closeSidebar: document.getElementById('closeSidebar'),
            sidebarBackBtn: document.getElementById('sidebarBackBtn'),
            sidebarLangToggle: document.getElementById('sidebarLangToggle'),
            sidebarLangText: document.getElementById('sidebarLangText'),
            sidebarThemeToggle: document.getElementById('sidebarThemeToggle'),
            sidebarHelpBtn: document.getElementById('sidebarHelpBtn')
        };
    }

    initTranslations() {
        return {
            fa: {
                start: 'آماده شروع؟',
                invalid: 'لطفاً عددی بین ۱ تا ۱۰۰ وارد کنید',
                tooHigh: 'خیلی زیاد! کمتر امتحان کن',
                tooLow: 'خیلی کم! بیشتر امتحان کن',
                correct: 'آفرین! درست حدس زدی!',
                newRecord: 'رکورد جدید! عالی بود!',
                gameOver: 'بازی تمام شد!'
            },
            en: {
                start: 'Ready to start?',
                invalid: 'Please enter a number between 1 and 100',
                tooHigh: 'Too high! Try lower',
                tooLow: 'Too low! Try higher',
                correct: 'Correct! Well done!',
                newRecord: 'New record! Excellent!',
                gameOver: 'Game over!'
            }
        };
    }

    init() {
        this.applyTheme();
        this.applyLanguage();
        this.startNewGame();
        this.bindEvents();
        this.updateDisplay();
    }

    bindEvents() {
        // Game controls
        this.elements.checkBtn.addEventListener('click', () => this.checkGuess());
        this.elements.resetBtn.addEventListener('click', () => this.startNewGame());
        
        // Input events
        this.elements.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkGuess();
        });
        
        this.elements.guessInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            if (e.target.value.length > 3) {
                e.target.value = e.target.value.slice(0, 3);
            }
        });
        
        // Modal events
        this.elements.helpBtn.addEventListener('click', () => this.showModal());
        this.elements.closeModal.addEventListener('click', () => this.hideModal());
        this.elements.startBtn.addEventListener('click', () => this.hideModal());
        this.elements.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.elements.modalOverlay) this.hideModal();
        });
        
        // Desktop theme and language
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.elements.langToggle.addEventListener('click', () => this.toggleLanguage());
        
        // Desktop back button
        this.elements.backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateToPortfolio();
        });
        
        // Mobile sidebar
        this.elements.menuBtn.addEventListener('click', () => this.showSidebar());
        this.elements.closeSidebar.addEventListener('click', () => this.hideSidebar());
        this.elements.sidebarOverlay.addEventListener('click', (e) => {
            if (e.target === this.elements.sidebarOverlay) this.hideSidebar();
        });
        
        // Mobile sidebar controls
        this.elements.sidebarThemeToggle.addEventListener('click', () => {
            this.toggleTheme();
            this.hideSidebar();
        });
        this.elements.sidebarLangToggle.addEventListener('click', () => {
            this.toggleLanguage();
            this.hideSidebar();
        });
        this.elements.sidebarBackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateToPortfolio();
        });
        this.elements.sidebarHelpBtn.addEventListener('click', () => {
            this.showModal();
            this.hideSidebar();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
                this.hideSidebar();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                this.hideSidebar();
            }
        });
    }

    startNewGame() {
        this.state.secretNumber = Math.floor(Math.random() * 20) + 1;
        this.state.score = 20;
        this.state.attempts = 0;
        this.state.isActive = true;
        
        this.elements.mysteryNumber.textContent = '?';
        this.elements.guessInput.value = '';
        this.elements.guessInput.disabled = false;
        this.elements.checkBtn.disabled = false;
        
        this.showMessage('start', 'fas fa-play-circle');
        this.updateDisplay();
        this.elements.guessInput.focus();
        
        console.log('Secret number:', this.state.secretNumber);
    }

    checkGuess() {
        if (!this.state.isActive) return;
        
        const guess = parseInt(this.elements.guessInput.value);
        
        if (!this.isValidGuess(guess)) {
            this.showMessage('invalid', 'fas fa-exclamation-triangle', 'error');
            this.shakeElement(this.elements.guessInput);
            return;
        }
        
        this.state.attempts++;
        
        if (guess === this.state.secretNumber) {
            this.handleWin();
        } else {
            this.handleWrongGuess(guess);
        }
        
        this.updateDisplay();
        this.elements.guessInput.value = '';
        
        if (this.state.isActive) {
            setTimeout(() => this.elements.guessInput.focus(), 100);
        }
    }

    isValidGuess(guess) {
        return guess && guess >= 1 && guess <= 100;
    }

    handleWin() {
        this.state.isActive = false;
        const isNewRecord = this.updateHighScore();
        
        this.elements.mysteryNumber.textContent = this.state.secretNumber;
        this.elements.guessInput.disabled = true;
        this.elements.checkBtn.disabled = true;
        
        const messageKey = isNewRecord ? 'newRecord' : 'correct';
        this.showMessage(messageKey, 'fas fa-trophy', 'success');
    }

    handleWrongGuess(guess) {
        this.state.score = Math.max(0, this.state.score - 1);
        
        if (this.state.score === 0) {
            this.handleGameOver();
        } else {
            const messageKey = guess > this.state.secretNumber ? 'tooHigh' : 'tooLow';
            const icon = guess > this.state.secretNumber ? 'fas fa-arrow-down' : 'fas fa-arrow-up';
            this.showMessage(messageKey, icon, 'warning');
            this.shakeElement(this.elements.guessInput);
        }
    }

    handleGameOver() {
        this.state.isActive = false;
        this.elements.mysteryNumber.textContent = this.state.secretNumber;
        this.elements.guessInput.disabled = true;
        this.elements.checkBtn.disabled = true;
        this.showMessage('gameOver', 'fas fa-times-circle', 'error');
    }

    updateHighScore() {
        if (this.state.score > this.state.highScore) {
            this.state.highScore = this.state.score;
            localStorage.setItem('guessGameHighScore', this.state.highScore);
            return true;
        }
        return false;
    }

    updateDisplay() {
        this.elements.score.textContent = this.state.score;
        this.elements.highScore.textContent = this.state.highScore;
        this.elements.attempts.textContent = this.state.attempts;
    }

    showMessage(key, icon = 'fas fa-info-circle', type = 'normal') {
        const message = this.translations[this.state.language][key];
        
        this.elements.messageBox.innerHTML = `
            <div class="flex items-center justify-center gap-3">
                <i class="${icon} ${this.getIconColor(type)}"></i>
                <span class="text-gray-700 dark:text-gray-300 font-medium text-sm lg:text-base">${message}</span>
            </div>
        `;
        
        // Remove existing state classes
        this.elements.messageBox.classList.remove('success', 'error', 'warning');
        
        // Add animation and state class
        this.elements.messageBox.classList.add('animate-fade-in');
        if (type !== 'normal') {
            this.elements.messageBox.classList.add(type);
        }
        
        // Remove animation class after animation completes
        setTimeout(() => {
            this.elements.messageBox.classList.remove('animate-fade-in');
        }, 300);
    }

    getIconColor(type) {
        const colors = {
            normal: 'text-blue-600 dark:text-blue-400',
            success: 'text-green-600 dark:text-green-400',
            error: 'text-red-600 dark:text-red-400',
            warning: 'text-yellow-600 dark:text-yellow-400'
        };
        return colors[type] || colors.normal;
    }

    shakeElement(element) {
        element.classList.add('animate-shake');
        setTimeout(() => element.classList.remove('animate-shake'), 300);
    }

    toggleTheme() {
        this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('guessGameTheme', this.state.theme);
        this.applyTheme();
    }

    applyTheme() {
        const html = document.documentElement;
        if (this.state.theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }

    toggleLanguage() {
        this.state.language = this.state.language === 'fa' ? 'en' : 'fa';
        localStorage.setItem('guessGameLanguage', this.state.language);
        this.applyLanguage();
    }

    applyLanguage() {
        const html = document.documentElement;
        const body = document.body;
        
        html.lang = this.state.language;
        body.dir = this.state.language === 'fa' ? 'rtl' : 'ltr';
        
        // Update language toggle buttons
        this.elements.langText.textContent = this.state.language === 'fa' ? 'EN' : 'فا';
        this.elements.sidebarLangText.textContent = this.state.language === 'fa' ? 'EN' : 'فا';
        
        // Update all translatable elements
        document.querySelectorAll('[data-en][data-fa]').forEach(element => {
            const key = this.state.language === 'en' ? 'data-en' : 'data-fa';
            element.textContent = element.getAttribute(key);
        });
        
        // Update current message if game is active
        if (this.state.isActive) {
            this.showMessage('start', 'fas fa-play-circle');
        }
    }

    showModal() {
        this.elements.modalOverlay.classList.remove('hidden');
        this.elements.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        this.elements.modalOverlay.classList.add('hidden');
        this.elements.modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    showSidebar() {
        this.elements.sidebarOverlay.classList.remove('hidden');
        this.elements.sidebar.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    hideSidebar() {
        this.elements.sidebar.classList.remove('open');
        setTimeout(() => {
            this.elements.sidebarOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 300);
    }

    navigateToPortfolio() {
        // Add your portfolio navigation logic here
        console.log('Navigate to portfolio');
        // Example: window.location.href = '/portfolio';
    }

    // Storage helpers
    getStoredHighScore() {
        return parseInt(localStorage.getItem('guessGameHighScore')) || 0;
    }

    getStoredLanguage() {
        return localStorage.getItem('guessGameLanguage') || 'fa';
    }

    getStoredTheme() {
        return localStorage.getItem('guessGameTheme') || 'dark';
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GuessGameController();
});

// Export for custom modifications
window.GuessGameController = GuessGameController;