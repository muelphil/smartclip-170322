'use strict'

import {app, BrowserWindow, globalShortcut, ipcMain, Menu, powerMonitor, protocol, screen, Tray} from 'electron';
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import {appendLineToLog} from '@/utils/appendLineToLog';
import '@/initialize/paths2';
import settingsManager from "electron-settings";
import installExtension, {VUEJS3_DEVTOOLS} from 'electron-devtools-installer'

const isDevelopment = process.env.NODE_ENV !== 'production'
app.allowRendererProcessReuse = false;
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let toolWindow: BrowserWindow | null = null;
let settingsWin: BrowserWindow | null = null;
let tray: Tray | null;
// @ts-ignore
let iconPath = path.join(__static, 'icons/favicon/clipboards.ico');
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}]);

let screenWidth, screenHeight;

async function createToolWindow() {
    const applicationWidth = 1000;
    const applicationHeight = 900;
    const x = (screenWidth - applicationWidth) / 2;
    const y = screenHeight * 0.2;
    const maxHeight = 0.45 * screenHeight;

    let options = {
        width: applicationWidth,
        height: applicationHeight,
        x: x,
        y: y,
        maxHeight: maxHeight,
        center: true,
        webPreferences: {

            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: (process.env
                .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            enableRemoteModule: true,
            // TODO beneath needed?
            webSecurity: false,
            spellcheck: false,
            nativeWindowOpen: true,
            preload: 'E:\\Programmierung\\v3\\smartclip\\src\\preload.js',
        },
        icon: iconPath
    };

    const showTransparent = !isDevelopment;

    if (showTransparent) {
        options = Object.assign(options, {
            show: false,
            resizable: false,
            movable: false,
            skipTaskbar: true,
            fullscreenable: false,
            frame: false,
            transparent: true,
            backgroundColor: '#00000001',
            alwaysOnTop: true,
        });
    }

    // Create the browser window.
    toolWindow = new BrowserWindow(options);

    tray = new Tray(iconPath);
    tray.setToolTip('SmartClip');
    let contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show DevTools', click: function () {
                toolWindow.webContents.openDevTools();
            }
        },
        {
            label: 'Show/Hide App', click: function () {
                toolWindow!.isVisible() ? toolWindow!.minimize() : toolWindow!.show();
            }
        },
        {
            label: 'Quit', click: function () {
                (app as any).isQuiting = true;
                app.quit();
            }
        }
    ]);
    tray.setContextMenu(contextMenu);
    tray.on('double-click', () => toolWindow!.show());

    // Windows is always on top
    if (!isDevelopment) {
        toolWindow.setAlwaysOnTop(true, 'floating');
        toolWindow.setVisibleOnAllWorkspaces(true);
        toolWindow.setFullScreenable(false);
    } else {
        toolWindow.webContents.openDevTools();
    }

    toolWindow.webContents.on('zoom-changed', () => {
        console.debug('[Events] Zoom changed!');
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await toolWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
        if (!showTransparent) toolWindow.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        toolWindow.loadURL('app://./index.html')
    }

    // TODO - Goal: minimize into the tray
    toolWindow.on('minimize', function (event: any) {
        console.log('[Events] toolWindow::minimize')
        // if ( !isDevelopment ) {
        event.preventDefault();
        toolWindow!.hide();
        // }
    });

    toolWindow.on('blur', function (_event: any) {
        console.log('[Events] toolWindow::blur')
        if (!isDevelopment && settingsWin === null)
            toolWindow!.hide();
    });

    toolWindow.on('close', function (event) {
        appendLineToLog('background.ts::ipcMain.on(\'close\') called');
        if (toolWindow) {
            event.preventDefault();
            toolWindow.webContents.send('app-close');
        }
    });

}


