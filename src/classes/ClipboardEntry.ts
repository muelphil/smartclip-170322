import { EntryType } from '@/plugins/clip/EntryType';
import {dirname, sep} from 'path';

// TODO locale
function getTypeStrings(type: EntryType): string[] {
    switch (type) {
        case EntryType.Plain:
            return [];
        case EntryType.Image:
            return ['image', 'picture'];
        case EntryType.Files:
            return ['files'];
        case EntryType.Email:
            return ['email', 'address'];
        case EntryType.Url:
            return ['url', 'link'];
        case EntryType.Math:
            return ['math', 'formula', 'latex', 'equation'];
        case EntryType.Code:
            return ['code', 'program'];
    }
    throw `unsupported type supplied: type=${type}`;
}

export class ClipboardEntry {

    static counter = 0;

    public _id: string | undefined; // keep undefined, this will cause the db to generate an id upon saving
    public plainText: string;
    public alternative: string | undefined = undefined;
    public createdAt: number = Date.now();
    public lastUsed: number = Date.now();
    public timesCopied: number = 0;
    public timesPasted: number = 0;
    public timesSmartPasted: number = 0;
    public favourite: boolean;
    public html: string | undefined = undefined;
    public type: EntryType = EntryType.Plain;

    protected constructor(plainText: string, type: EntryType, options: { html?: string, alternative?: string, id?: string } = {}) {
        this.plainText = plainText;
        if ( options.html )
            this.html = options.html;
        if ( options.alternative )
            this.alternative = options.alternative;
        if ( options.id )
            this._id = options.id;
        this.type = type;
    }

    get typeStrings(): string[] {
        return getTypeStrings(this.type);
    }
}


type MathData = {
    preferredPaste: 'mathjaxpng' | 'mathjaxsvg' | 'unicode' | 'ascii' | 'plainText' | 'pdflatexpng',
    inputLanguage: 'tex' | 'ascii',
    preferredPreview: 'pdflatex' | 'mathjax',
    cachedSvg?: SVGElement
}

export class MathEntry extends ClipboardEntry {
    public data: MathData;
    public cache: {
        previewPng?: {
            path: string,
            pxPerEm: number
        },
        previewSvg?: SVGElement,
        pastePath?: string,
        isInvalid?: boolean
    } = {};

    constructor(plainText, options: MathData) {
        super(plainText, EntryType.Math);
        this.data = options;
    }
}

// export type ImageData = {
//     src: string,
//     origin?: string,
//     path: Array<string>
// }
//
// export class ImageEntry extends ClipboardEntry {
//     public data: ImageData;
//
//     constructor(plainText, options: ImageData) {
//         super(plainText, EntryType.Image);
//         this.data = {...options};
//     }
// }

export type FileDataOptions = {
    uris: string[],
    fileType: 'directory' | 'file' | 'invalid' | 'multiple' | 'image',
    extension?: string,
    origin?: string,

}

type FileData = FileDataOptions & {
    path?: string[],
    basename?: string,
}

function splitIntoPath(path): string[] {
    return path.split(sep).filter(e => e !== '');
}


export class FilesEntry extends ClipboardEntry {
    public data: FileData;

    constructor(plainText: string, options: FileDataOptions) {
        super(plainText, EntryType.Files);
        this.data = {...options};
        if(this.data.uris?.length === 1){
            this.setPathAndBasename();
        }
    }

    setSingleFilePath(newPath : string){
        if(this.data.uris.length !== 1)
            throw 'can only be called for single files!';
        this.data.uris[0] = newPath;
        this.setPathAndBasename();
    }

    private setPathAndBasename(){
        const fileSegments = splitIntoPath(this.data.uris[0]);
        this.data.path = fileSegments.slice(0, -1);
        this.data.basename = fileSegments[fileSegments.length - 1];
    }
}

type CodeData = {
    language?: string,
    cachedHighlightHtml?: HTMLElement
}

export class CodeEntry extends ClipboardEntry {

    public data: CodeData;

    constructor(plainText: string, options?: CodeData) {
        super(plainText, EntryType.Code);
        this.data = options || {};
    }

}

export class PlainEntry extends ClipboardEntry {
    constructor(plainText: string, options?: { html?: string, alternative?: string }) {
        super(plainText, EntryType.Plain, options);
    }
}

export class EmailEntry extends ClipboardEntry {
    constructor(plainText: string,) {
        super(plainText, EntryType.Email);
    }
}

type UrlData = {
    previewImage?: string,
    description?: string,
    baseUrl?: string,
    siteName?: string,
    iconUrl?: string
}

export class UrlEntry extends ClipboardEntry {
    public data: UrlData;

    constructor(plainText: string, alternative?: string, options?: UrlData) {
        super(plainText, EntryType.Url);
        this.alternative = alternative;
        this.data = options || {};
    }
}

type ClipboardData = Partial<UrlData & ImageData & CodeData & FileData & MathData>;
