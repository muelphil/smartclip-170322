// import BasicEntry from "@/classes/BasicEntry";
// import AsyncPrefixService from "@/plugins/services/classes/AsyncPrefixService";
//
// class SynonymService implements AsyncPrefixService {
//
//     identifier: string = 'syn';
//     shortcut: string = 'syn';
//     name: string = 'Synonym-Finder';
//     description: string = 'Synonym-Finder';
//     view = 'basic-entry-view';
//     debounceDelay: number = 400;
//     prefixDisplay = 'Suche Synonyme';
//
//     public async query(query: string): Promise<Array<BasicEntry>> {
//         return new Promise((resolve, reject) => {
//             if (query) {
//                 var request = new XMLHttpRequest();
//                 request.open("GET", `https://www.synonyme.de/${query}/`);
//                 request.onreadystatechange = function () {
//                     if (request.readyState === 4 && request.status === 200) {
//                         const doc = new DOMParser().parseFromString(request.responseText, "text/html");
//                         const results = Array.from(doc.querySelectorAll('.search-result-left tr:not(.adtablet) td b'))
//                             .map((e: HTMLElement) => e.innerText)
//                             .map((e: string) => new BasicEntry(e));
//                         resolve(results);
//                     }
//                 };
//                 request.send(null); // Send the request now
//             } else {
//                 resolve([]);
//             }
//         })
//     }
// }
//
// const synonymService = new SynonymService();
// export default synonymService;
