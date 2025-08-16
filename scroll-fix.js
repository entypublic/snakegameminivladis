// ========== ИСПРАВЛЕНИЕ ПРОКРУТКИ ==========

// Функция для исправления прокрутки на мобильных
function fixMobileScrolling() {
    // Проверяем, это мобильное устройство
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Устанавливаем правильную высоту для контейнеров
        const updateHeights = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            const userProfile = document.querySelector('.user-profile');
            const tab = document.querySelector('.tab');
            const tabcontent = document.querySelector('.tabcontent');
            
            if (userProfile && tab && tabcontent) {
                const profileHeight = userProfile.offsetHeight;
                const tabHeight = tab.offsetHeight;
                const availableHeight = window.innerHeight - profileHeight - tabHeight;
                
                tabcontent.style.maxHeight = `${availableHeight}px`;
                tabcontent.style.minHeight = `${availableHeight}px`;
            }
        };
        
        // Обновляем высоты при загрузке и изменении размера
        updateHeights();
        window.addEventListener('resize', updateHeights);
        window.addEventListener('orientationchange', () => {
            setTimeout(updateHeights, 100);
        });
        
        // Добавляем плавную прокрутку к кнопкам игр
        const gameButtons = document.querySelectorAll('.game button');
        gameButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Небольшая задержка для обеспечения видимости кнопки
                setTimeout(() => {
                    button.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'nearest'
                    });
                }, 100);
            });
        });
        
        // Исправляем баг с прокруткой при фокусе на элементы
        document.addEventListener('touchstart', function(e) {
            if (e.target.tagName === 'BUTTON') {
                e.target.style.webkitTransform = 'translateZ(0)';
            }
        });
    }
}

// Функция для обеспечения доступности последних игр
function ensureLastGamesAccessible() {
    const games = document.querySelectorAll('.game');
    const lastGames = Array.from(games).slice(-3); // Последние 3 игры
    
    lastGames.forEach((game, index) => {
        const button = game.querySelector('button');
        if (button) {
            // Добавляем дополнительный отступ для последних игр
            game.style.marginBottom = `${20 + (index * 10)}px`;
            
            // Обработчик для прокрутки к кнопке при клике
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Прокручиваем так, чтобы кнопка была видна
                button.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
                
                // Выполняем оригинальное действие после прокрутки
                setTimeout(() => {
                    const originalOnClick = button.getAttribute('onclick');
                    if (originalOnClick) {
                        eval(originalOnClick);
                    }
                }, 300);
            });
        }
    });
}

// Функция для добавления индикатора прокрутки
function addScrollIndicator() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Создаем индикатор прокрутки
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = '↓ Прокрутите вниз для просмотра всех игр ↓';
        scrollIndicator.style.cssText = `
            position: fixed;
            bottom: 90px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--glass-bg);
            color: var(--text-accent);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 999;
            animation: pulse 2s infinite;
            border: 1px solid var(--glass-border);
            backdrop-filter: var(--backdrop-blur);
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(scrollIndicator);
        
        // Скрываем индикатор при прокрутке
        let scrollTimeout;
        const tabcontent = document.querySelector('.tabcontent.active');
        
        if (tabcontent) {
            tabcontent.addEventListener('scroll', function() {
                if (this.scrollTop > 100) {
                    scrollIndicator.style.opacity = '0';
                } else {
                    scrollIndicator.style.opacity = '1';
                }
                
                // Скрываем индикатор полностью после прокрутки
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    if (this.scrollTop > 200) {
                        scrollIndicator.remove();
                    }
                }, 2000);
            });
        }
        
        // Убираем индикатор через 10 секунд
        setTimeout(() => {
            if (scrollIndicator.parentNode) {
                scrollIndicator.remove();
            }
        }, 10000);
    }
}

// Инициализация всех исправлений
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        fixMobileScrolling();
        ensureLastGamesAccessible();
        addScrollIndicator();
    }, 500);
});

// Переинициализация при смене темы
document.addEventListener('themeChanged', function() {
    setTimeout(() => {
        ensureLastGamesAccessible();
    }, 100);
}); 