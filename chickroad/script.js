const GAME_MODES = {
    easy: [1.03, 1.07, 1.12, 1.17, 1.23, 1.29, 1.36, 1.44, 1.53, 1.63, 1.75, 1.88, 2.04, 2.22, 2.45, 2.72, 3.06, 3.50, 4.08, 4.90, 6.13, 6.61, 9.81, 19.44],
    medium: [1.12, 1.28, 1.47, 1.70, 1.98, 2.33, 2.76, 3.32, 4.03, 4.96, 6.20, 6.91, 8.90, 11.74, 15.99, 22.61, 33.58, 53.20, 92.17, 182.51, 451.71, 1788.80],
    hard: [1.23, 1.55, 1.98, 2.56, 3.36, 4.49, 5.49, 7.53, 10.56, 15.21, 22.59, 34.79, 55.97, 94.99, 172.42, 341.40, 760.46, 2007.63, 6956.47, 41321.43],
    hardcore: [1.63, 2.80, 4.95, 9.08, 15.21, 30.12, 62.96, 140.24, 337.19, 890.19, 2643.89, 9161.08, 39301.05, 233448.29, 2542251.93]
};

let currentGameMode = 'easy';
let gameInProgress = false;
let gameFinished = false;

// Элементы DOM
const chicken = document.getElementById('chicken');
const getSignalBtn = document.getElementById('getSignalBtn');
const backBtn = document.getElementById('backBtn');
const modeButtons = document.querySelectorAll('.mode-btn');
const tunnel = document.querySelector('.tunnel');

// Обработчики выбора режима игры
modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (gameInProgress) return; // Не позволяем менять режим во время игры
        
        // Убираем активный класс у всех кнопок
        modeButtons.forEach(btn => btn.classList.remove('active'));
        
        // Добавляем активный класс текущей кнопке
        button.classList.add('active');
        
        // Устанавливаем новый режим
        currentGameMode = button.dataset.mode;
        
        // Очистка если игра закончена
        if (gameFinished) {
            cleanupAllGameElements();
            gameFinished = false;
        }
        
        console.log(`Режим игры изменен на: ${currentGameMode}`);
    });
});

// Обработчик кнопки Back
backBtn.addEventListener('click', () => {
    window.history.back();
});

// Обработчик кнопки получения сигнала
getSignalBtn.addEventListener('click', async () => {
    if (gameInProgress) return;
    
    gameInProgress = true;
    getSignalBtn.disabled = true;
    
    // Отключаем кнопки выбора режима во время игры
    modeButtons.forEach(btn => btn.disabled = true);
    
    try {
        // ВАЖНО: Полная очистка перед началом новой игры
        await cleanupAllGameElements();
        gameFinished = false;
        
        await playGameSequence();
    } catch (error) {
        console.error('Ошибка в игре:', error);
        await cleanupAllGameElements();
    } finally {
        gameInProgress = false;
        getSignalBtn.disabled = false;
        modeButtons.forEach(btn => btn.disabled = false);
        gameFinished = true;
    }
});

// Полная очистка всех игровых элементов
function cleanupAllGameElements() {
    return new Promise(resolve => {
        // Убираем все динамически созданные элементы
        const fireAnimations = document.querySelectorAll('.fire-animation');
        const deadChickenContainers = document.querySelectorAll('.dead-chicken-container');
        
        fireAnimations.forEach(element => element.remove());
        deadChickenContainers.forEach(element => element.remove());
        
        // Показываем живую курицу
        chicken.style.display = 'block';
        
        // Убираем все классы анимации
        chicken.classList.remove('jumping');
        
        console.log('Все игровые элементы очищены');
        resolve();
    });
}

// Основная игровая последовательность
async function playGameSequence() {
    console.log(`Запуск игры в режиме: ${currentGameMode}`);
    
    // 1. Курица прыгает
    await chickenJump();
    
    // 2. Воспроизводим анимацию огня с превращением курицы во время огня
    await playFireAnimationWithTransformation();
    
    // 3. Игра завершается - результат остается до новой игры или смены режима
    console.log('Игра завершена - результат останется до новой игры');
}

// Анимация прыжка курицы
function chickenJump() {
    return new Promise(resolve => {
        chicken.classList.add('jumping');
        
        setTimeout(() => {
            chicken.classList.remove('jumping');
            resolve();
        }, 800);
    });
}

// Воспроизведение анимации огня с превращением курицы во время огня
function playFireAnimationWithTransformation() {
    return new Promise(resolve => {
        const fireContainer = document.createElement('div');
        fireContainer.className = 'fire-animation';
        
        const fireImg = document.createElement('img');
        fireContainer.appendChild(fireImg);
        
        tunnel.appendChild(fireContainer);
        
        let currentFrame = 0;
        const totalFrames = 22; // fire_0.webp до fire_21.webp
        const transformFrame = Math.floor(totalFrames / 2); // Превращаем курицу в середине анимации огня
        
        function updateFrame() {
            fireImg.src = `fire_${currentFrame}.webp`;
            fireImg.onerror = () => {
                console.warn(`Кадр fire_${currentFrame}.webp не найден`);
                fireImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==';
            };
            
            // Превращаем курицу в середине анимации огня
            if (currentFrame === transformFrame) {
                transformChickenToDead();
            }
            
            currentFrame++;
            
            if (currentFrame < totalFrames) {
                setTimeout(updateFrame, 82); // ~1.8 секунды на 22 кадра
            } else {
                // Удаляем анимацию огня после завершения
                fireContainer.remove();
                resolve();
            }
        }
        
        updateFrame();
    });
}

// Превращаем курицу в мертвую во время огня
function transformChickenToDead() {
    // Скрываем живую курицу
    chicken.style.display = 'none';
    
    // Создаем контейнер для мертвой курицы
    const deadChickenContainer = document.createElement('div');
    deadChickenContainer.className = 'dead-chicken-container';
    
    const deadChickenImg = document.createElement('img');
    deadChickenImg.src = 'deadchicken.png';
    deadChickenImg.className = 'dead-chicken-img';
    deadChickenImg.alt = 'Dead Chicken';
    
    // Обработка ошибки загрузки изображения мертвой курицы
    deadChickenImg.onerror = () => {
        console.warn('deadchicken.png не найден, используем заглушку');
        deadChickenImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIwIiBoZWlnaHQ9IjIyMCIgdmlld0JveD0iMCAwIDIyMCAyMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIyMCIgaGVpZ2h0PSIyMjAiIGZpbGw9IiNmZjAwMDAiLz48dGV4dCB4PSIxMTAiIHk9IjExNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+WDwvdGV4dD48L3N2Zz4=';
    };
    
    // Создаем элемент множителя
    const multiplierElement = document.createElement('div');
    multiplierElement.className = 'dead-chicken-multiplier';
    
    // Получаем случайный множитель для текущего режима
    const multipliers = GAME_MODES[currentGameMode];
    const randomMultiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
    multiplierElement.textContent = `${randomMultiplier}x`;
    
    console.log(`Выпал множитель: ${randomMultiplier}x в режиме ${currentGameMode}`);
    
    deadChickenContainer.appendChild(deadChickenImg);
    deadChickenContainer.appendChild(multiplierElement);
    
    tunnel.appendChild(deadChickenContainer);
}

// Инициализация игры
console.log('Chicken Road Signal Game загружена!');
console.log(`Текущий режим: ${currentGameMode}`);
console.log('Доступные режимы:', Object.keys(GAME_MODES));

// Очистка при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    cleanupAllGameElements();
}); 