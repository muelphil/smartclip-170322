// import BasicEntry from "@/classes/BasicEntry";
// import SyncPrefixService from "@/plugins/services/classes/SyncPrefixService";
// import {replace} from "@/plugins/unicodetex/replace";
//
// class TexToUnicodeService implements SyncPrefixService {
//
//     identifier: string = 'texToUnicode';
//     shortcut: string = 'tex';
//     name: string = 'Latex zu Unicode';
//     description: string = 'tex -> utf8';
//     view = 'basic-entry-view';
//     prefixDisplay: string = 'Tex to Unicode';
//
//     public query(query: string): Array<BasicEntry> {
//         if (query) return [new BasicEntry(
//             replace(query)
//         )];
//         else return [];
//     }
//
// }
//
// const texToUnicodeService = new TexToUnicodeService();
// export default texToUnicodeService;

import { createBasicPluginView } from '@/plugins/helpers/createBasicPlugin';
import { replace } from '@/plugins/unicodetex/replace';

export const tex = {
    id: 'tex',
    component: createBasicPluginView('tex', (query: string) => query ? [replace(query)] : []),
    prefixDisplay: 'Unicode2Tex',
    name: 'Unicode to Tex',
    description: ''
};
