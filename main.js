const { app, BrowserWindow, Menu } = require("electron");
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        backgroundColor: "#ffffff",
        webPreferences: {
            nodeIntegration: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true
        }
    });
    if (isDev) {
        win.webContents.openDevTools();
    }

    win.loadFile('index.html');
}

if (isDev) {
    try {
        require('electron-reload')(__dirname, {
            electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
        });
    } catch (err) {
        console.error("Failed to load electron-reload:", err);
    }
}

app.whenReady().then(() => {
    createWindow();
    const menuTemplate = [];
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
