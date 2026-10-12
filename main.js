// Kirana Rate Register — Electron main process (v1.0.0)
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

if (!app.requestSingleInstanceLock()) app.quit();

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 720,
    minHeight: 500,
    title: 'Kirana Rate Register',
    icon: path.join(__dirname, 'build', 'icon.png'),
    backgroundColor: '#e9ecf2',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, spellcheck: false }
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'index.html'));
  win.maximize();

  // External links browser mein khulein, app ke andar nahi
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });

  // Excel / Backup file: har baar "Save As" dialog dikhe
  win.webContents.session.on('will-download', (_e, item) => {
    item.setSaveDialogOptions({ title: 'File save karein', defaultPath: path.join(app.getPath('documents'), item.getFilename()) });
  });

  // Ctrl+R / F5 reload, Ctrl+P print, F12 devtools
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F5' || (input.control && input.key.toLowerCase() === 'r')) { win.reload(); e.preventDefault(); }
    if (input.control && input.key.toLowerCase() === 'p') { win.webContents.print(); e.preventDefault(); }
    if (input.key === 'F12') { win.webContents.toggleDevTools(); e.preventDefault(); }
  });
}

app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
