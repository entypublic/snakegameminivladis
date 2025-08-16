const items = [
    { name: 'RED', image: 'red cell.png' },
    { name: 'BLACK', image: 'black cell.png' },
    { name: 'FIRE', image: 'fire cell.png' }
];

const rouletteItems = document.getElementById('rouletteItems');
const spinButton = document.getElementById('spinButton');
const resultElement = document.getElementById('result');
const arrowTop = document.getElementById('arrowTop');
const arrowBottom = document.getElementById('arrowBottom');
const resultFrame = document.getElementById('resultFrame');
const glowEffect = document.getElementById('glowEffect');
const particlesContainer = document.getElementById('particles');
const analysisOverlay = document.getElementById('analysisOverlay');
let isSpinning = false;
let isResetting = false;

// Инициализация фоновых ячеек для фона
function initBackgroundCells() {
    const cellCount = window.innerWidth < 768 ? 15 : 25;
    const particlesContainer = document.getElementById('particles');
    
    // Очищаем контейнер
    particlesContainer.innerHTML = '';
    
    for (let i = 0; i < cellCount; i++) {
        createBackgroundCell();
    }
}

// Создание фоновой ячейки
function createBackgroundCell() {
    const particlesContainer = document.getElementById('particles');
    const cell = document.createElement('div');
    cell.classList.add('background-cell');
    
    // Случайный тип ячейки
    const cellTypes = ['red', 'black', 'fire'];
    const cellType = cellTypes[Math.floor(Math.random() * cellTypes.length)];
    cell.classList.add(cellType);
    
    // Случайный размер
    const size = Math.random() * 60 + 40;
    cell.style.width = `${size}px`;
    cell.style.height = `${size}px`;
    
    // Случайная позиция
    const posX = Math.random() * window.innerWidth;
    const posY = Math.random() * window.innerHeight;
    cell.style.left = `${posX}px`;
    cell.style.top = `${posY}px`;
    
    // Случайная прозрачность
    const opacity = Math.random() * 0.15 + 0.05;
    cell.style.opacity = opacity;
    
    // Случайные параметры движения для анимации
    const moveX = Math.random() * 200 - 100;
    const moveY = Math.random() * 200 - 100;
    const moveX2 = Math.random() * 200 - 100;
    const moveY2 = Math.random() * 200 - 100;
    const moveX3 = Math.random() * 200 - 100;
    const moveY3 = Math.random() * 200 - 100;
    const rotateDeg = Math.random() * 180;
    
    cell.style.setProperty('--move-x', `${moveX}px`);
    cell.style.setProperty('--move-y', `${moveY}px`);
    cell.style.setProperty('--move-x2', `${moveX2}px`);
    cell.style.setProperty('--move-y2', `${moveY2}px`);
    cell.style.setProperty('--move-x3', `${moveX3}px`);
    cell.style.setProperty('--move-y3', `${moveY3}px`);
    cell.style.setProperty('--rotate-deg', `${rotateDeg}deg`);
    
    // Анимация
    const duration = Math.random() * 60 + 30;
    cell.style.setProperty('--duration', `${duration}s`);
    cell.style.animation = `floatAnimation ${duration}s linear infinite`;
    
    // Добавляем эффект свечения для некоторых ячеек
    if (Math.random() < 0.3) {
        cell.classList.add('glow');
    }
    
    particlesContainer.appendChild(cell);
}

// Получаем ширину элемента в зависимости от размера экрана
function getItemWidth() {
    // Используем более точное определение ширины в зависимости от размера экрана
    if (window.innerWidth <= 480) {
        return 80; // Для очень маленьких экранов
    } else if (window.innerWidth <= 700) {
        return 90; // Для средних мобильных экранов
    } else {
        return 120; // Для десктопов
    }
}

