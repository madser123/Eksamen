const dns         = require('dns')
const electron    = require('electron')
const remote      = require('electron').remote
const storage     = require('electron-json-storage')

const mainProcess = require('electron').remote.require('./main.js')

var timerDisplay;
var i = 0;
var time;
var result;
var myVar;

var user = storage.get

var window;

function startTimer(duration, display) {
  if (time > 65) {
    stop();
  }
  var timer = duration, seconds;
  myVar = setInterval(function () {
    seconds = parseInt(timer % 60, 10);

    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = seconds;

    if (--timer < 0) {
      clearInterval(myVar);
      document.getElementById("timer").innerHTML = "Retrying."
      onloadFunction();
    }
  }, 1000);

};

function timerSwitch(num) {
  switch(num){
    case 0:
      time = 10;
      break;
    case 1:
      time = 15;
      break;
    case 2:
      time = 30;
      break;
    case 3:
      time = 45;
      break;
    case 4:
      time = 60;
      break;
    case 5:
      time = 70;
      break;
  }
  i++;
};

function checkConnection() {
  dns.resolve('www.google.com', function(err, records) {
    if (err) {
      console.log("Error");
      return console.error(err.message);
    }

    if (records) {
      console.log("Connected");
      result = records;
    } else {
      console.log("Not connected");
    }
  });
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 100);
  });
};

async function onloadFunction() {

  connResult = await checkConnection();

  if (connResult === 'resolved') {
    if (result) {
      console.log("result defined");
      console.log("Connected (LOAD NEW WINDOW)");

      mainProcess.checkAuto();

      window = remote.getCurrentWindow;
      window.close();

    } else {
      timerSwitch(i)
      document.getElementById("timer").innerHTML = "<p id='loaderText'>Connection not available.<br> Retrying in: <span id='time'></span> seconds";
      timerDisplay = document.querySelector('#time');
      startTimer(time, timerDisplay);
    }
  }
};

function stop() {
  document.getElementById("remover").innerHTML = "";
  document.getElementById("timer").innerHTML   = "No connection available. <br> Connect to the internet and retry.<br> <button class='buttonMedium' id='retryButton'>Retry</button>";
  document.getElementById("retryButton").addEventListener('click', retry);
}

function retry() {
  i = 0;
  document.getElementById("remover").innerHTML = "<div class='logoloader'><img src='Ellipsis-1s-164px.gif'></div>";
  onloadFunction();
}
