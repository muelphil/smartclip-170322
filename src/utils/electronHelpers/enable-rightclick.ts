// Importing this adds a right-click menu with 'Inspect Element' option
// @ts-ignore
const remote = require('electron').remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

if(process.env.NODE_ENV === 'development'){
    let rightClickPosition = null;

    const menu = new Menu();
    const menuItem = new MenuItem({
        label: 'Inspect Element',
        click: () => {
            remote.getCurrentWindow().webContents.inspectElement(rightClickPosition.x, rightClickPosition.y)
        }
    });
    menu.append(menuItem);

    window.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        rightClickPosition = {x: e.x, y: e.y}
        menu.popup({window: remote.getCurrentWindow()})
    }, false);
}

export {}
