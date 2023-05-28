// main.js

const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 1200,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Needed for Electron 12 and above
      enableRemoteModule: true, // Needed for Electron 12 and above
    },
    icon: path.join(__dirname, 'assets/icons/png/1024x1024.png'),
  });
  const filePath = path.join(__dirname, 'build-client', 'index.html');
  const fileURL = url.pathToFileURL(filePath).toString();

  win.loadURL(fileURL);

  const server = spawn('npm', ['run', 'start:prod'], {
    shell: true,
  });
  server.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  server.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
