


const startButton = document.getElementById("startButton");
const bettingPanel = document.getElementById("bettingPanel");
const confirmButton = document.getElementById("confirmButton");
const betDisplay = document.getElementById("betDisplay");
const ball = document.getElementById("ball");
const betInput = document.getElementById("betAmount");
const currencyInputs = document.querySelectorAll("input[name='currency']");
const ballContainer = document.querySelector(".ball-container");

let betAmount = 0;
let selectedCurrency = "";

// Start game
startButton.addEventListener("click", () => {
  bettingPanel.style.display = "flex";
  setTimeout(() => {
    bettingPanel.classList.add("visible");
  }, 10);
  startButton.style.display = "none";
});

// Check confirm button state
function updateConfirmButtonState() {
  const isCurrencySelected = Array.from(currencyInputs).some(input => input.checked);
  const isAmountValid = parseFloat(betInput.value) > 0;
  confirmButton.disabled = !(isCurrencySelected && isAmountValid);
}

// Amount input handler
betInput.addEventListener("input", updateConfirmButtonState);

// Currency selection handler
currencyInputs.forEach(input => {
  input.addEventListener("change", updateConfirmButtonState);
});

// Confirm bet
confirmButton.addEventListener("click", () => {
  betAmount = parseFloat(betInput.value) || 0;
  selectedCurrency = document.querySelector("input[name='currency']:checked").value;

  betDisplay.innerHTML = `${selectedCurrency}${betAmount.toFixed(2)}`;
  betDisplay.style.opacity = 1;

  bettingPanel.classList.remove("visible");
  bettingPanel.classList.add("hiding");
  restartButton.style.display = "block";

  setTimeout(() => {
    bettingPanel.style.display = "none";
    bettingPanel.classList.remove("hiding");
  }, 400);

  window.scrollTo(0, 0);

  // Добавляем класс для анимации надувания
  ball.classList.add('inflating');
  
  animateBallAndBet();
});

// Generate random multiplier with weights
function getRandomMultiplier() {
  const ranges = [
    { min: 2.0, max: 3.0, weight: 0.4 },
    { min: 3.0, max: 3.5, weight: 0.3 },
    { min: 3.5, max: 4.0, weight: 0.2 },
    { min: 4.0, max: 5.0, weight: 0.1 },
  ];

  const totalWeight = ranges.reduce((sum, range) => sum + range.weight, 0);
  let random = Math.random() * totalWeight;

  for (const { min, max, weight } of ranges) {
    if (random < weight) {
      return Math.random() * (max - min) + min;
    }
    random -= weight;
  }
}

// Animate ball and bet
function animateBallAndBet() {
  let scale = 1;
  let currentBet = betAmount;
  const multiplier = getRandomMultiplier();
  const maxScale = 1.8;
  const maxTextScale = 1.6;
  const speed = 100 / multiplier; // Скорость анимации зависит от множителя
  let isExploding = false;
  let acceleration = 0.01; // Начальное ускорение
  
  // Добавляем звук надувания
  const inflateSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-balloon-foil-squeak-2811.mp3');
  inflateSound.volume = 0.3;
  inflateSound.loop = true;
  inflateSound.play().catch(error => {
    console.log('Автовоспроизведение звука заблокировано браузером:', error);
  });

  const interval = setInterval(() => {
    if (scale >= maxScale && !isExploding) {
      isExploding = true;
      // Останавливаем звук надувания
      inflateSound.pause();
      // Удаляем класс анимации надувания перед взрывом
      ball.classList.remove('inflating');
      // Взрыв шарика
      explodeBalloon(multiplier);
      clearInterval(interval);
    } else if (!isExploding) {
      // Увеличиваем ускорение по мере надувания для эффекта напряжения
      acceleration = acceleration * 1.03;
      scale += 0.02 + acceleration;
      currentBet = betAmount * (scale / maxScale) * multiplier;

      const newSize = 200 * scale;
      ballContainer.style.width = `${newSize}px`;
      ballContainer.style.height = `${newSize}px`;

      ball.style.transform = `scale(${scale})`;
      ball.style.transition = "transform 0.1s ease-in-out";
      
      // Добавляем эффект дрожания при приближении к максимальному размеру
      if (scale > maxScale * 0.8) {
        const shake = (scale / maxScale) * 2 - 1.6; // Начинаем дрожание на 80% от максимального размера
        if (shake > 0) {
          const randomX = (Math.random() - 0.5) * shake;
          const randomY = (Math.random() - 0.5) * shake;
          ball.style.transform = `scale(${scale}) translate(${randomX}px, ${randomY}px)`;
        }
      }

      betDisplay.style.transform = `translate(-50%, -50%) scale(${Math.min(scale, maxTextScale)})`;
      betDisplay.style.fontSize = `${13 + (5 * Math.min(scale, maxTextScale))}px`;
      betDisplay.innerHTML = `${selectedCurrency}${currentBet.toFixed(2)}`;
    }
  }, speed);
}