// Quit when cleanup is done.
ipcMain.on('closed', _ => {
    appendLineToLog('background.ts::ipcMain.on(\'closed\') called');
    // Unregister all shortcuts.
    globalShortcut.unregisterAll();
    toolWindow = null;
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// TODO transparent window: https://github.com/electron/electron/issues/2170#issuecomment-736223269
// app.disableHardwareAcceleration();

app.on('activate', () => {
    // appendLineToLog('background.ts::app.on(\'activate\') called');
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createToolWindow();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    const size = screen.getPrimaryDisplay().workAreaSize;
    screenWidth = size.width;
    screenHeight = size.height;
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS3_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createToolWindow();
});

// https://github.com/electron/electron/issues/23757#issuecomment-640146333
app.whenReady().then(() => {
    protocol.registerFileProtocol('file', (request, callback) => {
        const pathname = request.url.replace('file:///', '');
        callback(pathname);
    });
});

// ========================================================================================

function createSettingsWindow() { // TODO settings arg entfernen
    console.log('toolWindow.webContents.id = ', toolWindow.webContents.id);
    let options = {
        parent: toolWindow,
        modal: true,
        resizable: isDevelopment,
        movable: isDevelopment,
        skipTaskbar: true,
        fullscreenable: isDevelopment,
        frame: isDevelopment,
        transparent: true,
        backgroundColor: '#00000001',
        alwaysOnTop: true,
        width: 800,
        height: 800,
        x: screenWidth - 820,
        y: screenHeight - 820,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: (process.env
                .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            enableRemoteModule: true,
            // TODO beneath needed?
            webSecurity: false,
            spellcheck: false,
            nativeWindowOpen: true,
            additionalArguments: [String(toolWindow.webContents.id)],
            preload: 'E:\\Programmierung\\v3\\smartclip\\src\\settings-window\\preload.js',
        },
        icon: iconPath
    };

    // Create the browser window.
    settingsWin = new BrowserWindow(options);

    settingsWin.webContents.on('zoom-changed', () => {
        console.debug('[Events] Zoom changed!');
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        const url = '' + process.env.WEBPACK_DEV_SERVER_URL as string + '#settings';
        settingsWin.loadURL(url);
        // todo transparent settingsWindow: comment this in when aiming for transparent settingsWindow
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        settingsWin.loadURL('app://./settings-index.html');
    }

    // TODO - Goal: minimize into the tray
    settingsWin.on('minimize', function (event: any) {
        // if ( !isDevelopment ) {
        event.preventDefault();
        settingsWin!.hide();
        // }
    });

    settingsWin.on('blur', function (_event: any) {
        if (!isDevelopment)
            settingsWin!.hide();
    });

    settingsWin.on('close', () => {
        settingsWin = null;
        console.log('toolWindow=', toolWindow)
        toolWindow.webContents.send('focus-searchbar');
    });

    settingsWin.webContents.openDevTools();
}

ipcMain.on('open-settings', (_) => {
    console.log('[Events] opensettings called!');
    createSettingsWindow();
});

ipcMain.on('close-settings', (_) => {
    if (settingsWin) {
        settingsWin.close();
    }
});

ipcMain.on('log', async (event, someArgument) => {
    let loadedSettings = settingsManager.getSync('settings') || {};
    console.log('loadedsettings from background.ts', loadedSettings);
    // console.log('settings=', global.settings);
    // console.log('modifying...');
    // global.settings['test'].test2 = 'test4'
    // console.log('settings=', global.settings);
})

ipcMain.handle('get-tool-window-id', async (event, _someArgument) => {
    return toolWindow.webContents.id;
})

// ========================================================================================
process.on('exit', () => appendLineToLog('background.ts::process.on(\'exit\') called'));
powerMonitor.on('lock-screen', () => appendLineToLog('background.ts::powerMonitor.on(\'lock-screen\') called'));
powerMonitor.on('shutdown', (event) => {
    event.preventDefault();
    appendLineToLog('background.ts::powerMonitor.on(\'shutdown\') called').then(() => app.quit());
});
powerMonitor.on('suspend', () => appendLineToLog('background.ts::powerMonitor.on(\'suspend\') called'));

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
