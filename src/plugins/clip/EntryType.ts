export enum EntryType {
    Plain,
    Url,
    Email,
    Code,
    Math,
    Image,
    Files
}

export function entryTypeToClassName(type: EntryType) {
    switch (type) {
        case EntryType.Code:
            return 'code';
        case EntryType.Email:
            return 'email';
        case EntryType.Math:
            return 'math';
        case EntryType.Files:
            return 'files';
        case EntryType.Url:
            return 'url';
        case EntryType.Plain:
            return 'plain';
        case EntryType.Image:
            return 'image';
    }
}
