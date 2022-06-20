"use strict";

const btnIncreaseHours = document.getElementById("btnIncreaseHours");
const btnIncreaseMinutes = document.getElementById("btnIncreaseMinutes");

const btnDecreaseHours = document.getElementById("btnDecreaseHours");
const btnDecreaseMinutes = document.getElementById("btnDecreaseMinutes");

const btnStartAlarm = document.getElementById("btnStartAlarm");
const btnResetAlarm = document.getElementById("btnResetAlarm");
const btnSilenceAlarm = document.getElementById("btnSilenceAlarm");

const displayHours = document.getElementById("displayHours");
const displayMinutes = document.getElementById("displayMinutes");
let curToastNum = 0;
let bell = new Audio("assets/rooster_crowing.wav");
let bellLoop;

function normalizeClockNumber(num, min, max) {
  if (isNaN(num)) {
    return "00";
  }
  num = Math.floor(Number(num));

  if (num < min) {
    num = min;
  } else if (num > max) {
    num = max;
  }

  return String(num).padStart(2, "0");
}

bell.addEventListener("ended", () => {
  bell.currentTime = 0;
  bellLoop = setTimeout(() => {
    bell.play();
  }, 2000);
});

btnIncreaseHours.addEventListener("click", () => {
  if (+displayHours.innerText < 23) {
    displayHours.innerText = String(+displayHours.innerText + 1).padStart(2, "0");
  } else {
    displayHours.innerText = "00";
  }
});

btnIncreaseMinutes.addEventListener("click", () => {
  if (+displayMinutes.innerText < 59) {
    displayMinutes.innerText = String(+displayMinutes.innerText + 1).padStart(2, "0");
  } else {
    displayMinutes.innerText = "00";
  }
});

btnDecreaseHours.addEventListener("click", () => {
  if (+displayHours.innerText > 0) {
    displayHours.innerText = String(+displayHours.innerText - 1).padStart(2, "0");
  } else {
    displayHours.innerText = "23";
  }
});

btnDecreaseMinutes.addEventListener("click", () => {
  if (+displayMinutes.innerText > 0) {
    displayMinutes.innerText = String(+displayMinutes.innerText - 1).padStart(2, "0");
  } else {
    displayMinutes.innerText = "59";
  }
});

btnResetAlarm.addEventListener("click", () => {
  displayHours.innerText = "00";
  displayMinutes.innerText = "00";
});

btnStartAlarm.addEventListener("click", () => {
  let curDate = new Date();
  let alarmDate = new Date(curDate.getTime());
  alarmDate.setSeconds(0, 0);
  const alarmHours = displayHours.innerText;
  const alarmMinutes = displayMinutes.innerText;

  alarmDate.setHours(+displayHours.innerText);
  alarmDate.setMinutes(+displayMinutes.innerText);

  if (alarmDate < curDate) {
    alarmDate.setDate(+alarmDate.getDate() + 1);
  }

  curToastNum++;

  document.getElementById("alarmContainer").insertAdjacentHTML(
    "beforeend",
    `
            <div id="alarmToast${curToastNum}" class="toast text-dark bg-warning " role="alert" aria-live="assertive"
              aria-atomic="true" data-bs-autohide="false">
              <div class="toast-header">
                <strong class="me-auto"><i class="bi bi-alarm"></i> Alarm</strong>
                <button id="btnAlarmClose${curToastNum}"type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
              </div>
              <div class="toast-body">
                Alarm at: ${alarmHours}:${alarmMinutes}
              </div>
            </div>
  `
  );

  const curAlarmToast = document.getElementById(`alarmToast${curToastNum}`);
  const toast = new bootstrap.Toast(curAlarmToast);
  toast.show();

  const alarmTimeout = setTimeout(() => {
    curAlarmToast.remove();
    curToastNum--;

    btnSilenceAlarm.style.display = "block";
    bell.play();
  }, alarmDate.getTime() - curDate.getTime());

  curAlarmToast.setAttribute("data-timeout-id", alarmTimeout);

  document.getElementById(`btnAlarmClose${curToastNum}`).addEventListener("click", () => {
    clearTimeout(curAlarmToast.getAttribute("data-timeout-id"));
    curAlarmToast.remove();
    curToastNum--;
    alert(`Removed the alarm at: ${alarmHours}:${alarmMinutes}`);
  });
});

btnSilenceAlarm.addEventListener("click", () => {
  clearTimeout(bellLoop);
  bell.pause();
  btnSilenceAlarm.style.display = "none";
});

displayHours.addEventListener("click", () => {
  displayHours.innerText = normalizeClockNumber(prompt("Enter hours for alarm:"), 0, 23);
});

displayMinutes.addEventListener("click", () => {
  displayMinutes.innerText = normalizeClockNumber(
    prompt("Enter minutes for alarm:"),
    0,
    59
  );
});
