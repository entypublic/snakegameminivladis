

document.addEventListener('DOMContentLoaded', () => {
    const kangaroo = document.getElementById('kangaroo');
    const platformContainer = document.getElementById('platform-container');
    const playButton = document.getElementById('play-button');
    
    // Preloading only existing images
    const kenguImg = new Image();
    kenguImg.src = 'kengu.png';
    
    const kenguzerkImg = new Image();
    kenguzerkImg.src = 'kenguzerk.png';
    
    // Checking image availability
    console.log('Preloading images...');
    kenguzerkImg.onload = () => console.log('✅ kenguzerk.png found and preloaded');
    kenguzerkImg.onerror = () => console.error('❌ kenguzerk.png NOT FOUND - fix the file path!');
    
    kenguImg.onload = () => console.log('✅ kengu.png found and preloaded');
    kenguImg.onerror = () => console.error('❌ kengu.png NOT FOUND - fix the file path!');
    
    // Флаг для режима прыжков на платформы 20-100
    let highMultiplierMode = false;
    
    // Создаем невидимую кнопку для прыжков к платформам 20-100
    const secretButton = document.createElement('div');
    secretButton.className = 'secret-button';
    secretButton.style.position = 'fixed';
    secretButton.style.left = '20px';
    secretButton.style.bottom = '20px';
    secretButton.style.width = '80px';
    secretButton.style.height = '80px';
    secretButton.style.zIndex = '100';
    secretButton.style.cursor = 'pointer';
    secretButton.style.opacity = '0'; // Делаем кнопку невидимой
    
    document.body.appendChild(secretButton);
    
    // Добавляем обработчик для включения режима прыжков к платформам 20-100
    secretButton.addEventListener('click', () => {
        highMultiplierMode = !highMultiplierMode;
        
        if (highMultiplierMode) {
            alert('Включен режим прыжков на платформы 20-100x!');
            console.log('Включен режим прыжков на платформы с коэффициентами 20-100');
        } else {
            alert('Режим прыжков на платформы 20-100x отключен');
            console.log('Режим прыжков на платформы с коэффициентами 20-100 отключен');
        }
    });
    
    // Функция для прыжка к платформам с высокими коэффициентами (20-100)
    function jumpToHighPlatform() {
        if (isJumping) return;
        
        // Фильтруем платформы с коэффициентами от 20 до 100, которые не использовались
        const highPlatforms = visiblePlatforms.filter(p => {
            const coef = parseFloat(p.dataset.coefficient);
            return coef >= 20 && coef <= 100 && !usedPlatforms.includes(p);
        });
        
        if (highPlatforms.length === 0) {
            console.log('Нет доступных платформ с коэффициентами 20-100');
            resetGame();
            return;
        }
        
        // Выбираем случайную платформу из отфильтрованных
        const randomIndex = Math.floor(Math.random() * highPlatforms.length);
        const selectedPlatform = highPlatforms[randomIndex];
        
        console.log(`Прыжок к платформе с коэффициентом ${selectedPlatform.dataset.coefficient}`);
        
        // Прыгаем к выбранной платформе
        jumpTo(selectedPlatform);
    }
    
    // Creating a modal window for coefficients
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    modal.style.zIndex = '1000';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease';
    modal.style.pointerEvents = 'none';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '30px';
    modalContent.style.borderRadius = '10px';
    modalContent.style.textAlign = 'center';
    modalContent.style.maxWidth = '80%';
    modalContent.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
    modalContent.style.transform = 'scale(0.8)';
    modalContent.style.transition = 'transform 0.3s ease';
    
    const modalText = document.createElement('h2');
    modalText.style.marginBottom = '15px';
    modalText.style.fontSize = '28px';
    modalText.style.color = '#333';
    
    const modalSubtext = document.createElement('p');
    modalSubtext.textContent = 'Cash Out!';
    modalSubtext.style.fontSize = '22px';
    modalSubtext.style.color = '#FF8000';
    modalSubtext.style.fontWeight = 'bold';
    
    // Adding OK button
    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.marginTop = '20px';
    okButton.style.padding = '10px 30px';
    okButton.style.backgroundColor = '#FF8000';
    okButton.style.border = 'none';
    okButton.style.borderRadius = '5px';
    okButton.style.color = 'white';
    okButton.style.fontSize = '18px';
    okButton.style.fontWeight = 'bold';
    okButton.style.cursor = 'pointer';
    okButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    
    // Adding hover effect
    okButton.addEventListener('mouseover', () => {
        okButton.style.backgroundColor = '#FF9933';
        okButton.style.transform = 'scale(1.05)';
    });
    
    okButton.addEventListener('mouseout', () => {
        okButton.style.backgroundColor = '#FF8000';
        okButton.style.transform = 'scale(1)';
    });
    
    // Adding click handler to close modal window
    okButton.addEventListener('click', () => {
        hideModal();
        stopAutoJumping();
        returnToStart();
    });
    
    modalContent.appendChild(modalText);
    modalContent.appendChild(modalSubtext);
    modalContent.appendChild(okButton);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
    
    // Function to show modal window
    function showModal(coefficient) {
        modalText.textContent = `Multiplier: ${coefficient}x`;
        modal.style.display = 'flex';
        
        // Appear animation
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.pointerEvents = 'auto';
            modalContent.style.transform = 'scale(1)';
        }, 10);
        
        // Removed automatic closing after 2 seconds
        // Now the modal window closes only when clicking the OK button
    }
    
    // Function to hide modal window
    function hideModal() {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.8)';
        modal.style.pointerEvents = 'none';
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    // Determining if the device is mobile
    const isMobile = window.innerWidth < 768;
    
    // Adapting platform positions depending on screen size
    function getAdaptedPositions() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Starting point for diagonal placement
        const startX = screenWidth * 0.2;  // Start from left
        const startY = 120;  // Initial height (bottom of screen)
        
        // Steps for diagonal placement
        const xStep = isMobile ? 4 : 15;  // Step to the right
        const yStep = isMobile ? 80 : 10;  // Step up
        
        // Adjusting scaling - lower platforms larger than upper ones
        const maxScale = isMobile ? 1.1 : 1.3;  // Initial scale (bottom tile)
        const minScale = isMobile ? 0.5 : 0.65;  // Final scale (top tile)
        
        // Creating an array to store platform positions
        const positions = [];
        
        // Coefficients for platforms from bottom to top
        const coefficients = [1.1, 1.2, 1.5, 2, 3, 5, 10, 20, 50, 100];
        
        // Tile types for different coefficients
        const getPlatformType = (coef) => {
            if (coef <= 2) return 'plitka1.png';
            if (coef <= 10) return 'plitka2.png';
            return 'plitka3.png';
        };
        
        // Calculating arc parameters considering screen
        // Determining optimal parameters based on screen size
        const rightMargin = screenWidth * 0.05; // Right margin 5%
        const maxPlatformWidth = 200; // Approximate maximum tile width
        const safeWidth = screenWidth - rightMargin - maxPlatformWidth;
        
        // Computing optimal arc parameters
        const radiusRatio = Math.min(0.45, (safeWidth / screenWidth) * 0.6); // Increasing radius further
        const radius = screenHeight * radiusRatio;
        
        // Arc center calculated so that the rightmost point doesn't go beyond safeWidth
        const maxCosAngle = Math.cos(-0.5 * Math.PI * 0.8); // Maximum cosine value for our angles
        const centerX = Math.min(screenWidth * 0.12, safeWidth - radius * maxCosAngle); // Moving center even more to the right
        const centerY = screenHeight * 0.5; // Arc center (Y)
        
        // Creating positions for each platform - diagonal placement from bottom to top
        for (let i = 0; i < coefficients.length; i++) {
            // Creating arc-shaped trajectory, curved to the left
            
            // Normalized position in trajectory (from 0 to 1)
            const t = i / (coefficients.length - 1);
            
            // Using more uniform distribution to separate tiles with larger intervals
            let tAdjusted;
            if (i === 0) {
                // For the very first tile (bottom)
                tAdjusted = 0.15; // Move lower to increase distance from second
            } else if (i === 1) {
                // For the second tile
                tAdjusted = 0.32; // Increase distance from first
            } else {
                // For remaining tiles use nonlinear distribution
                // with more uniform spaces between tiles
                const progress = (i - 1) / (coefficients.length - 2); // From 0 to 1 without first tile
                // Quadratic distribution for better uniformity
                tAdjusted = 0.32 + Math.pow(progress, 0.9) * 0.65;
            }
            
            // Parametric equation for arc (semicircle)
            // Reducing arc span to increase Y spread
            const angle = (tAdjusted - 0.5) * Math.PI * 0.8; 
            
            // Calculating position on arc
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            // Scale decreases towards arc edges, but not as much
            const scale = minScale + (1 - Math.abs(tAdjusted - 0.5) * 1.8) * (maxScale - minScale);
            
            positions.push({
                id: `p-${coefficients[i]}`,
                coefficient: coefficients[i],
                plitka: getPlatformType(coefficients[i]),
                position: { bottom: y, left: x },
                scale: scale
            });
        }
        
        return positions;
    }
    
    // Using adapted positions
    const platformData = getAdaptedPositions();
    
    // Current kangaroo position
    let currentPosition = { x: isMobile ? 80 : 120, y: 80 };
    let isJumping = false;
    let visiblePlatforms = [];
    let usedPlatforms = [];
    let lastPlatform = null;
    let currentPlatformIndex = -1; // Index of current platform
    let isZerkMode = false; // Flag to track mirror kangaroo mode
    
    // Creating all platforms at once with fixed position
    function createPlatforms() {
        platformContainer.innerHTML = '';
        visiblePlatforms = [];
        usedPlatforms = [];
        
        platformData.forEach((data, index) => {
            const platform = document.createElement('div');
            platform.className = 'platform';
            platform.id = data.id;
            platform.dataset.coefficient = data.coefficient;
            platform.dataset.index = index;
            
            // Setting position from data
            platform.style.bottom = `${data.position.bottom}px`;
            platform.style.left = `${data.position.left}px`;
            
            // Scale depends on position (farther ones smaller)
            const scale = data.scale || (1 - (index * 0.03));
            platform.style.transform = `scale(${scale})`;
            
            const img = document.createElement('img');
            img.src = data.plitka;
            img.className = 'platform-image';
            
            // Using images for coefficients
            const coefficient = document.createElement('div');
            coefficient.className = 'coefficient';
            
            // Checking if coefficient file exists
            const coefImg = document.createElement('img');
            coefImg.src = `${data.coefficient}.png`;
            coefImg.onerror = function() {
                // If image not found, show text
                this.remove();
                coefficient.textContent = data.coefficient;
            };
            coefficient.appendChild(coefImg);
            
            platform.appendChild(img);
            platform.appendChild(coefficient);
            
            platformContainer.appendChild(platform);
            visiblePlatforms.push(platform);
            
            // Adding click handler for platforms
            platform.addEventListener('click', () => jumpTo(platform));
        });
    }
    
    // Function for sequential jump
    function jumpNext() {
        if (isJumping) return;
        
        // Sorting all platforms by index
        const sortedPlatforms = [...visiblePlatforms].sort((a, b) => 
            parseInt(a.dataset.index) - parseInt(b.dataset.index)
        );
        
        // Filtering only those not yet used
        const unusedPlatforms = sortedPlatforms.filter(p => !usedPlatforms.includes(p));
        
        if (unusedPlatforms.length === 0) {
            resetGame();
            return;
        }
        
        // Taking first unused platform in order
        const nextPlatform = unusedPlatforms[0];
        const nextIndex = parseInt(nextPlatform.dataset.index);
        
        console.log(`Jump to platform #${nextIndex} with multiplier ${nextPlatform.dataset.coefficient}`);
        
        // Jumping to nearest platform
        jumpTo(nextPlatform);
        
        // If target platform reached, showing modal window
        if (window.targetPlatformIndex === nextIndex) {
            setTimeout(() => {
                const coefficient = nextPlatform.dataset.coefficient;
                showModal(coefficient);
                stopAutoJumping();
            }, 1000);
        }
    }
    
    // Kangaroo jump to platform
    function jumpTo(platform) {
        if (isJumping || usedPlatforms.includes(platform)) return;
        
        isJumping = true;
        
        // IMPORTANT: Checking immediately if this is platform with coefficient 3?
        const isPlatformWithCoef3 = platform.dataset.coefficient === '3';
        console.log(`Jump to platform ${platform.id}, multiplier: ${platform.dataset.coefficient}, coefficient 3 check: ${isPlatformWithCoef3}`);
        
        // If this is platform with coefficient 3, change image immediately
        if (isPlatformWithCoef3) {
            kangaroo.style.backgroundImage = "url('kenguzerk.png')";
            kangaroo.style.transform = 'scaleX(1)';
            isZerkMode = true;
            console.log('👁️ IMAGE CHANGED TO kenguzerk.png');
        }
        
        const platformRect = platform.getBoundingClientRect();
        const kangarooRect = kangaroo.getBoundingClientRect();
        const kangarooWidth = kangarooRect.width;
        const kangarooHeight = kangarooRect.height;
        
        // Calculating jump position - EXACTLY TO TILE CENTER
        // Centering kangaroo horizontally relative to platform
        let jumpX = platformRect.left + (platformRect.width / 2) - (kangarooWidth / 2);
        jumpX = Math.max(10, Math.min(jumpX, window.innerWidth - kangarooWidth - 10)); // Limiting within screen bounds
        
        // Kangaroo stands on platform from below (feet on platform)
        // Computing position where kangaroo's feet will be on top part of platform
        const jumpY = platformRect.top - (kangarooHeight * 0.8); // 0.8 coefficient accounts for feet not being at very bottom of image
        
        console.log(`Jump to position: X=${jumpX}, Y=${jumpY}, platform dimensions: ${platformRect.width}x${platformRect.height}`);
        
        // Animating jump
        kangaroo.style.transition = 'all 0.5s ease-out';
        kangaroo.style.left = `${jumpX}px`;
        kangaroo.style.bottom = `${window.innerHeight - jumpY - kangarooHeight}px`; // adjusting for screen height
        
        // Updating current kangaroo position
        currentPosition = { x: jumpX, y: window.innerHeight - jumpY - kangarooHeight };
        lastPlatform = platform;
        currentPlatformIndex = parseInt(platform.dataset.index);
        
        // Marking platform as used and adding disappear animation
        platform.style.opacity = '0.5';
        usedPlatforms.push(platform);
        
        setTimeout(() => {
            // Jump end animation
            kangaroo.classList.add('jump-end');
            
            setTimeout(() => {
                // After jump ends, hide platform completely
                platform.style.opacity = '0';
                
                setTimeout(() => {
                    // Finally remove platform from DOM
                    platform.style.display = 'none';
                }, 500);
                
                kangaroo.classList.remove('jump-end');
                isJumping = false;
                
                // Show modal window with coefficient
                const coefficient = platform.dataset.coefficient;
                showModal(coefficient);
                stopAutoJumping();
                
                // Automatically return kangaroo to starting position after some time
                setTimeout(() => {
                    returnToStart();
                }, 1500);
            }, 300);
        }, 500);
    }
    
    // Adding flag for automatic jumps
    let isAutoJumping = false;
    
    // Function to start sequence of automatic jumps
    function startAutoJumping() {
        isAutoJumping = true;
        
        // Reset last platform to generate new coefficient
        lastPlatform = null;
        
        // Проверяем, активирован ли режим высоких коэффициентов
        if (highMultiplierMode) {
            console.log('🎯 Режим высоких коэффициентов: выбираем платформу 20-100x');
            
            // Фильтруем платформы с коэффициентами от 20 до 100, которые не использовались
            const highPlatforms = visiblePlatforms.filter(p => {
                const coef = parseFloat(p.dataset.coefficient);
                return coef >= 20 && coef <= 100 && !usedPlatforms.includes(p);
            });
            
            if (highPlatforms.length === 0) {
                console.log('Нет доступных платформ с коэффициентами 20-100');
                resetGame();
                return;
            }
            
            // Выбираем случайную платформу из отфильтрованных
            const randomIndex = Math.floor(Math.random() * highPlatforms.length);
            const selectedPlatform = highPlatforms[randomIndex];
            
            console.log(`Выбрана платформа с коэффициентом ${selectedPlatform.dataset.coefficient}`);
            
            // Запоминаем индекс целевой платформы
            window.targetPlatformIndex = parseInt(selectedPlatform.dataset.index);
            
            // Прыгаем к выбранной платформе
            jumpTo(selectedPlatform);
            return;
        }
        
        // Select target platform with coef. 2, 3, 5, 10 - chance 30%, 30%, 20%, 20%
        const targetCoefficients = [2, 3, 5, 10];
        
        // Choose random coefficient with new probability distribution
        const randomValue = Math.random();
        console.log(`🎲 NEW GAME! Generated random number: ${randomValue.toFixed(4)}`);
        
        let targetCoefficient;
        // New distribution: 2 - 30%, 3 - 30%, 5 - 20%, 10 - 20%
        if (randomValue < 0.3) {
            targetCoefficient = targetCoefficients[0]; // 2 - 30%
        } else if (randomValue < 0.6) {
            targetCoefficient = targetCoefficients[1]; // 3 - 30%
        } else if (randomValue < 0.8) {
            targetCoefficient = targetCoefficients[2]; // 5 - 20%
        } else {
            targetCoefficient = targetCoefficients[3]; // 10 - 20%
        }
        
        console.log(`🎯 SELECTED MULTIPLIER: ${targetCoefficient}x (chances: 2x-30%, 3x-30%, 5x-20%, 10x-20%)`);
        
        // Finding platform with chosen coefficient
        const targetPlatform = visiblePlatforms.find(p => 
            parseFloat(p.dataset.coefficient) === targetCoefficient
        );
        
        if (!targetPlatform) {
            console.error("Platform with target coefficient not found!");
            // Try to select any platform with suitable coefficient
            const anyPlatformWithTargetCoef = visiblePlatforms.find(p => {
                const coef = parseFloat(p.dataset.coefficient);
                return targetCoefficients.includes(coef);
            });
            
            if (anyPlatformWithTargetCoef) {
                window.targetPlatformIndex = parseInt(anyPlatformWithTargetCoef.dataset.index);
                console.log(`Alternative target platform with index: ${window.targetPlatformIndex} and multiplier: ${anyPlatformWithTargetCoef.dataset.coefficient}`);
                
                // Jump directly to target platform
                jumpTo(anyPlatformWithTargetCoef);
            } else {
                console.error("No platforms with suitable coefficients found!");
                return;
            }
        } else {
            // Remember target platform index
            window.targetPlatformIndex = parseInt(targetPlatform.dataset.index);
            console.log(`Target platform index: ${window.targetPlatformIndex}`);
            
            // Jump directly to target platform
            jumpTo(targetPlatform);
        }
    }
    
    // Function to stop automatic jumps
    function stopAutoJumping() {
        isAutoJumping = false;
    }
    
    // Function to calculate successful jump chance
    function calculateJumpChance(coefficient) {
        // The higher the coefficient, the lower the chance
        return 1 / (coefficient * 0.5);
    }

    // Function for random jump
    function randomJump() {
        if (isJumping) return;
        
        // Filter unused platforms
        const availablePlatforms = visiblePlatforms.filter(p => !usedPlatforms.includes(p));
        if (availablePlatforms.length === 0) {
            resetGame();
            return;
        }

        // Проверяем, активирован ли режим высоких коэффициентов
        if (highMultiplierMode) {
            // Фильтруем платформы с коэффициентами от 20 до 100
            const highPlatforms = availablePlatforms.filter(p => {
                const coef = parseFloat(p.dataset.coefficient);
                return coef >= 20 && coef <= 100;
            });
            
            if (highPlatforms.length > 0) {
                // Выбираем случайную платформу с высоким коэффициентом
                const randomIndex = Math.floor(Math.random() * highPlatforms.length);
                const selectedPlatform = highPlatforms[randomIndex];
                
                console.log(`Прыжок на платформу с высоким коэффициентом: ${selectedPlatform.dataset.coefficient}x`);
                
                // Показываем модальное окно с коэффициентом
                const coefficient = selectedPlatform.dataset.coefficient;
                showModal(coefficient);
                
                // Прыгаем к выбранной платформе
                jumpTo(selectedPlatform);
                return;
            } else {
                console.log('Нет доступных платформ с коэффициентами 20-100 для случайного прыжка');
            }
        }

        // Target coefficients with probabilities 30%, 30%, 20%, 20%
        const targetCoefficients = [2, 3, 5, 10];
        
        // Using same probability distribution as in startAutoJumping
        const randomValue = Math.random();
        let targetCoefficient;
        if (randomValue < 0.3) {
            targetCoefficient = 2; // 30%
        } else if (randomValue < 0.6) {
            targetCoefficient = 3; // 30%
        } else if (randomValue < 0.8) {
            targetCoefficient = 5; // 20%
        } else {
            targetCoefficient = 10; // 20%
        }
        
        console.log(`🎲 Random jump! Number: ${randomValue.toFixed(4)}, selected multiplier: ${targetCoefficient}x`);
        
        // Try to find platform with chosen coefficient
        let selectedPlatform = availablePlatforms.find(p => 
            parseFloat(p.dataset.coefficient) === targetCoefficient
        );
        
        // If target platform not found, take random one
        if (!selectedPlatform) {
            // Filter platforms with specified coefficients
            let jumpablePlatforms = availablePlatforms.filter(p => {
                const coef = parseFloat(p.dataset.coefficient);
                return targetCoefficients.includes(coef);
            });
            
            // If no platforms with target coefficients, take all available
            if (jumpablePlatforms.length === 0) {
                jumpablePlatforms = availablePlatforms;
            }
            
            // Choose random platform from available ones
            const randomIndex = Math.floor(Math.random() * jumpablePlatforms.length);
            selectedPlatform = jumpablePlatforms[randomIndex];
        }

        // Show modal window with coefficient
        const coefficient = selectedPlatform.dataset.coefficient;
        showModal(coefficient);

        // Jump to selected platform
        jumpTo(selectedPlatform);
    }
    
    // Reset kangaroo position
    function resetKangaroo() {
        kangaroo.style.transition = 'none';
        kangaroo.style.left = `${currentPosition.x}px`;
        kangaroo.style.bottom = `${currentPosition.y}px`;
    }
    
    // Reset game
    function resetGame() {
        // Return kangaroo to initial position
        currentPosition = { x: isMobile ? 80 : 120, y: 80 };
        lastPlatform = null;
        currentPlatformIndex = -1;
        
        // Reset mode flag
        isZerkMode = false;
        
        // Reset target platform
        window.targetPlatformIndex = null;
        
        // Set initial kangaroo image
        kangaroo.style.backgroundImage = "url('kengu.png')";
        kangaroo.style.transform = 'scaleX(1)';
        
        createPlatforms();
        resetKangaroo();
        
        console.log("Game reset!");
    }
    
    // Start game / Jump
    playButton.addEventListener('click', () => {
        if (usedPlatforms.length === visiblePlatforms.length) {
            // All platforms used - restart
            resetGame();
            setTimeout(startAutoJumping, 100);
        } else {
            // Continue game - start auto jumps
            startAutoJumping();
        }
    });
    
    // Also adding click handler for modal window,
    // to allow stopping auto jumps and returning kangaroo to initial position
    modal.addEventListener('click', (event) => {
        // Prevent closing when clicking on modal window itself
        if (event.target === modal) {
            stopAutoJumping();
            hideModal();
            returnToStart();
        }
    });
    
    // Handling screen size changes
    window.addEventListener('resize', () => {
        // Update platform data and recreate them
        const newPlatformData = getAdaptedPositions();
        platformData.length = 0;
        platformData.push(...newPlatformData);
        createPlatforms();
        resetKangaroo();
    });
    
    // When page loads, check image availability
    function checkImages() {
        console.log('Checking image availability...');
        
        const testKenguzerk = new Image();
        testKenguzerk.onload = () => console.log('kenguzerk.png available');
        testKenguzerk.onerror = () => console.error('kenguzerk.png NOT FOUND!');
        testKenguzerk.src = 'kenguzerk.png';
        
        const testKengu = new Image();
        testKengu.onload = () => console.log('kengu.png available');
        testKengu.onerror = () => console.error('kengu.png NOT FOUND!');
        testKengu.src = 'kengu.png';
    }
    
    // Initialization
    // Setting initial kangaroo image
    kangaroo.style.backgroundImage = "url('kengu.png')";
    
    createPlatforms();
    checkImages();
    
    // Forced display of all platforms in console for diagnostics
    console.log("ALL PLATFORMS:");
    visiblePlatforms.forEach((platform, index) => {
        console.log(`Platform #${index}: id=${platform.id}, multiplier=${platform.dataset.coefficient}, index=${platform.dataset.index}`);
    });

    // Function to return kangaroo to starting position
    function returnToStart() {
        // Reset mode flag
        isZerkMode = false;
        
        // Set initial kangaroo image
        kangaroo.style.backgroundImage = "url('kengu.png')";
        kangaroo.style.transform = 'scaleX(1)';
        
        // Return kangaroo to initial position
        const startPosition = { x: isMobile ? 80 : 120, y: 80 };
        kangaroo.style.transition = 'all 0.5s ease-out';
        kangaroo.style.left = `${startPosition.x}px`;
        kangaroo.style.bottom = `${startPosition.y}px`;
        currentPosition = startPosition;
        
        // Reload platforms
        setTimeout(() => {
            // Remove used platforms
            usedPlatforms = [];
            
            // Restore platform visibility
            visiblePlatforms.forEach(platform => {
                platform.style.opacity = '1';
                platform.style.display = 'block';
            });
        }, 500);
    }
}); 