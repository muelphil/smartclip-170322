import { logPath } from '@/initialize/paths';
import { getDateFormatted, getDateTimeFormatted } from '@/utils/generateFileName';

export type Error = {
    originator: string,
    description: string,
    stacktrace?: string,
    additionalInformation?: string
};
const fs = require('fs');
const {join} = require('path');

const listeners = [];
const errorQueue = [];

const logFilePath = join(logPath, getDateFormatted() + '.log');
const stream = fs.createWriteStream(logFilePath, {flags: 'a'});
stream.write(` === SmartClip started on ${getDateTimeFormatted()} === \n`);

function error(error: Error) {
    // info: stream.end(); will be called automatically on process close
    let errorStrBuf = [`${getDateTimeFormatted()}: [${error.originator}] ${error.description}, `];
    if ( error.additionalInformation ) {
        errorStrBuf.push(`additional information provided: ${error.additionalInformation}, `);
    }
    if ( error.stacktrace ) {
        errorStrBuf.push(`stacktrace: ${error.stacktrace.toString() || 'No stacktrace provided'}`);
    }
    errorStrBuf.push('\n');
    stream.write(errorStrBuf.join(''));
    console.error(error);
    errorQueue.push(error);
    listeners.forEach(fn => fn(error));
}

function addErrorListener(fn: (Error) => void, retrospect = true) {
    listeners.push(fn);
    if ( retrospect && errorQueue.length !== 0 ) {
        errorQueue.forEach(fn);
    }
}

function removeErrorListener(fn) {
    const index = listeners.indexOf(fn);
    if ( index !== -1 ) {
        listeners.splice(index, 1);
        return true;
    }
    return false;
}

export const logger = {error, addErrorListener, removeErrorListener, logFilePath};
