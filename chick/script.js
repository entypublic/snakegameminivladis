const stripeContainer = document.getElementById('stripe-container');
const stripeCount = 5; // Количество полос
const stripeSpacing = 20; // Расстояние между полосами (% от высоты экрана)

// Создаем полосы
for (let i = 0; i < stripeCount; i++) {
    const stripe = document.createElement('div');
    stripe.classList.add('stripe');
    stripe.style.animationDelay = `${i * (stripeSpacing / 100) * 2}s`;
    stripeContainer.appendChild(stripe);
}

// Логика смены GIF
const centerGif = document.getElementById('centerGif');
const startButton = document.getElementById('startButton');
const gifs = ['left.gif', 'right.gif']; // Массив с путями к гифкам

// Добавляем функцию создания облаков
function createCloud() {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';

    // Случайные размеры для разнообразия
    const size = 60 + Math.random() * 40;
    cloud.style.width = size + 'px';
    cloud.style.height = size/2 + 'px';

    // Случайная позиция по вертикали
    cloud.style.top = Math.random() * 60 + '%';

    // Случайная продолжительность анимации
    const duration = 15 + Math.random() * 10;
    cloud.style.animationDuration = duration + 's';

    document.getElementById('cloudContainer').appendChild(cloud);

    // Удаляем облако после завершения анимации
    setTimeout(() => {
        cloud.remove();
    }, duration * 1000);
}

// Создаем новые облака с интервалом
setInterval(createCloud, 3000);

// Создаем начальные облака
for(let i = 0; i < 5; i++) {
    createCloud();
}

// Упрощенный обработчик клика кнопки без истории игр
startButton.addEventListener('click', () => {
    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
    centerGif.src = randomGif;
    centerGif.style.width = '320px';
    centerGif.style.height = 'auto';

    // Возвращаем обратно к основной гифке через 4 секунды
    setTimeout(() => {
        centerGif.src = 'chicks.gif';
        centerGif.style.width = '150px';
        centerGif.style.height = 'auto';
    }, 4050);
}); 