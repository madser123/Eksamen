const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow} = electron;

let mainWindow;

// Listen for app to be ready
app.on('ready', function(){
  // Create new window
  mainWindow = new BrowserWindow({
    //transparent: true,
    //frame: false
  });
  // Load html into window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol:'file:',
    slashes: true
  }));

  // Build menu from template
  //const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
//  Menu.setApplicationMenu(mainMenu);
});

// Create menu template
