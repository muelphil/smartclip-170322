import Clipboard = Electron.Clipboard;

let electronClipboard: Clipboard = require('electron').clipboard;
const EventEmitter = require('events').EventEmitter;
const clipboardEmitter = new EventEmitter();
const fs = require('fs').promises;
const path = require('path');
const onClipboardChangeModule = require('onclipboardchange');
const win = require('electron').remote.getCurrentWindow();

type ClipboardEvent = 'copy';

let protectedCopy = false;

type ClipboardExtended = Omit<Clipboard, "writeText" | "write" | "writeBuffer"> & {
    shutdown(): void,
    getFormat(): 'file' | 'image' | 'text',
    readFiles(): { files: string[], dropEffect: DropEffect },
    writeFiles(files: string[], mode?: DropEffect, protectCopy?: boolean): void,
    saveImage(dir: string, fileName: string): Promise<string>,
    savePng(dir: string, fileName: string): Promise<string>,
    saveBitmap(dir: string, fileName: string): Promise<string>,
    on(eventName: ClipboardEvent, callback: () => void): void,
    once(eventName: ClipboardEvent, callback: () => void): void,
    removeListener(eventName, callback): void,
    removeAllListeners(eventName?: ClipboardEvent): void,
    ignoreCopy(),
    write(data: { [key: string]: string }, protectCopy?: boolean),
    writeBuffer(format: string, buffer: string, protectCopy?: boolean),
    writeText(text: string, protectCopy?: boolean): void
    startListeningForPasteAndEscape(pasteListener, escListener)
    stopListeningForPasteAndEscape()
    protectCopy(): void
    writeBuffers(obj, protectCopy?: boolean), void
}

let clipboard: ClipboardExtended = electronClipboard as unknown as ClipboardExtended;

clipboard.on = (eventName: ClipboardEvent, callback: () => void) => clipboardEmitter.on(eventName, callback);
clipboard.once = (eventName: ClipboardEvent, callback: () => void) => clipboardEmitter.once(eventName, callback);
clipboard.removeListener = (eventName: ClipboardEvent, callback) => clipboardEmitter.removeListener(eventName, callback);
clipboard.removeAllListeners = (eventName?: ClipboardEvent) => clipboardEmitter.removeAllListeners(eventName);
clipboard.protectCopy = () => protectedCopy = true;
clipboard.writeBuffers = function (obj: { [key: number]: Buffer }, protectCopy = true) {
    if (protectCopy)
        protectedCopy = true;
    onClipboardChangeModule.writeBuffers(obj);
};


onClipboardChangeModule.disableAnimations(win.getNativeWindowHandle());

let lastText: string = null;
// let ignore = false;
// TODO this is ugly but necessary because chrome performs 2 clipboard changing actions when copying from the url
onClipboardChangeModule.startListeningForCopy(() => {
    // if ( !ignore ) {
    //     ignore = true;
    //     setTimeout(() => ignore = false, 20);
    console.debug('[Clipboard Extended] onClipboardChangeModule.startListeningForCopy::start');
    if (protectedCopy) {
        protectedCopy = false;
        return;
    }
    const format = clipboard.getFormat();
    if (format === 'text') {
        const text = clipboard.readText();
        if (text !== lastText) {
            lastText = text;
            clipboardEmitter.emit('copy', format);
        } else {
            console.warn('[Clipboard Extended] Clipboard change event ignored due to no change in the clipboard data (same thing copied twice)');
        }
    } else {
        lastText = null;
        clipboardEmitter.emit('copy', format);
    }
    console.debug('[Clipboard Extended] onClipboardChangeModule.startListeningForCopy::end');
    // }
    // clipboardEmitter.emit('everyCopy'); // todo for pl that want to react every copy no matter if they are the same
});

clipboard.startListeningForPasteAndEscape = (pasteListener, escListener) =>
    onClipboardChangeModule.startListeningForPasteAndEscape(pasteListener, escListener ? () => {
        if (!win.isFocused())
            escListener();
    } : null);

clipboard.stopListeningForPasteAndEscape = () => onClipboardChangeModule.stopListeningForPasteAndEscape();

/*
TODO Linux alternative
clipboard.on('text-changed', onTextChanged)
    .on('image-changed', onImageChanged)
    .startWatching();
*/

