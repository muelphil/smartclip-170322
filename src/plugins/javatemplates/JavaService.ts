// import BasicEntry from "@/classes/BasicEntry";
// import SyncPrefixService from "@/plugins/services/classes/SyncPrefixService";
//
// function capitalize(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1);
// }
//
//
// class JavaService implements SyncPrefixService {
//
//     identifier: string = 'java';
//     shortcut: string = 'java';
//     name: string = 'Java';
//     description: string = 'Java Templates';
//     view = 'basic-entry-view';
//     prefixDisplay = 'Java Templates';
//
//     static functions: { [key: string]: (any) => string } = {
//         'class': function (clazz) {
//             return `public class ${clazz ? capitalize(clazz) : '<ClassName>'}{}`;
//         },
//         'psvm': function () {
//             return `public static void main(String[] args){}`;
//         },
//         'sout': function (...args) {
//             return `System.out.println(\"${args.join(' ') || 'Hello World!'}\");\n`;
//         },
//         'for': function (upper, indexvarname = 'i') {
//             return `for(int ${indexvarname}=0; ${indexvarname}<${upper}; ${indexvarname}++){}`;
//         }
//     };
//
//
//     public query(query: string): Array<BasicEntry> {
//         const query_splitted = query.split(' ')
//         const templateName = query_splitted[0];
//         const templateParameters = query_splitted.slice(1);
//
//         if (templateName in JavaService.functions) return [
//             new BasicEntry(JavaService.functions[templateName].apply(null, templateParameters))
//         ];
//         else return [];
//     }
//
// }
//
// const javaService = new JavaService();
// export default javaService;
