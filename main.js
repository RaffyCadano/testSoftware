const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('renderer/index.html');

  // Wire autoUpdater events to renderer
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';

  autoUpdater.on('checking-for-update', () => {
    mainWindow.webContents.send('checking-for-update');
  });
  autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('update-available', info);
  });
  autoUpdater.on('update-not-available', (info) => {
    mainWindow.webContents.send('update-not-available', info);
  });
  autoUpdater.on('error', (err) => {
    mainWindow.webContents.send('update-error', (err && err.stack) ? err.stack : String(err));
  });
  autoUpdater.on('download-progress', (progressObj) => {
    mainWindow.webContents.send('download-progress', progressObj);
  });
  autoUpdater.on('update-downloaded', (info) => {
    mainWindow.webContents.send('update-downloaded', info);
  });
}

app.whenReady().then(() => {
  createWindow();
  autoUpdater.allowPrerelease = true;
  // check for updates on startup (non-blocking)
  try { autoUpdater.checkForUpdatesAndNotify(); } catch (e) { log.error(e); }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.on('ping', (event, arg) => {
  event.sender.send('pong', `Main received: ${arg}`);
});

// renderer -> main commands for updater
ipcMain.on('check-for-updates', () => {
  autoUpdater.checkForUpdates();
});

ipcMain.on('install-update', () => {
  // quit and install the downloaded update
  try { autoUpdater.quitAndInstall(); } catch (e) { log.error(e); }
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});
