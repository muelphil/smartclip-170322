import '@/initialize/paths';
import { generateEventEmitter } from '@/services/eventemitter';
window.emitter = generateEventEmitter();

const win = require('electron').remote.getCurrentWindow();

let listenersId = window.emitter.setListeners({
    'esc': (event) => { // TODO use eventemitter instead
        event.preventDefault();
        // window.services.global.settingsActive = false;
        // win.minimize();
        win.hide();
    }
});