clipboard.shutdown = function () {
    onClipboardChangeModule.stopListeningForCopy();
    onClipboardChangeModule.stopListeningForPaste();
};

clipboard.getFormat = function (): 'file' | 'image' | 'text' {
    if (clipboard.has('CF_HDROP') && clipboard.has('FileName')) {
        return 'file';
    } else if (
        clipboard.has('CF_DIBV5')
        || clipboard.has('PNG')
        || clipboard.has('CF_DIB')
        || clipboard.has('CF_BITMAP')
    ) {
        return 'image';
    } else {
        return 'text';
    }
};

// https://docs.microsoft.com/en-us/windows/win32/com/dropeffect-constants
// DROPEFFECT_NONE, DROPEFFECT_COPY, DROPEFFECT_MOVE, DROPEFFECT_LINK
const dropEffects: DropEffect[] = ['none', 'filecopy', 'move', 'link', '???', 'copy']; // info: difference between filecopy and copy is that when copying fe an svg and pasting in word filecopy will create a link and copy will paste the file contents

// { [key: number]: DropEffect } = {
//     0: 'none', //'DROPEFFECT_NONE',
//     1: 'copy', //'DROPEFFECT_COPY',
//     2: 'move', //'DROPEFFECT_MOVE',
//     3: 'link' //'DROPEFFECT_LINK',
//     // 0x80000000: 'DROPEFFECT_SCROLL'
// };

type DropEffect = 'none' | 'copy' | 'move' | 'link' | '???' | 'filecopy';

clipboard.readFiles = function (): { files: string[], dropEffect: DropEffect } {
    // example:##################C#:#\#U#s#e#r#s#\#P#h#i#l#i#p#\#D#e#s#k#t#o#p#\#t#e#s#t#.#b#m#p###C#:#\#U#s#e#r#s#\#P#h#i#l#i#p#\#D#e#s#k#t#o#p#\#t#e#s#t#2#.#b#m#p###C#:#\#U#s#e#r#s#\#P#h#i#l#i#p#\#D#e#s#k#t#o#p#\#e#u#r#e#k#a#2#.#b#m#p#####
    if (clipboard.has('CF_HDROP')) {
        const buffer = clipboard.readBuffer('CF_HDROP');
        const str = buffer.toString('utf16le');
        const files = str.match(/([^\0-\32]+)/gi); // \0-\32 are control characters
        let preferredDropEffect = 0;
        if (clipboard.has('Preferred DropEffect')) {
            preferredDropEffect = clipboard.readBuffer('Preferred DropEffect')[0];
        }
        return {
            files, dropEffect: dropEffects[preferredDropEffect]
        };
    } else { // path was copied directly from file explorer header
        return {
            files: [clipboard.readText()], dropEffect: 'none'
        };
    }

};

clipboard.writeFiles = async function (files: string[], mode: DropEffect = 'copy', protectCopy = true) {
    if (files.length === 0) {
        throw 'files cannot be empty!';
    }
    const separator = Buffer.from([0, 0]);
    // returns the file encoded as ut16le with \x00\x00 suffix as separator
    const filesAsBuffer: Buffer[] = files.map(f => {
        const buf: Buffer = Buffer.alloc((f.length + 1) * 2);
        buf.write(f, 'utf16le');
        return buf;
    });
    const preferredDropEffect = Buffer.from([dropEffects.indexOf(mode), 0, 0, 0]);
    const cf_hdrop_prefix = Buffer.from([20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]); // no clue what this gibberish means
    const cf_hdrop = Buffer.concat([cf_hdrop_prefix, ...filesAsBuffer, separator]);
    const asyncFlag = Buffer.from([1, 0, 0, 0]);
    const dataObject = Buffer.from('†\x00\x00\x00\x00\x00');
    // const dataObject = Buffer.from([88, 2, 2, 0, 0, 0, 0, 0]); // Not necessary
    if (protectCopy) {
        protectedCopy = true;
    }
    const buffers = {
        'CF_HDROP': cf_hdrop, // CF_HDROP
        'Preferred DropEffect': preferredDropEffect, // Preferred DropEffect TODO these change based on startup - find workaround! fe 49321 this time is Unified Resource L... instead of preferred drop effect
        'FileNameW': filesAsBuffer[0], // FileNameW
        'AsyncFlag': asyncFlag
    };
    if (files.length === 1 && files[0].endsWith('.svg')) {
        try {
            const svg: Buffer = await fs.readFile(files[0]);
            buffers['image/svg+xml'] = svg;
        } catch {
        }
    }
    const success = clipboard.writeBuffers(buffers);
    if (!success) {
        global.logger.error({
            originator: 'Clipboard-Extended::writeFiles',
            description: 'Failed to write files to clipboard',
            stacktrace: 'Attempted to write the following files:' + files.join(',')
        });
    }
};

