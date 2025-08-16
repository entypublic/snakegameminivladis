// ========== БЫСТРЫЕ ДЕЙСТВИЯ ==========

class QuickActionsManager {
    constructor() {
        this.botData = null;
        this.init();
    }

    init() {
        this.getBotData();
        this.initEventListeners();
    }

    // Получаем данные бота автоматически
    getBotData() {
        try {
            let botUsername = null;
            let botName = 'Gaming Bot';
            
            if (window.Telegram && window.Telegram.WebApp) {
                const tg = window.Telegram.WebApp;
                
                // Метод 1: Получаем из initData
                if (tg.initDataUnsafe) {
                    // Из user данных
                    if (tg.initDataUnsafe.user) {
                        console.log('User data:', tg.initDataUnsafe.user);
                    }
                    
                    // Из start_param
                    if (tg.initDataUnsafe.start_param) {
                        console.log('Start param:', tg.initDataUnsafe.start_param);
                    }
                    
                    // Пытаемся получить bot username из chat данных
                    if (tg.initDataUnsafe.chat) {
                        console.log('Chat data:', tg.initDataUnsafe.chat);
                    }
                }
                
                // Метод 2: Из query string
                const urlParams = new URLSearchParams(window.location.search);
                botUsername = urlParams.get('bot') || urlParams.get('username');
                
                // Метод 3: Из WebApp данных
                if (tg.initData) {
                    try {
                        const initDataString = decodeURIComponent(tg.initData);
                        const botMatch = initDataString.match(/bot[^&]*[@\w]+/);
                        if (botMatch) {
                            console.log('Bot from initData:', botMatch[0]);
                        }
                    } catch (e) {
                        console.log('Could not parse initData');
                    }
                }
                
                // Метод 4: Из document referrer
                if (!botUsername) {
                    botUsername = this.extractBotFromURL();
                }
                
                // Метод 5: Пытаемся получить из window.location
                if (!botUsername && window.location.hash) {
                    const hashMatch = window.location.hash.match(/@(\w+)/);
                    if (hashMatch) {
                        botUsername = hashMatch[1];
                    }
                }
                
                console.log('Detected bot username:', botUsername);
            }
            
            // Устанавливаем данные бота
            this.botData = {
                username: botUsername || 'gaming_bot',
                url: botUsername ? `https://t.me/${botUsername}` : window.location.href,
                name: botName
            };
            
            console.log('Final bot data:', this.botData);
            
        } catch (error) {
            console.error('Error getting bot data:', error);
            this.botData = {
                username: 'gaming_bot',
                url: window.location.href,
                name: 'Gaming Bot'
            };
        }
    }

    // Извлекаем bot username из URL
    extractBotFromURL() {
        try {
            // Источники для поиска
            const sources = [
                document.referrer,
                window.location.href,
                window.location.origin,
                localStorage.getItem('telegram_bot_url'),
                sessionStorage.getItem('telegram_bot_url')
            ].filter(Boolean);
            
            for (const url of sources) {
                // Паттерн 1: t.me/botname
                let match = url.match(/t\.me\/([^\/\?\#\s]+)/);
                if (match && match[1] && !match[1].includes('share')) {
                    console.log(`Found bot from ${url}: ${match[1]}`);
                    return match[1];
                }
                
                // Паттерн 2: telegram.me/botname
                match = url.match(/telegram\.me\/([^\/\?\#\s]+)/);
                if (match && match[1]) {
                    console.log(`Found bot from telegram.me: ${match[1]}`);
                    return match[1];
                }
                
                // Паттерн 3: @botname в URL
                match = url.match(/@([a-zA-Z0-9_]+)/);
                if (match && match[1]) {
                    console.log(`Found bot with @: ${match[1]}`);
                    return match[1];
                }
            }
            
            return null;
        } catch (e) {
            console.error('Error extracting bot from URL:', e);
            return null;
        }
    }

    initEventListeners() {
        // Кнопка "Поделиться"
        const shareBotBtn = document.getElementById('shareBotBtn');
        if (shareBotBtn) {
            shareBotBtn.addEventListener('click', () => {
                this.shareBot();
                this.addHapticFeedback();
            });
        }
    }



    // Поделиться ботом через Telegram
    shareBot() {
        try {
            const shareText = "Сигнальный бот с кучей игр, скорее залетай!";
            const botUrl = this.botData ? this.botData.url : window.location.href;
            const botUsername = this.botData ? this.botData.username : 'gaming_bot';
            
            console.log('Sharing bot:', this.botData);
            
            // Используем Telegram WebApp API
            if (window.Telegram && window.Telegram.WebApp) {
                const tg = window.Telegram.WebApp;
                
                // Открываем выбор чатов для отправки
                tg.openTelegramLink(`https://t.me/share/url?url=https://t.me/minesprosignal_bot&text=${encodeURIComponent(shareText)}`);
                
                // Показываем уведомление
                this.showNotification(`Sharing @${botUsername}... 📤`, "success");
            } else {
                // Fallback для веб-версии
                const shareData = {
                    title: 'Gaming Bot',
                    text: shareText,
                    url: botUrl
                };

                if (navigator.share) {
                    navigator.share(shareData);
                } else {
                    // Копируем в буфер обмена
                    navigator.clipboard.writeText(botUrl).then(() => {
                        this.showNotification("Link copied to clipboard! 📋", "success");
                    });
                }
            }
        } catch (error) {
            console.error('Share error:', error);
            this.showNotification("Share failed. Try again! ❌", "error");
        }
    }



    // Тактильная обратная связь
    addHapticFeedback() {
        // Вибрация для мобильных
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
        
        // Telegram WebApp haptic feedback
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    }

    // Показать уведомление
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--glass-bg);
            color: var(--text-primary);
            padding: 12px 20px;
            border-radius: 10px;
            border: 1px solid var(--glass-border);
            backdrop-filter: var(--backdrop-blur);
            z-index: 3000;
            font-size: 14px;
            box-shadow: 0 4px 20px var(--shadow-primary);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Убираем через 3 секунды
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Глобальная инициализация
let quickActionsManager;

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        quickActionsManager = new QuickActionsManager();
    }, 200);
});

// Экспорт для использования в других скриптах
window.QuickActionsManager = QuickActionsManager; 