// Функция для анимации взрыва шарика
function explodeBalloon(multiplier) {
  // Создаем элементы для анимации взрыва
  const explosionContainer = document.createElement('div');
  explosionContainer.className = 'explosion-container';
  ballContainer.appendChild(explosionContainer);
  
  // Воспроизводим звук взрыва
  playExplosionSound();
  
  // Создаем частицы взрыва (увеличиваем количество для более впечатляющего эффекта)
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.className = 'explosion-particle';
    
    // Случайное положение и направление для частиц
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 150; // Увеличиваем максимальную дистанцию
    const duration = 0.5 + Math.random() * 1.0; // Увеличиваем вариацию длительности
    
    // Случайный размер для частиц
    const size = 5 + Math.random() * 20;
    
    particle.style.backgroundColor = getRandomColor();
    particle.style.left = '50%';
    particle.style.top = '50%';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animation = `explode ${duration}s ease-out forwards`;
    particle.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
    
    // Устанавливаем конечную позицию через CSS переменные
    particle.style.setProperty('--end-x', `${Math.cos(angle) * distance}px`);
    particle.style.setProperty('--end-y', `${Math.sin(angle) * distance}px`);
    
    explosionContainer.appendChild(particle);
  }
  
  // Добавляем круговую волну взрыва
  const shockwave = document.createElement('div');
  shockwave.className = 'shockwave';
  explosionContainer.appendChild(shockwave);
  
  // Скрываем шарик
  ball.style.opacity = '0';
  ball.style.transition = 'opacity 0.2s ease-out';
  
  // Вычисляем и показываем сумму выигрыша вместо множителя
  const winAmount = betAmount * multiplier;
  
  // Показываем сумму выигрыша вместо множителя X
  setTimeout(() => {
    betDisplay.innerHTML = `${selectedCurrency}${winAmount.toFixed(2)}`;
    betDisplay.style.fontSize = '36px';
    betDisplay.style.color = '#FFD700'; // Золотой цвет для выигрыша
    betDisplay.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.7)';
    betDisplay.classList.add('win-amount'); // Добавляем класс для анимации пульсации
  }, 200);
}

// Функция для воспроизведения звука взрыва
function playExplosionSound() {
  const audio = new Audio();
  audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-explosion-impact-1682.mp3';
  audio.volume = 0.5;
  audio.play().catch(error => {
    console.log('Автовоспроизведение звука заблокировано браузером:', error);
  });
}

// Функция для генерации случайного цвета для частиц
function getRandomColor() {
  const colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Restart button handler
restartButton.addEventListener("click", () => {
  bettingPanel.style.display = "none";
  startButton.style.display = "block";
  restartButton.style.display = "none";
  betDisplay.style.opacity = 0;
  betDisplay.style.color = "#fff";
  betDisplay.style.textShadow = "0 2px 4px rgba(0, 0, 0, 0.4)";
  betDisplay.style.fontSize = "22px";
  betDisplay.classList.remove('win-amount'); // Удаляем класс анимации при перезапуске
  
  // Сбрасываем шарик
  ball.style.transform = "scale(1)";
  ball.style.transition = "none";
  ball.style.opacity = "1";
  ball.classList.remove('inflating'); // Удаляем класс анимации надувания
  
  // Удаляем контейнер с частицами взрыва, если он существует
  const explosionContainer = document.querySelector('.explosion-container');
  if (explosionContainer) {
    explosionContainer.remove();
  }
  
  // Сбрасываем размер контейнера шарика
  ballContainer.style.width = "500px";
  ballContainer.style.height = "200px";
});

// Создаем звезды на фоне
function createStars() {
  const starsContainer = document.getElementById('stars');
  const numberOfStars = 50;
  
  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Случайное положение
    const x = Math.random() * 100;
    const y = Math.random() * 60; // Только в верхней части экрана
    
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    
    // Случайный размер
    const size = 1 + Math.random() * 2;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    // Случайная задержка анимации
    const delay = Math.random() * 5;
    star.style.animationDelay = `${delay}s`;
    
    // Случайная длительность анимации
    const duration = 3 + Math.random() * 4;
    star.style.animationDuration = `${duration}s`;
    
    starsContainer.appendChild(star);
  }
}

// Вызываем функцию создания звезд при загрузке страницы
window.addEventListener('load', createStars); 