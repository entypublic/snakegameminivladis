// Переводы
const translations = {
    ru: {
        start: 'СТАРТ',
        back: 'Назад',
        bet_title: 'Введите сумму ставки',
        bet_amount: 'Сумма ставки:',
        confirm: 'ПОДТВЕРДИТЬ',
        sync_title: 'Синхронизация данных',
        extracting_handshake: 'Извлечение хендшейка...',
        establishing_connection: 'Установка соединения...',
        checking_strategy: 'Проверка стратегии торговли...',
        validating_session: 'Валидация сессии...',
        analyzing_patterns: 'Анализ паттернов полёта...',
        calculating_trajectory: 'Расчёт траектории...',
        analysis: 'Анализ полётных данных...',
        result_title: 'Результат анализа',
        result_text: 'На основе анализа полётных данных:<br><br>Вам осталось <span class="result-highlight">{bets}</span> ставок со ставкой <span class="result-highlight">{amount}₽</span> до заноса <span class="result-highlight">X{multiplier}</span> с вероятностью <span class="result-highlight">{chance}%</span>',
        restart: 'НАЧАТЬ ЗАНОВО',
        close: 'ЗАКРЫТЬ',
        data_points: 'Точек данных:',
        accuracy: 'Точность прогноза:'
    },
    en: {
        start: 'START',
        back: 'Back',
        bet_title: 'Enter bet amount',
        bet_amount: 'Bet amount:',
        confirm: 'CONFIRM',
        sync_title: 'Data synchronization',
        extracting_handshake: 'Extracting handshake...',
        establishing_connection: 'Establishing connection...',
        checking_strategy: 'Checking trading strategy...',
        validating_session: 'Validating session...',
        analyzing_patterns: 'Analyzing flight patterns...',
        calculating_trajectory: 'Calculating trajectory...',
        analysis: 'Analyzing flight data...',
        result_title: 'Analysis result',
        result_text: 'Based on flight data analysis:<br><br>You have <span class="result-highlight">{bets}</span> bets left with <span class="result-highlight">{amount}₽</span> stake until <span class="result-highlight">X{multiplier}</span> win with <span class="result-highlight">{chance}%</span> probability',
        restart: 'START AGAIN',
        close: 'CLOSE',
        data_points: 'Data points:',
        accuracy: 'Forecast accuracy:'
    }
};

// Текущий язык
let currentLang = 'ru';
let userBetAmount = 0;

// Переменные для интервалов
let syncInterval = null;
let analysisInterval = null;

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupClouds();
    startTypewriter();
    initializeLanguageSelector();
    initializeStartButton();
    initializeBackButton();
    initializeModals();
    updateLanguage();
}

// Настройка облаков
function setupClouds() {
    const clouds = document.querySelectorAll('.cloud');
    clouds.forEach(cloud => {
        const randomDelay = Math.random() * 10;
        const randomDuration = 20 + Math.random() * 15;
        cloud.style.animationDelay = `-${randomDelay}s`;
        cloud.style.animationDuration = `${randomDuration}s`;
    });
}

// Инициализация селектора языка
function initializeLanguageSelector() {
    const languageToggle = document.getElementById('languageToggle');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageOptions = document.querySelectorAll('.language-option');

    languageToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        languageDropdown.classList.toggle('show');
    });

    languageOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const selectedLang = option.dataset.lang;
            if (selectedLang !== currentLang) {
                currentLang = selectedLang;
                updateLanguage();
                updateLanguageDisplay();
            }
            languageDropdown.classList.remove('show');
        });
    });

    // Закрытие дропдауна при клике вне его
    document.addEventListener('click', () => {
        languageDropdown.classList.remove('show');
    });
}

// Обновление отображения языка
function updateLanguageDisplay() {
    const currentFlag = document.getElementById('currentFlag');
    const currentLangSpan = document.getElementById('currentLang');

    if (currentLang === 'ru') {
        currentFlag.innerHTML = `
            <rect width="32" height="8" fill="#ffffff"/>
            <rect width="32" height="8" y="8" fill="#0052b4"/>
            <rect width="32" height="8" y="16" fill="#d90012"/>
        `;
        currentLangSpan.textContent = 'RU';
    } else {
        currentFlag.innerHTML = `
            <rect width="32" height="24" fill="#012169"/>
            <path d="M0 0v24h32V0z" fill="#012169"/>
            <path d="M0 0l32 24M32 0L0 24" stroke="#ffffff" stroke-width="2"/>
            <path d="M16 0v24M0 12h32" stroke="#ffffff" stroke-width="4"/>
            <path d="M0 0l32 24M32 0L0 24" stroke="#c8102e" stroke-width="1"/>
            <path d="M16 0v24M0 12h32" stroke="#c8102e" stroke-width="2"/>
        `;
        currentLangSpan.textContent = 'EN';
    }
}

