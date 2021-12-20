import {
    ClipboardEntry,
    CodeEntry,
    EmailEntry,
    FilesEntry,
    MathEntry,
    PlainEntry,
    UrlEntry
} from '@/classes/ClipboardEntry';
import { EntryType } from '@/plugins/clip/EntryType';

export default class SerializedClipboardEntry {

    public _id: string | undefined;
    public plainText: string;
    public alternative: string;
    public createdAt: number;
    public lastUsed: number;
    public html: string;
    public type: EntryType;
    public timesCopied: number = 0;
    public timesPasted: number = 0;
    public timesSmartPasted: number = 0;

    constructor() {
    }

    static fromClipboardEntry(clipboardEntry: ClipboardEntry): SerializedClipboardEntry {
        return Object.assign(Object.create(SerializedClipboardEntry.prototype), clipboardEntry);
    }

    static toClipboardEntry(entry: SerializedClipboardEntry): ClipboardEntry {
        const deserialized = Object.assign(Object.create(this.getPrototypeForEntry(entry)), entry);
        deserialized.favourite = true;
        deserialized.cache = {};
        return deserialized;
    }

    static getPrototypeForEntry(entry: { type: EntryType }) {
        switch (entry.type) {
            case EntryType.Code:
                return CodeEntry.prototype;
            case EntryType.Email:
                return EmailEntry.prototype;
            case EntryType.Math:
                return MathEntry.prototype;
            case EntryType.Files:
                return FilesEntry.prototype;
            case EntryType.Url:
                return UrlEntry.prototype;
            case EntryType.Plain:
                return PlainEntry.prototype;
        }
        throw 'unsupported entry type: ' + entry.type;
    }
}
