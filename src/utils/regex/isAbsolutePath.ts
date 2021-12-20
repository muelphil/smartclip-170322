const platform = require('os').platform();

const winPathRegex = /^(?:[A-Za-z]:)[\/\\]{0,2}(?:[.\/\\ ](?![.\/\\\n])|[^<>:"|?*.\/\\ \n])+$/;

function isAbsoluteWindowsPath(str) {
    return winPathRegex.test(str);
}

export default function isAbsolutePath(str) {
    if ( platform === 'win32' )
        return isAbsoluteWindowsPath(str);
    throw 'NotYetImplemented'; // TODO darwin, linux
}
