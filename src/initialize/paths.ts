import isDevelopment from '@/utils/regex/isDevelopment';

// console.log('app.getAppPath()=', app.getAppPath());
// console.log('app.getPath(\'home\')=', app.getPath('home'));
// console.log('app.getPath(\'appData\')=', app.getPath('appData'));
// console.log('app.getPath(\'userData\')=', app.getPath('userData'));
// console.log('app.getPath(\'cache\')=', app.getPath('cache'));
// console.log('app.getPath(\'temp\')=', app.getPath('temp'));
// console.log('app.getPath(\'exe\')=', app.getPath('exe'));
// console.log('app.getPath(\'module\')=', app.getPath('module'));

// app.getAppPath()=		 	C:\Users\Philip\AppData\Local\Programs\smartclip\resources\app
// app.getPath('home')=		    C:\Users\Philip
// app.getPath('appData')=		C:\Users\Philip\AppData\Roaming
// app.getPath('userData')=	    C:\Users\Philip\AppData\Roaming\smartclip
// app.getPath('cache')=		C:\Users\Philip\AppData\Roaming
// app.getPath('temp')=		    C:\Users\Philip\AppData\Local\Temp
// app.getPath('exe')=		 	C:\Users\Philip\AppData\Local\Programs\smartclip\smartclip.exe
// app.getPath('module')=		C:\Users\Philip\AppData\Local\Programs\smartclip\smartclip.exe

const fs = require('fs');
const {join, basename, dirname} = require('path');
const {app} = require('electron').remote;

const appPath = dirname(app.getPath('exe'));
const resourcesPath = isDevelopment ?
    'E:/Programmierung/smartclip/src/extraResources' :
    join(appPath, 'resources');
const serviceCache = app.getPath('userData'); // C:\Users\Philip\AppData\Roaming\smartclip
const dotSmartclipPath = join(app.getPath('home'), isDevelopment ? '.smartclipdev' : '.smartclip');
const logPath = join(dotSmartclipPath, 'logs');
const customThemesPath = join(dotSmartclipPath, 'themes');
const favImageCache = join(dotSmartclipPath, 'images');
const pluginsPath = join(dotSmartclipPath, 'plugins');
const baseThemesPath = join(resourcesPath, 'themes');
const fallbackCssPath = join(baseThemesPath, 'dracula.css');
const imageCache = join(serviceCache, 'cached_images');

if ( !fs.existsSync(dotSmartclipPath) ) {
    fs.mkdirSync(dotSmartclipPath);
}

try {
    fs.rmdirSync(imageCache, {recursive: true}); // clear cached images
} catch (err) {
    console.warn('[Initialization] Could not clear the image cache, will try again on next startup');
}

for (let dir of [dotSmartclipPath, customThemesPath, favImageCache, serviceCache, imageCache, pluginsPath, logPath]) {
    if ( !fs.existsSync(dir) ) {
        console.debug(`[Initialization] Creating missing directory ${dir}`);
        fs.mkdirSync(dir);
    }
}

function getThemes(path: string): { [key: string]: string } {
    return fs.readdirSync(path)
        .reduce((obj: object, css: string) => {
            obj[basename(css, '.css')] = join(path, css);
            return obj;
        }, {});
}

const baseThemes = getThemes(baseThemesPath);
const customThemes = getThemes(customThemesPath);
const themes: { [key: string]: string } = {...baseThemes, ...customThemes};

export {
    appPath,
    dotSmartclipPath,
    themes,
    resourcesPath,
    fallbackCssPath,
    customThemesPath,
    baseThemesPath,
    serviceCache,
    favImageCache,
    imageCache,
    pluginsPath,
    logPath
};
