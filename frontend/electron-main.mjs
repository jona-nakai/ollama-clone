import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// filepath for main file and main directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ipcMain.handle('ping', () => 'pong from main');

// create the window that holds the application
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  // if in dev, use vite dev server. if packaged, load from dist
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    win.loadURL('http://localhost:5173');
  }
}

// create window when electron app has initialized
app.whenReady().then(()=> {
  createWindow();
});

// if there are no windows, create a window
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length() === 0) createWindow();
});

// if on mac, and all windos are closed, quit the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});