// Обновление текстов по языку
function updateLanguage() {
    const elements = document.querySelectorAll('[data-lang-key]');
    elements.forEach(element => {
        const key = element.dataset.langKey;
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
}

// Инициализация кнопки старт
function initializeStartButton() {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        showBetModal();
    });
}

// Инициализация кнопки назад
function initializeBackButton() {
    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => {
        // Используем history.back() для возврата на предыдущую страницу
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // Если истории нет, можно редиректить на главную или показать сообщение
            console.log('Нет предыдущей страницы в истории');
        }
    });
}

// Инициализация модальных окон
function initializeModals() {
    // Модальное окно ставки
    const confirmBetBtn = document.getElementById('confirmBet');
    confirmBetBtn.addEventListener('click', () => {
        const betAmount = document.getElementById('betAmount').value;
        if (betAmount && betAmount > 0) {
            userBetAmount = parseInt(betAmount);
            hideBetModal();
            startSynchronization();
        }
    });

    // Кнопки закрытия
    const closeBetBtn = document.getElementById('closeBetBtn');
    const closeResultBtn = document.getElementById('closeResultBtn');
    const closeBtn = document.getElementById('closeBtn');
    
    if (closeBetBtn) {
        closeBetBtn.addEventListener('click', hideBetModal);
    }
    
    if (closeResultBtn) {
        closeResultBtn.addEventListener('click', () => {
            hideResultModal();
            resetGame();
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            hideResultModal();
            resetGame();
        });
    }

    // Кнопка перезапуска
    const restartBtn = document.getElementById('restartBtn');
    restartBtn.addEventListener('click', () => {
        hideResultModal();
        resetGame();
    });

    // Закрытие модальных окон по клику вне контента
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (modal.id === 'resultModal') {
                    // При закрытии результата - полный сброс
                    hideResultModal();
                    resetGame();
                } else {
                    // Для других модальных окон просто скрыть
                    hideAllModals();
                }
            }
        });
    });
}

// Показать модальное окно ставки
function showBetModal() {
    const modal = document.getElementById('betModal');
    const betAmountInput = document.getElementById('betAmount');
    
    modal.classList.add('show');
    setTimeout(() => {
        betAmountInput.focus();
    }, 300);
}

// Скрыть модальное окно ставки
function hideBetModal() {
    const modal = document.getElementById('betModal');
    modal.classList.remove('show');
}

// Начать синхронизацию
function startSynchronization() {
    const modal = document.getElementById('syncModal');
    const syncFill = document.getElementById('syncFill');
    const syncPercentage = document.getElementById('syncPercentage');
    const syncStatus = document.getElementById('syncStatus');
    
    const syncSteps = [
        'extracting_handshake',
        'establishing_connection',
        'checking_strategy',
        'validating_session',
        'analyzing_patterns',
        'calculating_trajectory'
    ];
    
    modal.classList.add('show');
    
    let currentStep = 0;
    let progress = 0;
    
    // Начальное обновление текста
    syncStatus.textContent = translations[currentLang][syncSteps[currentStep]];
    
    syncInterval = setInterval(() => {
        // Увеличиваем скорость для сокращения времени
        progress += Math.random() * 18 + 7; // Случайное увеличение на 7-25%
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(syncInterval);
            syncInterval = null;
            
            setTimeout(() => {
                hideSyncModal();
                startFlightAnalysis();
            }, 500);
        }
        
        // Обновление шага с более детальной логикой
        const stepProgress = 100 / syncSteps.length;
        const targetStep = Math.floor(progress / stepProgress);
        
        if (targetStep > currentStep && targetStep < syncSteps.length) {
            currentStep = targetStep;
            syncStatus.textContent = translations[currentLang][syncSteps[currentStep]];
        }
        
        // Обновление прогресса
        syncFill.style.width = progress + '%';
        syncPercentage.textContent = Math.round(progress) + '%';
        
    }, 300 + Math.random() * 400); // Сокращенная задержка 300-700мс
}

// Скрыть модальное окно синхронизации
function hideSyncModal() {
    const modal = document.getElementById('syncModal');
    modal.classList.remove('show');
}

