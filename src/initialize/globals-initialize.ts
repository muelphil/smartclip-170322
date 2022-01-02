import {logger} from '@/classes/Logger';

const win = require('electron').remote.getCurrentWindow();
const {shell} = require('electron');

function htmlToDocument(html: string): Document {
    return new DOMParser().parseFromString(html, "text/html");
}

function requestPageSource(url: string): Promise<{ status: number, html: string }> {
    return new Promise((resolve, reject) => {
        const xmlHttp: XMLHttpRequest = new XMLHttpRequest();
        xmlHttp.open("GET", url, true); // false for synchronous request
        xmlHttp.onreadystatechange = (event) => {
            if (xmlHttp.readyState === XMLHttpRequest.DONE) {
                const status = xmlHttp.status;
                const hasHtml = (status === 0 || (status >= 200 && status < 400));
                const html = hasHtml ? xmlHttp.responseText : null;
                resolve({status, html})
            }
        };
        xmlHttp.timeout = 5000;
        ['timeout', 'error', 'abort'].forEach(event => {
            xmlHttp['on' + event] = () => reject(event);
        });
        xmlHttp.send(null);
        return xmlHttp.responseText;
    })
}

global.logger = logger;
global.services = [];
global.htmlToDocument = htmlToDocument;
global.requestPageSource = requestPageSource;
window.hide = () => win.hide();
global.openUrl = url => {
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    shell.openExternal(url);
};
global.openExternal = shell.openExternal; // todo wirklich notwendig oder kann auch einfach immer shell importiert werden?

console.debug("[globals-initialize] globals are initialized");