clipboard.saveImage = function (dir: string, fileName: string): Promise<string> {
    if (clipboard.has('PNG')) {
        return clipboard.savePng(dir, fileName);
    } else if (clipboard.has('CF_DIBV5')) {
        return clipboard.saveBitmap(dir, fileName);
    } else {
        throw 'no image present in the clipboard buffer';
    }
};

async function writeToNextAvailableName(dir: string, fileName: string, data, options): Promise<string> {
    if (!(await fs.lstat(dir)).isDirectory()) {
        throw 'supplied dir does not exists';
    }
    const dirContents = await fs.readdir(dir);
    let {name, base, ext} = path.parse(fileName);
    let counter = 1;
    while (dirContents.indexOf(base) !== -1) {
        base = `${name}(${counter})${ext}`;
    }
    const savedPathToFile = path.join(dir, base);
    await fs.writeFile(savedPathToFile, data, options);
    return savedPathToFile;
}

clipboard.savePng = async function (dir: string, fileName: string): Promise<string> { // TODO Promises and Errors
    if (!fileName.endsWith('.png')) {
        fileName += '.png';
    }
    if (clipboard.has('PNG')) {
        const png = clipboard.readBuffer('PNG');
        return await writeToNextAvailableName(dir, fileName, png, 'binary');
    } else {
        throw 'no image available in the clipboard!';
    }
};

clipboard.saveBitmap = async function (dir: string, fileName: string): Promise<string> {
    if (!fileName.endsWith('.bmp')) {
        fileName += '.bmp';
    }

    const buffer = clipboard.readBuffer('CF_DIBV5');
    const imageData = buffer.subarray(124);
    const imageWidth = buffer.readInt32LE(4);
    const imageHeight = buffer.readInt32LE(8);
    const imageSize = buffer.readInt32LE(20);
    const offset = 14 + 124;
    const fileSize = offset + imageData.byteLength;
    // console.info(`imageWidth: ${imageWidth}, imageHeight: ${imageHeight}, imageSize: ${imageSize}`);

    const fileHeader = Buffer.alloc(14);
    fileHeader.writeUInt16LE(19778, 0); // BM
    fileHeader.writeUInt32LE(fileSize, 2);  // file size in byte
    fileHeader.writeUInt32LE(0, 6);  // reserved
    fileHeader.writeUInt32LE(offset, 10); // offset of image data

    const bitmapHeader = Buffer.alloc(124);
    bitmapHeader.writeUInt32LE(124, 0); // bitmap header size in bytes
    bitmapHeader.writeUInt32LE(imageWidth, 4); // image width
    bitmapHeader.writeUInt32LE(imageHeight, 8); // image height
    bitmapHeader.writeUInt16LE(1, 12); // image planes
    bitmapHeader.writeUInt16LE(32, 14); // pixel bit count
    bitmapHeader.writeUInt32LE(3, 16); // compression = BI_BITFIELDS
    bitmapHeader.writeUInt32LE(imageSize, 20); // image size in bytes
    bitmapHeader.writeUInt32LE(3780, 24); // pixels per meter (X)
    bitmapHeader.writeUInt32LE(3780, 28); // pixels per meter (Y)
    // bitmapHeader.writeUInt32LE(0, 32); // colors used
    // bitmapHeader.writeUInt32LE(0, 36); // biClrImportant
    bitmapHeader.writeUInt32LE(16711680, 40); // bV5RedMask
    bitmapHeader.writeUInt32LE(65280, 44); // bV5GreenMask
    bitmapHeader.writeUInt32LE(255, 48); // bV5BlueMask
    bitmapHeader.writeUInt32LE(4278190080, 52); // bV5AlphaMask
    bitmapHeader.writeUInt32LE(1466527264, 56); // bV5CSType
    // then only 0's follow from 60 - 127
    const result = Buffer.concat([fileHeader, bitmapHeader, imageData]);
    return await writeToNextAvailableName(dir, fileName, result, 'binary');
};

