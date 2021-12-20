import { logger } from '@/classes/Logger';
import got from 'got';
const win = require('electron').remote.getCurrentWindow();
const {shell} = require('electron');

global.got = got;

console.log("GLOBALS ARE INITIALIZED!");
global.logger = logger;
global.requestPageSource = (url) => {
    return got.get(url).then(response => {
        return {status: response.statusCode, document: new DOMParser().parseFromString(response.body, 'text/html')};
    });
};
window.hide = () => win.hide();
global.openUrl = url => {
    if ( !url.startsWith('http') )
        url = 'https://' + url;
    shell.openExternal(url);
};
global.openExternal = shell.openExternal; // todo wirklich notwendig oder kann auch einfach immer shell importiert werden?