// Создаем элементы рулетки
function createRouletteItems() {
    // Создаем множество элементов для эффекта прокрутки
    const totalItems = items.length * 15; // Увеличиваем количество элементов для большего выбора
    let html = '';
    
    // Добавляем дополнительные элементы в начало для правильного центрирования
    const centerOffset = Math.ceil(items.length * 1.5); // Увеличиваем смещение для отображения большего количества ячеек
    for (let i = 0; i < totalItems + centerOffset; i++) {
        const item = items[i % items.length];
        html += `<div class="roulette-item" data-name="${item.name}">
            <img src="${item.image}" alt="${item.name}">
        </div>`;
    }
    
    rouletteItems.innerHTML = html;
    
    // Добавляем эффект при наведении на элементы
    const itemElements = document.querySelectorAll('.roulette-item');
    itemElements.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (!isSpinning) {
                item.classList.add('highlight');
            }
        });
        
        item.addEventListener('mouseleave', () => {
            item.classList.remove('highlight');
        });
    });
    
    // Центрируем начальную позицию
    centerRoulettePosition();
}

// Центрирование рулетки
function centerRoulettePosition() {
    const itemWidth = getItemWidth();
    const containerWidth = document.querySelector('.roulette-container').offsetWidth;
    const visibleItems = Math.floor(containerWidth / itemWidth);
    const centerOffset = Math.ceil(items.length * 1.5);
    const initialOffset = -itemWidth * centerOffset + (containerWidth - itemWidth) / 2;
    
    rouletteItems.style.transition = 'none';
    rouletteItems.style.transform = `translateX(${initialOffset}px)`;
    
    // Форсируем перерисовку
    void rouletteItems.offsetWidth;
    
    // Восстанавливаем анимацию
    rouletteItems.style.transition = 'transform 5s cubic-bezier(0.34, 1.56, 0.64, 1)';
}

// Функция для определения элемента под стрелкой
function getElementUnderArrow() {
    // Получаем центр контейнера рулетки
    const containerRect = document.querySelector('.roulette-container').getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    
    // Находим элемент, который находится под центром
    const items = document.querySelectorAll('.roulette-item');
    for (let item of items) {
        const itemRect = item.getBoundingClientRect();
        if (centerX >= itemRect.left && centerX <= itemRect.right) {
            return item;
        }
    }
    
    return null;
}

