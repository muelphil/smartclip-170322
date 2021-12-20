export default function isOrHasImageExtension(fileOrExtension: string): boolean {
    return /(?:^|\.)(png|jpeg|jpg|bmp|dib|svg|gif|giff)$/.test(fileOrExtension);
}
