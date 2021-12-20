// import BasicEntry from '@/classes/BasicEntry';
// import clipboardService from '@/plugins/services/ClipboardService';
// import AsyncPrefixService from '@/plugins/services/classes/AsyncPrefixService';
//
// class EvalService implements AsyncPrefixService {
//
//     identifier: string = 'eval';
//     shortcut: string = 'eval';
//     name: string = 'Eval';
//     description: string = 'Evaluate the JS';
//     view = 'basic-entry-view';
//     debounceDelay: number = 1000;
//     prefixDisplay = 'eval';
//
//     public query(query: string): Promise<Array<BasicEntry>> {
//         function c(index: number): string {
//             return clipboardService.clipboardEntries.value[index - 1].plainText;
//         }
//
//         let result;
//         try {
//             result = eval(query);
//         } catch (e) {
//             result = e.toString();
//         }
//
//         return new Promise(((resolve, reject) => {
//             if ( query ) {
//                 resolve([new BasicEntry(result)]);
//             } else {
//                 resolve([]);
//             }
//         }));
//     }
//
// }
//
// const evalService = new EvalService();
// export default evalService;
