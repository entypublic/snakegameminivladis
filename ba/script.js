const gameContainer = document.querySelector('.game-container');
const balloon = document.querySelector('.balloon');
const valueDisplay = document.querySelector('.value');
const predictButton = document.getElementById('predictButton');
const backButton = document.getElementById('backButton');
const telegramButton = document.getElementById('telegramButton');
const currencyModal = document.getElementById('currencyModal');
const currencyBtns = document.querySelectorAll('.currency-btn');
const currencyNotification = document.getElementById('currencyNotification');
const currencyText = document.getElementById('currencyText');
const stars = document.querySelector('.stars');
const meteors = document.querySelectorAll('.meteor');
const saturn = document.querySelector('.saturn');

let isAnimating = false;
let targetMultiplier = 1.0;
let saturnInterval;

// Функция для создания случайного метеора
function createRandomMeteor() {
    const delay = Math.random() * 15; // Случайная задержка до 15 секунд
    const leftPos = Math.random() * 80; // Случайная позиция слева (0-80%)
    const topPos = Math.random() * 40; // Случайная позиция сверху (0-40%)
    
    setTimeout(() => {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        meteor.style.left = `${leftPos}%`;
        meteor.style.top = `${topPos}%`;
        
        document.querySelector('.space-elements').appendChild(meteor);
        
        // Удаляем метеор после анимации
        setTimeout(() => {
            meteor.remove();
            // Создаем новый метеор
            createRandomMeteor();
        }, 8000); // Длительность анимации
    }, delay * 1000);
}

// Функция для перемещения Сатурна
function moveSaturn() {
    // Сначала скрываем Сатурн
    saturn.style.opacity = '0';
    
    // Через 1.5 секунды (когда Сатурн полностью исчезнет) меняем его позицию
    setTimeout(() => {
        // Случайная позиция
        const topPos = 5 + Math.random() * 30; // от 5% до 35% сверху
        const rightPos = 5 + Math.random() * 30; // от 5% до 35% справа
        
        saturn.style.top = `${topPos}%`;
        saturn.style.right = `${rightPos}%`;
        
        // Показываем Сатурн снова
        saturn.style.opacity = '1';
    }, 1500);
}

// Запускаем интервал для перемещения Сатурна
function startSaturnMovement() {
    // Сначала очищаем предыдущий интервал, если он был
    if (saturnInterval) {
        clearInterval(saturnInterval);
    }
    
    // Случайный интервал от 15 до 30 секунд
    const interval = 15000 + Math.random() * 15000;
    saturnInterval = setInterval(moveSaturn, interval);
}

function showCurrencyModal() {
    currencyModal.classList.add('show');
}

function hideCurrencyModal() {
    currencyModal.classList.remove('show');
}

function showCurrencyNotification(currency, symbol) {
    currencyText.textContent = `Generating signal for ${currency} ${symbol}`;
    currencyNotification.classList.remove('hide');
    currencyNotification.classList.add('show');
}

function hideCurrencyNotification() {
    currencyNotification.classList.remove('show');
    currencyNotification.classList.add('hide');
}

async function startSignalGeneration(currency, symbol) {
    // Скрываем модальное окно
    hideCurrencyModal();
    
    // Показываем уведомление о выбранной валюте
    showCurrencyNotification(currency, symbol);
    
    // Выводим информацию в консоль
    console.log(`Signal request for currency: ${currency} (${symbol})`);
    
    isAnimating = true;
    predictButton.disabled = true;
    backButton.classList.add('disabled');
    telegramButton.classList.add('disabled');

    await resetBalloon();
    
    targetMultiplier = getRandomMultiplier();
    
    // Увеличиваем длительность анимации для более медленного накопления значения
    const animationDuration = parseFloat(targetMultiplier) > 5 ? 5000 : 4000;
    animate(1.0, parseFloat(targetMultiplier), animationDuration);
    
    // Запускаем случайный метеор при каждом клике
    const meteor = document.querySelector('.meteor');
    if (meteor) {
        meteor.style.animation = 'none';
        void meteor.offsetWidth; // Форсируем перерисовку
        meteor.style.animation = 'meteor-fall 8s 1';
    }
    
    // Включаем кнопки после завершения анимации
    setTimeout(() => {
        backButton.classList.remove('disabled');
        telegramButton.classList.remove('disabled');
        predictButton.disabled = false;
        
        // Скрываем уведомление о валюте
        hideCurrencyNotification();
        
        // Выводим результат с учетом валюты
        console.log(`Result for ${currency}: ${targetMultiplier}x`);
    }, animationDuration + 500);
}