const oldWriteText = clipboard.writeText;
clipboard.writeText = function (text: string, protectCopy = true) {
    if (protectCopy)
        protectedCopy = true;
    oldWriteText(text);
};

const oldWriteBuffer = clipboard.writeBuffer;
clipboard.writeBuffer = function (format: string, buffer: string, protectCopy = true) {
    if (protectCopy)
        protectedCopy = true;
    oldWriteBuffer(format, buffer);
};

const oldWrite = clipboard.write;
clipboard.write = function (data: { [key: string]: string }, protectCopy = true) {
    if (protectCopy)
        protectedCopy = true;
    oldWrite(data);
};

// clipboard.logBitmapHeader = function (path: string) {
//     const buf = fs.readFileSync(path);
//     const compression: string[] = ['BI_RGB', 'BI_RLE8', 'BI_RLE4', 'BI_BITFIELDS'];
//     console.log(`
// File-Header:
// [000-001] 'BM' prefix (19778 if intact): ${buf.readUInt16LE(0)}
// [002-005]             file size in byte: ${buf.readUInt32LE(2)}
// [006-009]                      reserved: ${buf.readUInt32LE(6)}
// [010-013]          offset of image data: ${buf.readUInt32LE(10)}
// Bitmap-Header:
// [014-017]    bitmap header size in byte: ${buf.readUInt32LE(14)}
// [018-021]                   image width: ${buf.readInt32LE(18)}
// [022-025]                  image height: ${buf.readInt32LE(22)} (${buf.readInt32LE(22) < 0 ? 'top-down' : 'bottom-up'}-bitmap)
// [026-027]                  image planes: ${buf.readUInt16LE(26)}
// [028-029]               pixel bit count: ${buf.readUInt16LE(28)} (must be 1, 4, 8, 16, 24 or 32)
// [030-033]                   compression: ${compression[buf.readUInt32LE(30)]}
// [034-037]                    image size: ${buf.readUInt32LE(34)}
// [038-041]          pixels per meter (X): ${buf.readInt32LE(38)}
// [042-045]          pixels per meter (Y): ${buf.readInt32LE(42)}
// [046-049]                   colors used: ${buf.readUInt32LE(46)}
// [050-053]                biClrImportant: ${buf.readUInt32LE(50)}
// V5-Header Extension:
// [054-057]                    bV5RedMask: ${buf.readUInt32LE(54)}
// [058-061]                  bV5GreenMask: ${buf.readUInt32LE(58)}
// [062-065]                   bV5BlueMask: ${buf.readUInt32LE(62)}
// [066-069]                  bV5AlphaMask: ${buf.readUInt32LE(66)}
// [070-073]                     bV5CSType: ${buf.readUInt32LE(70)}
// [074-109]                  CIEXYZTRIPLE: (${buf.readUInt32LE(74)},${buf.readUInt32LE(78)},${buf.readUInt32LE(82)}),(${buf.readUInt32LE(86)},${buf.readUInt32LE(90)},${buf.readUInt32LE(94)}),(${buf.readUInt32LE(98)},${buf.readUInt32LE(102)},${buf.readUInt32LE(106)})
// [110-113]                   bV5GammaRed: ${buf.readUInt32LE(110)}
// [114-117]                 bV5GammaGreen: ${buf.readUInt32LE(114)}
// [118-121]                  bV5GammaBlue: ${buf.readUInt32LE(118)}
// [122-125]                     bV5Intent: ${buf.readUInt32LE(122)}
// [126-129]                bV5ProfileData: ${buf.readUInt32LE(126)}
// [130-133]                bV5ProfileSize: ${buf.readUInt32LE(130)}
// [134-137]                      reserved: ${buf.readUInt32LE(134)}
//     `);
// };


const clipboardExtended = clipboard as ClipboardExtended;

export {
    clipboardExtended as clipboard,
    ClipboardExtended
};
