import path, {dirname} from "path";
import {app} from 'electron';

function getSourcePathDev() {
    return path.join(dirname(app.getPath('exe')).replace(/(node_modules).+$/, ''), 'src');
}

export {getSourcePathDev}