function getRandomMultiplier() {
    // Генерируем случайное значение с двумя десятичными знаками (сотыми)
    return (1.20 + Math.random() * 8.80).toFixed(2);
}

function updateBalloon(multiplier) {
    // Отображаем значение с двумя десятичными знаками (сотыми)
    valueDisplay.textContent = parseFloat(multiplier).toFixed(2) + 'x';
    
    // Увеличиваем масштаб шара в зависимости от значения X
    const baseScale = 1;
    const maxScale = 1.8; // Уменьшаем максимальный масштаб
    const scaleProgress = (multiplier - 1) / 9;
    const scale = baseScale + (maxScale - baseScale) * scaleProgress;
    
    // Вычисляем высоту подъема в зависимости от множителя
    // Используем отрицательные значения для подъема вверх
    // Начинаем с -70% (начальная позиция) и поднимаемся до -85% при максимальном значении
    // Ограничиваем максимальную высоту подъема, чтобы шарик не достигал заголовка
    const maxLift = 15; // Уменьшаем максимальный подъем в процентах с 30 до 15
    const liftHeight = -70 - (maxLift * scaleProgress); // От -70% до -85%
    
    // Устанавливаем CSS-переменную для высоты подъема (используется в анимации покачивания)
    balloon.style.setProperty('--lift-height', `${liftHeight}%`);
    
    // Применяем трансформацию: подъем и центрирование по горизонтали
    balloon.style.transform = `translate(-50%, ${liftHeight}%)`;
    balloon.style.scale = scale.toFixed(2);
    
    // Изменяем класс flying в зависимости от множителя
    balloon.classList.add('flying');
    
    // Добавляем класс flying для контейнера игры, чтобы активировать анимацию фона
    gameContainer.classList.add('flying');
    
    // Добавляем класс high-flying при высоких значениях множителя
    if (multiplier > 5) {
        balloon.classList.add('high-flying');
        gameContainer.classList.add('high-flying');
    } else {
        balloon.classList.remove('high-flying');
        gameContainer.classList.remove('high-flying');
    }
    
    // Увеличиваем интенсивность свечения Сатурна при высоких значениях множителя
    if (multiplier > 5) {
        const glowIntensity = 0.3 + (multiplier - 5) / 10; // От 0.3 до 0.8
        saturn.style.filter = `drop-shadow(0 0 25px rgba(255, 255, 255, ${glowIntensity}))`;
    }
}

function resetBalloon() {
    return new Promise(resolve => {
        // Удаляем классы анимации
        balloon.classList.remove('flying');
        balloon.classList.remove('high-flying');
        
        // Удаляем классы анимации для контейнера игры
        gameContainer.classList.remove('flying');
        gameContainer.classList.remove('high-flying');
        
        // Устанавливаем короткий переход для сброса
        balloon.style.transition = 'transform 1s ease, scale 1s ease';
        
        // Сбрасываем CSS-переменную для высоты подъема
        balloon.style.setProperty('--lift-height', '-70%');
        
        // Возвращаем шарик в начальную позицию
        balloon.style.transform = 'translate(-50%, -70%)';
        balloon.style.scale = '1';
        valueDisplay.textContent = '1.00x';
        
        // Сбрасываем свечение Сатурна
        saturn.style.filter = 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.3))';
        
        // Сбрасываем позицию фоновых элементов (кроме звезд, которые управляются через CSS-анимации)
        document.querySelectorAll('.space-elements, .nebula, .saturn').forEach(element => {
            element.style.transform = '';
        });
        
        // Сбрасываем анимацию фоновых звезд, чтобы она перезапустилась
        stars.style.animation = 'none';
        void stars.offsetWidth; // Форсируем перерисовку
        stars.style.animation = 'stars-drift 120s infinite linear';
        
        // Сбрасываем анимации отдельных звезд
        document.querySelectorAll('.star').forEach(star => {
            // Сохраняем оригинальный класс звезды
            const starClass = star.className;
            
            // Сбрасываем анимацию
            star.style.animation = 'none';
            star.style.transform = '';
            
            // Форсируем перерисовку
            void star.offsetWidth;
            
            // Восстанавливаем оригинальную анимацию в зависимости от типа звезды
            if (starClass.includes('star-small')) {
                star.style.animation = 'twinkle-small 3s infinite alternate';
            } else if (starClass.includes('star-medium')) {
                star.style.animation = 'twinkle-medium 4s infinite alternate';
            } else if (starClass.includes('star-large')) {
                star.style.animation = 'twinkle-large 5s infinite alternate';
            } else if (starClass.includes('star-bright')) {
                star.style.animation = 'pulse-bright 2s infinite alternate';
            } else if (starClass.includes('star-colored')) {
                star.style.animation = 'color-shift 8s infinite alternate';
            }
        });
        
        setTimeout(() => {
            // Возвращаем более длительный переход для плавного подъема
            balloon.style.transition = 'transform 3s cubic-bezier(0.19, 1, 0.22, 1), scale 3s cubic-bezier(0.19, 1, 0.22, 1)';
            resolve();
        }, 800);
    });
}