// Функция прокрутки
function spin() {
    if (isSpinning) return;
    isSpinning = true;
    spinButton.disabled = true;
    spinButton.classList.add('spinning');
    
    // Очищаем предыдущий результат
    if (resultElement.textContent) {
        resultElement.classList.remove('active');
        setTimeout(() => {
            resultElement.textContent = '';
        }, 300);
    }
    
    // Показываем надпись Analysis на рулетке
    analysisOverlay.classList.add('active');
    
    // Скрываем рамку результата
    resultFrame.classList.remove('active');
    
    // Задержка перед началом вращения для отображения анимации загрузки
    setTimeout(() => {
        // Скрываем надпись Analysis
        analysisOverlay.classList.remove('active');
        
        // Активируем эффект свечения
        glowEffect.classList.add('active');
        
        // Сначала убедимся, что рулетка находится в центральной позиции
        centerRoulettePosition();
        
        // Добавляем класс для анимации стрелок
        arrowTop.classList.add('spinning');
        arrowBottom.classList.add('spinning');

        // Генерируем случайный результат
        const randomIndex = Math.floor(Math.random() * items.length);
        const result = items[randomIndex].name;

        // Вычисляем позицию для прокрутки
        const itemWidth = getItemWidth();
        const containerWidth = document.querySelector('.roulette-container').offsetWidth;
        const centerOffset = Math.ceil(items.length * 1.5);
        
        // Рассчитываем базовое смещение так, чтобы центр контейнера совпадал с центром ячейки
        const baseOffset = -itemWidth * centerOffset + (containerWidth - itemWidth) / 2;
        
        // Рассчитываем общее смещение для прокрутки
        // Добавляем дополнительное смещение, чтобы выбранный элемент оказался точно по центру
        const spinRotations = 10;
        const totalScroll = baseOffset - (itemWidth * (items.length * spinRotations + randomIndex));

        // Добавляем звуковой эффект
        playSpinSound();

        // Небольшая задержка перед запуском анимации для гарантии применения стилей
        setTimeout(() => {
            // Анимация прокрутки
            rouletteItems.style.transform = `translateX(${totalScroll}px)`;
        }, 100);

        // Слушаем событие окончания анимации
        const transitionEndHandler = function() {
            // Определяем элемент под стрелкой
            const elementUnderArrow = getElementUnderArrow();
            const actualResult = elementUnderArrow ? elementUnderArrow.dataset.name : result;
            
            // Если элемент не по центру, корректируем позицию
            if (elementUnderArrow) {
                const containerRect = document.querySelector('.roulette-container').getBoundingClientRect();
                const containerCenter = containerRect.left + containerRect.width / 2;
                const itemRect = elementUnderArrow.getBoundingClientRect();
                const itemCenter = itemRect.left + itemRect.width / 2;
                
                // Если есть небольшое смещение, корректируем позицию
                if (Math.abs(containerCenter - itemCenter) > 2) {
                    const currentTransform = getComputedStyle(rouletteItems).transform;
                    const matrix = new DOMMatrix(currentTransform);
                    const currentX = matrix.m41;
                    const correction = containerCenter - itemCenter;
                    
                    // Плавно корректируем позицию
                    rouletteItems.style.transition = 'transform 0.5s ease-out';
                    rouletteItems.style.transform = `translateX(${currentX + correction}px)`;
                    
                    // Даем время на корректировку перед продолжением
                    setTimeout(continueAfterCorrection, 600);
                    return;
                }
            }
            
            // Если корректировка не требуется, продолжаем обычный процесс
            continueAfterCorrection();
            
            function continueAfterCorrection() {
                // Добавляем класс выбранному элементу
                const finalElement = getElementUnderArrow();
                const finalResult = finalElement ? finalElement.dataset.name : result;
                
                if (finalElement) {
                    finalElement.classList.add('selected-item');
                }
                
                // Воспроизводим звук результата
                playResultSound(finalResult);
                
                // Показываем результат с анимацией
                resultElement.innerHTML = `Bet on: <span>${finalResult}</span>`;
                setTimeout(() => {
                    resultElement.classList.add('active');
                }, 200);
                
                // Убираем анимацию стрелок
                arrowTop.classList.remove('spinning');
                arrowBottom.classList.remove('spinning');
                
                // Деактивируем эффект свечения через некоторое время
                setTimeout(() => {
                    glowEffect.classList.remove('active');
                }, 3000);
                
                // Разблокируем кнопку
                setTimeout(() => {
                    isSpinning = false;
                    spinButton.disabled = false;
                    spinButton.classList.remove('spinning');
                    
                    // Удаляем класс выбранного элемента
                    if (finalElement) {
                        setTimeout(() => {
                            finalElement.classList.remove('selected-item');
                        }, 3000);
                    }
                }, 1000);
            }
            
            // Удаляем обработчик события
            rouletteItems.removeEventListener('transitionend', transitionEndHandler);
        };
        
        // Добавляем обработчик события окончания анимации
        rouletteItems.addEventListener('transitionend', transitionEndHandler);
    }, 2000); // Задержка перед началом вращения (2 секунды для отображения анимации загрузки)
}

// Функция воспроизведения звука вращения
function playSpinSound() {
    // Здесь можно добавить воспроизведение звука, если нужно
    // Например:
    // const spinSound = new Audio('spin.mp3');
    // spinSound.play();
}

// Функция воспроизведения звука результата
function playResultSound(result) {
    // Здесь можно добавить воспроизведение звука, если нужно
    // Например:
    // const resultSound = new Audio(`${result.toLowerCase()}.mp3`);
    // resultSound.play();
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    createRouletteItems();
    initBackgroundCells();
    
    // Добавляем анимацию при загрузке страницы
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 300);
});

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    if (!isSpinning && !isResetting) {
        // Добавляем небольшую задержку, чтобы не вызывать функцию слишком часто
        if (window.resizeTimer) {
            clearTimeout(window.resizeTimer);
        }
        window.resizeTimer = setTimeout(() => {
            centerRoulettePosition();
            // Пересоздаем фоновые ячейки при изменении размера окна
            initBackgroundCells();
        }, 250);
    }
}); 