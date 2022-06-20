"use strict";

const btnStartStopwatch = document.getElementById("btnStartStopwatch");
const btnResetStopwatch = document.getElementById("btnResetStopwatch");
const btnFinishStopwatch = document.getElementById("btnFinishStopwatch");
const displayHours = document.getElementById("displayHours");
const displayMinutes = document.getElementById("displayMinutes");
const displaySeconds = document.getElementById("displaySeconds");
const displayMilliSeconds = document.getElementById("displayMilliSeconds");
const stopwatchTimesBody = document.getElementById("stopwatchTimesBody");

let stopwatchInterval;
let stopwatchStart;
let stopwatchPassedMS = 0;
let lastTimeId = 1;
let isTicking = false;

function resetStopwatch() {
  clearInterval(stopwatchInterval);
  displayHours.innerText = "00";
  displayMinutes.innerText = "00";
  displaySeconds.innerText = "00";
  displayMilliSeconds.innerText = "000";
  btnStartStopwatch.innerText = "Start";
}

function updateStopwatch() {
  let stopwatchNow = new Date(Date.now() - stopwatchStart);

  displayHours.innerText = String(stopwatchNow.getUTCHours()).padStart(2, "0");
  displayMinutes.innerText = String(stopwatchNow.getUTCMinutes()).padStart(2, "0");
  displaySeconds.innerText = String(stopwatchNow.getUTCSeconds()).padStart(2, "0");
  displayMilliSeconds.innerText = String(stopwatchNow.getUTCMilliseconds()).padStart(
    2,
    "0"
  );
}

function toHHMMSSMS(msecs) {
  let secsDec = parseInt(msecs / 1000, 10);
  let hours = Math.floor(secsDec / 3600);
  secsDec %= 3600;
  let minutes = Math.floor(secsDec / 60);
  secsDec %= 60;
  let seconds = secsDec;
  let milliseconds = msecs % 1000;

  return (
    [hours, minutes, seconds]
      .map((v) => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":") +
    "." +
    String(milliseconds).padStart(3, "0")
  );
}

btnStartStopwatch.addEventListener("click", () => {
  switch (btnStartStopwatch.innerText) {
    case "Start":
      btnStartStopwatch.innerText = "Stop";
      isTicking = true;
      stopwatchPassedMS = 0;
      stopwatchStart = Date.now();
      stopwatchInterval = setInterval(updateStopwatch, 10);
      break;
    case "Stop":
      btnStartStopwatch.innerText = "Resume";
      isTicking = false;
      stopwatchPassedMS = Date.now() - stopwatchStart;
      clearInterval(stopwatchInterval);
      break;
    case "Resume":
      btnStartStopwatch.innerText = "Stop";
      stopwatchStart = Date.now() - stopwatchPassedMS;
      stopwatchPassedMS = 0;
      isTicking = true;
      stopwatchInterval = setInterval(updateStopwatch, 10);
      break;
  }
});

btnResetStopwatch.addEventListener("click", () => {
  resetStopwatch();
  lastTimeId = 1;
  isTicking = false;
  stopwatchPassedMS = 0;
  stopwatchTimesBody.innerHTML = "";
});

btnFinishStopwatch.addEventListener("click", () => {
  let stopwatchString;

  resetStopwatch();
  if (!isTicking && stopwatchPassedMS == 0) {
    return;
  }
  if (!isTicking && stopwatchPassedMS != 0) {
    stopwatchString = toHHMMSSMS(stopwatchPassedMS);
  } else if (isTicking) {
    stopwatchString = toHHMMSSMS(Date.now() - stopwatchStart);
  }
  stopwatchTimesBody.insertAdjacentHTML(
    "afterbegin",
    `
              <tr>
                <td>${lastTimeId}</td>
                <td>${stopwatchString}</td>
              </tr>
    
    `
  );
  lastTimeId++;
  stopwatchPassedMS = 0;
  isTicking = false;
});
