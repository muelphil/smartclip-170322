import { clipboard } from '@/clipboard-extended/clipboard-extended';
import {
    ClipboardEntry,
    CodeEntry,
    EmailEntry,
    FileDataOptions,
    FilesEntry,
    MathEntry,
    PlainEntry,
    UrlEntry
} from '@/classes/ClipboardEntry';
import { generateFilename } from '@/utils/generateFileName';
import { imageCache } from '@/initialize/paths';
import { loadOGInfo } from '@/services/ClipService/loadOpenGraphInfo';
import { reactive } from 'vue';
import { isAbsolutePath, isCode, isEmail, isLatex, isOrHasImageExtension, isURL } from '@/utils/regex';

const fs = require('fs').promises;
const {dirname, extname, basename, parse} = require('path');

export async function generateEntry(format: 'text' | 'file' | 'image'): Promise<ClipboardEntry> {
    if ( format === 'text' ) {
        const text = clipboard.readText();
        if ( !text )
            throw 'empty text copied!';
        const html = clipboard.readHTML();
        return fromText(text, html);
    } else if ( format === 'file' ) {
        const {files, dropEffect} = clipboard.readFiles();
        if ( dropEffect !== 'move' && files.length !== 0 ) {
            if ( files.length === 1 ) {
                const file = files[0];
                if ( isOrHasImageExtension(file) )
                    return fromImagePath(file);
                return fromSinglePath(file);
            } else {
                return fromMultiplePaths(files);
            }
        } else {
            console.warn('[Clipboard Change Listener] Files were copied but ignored, as they were copied with dropeffect move');
        }
    } else { //format === 'image'
        return fromImage();
    }
}

async function fromText(text: string, html?: string): Promise<ClipboardEntry> {
    if ( isEmail(text) ) { // order matters here, as emails ⊆ urls!
        return new EmailEntry(text);
    } else if ( isURL(text) ) {
        return fromUrl(text);
    } else if ( isCode(text, html) ) {
        return fromCode(text);
    } else if ( isAbsolutePath(text) ) {
        return fromSinglePath(text); // TODO check image
    } else if ( text.length < 1024 && isLatex(text) ) {
        return fromMath(text);
    }
    return new PlainEntry(text, {html});
}


const baseUrlRegex = /^(?:[^\/]*\/\/)?(?:www\.)?([^\/]+(?:\/[a-zA-Z0-9]*))/;

async function fromUrl(url: string): Promise<UrlEntry> {
    return new Promise(resolve => {
        const entry = reactive(new UrlEntry(url)); // todo - this is necessary because otherwise it will not update automatically - find the reason for that later
        resolve(entry);
        // try {
        const baseUrl = url.match(baseUrlRegex)[1];
        loadOGInfo(url).then(({ogTitle, ogImage, ogDescription, ogSiteName, iconUrl}: any) => {
            entry.alternative = ogTitle;
            entry.data = {
                previewImage: ogImage?.url,
                description: ogDescription,
                baseUrl,
                siteName: ogSiteName,
                iconUrl: iconUrl
            };
        }).catch(err => console.info('Could not load open graph information for url', err));
    });
}

async function fromCode(code: string) {
    return new CodeEntry(code, {});
}

async function fromMath(math: string) {
    // TODO default preferred Preview option in options
    return new MathEntry(math, {inputLanguage: 'tex', preferredPaste: 'plainText', preferredPreview: 'mathjax'});
}

async function fromSinglePath(fileOrDirectory: string): Promise<FilesEntry> {
    const plainText = basename(fileOrDirectory);
    const data: Partial<FileDataOptions> = {};
    data.uris = [fileOrDirectory];
    try {
        const stats = await fs.lstat(fileOrDirectory);
        if ( stats.isDirectory() ) {
            data.fileType = 'directory';
        } else {
            if ( isOrHasImageExtension(fileOrDirectory) ) {
                data.fileType = 'image';
            } else {
                data.fileType = 'file';
            }
            data.extension = extname(fileOrDirectory);
        }
        return new FilesEntry(plainText, data as FileDataOptions);
    } catch {
        return new FilesEntry(plainText, {fileType: 'invalid', uris: data.uris});
    }
}

function fromMultiplePaths(uris: string[]): FilesEntry {
    const data: any = {};
    data.fileType = 'multiple';
    data.uris = uris;
    const _dirname = dirname(uris[0]);
    let plainText;
    if ( uris.every(e => e.startsWith(_dirname)) ) {
        data.basedir = _dirname;
        if ( uris.length > 4 ) {
            plainText = uris.length + ' Files';
        } else {
            plainText = uris.map(e => e.slice(_dirname.length + 1)).join(', ');
        }
    } else {
        plainText = uris.join(', ');
    }
    return new FilesEntry(plainText, data);
}

async function fromImage(html?: string): Promise<FilesEntry> {
    let filename;
    let alternative = undefined;
    let src = undefined;
    if ( html ) {
        const imgAttributes = html.match(/<img (.*)\/>/)[1];
        src = imgAttributes.match(/src="([^"]+)"/)[1];
        filename = parse(src).name; // without extension
        alternative = decodeURI(imgAttributes.match(/alt="([^"]+)"/)[1]);
    }
    const savedFilePath = await clipboard.saveImage(imageCache, filename || generateFilename());
    const data: FileDataOptions = {
        fileType: 'image',
        uris: [savedFilePath],
        origin: src
    };
    const imageEntry = new FilesEntry(basename(savedFilePath), data);
    imageEntry.alternative = alternative;
    return imageEntry;
}

function fromImagePath(imagePath: string, html?: string): FilesEntry {
    const plainText = basename(imagePath);
    return new FilesEntry(plainText, {
        fileType: 'image',
        uris: [imagePath]
    });
}