// Функция для динамического изменения интенсивности смещения фона
function updateBackgroundShift(multiplier) {
    // Вычисляем смещение фона в зависимости от множителя
    const baseShift = 10; // Базовое смещение в vh
    const maxShift = 30; // Уменьшаем максимальное смещение в vh с 40 до 30
    const shiftProgress = (multiplier - 1) / 9;
    const shift = baseShift + (maxShift - baseShift) * shiftProgress;
    
    // Устанавливаем CSS-переменные для смещения фона
    gameContainer.style.setProperty('--background-shift', `${shift}vh`);
    gameContainer.style.setProperty('--background-shift-high', `${shift * 1.2}vh`); // Уменьшаем множитель с 1.3 до 1.2
}

function animate(startValue, endValue, duration) {
    const startTime = performance.now();
    isAnimating = true;
    predictButton.disabled = true;

    // Устанавливаем плавный переход для подъема
    balloon.style.transition = 'transform 3s cubic-bezier(0.19, 1, 0.22, 1), scale 3s cubic-bezier(0.19, 1, 0.22, 1)';
    
    // Сразу начинаем подъем шарика
    balloon.classList.add('flying');
    gameContainer.classList.add('flying');

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Используем более плавную функцию анимации с замедлением накопления значения X
        const easeProgress = easeOutQuart(progress);
        const currentValue = startValue + (endValue - startValue) * easeProgress;
        
        // Обновляем смещение фона в зависимости от текущего значения множителя
        updateBackgroundShift(currentValue);
        
        // Округляем до двух десятичных знаков (сотых) для отображения
        updateBalloon(currentValue.toFixed(2));

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            isAnimating = false;
            
            // Добавляем небольшую задержку перед тем, как разрешить новую анимацию
            setTimeout(() => {
                predictButton.disabled = false;
            }, 500);
        }
    }

    requestAnimationFrame(update);
}

// Добавляем новую функцию анимации для более медленного накопления значения
function easeOutQuart(x) {
    // Эта функция начинается быстро, но затем замедляется
    return 1 - Math.pow(1 - x, 4);
}

// Обработчик для кнопки Get Signal - показывает модальное окно выбора валюты
predictButton.addEventListener('click', () => {
    if (isAnimating) return;
    showCurrencyModal();
});

// Обработчики для кнопок валют
currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const currency = btn.getAttribute('data-currency');
        const symbol = btn.getAttribute('data-symbol');
        startSignalGeneration(currency, symbol);
    });
});

// Закрытие модального окна при клике вне его
currencyModal.addEventListener('click', (e) => {
    if (e.target === currencyModal) {
        hideCurrencyModal();
    }
});

// Инициализация начального состояния
updateBalloon(1.00);

// Устанавливаем начальную позицию шарика и плавный переход
balloon.style.setProperty('--lift-height', '-70%');
balloon.style.transform = 'translate(-50%, -70%)';
balloon.style.scale = '1';
balloon.style.transition = 'transform 3s cubic-bezier(0.19, 1, 0.22, 1), scale 3s cubic-bezier(0.19, 1, 0.22, 1)';

// Запускаем случайные метеоры
for (let i = 0; i < 3; i++) {
    createRandomMeteor();
}

// Запускаем перемещение Сатурна
startSaturnMovement(); 