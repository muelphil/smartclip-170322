// // this should be called after creation
// // TODO actually call this!
// import { EntryType } from '@/plugins/clip/EntryType';
// import {ClipboardEntry} from '@/classes/ClipboardEntry';
//
// const fs = require('fs').promises;
// const {dirname, extname, basename} = require('path');
//
// const baseUrlRegex = /^(?:[^\/]*\/\/)?(?:www\.)?([^\/]+(?:\/[a-zA-Z0-9]*))/;
//
// export async function postProcess(entry: ClipboardEntry) {
//     switch (entry.type) {
//         case EntryType.Url:
//             entry.data.baseUrl = entry.plainText.match(baseUrlRegex)[1];
//             if ( !entry.alternative ) {
//                 const document: Document = (await global.requestPageSource(entry.plainText)).document;
//                 if ( document ) {
//                     try {
//                         // https://ogp.me/ - The Open Graph protocol
//                         const title =
//                             (document.querySelector('meta[name="title"]') as HTMLMetaElement || {}).content
//                             || document.querySelector('title').textContent;
//                         entry.alternative = title;
//                         const previewImage: HTMLMetaElement = document.querySelector('meta[property="og:image"]');
//                         entry.data.previewImage = previewImage.content;
//                         const descriptionTag: HTMLMetaElement = document.querySelector('meta[property="og:description"]');
//                         entry.data.description = descriptionTag.content;
//                     } catch {
//                         console.error('Could not load title of url', entry.plainText);
//                     }
//                 } else {
//                     console.warn('Could not load the page');
//                 }
//             }
//             break;
//         case EntryType.Code:
//             break;
//         case EntryType.Files:
//             if ( entry.data.uris.length === 0 ) throw 'data.uris is empty! this is not valid!';
//             if ( entry.data.uris.length === 1 ) {
//
//             } else {
//                 entry.data.fileType = 'multiple';
//                 const _dirname = dirname(entry.data.uris[0]);
//                 if ( entry.data.uris.every(e => e.startsWith(_dirname)) ) {
//                     entry.data.basedir = _dirname;
//                     entry.plainText = entry.data.uris.map(e => basename(e)).join(', ');
//                 } else {
//                     entry.plainText = entry.data.uris.join(', ');
//                 }
//             }
//             break;
//         // TODO Highlighting here
//     }
// }
