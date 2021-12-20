import { ipcRenderer } from 'electron';
import { appendLineToLog } from '@/utils/appendLineToLog';

// const fs = require('fs');
const listeners: Array<() => void> = [];

// http://www.matthiassommer.it/programming/frontend/two-ways-to-react-on-the-electron-close-event/
// todo allow async, move to helpers
ipcRenderer.on('app-close', _ => {
    appendLineToLog('ipcRenderer.on(\'app-close\')');
    listeners.forEach(listener => listener());
    appendLineToLog('ipcRenderer.on(\'app-close\') - all listeners executed!');
    ipcRenderer.send('closed'); // TODO recheck if all cleanup methods really go through before this is called - are the #used for clipboard entries saved?
});

process.on('exit', function () {
    listeners.forEach(listener => listener());
});

function onClose(listener: () => void) {
    listeners.push(listener);
}

export { onClose };
