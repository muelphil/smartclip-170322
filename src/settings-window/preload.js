console.log('preload.js called!');
// const { ipcRenderer } = require('electron')
console.dir("process.argv=", process.argv);

const toolWindowId = +process.argv.slice(-1);
window.toolWindowId = toolWindowId;