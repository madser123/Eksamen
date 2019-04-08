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

      mainProcess.createMain();

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
