const {webFrame} = require('electron');

export function setZoomFactor(zoomLevel: number) {
    console.debug('[Settings] setZoomLevel called!');
    webFrame.setZoomFactor(+zoomLevel);
}
