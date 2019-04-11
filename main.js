'use strict';

// Modules
const electron  = require('electron');
const url       = require('url');
const path      = require('path');
const storage   = require('electron-json-storage');

const {app, BrowserWindow, ipcMain} = electron;

// Windows
let win;
let login;
let loader;

var user;

storage.get('user', function(error, object) {
  if (error) throw error;
  user = object;
});

// Listen for app to be ready
app.on('ready', function() {
  //test();
  checkAutoLogin();
  // Create new window
  loader = new BrowserWindow({
    frame : false,
    width : 400,
    height: 500,
    icon  : 'img/logo4.png'
  });

  // Load html into window
  loader.loadURL(url.format({
    //pathname: path.join(__dirname, '/commTest/TEST.html'),
    pathname: path.join(__dirname, '/loader/loader.html'),
    //pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes : true
  }));

});

// Handle create mainWindow
function createMainWindow() {
  win = new BrowserWindow({
    icon: 'img/logo4.png'
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, './dashboard/welcome.html'),
    protocol: 'file:',
    slashes : true
  }));
};

// Handle create loginWindow
function createLoginWindow() {
  login = new BrowserWindow({
    icon: 'img/logo4.png'
  })

  login.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes : true
  }))
}

function checkAutoLogin() {
  if(user) {
    if(user.autoLogin === true) {
      console.log("AUTOLOGIN: TRUE");
      console.log(user);
      createMainWindow();
    } else {
      console.log("AUTOLOGIN: FALSE");
      console.log(user);
      createLoginWindow();
    }
  }
}


function test() {
  win = new BrowserWindow;

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'camTest/test.html')
  }))
}

// Exports
exports.createMain  = () => createMainWindow();
exports.createLogin = () => createLoginWindow();
exports.checkAuto   = () => checkAutoLogin();
