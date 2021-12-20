import { fallbackCssPath, themes } from '@/initialize/paths';

const fs = require('fs');
const path = require('path');
const remote = require('electron').remote;
const app = remote.app;
const win = remote.getCurrentWindow();
const AutoLaunch = require('auto-launch');
const globalShortcut = remote.globalShortcut;
const settingsManager = require('electron-settings');

const fallbackCss = fs.readFileSync(fallbackCssPath, 'utf-8');

let cssKey: string = '';

function setTheme(theme: string) {
    console.debug('[Settings] setThemes called!');
    const themePath = themes[theme];
    fs.readFile(themePath, 'utf-8',
        (err: (NodeJS.ErrnoException | null), cssContent: string) => {
            if ( cssKey ) {
                win.webContents.removeInsertedCSS(cssKey);
            }
            if ( err ) {
                console.error(err);
                win.webContents.insertCSS(fallbackCss).then(res => cssKey = res);
            } else {
                win.webContents.insertCSS(cssContent).then(res => cssKey = res);
            }
        });
}

function setStartup(launchOnStartup: boolean) {
    // TODO!
    const exepath = process.env.NODE_ENV === 'development' ?
        'C:\\Users\\Philip\\AppData\\Local\\Programs\\smartclip\\smartclip.exe'
        : app.getPath('exe');

    const autoLaunch = new AutoLaunch({
        name: 'smartclip',
        path: exepath,
    });
    autoLaunch.isEnabled()
        .then(function (isEnabled) {
            if ( isEnabled && !launchOnStartup ) {
                autoLaunch.disable();
            }
            if ( !isEnabled && launchOnStartup ) {
                autoLaunch.enable();
            }
        })
        .catch(function (err) {
            console.error(err);
        });

}


// function loadServices(): any { // deprecated
// return '';
// return requireDir('../extraResources/services', { extensions: ['.js', '.ts'] });
// electron:serve - D:\Programmierung\v2\smartclip\dist_electron
// electron:build - D:\Programmierung\v2\smartclip\dist_electron\win-unpacked\resources\app.asar

// const echoService = fs.readFileSync('D:/Programmierung/v2/smartclip/src/extraResources/services/deprecatedEchoService.js', "utf8");
// const myModule = eval(echoService);
// console.dir(echoService);
// eval('console.log("Hello World!");');
// return 'Hello';
// return fs.readdirSync('D:/Programmierung/v2/smartclip/src/extraResources/services').filter((f: string) => f.endsWith('.ts'))
//     .map((f: string) => f.slice(0, -3))
//     .map((f: string) => require(`../extraResources/services/${f}`));
// }

const setApplicationHotkeyListeners = [];

// to use windows combinations that are reserved reimplement this with
// https://github.com/MarshallOfSound/node-lowlevel-keyboard-hook-win
// see https://github.com/electron/electron/issues/9206
// unregistration is done in background.ts
// todo this does not work when changing - unregistering required in this case! (see settings hotkey keycomb)
// see https://www.electronjs.org/docs/api/global-shortcut#globalshortcutunregisteraccelerator
function setApplicationHotkey(hotkey: string[]) {
    console.log('setApplicationHotkey called!');
    let hotkeyFormatted = hotkey
        .join('+')
        .replace(/Ctrl/g, 'CommandOrControl')
        .replace(/Meta/g, 'Super');
    let success = globalShortcut.register(hotkeyFormatted, () => {
        win.show();
        win.focus();
        remote.getCurrentWebContents()?.focus();
        setApplicationHotkeyListeners.forEach(listener => listener());
    });
    if ( success ) {
        console.info(`[Initialization] Successfully registered global shortcut "${hotkeyFormatted}" for opening smartclip`);
    } else {
        global.logger.error({
            originator:'::setApplicationHotkey',
            description:`Failed to register global shortcut "${hotkeyFormatted}" for opening smartclip`
        })
    }
}

function registerApplicationHotkeyListener(listener) {
    setApplicationHotkeyListeners.push(listener);
}

function search(str: string, query: string): string {
    let strUpper = str.toUpperCase();
    let queryUpper = query.toUpperCase();
    let strIndex = 0;
    let queryIndex = 0;
    let matchedSections = [];
    let sectionActive = false;

    // Example: binding - ii
    while (queryIndex < query.length) {
        while (strIndex < str.length) {
            const currentStrChar = strUpper.charAt(strIndex);
            const currentQueryChar = queryUpper.charAt(queryIndex);
            const charsMatch = currentQueryChar == currentStrChar;

            // falls zeichen übereinstimmen
            if ( charsMatch ) {
                if ( !sectionActive ) {
                    sectionActive = true;
                    matchedSections.push([strIndex]);
                }
                // falls es letztes zeichen in query war
                if ( queryIndex == query.length - 1 ) {
                    matchedSections[matchedSections.length - 1].push(strIndex + 1);
                    // war der match erfolgreich!
                    // beende und gib
                    return format(str, matchedSections);
                } else {
                    strIndex++;
                    break;
                }
            } else { // falls zeichen nicht übereinstimmen
                if ( strIndex == str.length - 1 ) { // und es keine weiteren zeichen mehr gibt
                    return null;
                } else {
                    if ( sectionActive ) {
                        sectionActive = false;
                        matchedSections[matchedSections.length - 1].push(strIndex);
                    }
                    // str hat noch weitere zeichen
                }
            }
            strIndex++;
        }
        queryIndex++;
    }
    return null; // string is at its end but query not -> no match
}

function format(str: string, matchedSections: number[]) {
    for (let i = matchedSections.length - 1; i >= 0; i--) {
        str = str.substring(0, matchedSections[i][0])
            + '<span class="highlight">'
            + str.substring(matchedSections[i][0], matchedSections[i][1])
            + '</span>'
            + str.substring(matchedSections[i][1]);
    }
    return str;
}

export {
    setTheme,
    setStartup,
    setApplicationHotkey,
    registerApplicationHotkeyListener,
    search
};
