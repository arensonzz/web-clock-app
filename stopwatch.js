'use strict';

const btnStartStopwatch = document.getElementById('btnStartStopwatch');
const btnResetStopwatch = document.getElementById('btnResetStopwatch');
const displayHours = document.getElementById('displayHours');
const displayMinutes = document.getElementById('displayMinutes');
const displaySeconds = document.getElementById('displaySeconds');
const displayMilliSeconds = document.getElementById('displayMilliSeconds');

let stopwatchInterval;
let stopwatchStart;
let stopwatchPassedMS;

function updateStopwatch() {
  let stopwatchNow = new Date(Date.now() - stopwatchStart);

  displayHours.innerText = String(stopwatchNow.getUTCHours()).padStart(2, '0');
  displayMinutes.innerText = String(stopwatchNow.getUTCMinutes()).padStart(
    2,
    '0'
  );
  displaySeconds.innerText = String(stopwatchNow.getUTCSeconds()).padStart(
    2,
    '0'
  );
  displayMilliSeconds.innerText = String(
    stopwatchNow.getUTCMilliseconds()
  ).padStart(2, '0');
}

btnStartStopwatch.addEventListener('click', () => {
  switch (btnStartStopwatch.innerText) {
    case 'Start':
      btnStartStopwatch.innerText = 'Stop';
      stopwatchStart = Date.now();
      stopwatchInterval = setInterval(updateStopwatch, 100);
      break;
    case 'Stop':
      btnStartStopwatch.innerText = 'Resume';
      stopwatchPassedMS = Date.now() - stopwatchStart;
      clearInterval(stopwatchInterval);
      break;
    case 'Resume':
      btnStartStopwatch.innerText = 'Stop';
      stopwatchStart = Date.now() - stopwatchPassedMS;
      stopwatchInterval = setInterval(updateStopwatch, 100);
      break;
  }
});

btnResetStopwatch.addEventListener('click', () => {
  clearInterval(stopwatchInterval);
  displayHours.innerText = '00';
  displayMinutes.innerText = '00';
  displaySeconds.innerText = '00';
  displayMilliSeconds.innerText = '000';
  btnStartStopwatch.innerText = 'Start';
});