// Начать анализ полета
function startFlightAnalysis() {
    // Скрыть кнопку старт
    const startContainer = document.getElementById('startContainer');
    startContainer.classList.add('hidden');
    
    // Показать прогресс анализа
    const analysisProgress = document.getElementById('analysisProgress');
    const progressFill = document.getElementById('progressFill');
    const progressPercentage = document.getElementById('progressPercentage');
    
    analysisProgress.classList.add('show');
    
    // Запустить анимацию самолета
    const plane = document.getElementById('plane');
    plane.classList.add('plane-flying');
    
    // Прогресс анализа синхронизирован с анимацией самолета
    let progress = 0;
    const analysisTime = 4500; // 4.5 секунды - время анимации самолета
    const updateInterval = 200; // Обновляем каждые 200мс
    const totalUpdates = analysisTime / updateInterval; // Количество обновлений
    const progressStep = 100 / totalUpdates; // Шаг прогресса за обновление
    
    analysisInterval = setInterval(() => {
        progress += progressStep + Math.random() * 2; // Небольшая вариация
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(analysisInterval);
            analysisInterval = null;
            
            setTimeout(() => {
                hideAnalysisProgress();
                showResult();
            }, 500);
        }
        
        progressFill.style.width = progress + '%';
        progressPercentage.textContent = Math.round(progress) + '%';
        
    }, updateInterval);
    
    // Убрать анимацию самолета через 4.5 секунды - синхронно с анализом
    setTimeout(() => {
        plane.classList.remove('plane-flying');
    }, analysisTime);
}

// Скрыть прогресс анализа
function hideAnalysisProgress() {
    const analysisProgress = document.getElementById('analysisProgress');
    analysisProgress.classList.remove('show');
}

// Показать результат
function showResult() {
    const modal = document.getElementById('resultModal');
    const resultText = document.getElementById('resultText');
    
    // Генерация случайных данных
    const betsLeft = Math.floor(Math.random() * 21) + 10; // 10-30
    const multiplier = Math.floor(Math.random() * 71) + 20; // 20-90
    const chance = Math.floor(Math.random() * 31) + 60; // 60-90
    
    // Генерация деталей анализа
    const dataPoints = Math.floor(Math.random() * 500) + 1500; // 1500-2000 точек
    const accuracy = Math.floor(Math.random() * 15) + 85; // 85-99%
    
    // Обновление деталей анализа
    document.getElementById('dataPoints').textContent = dataPoints.toLocaleString();
    document.getElementById('accuracy').textContent = accuracy + '%';
    
    // Формирование текста результата
    const text = translations[currentLang].result_text
        .replace('{bets}', betsLeft)
        .replace('{amount}', userBetAmount)
        .replace('{multiplier}', multiplier)
        .replace('{chance}', chance);
    
    resultText.innerHTML = text;
    modal.classList.add('show');
}

// Скрыть модальное окно результата
function hideResultModal() {
    const modal = document.getElementById('resultModal');
    modal.classList.remove('show');
}

// Скрыть все модальные окна
function hideAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
}

// Сброс игры
function resetGame() {
    // Остановить все интервалы
    if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
    }
    if (analysisInterval) {
        clearInterval(analysisInterval);
        analysisInterval = null;
    }
    
    // Показать кнопку старт
    const startContainer = document.getElementById('startContainer');
    startContainer.classList.remove('hidden');
    
    // Скрыть прогресс анализа
    const analysisProgress = document.getElementById('analysisProgress');
    analysisProgress.classList.remove('show');
    
    // Убрать анимацию самолета если она есть
    const plane = document.getElementById('plane');
    plane.classList.remove('plane-flying');
    
    // Сбросить значения
    userBetAmount = 0;
    document.getElementById('betAmount').value = '';
    
    // Сбросить прогресс-бары
    document.getElementById('syncFill').style.width = '0%';
    document.getElementById('syncPercentage').textContent = '0%';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('progressPercentage').textContent = '0%';
    
    // Сбросить статус синхронизации
    document.getElementById('syncStatus').textContent = translations[currentLang].extracting_handshake;
    
    // Сбросить детали анализа
    document.getElementById('dataPoints').textContent = '--';
    document.getElementById('accuracy').textContent = '--';
}

// Генератор хендшейка
function startTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    const chars = 'abcdef0123456789';
    
    function generateHandshake() {
        let handshake = '';
        const length = 12 + Math.floor(Math.random() * 8); // 12-20 символов
        
        for (let i = 0; i < length; i++) {
            handshake += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        typewriterElement.textContent = handshake;
    }
    
    // Генерируем новый хендшейк каждые 2 секунды
    generateHandshake();
    setInterval(generateHandshake, 2000);
}

// Debug информация
console.log('🚢 AviaMASTER: Мобильная версия инициализирована');
console.log('📱 Модальные окна готовы');
console.log('✈️ Анимации самолета подключены');
console.log('🌍 Мультиязычность активирована'); 