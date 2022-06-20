"use strict";

const displayHours = document.getElementById("displayHours");
const displayMinutes = document.getElementById("displayMinutes");
const displaySeconds = document.getElementById("displaySeconds");

const btnIncreaseHours = document.getElementById("btnIncreaseHours");
const btnIncreaseMinutes = document.getElementById("btnIncreaseMinutes");
const btnIncreaseSeconds = document.getElementById("btnIncreaseSeconds");

const btnDecreaseHours = document.getElementById("btnDecreaseHours");
const btnDecreaseMinutes = document.getElementById("btnDecreaseMinutes");
const btnDecreaseSeconds = document.getElementById("btnDecreaseSeconds");

const timerProgressBar = document.getElementById("timerProgressBar");

const btnStartTimer = document.getElementById("btnStartTimer");
const btnResetTimer = document.getElementById("btnResetTimer");

const timerSet = document.getElementById("timerSet");

let countdown;
let finishDateMS; // finish date in UNIX epoch milliseconds
let pauseDateMS;

function updateTimer() {
  let totalSecondsLeft = Math.round((finishDateMS - Date.now()) / 1000);
  if (totalSecondsLeft <= 0) {
    const timerToast = document.getElementById("timerToast");
    const toast = new bootstrap.Toast(timerToast);
    toast.show();
    const bell = new Audio("assets/achievement_bell.wav");
    bell.play();
    btnResetTimer.click();
  } else {
    timerString = toHHMMSS(totalSecondsLeft);
    document.getElementById("timerString").innerText = timerString;
    const percent =
      Math.floor(
        (totalSecondsLeft / +timerProgressBar.getAttribute("aria-valuemax")) * 100
      ) + "%";
    timerProgressBar.style.width = percent;
    timerProgressBar.innerText = percent;
    timerProgressBar.setAttribute("aria-valuenow", totalSecondsLeft);
  }
}

function toHHMMSS(secs) {
  let secsDec = parseInt(secs, 10);
  let hours = Math.floor(secsDec / 3600);
  secsDec %= 3600;
  let minutes = Math.floor(secsDec / 60);
  secsDec %= 60;
  let seconds = secsDec;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
}

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

btnResetTimer.addEventListener("click", () => {
  displayHours.textContent = "00";
  displayMinutes.textContent = "00";
  displaySeconds.textContent = "00";

  document.getElementById("timerUpButtons").style.visibility = "visible";
  document.getElementById("timerDownButtons").style.visibility = "visible";
  const timerDisplay = document.getElementById("timerDisplay");
  try {
    if (timerDisplay != null) {
      timerDisplay.remove();
    }
  } catch (err) {
    console.error(err);
  }
  timerProgressBar.style.visibility = "hidden";
  timerSet.style.display = "flex";

  btnStartTimer.innerText = "Start";
  clearInterval(countdown);
});

btnStartTimer.addEventListener("click", () => {
  switch (btnStartTimer.innerText) {
    case "Start":
      timerProgressBar.style.visibility = "visible";
      let totalSecondsLeft =
        +displayHours.innerText * 3600 +
        +displayMinutes.innerText * 60 +
        +displaySeconds.innerText;
      if (totalSecondsLeft <= 0) {
        timerProgressBar.style.width = "0%";
        timerProgressBar.innerText = "0%";
        timerProgressBar.setAttribute("aria-valuenow", totalSecondsLeft);
        timerProgressBar.setAttribute("aria-valuemax", totalSecondsLeft);
        break;
      }
      timerProgressBar.style.width = "100%";
      timerProgressBar.innerText = "100%";
      timerProgressBar.setAttribute("aria-valuenow", totalSecondsLeft);
      timerProgressBar.setAttribute("aria-valuemax", totalSecondsLeft);

      finishDateMS = Date.now() + totalSecondsLeft * 1000;
      let timerString = toHHMMSS(totalSecondsLeft);

      timerSet.style.display = "none";
      timerSet.insertAdjacentHTML(
        "afterend",
        `
      <div id="timerDisplay" class="timer__display row justify-content-center text-center border border-2 my-2 rounded-3">
              <div id="timerString" class="display-1">${timerString}</div>
            </div>

      `
      );
      document.getElementById("timerUpButtons").style.visibility = "hidden";
      document.getElementById("timerDownButtons").style.visibility = "hidden";

      btnStartTimer.innerText = "Stop";
      countdown = setInterval(updateTimer, 200);

      break;
    case "Stop":
      btnStartTimer.innerText = "Resume";
      pauseDateMS = Date.now();
      clearInterval(countdown);
      break;
    case "Resume":
      btnStartTimer.innerText = "Stop";
      finishDateMS += Date.now() - pauseDateMS;
      countdown = setInterval(updateTimer, 200);
      break;
  }
});

btnIncreaseHours.addEventListener("click", () => {
  if (+displayHours.innerText < 99) {
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

btnIncreaseSeconds.addEventListener("click", () => {
  if (+displaySeconds.innerText < 59) {
    displaySeconds.innerText = String(+displaySeconds.innerText + 1).padStart(2, "0");
  } else {
    displaySeconds.innerText = "00";
  }
});

btnDecreaseHours.addEventListener("click", () => {
  if (+displayHours.innerText > 0) {
    displayHours.innerText = String(+displayHours.innerText - 1).padStart(2, "0");
  } else {
    displayHours.innerText = "99";
  }
});

btnDecreaseMinutes.addEventListener("click", () => {
  if (+displayMinutes.innerText > 0) {
    displayMinutes.innerText = String(+displayMinutes.innerText - 1).padStart(2, "0");
  } else {
    displayMinutes.innerText = "59";
  }
});

btnDecreaseSeconds.addEventListener("click", () => {
  if (+displaySeconds.innerText > 0) {
    displaySeconds.innerText = String(+displaySeconds.innerText - 1).padStart(2, "0");
  } else {
    displaySeconds.innerText = "59";
  }
});

displayHours.addEventListener("click", () => {
  displayHours.innerText = normalizeClockNumber(prompt("Enter hours for timer:"), 0, 99);
});

displayMinutes.addEventListener("click", () => {
  displayMinutes.innerText = normalizeClockNumber(
    prompt("Enter minutes for timer:"),
    0,
    59
  );
});

displaySeconds.addEventListener("click", () => {
  displaySeconds.innerText = normalizeClockNumber(
    prompt("Enter seconds for timer:"),
    0,
    59
  );
});
