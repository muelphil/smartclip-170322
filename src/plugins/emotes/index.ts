// import BasicEntry from "@/classes/BasicEntry";
// import SyncPrefixService from "@/plugins/services/classes/SyncPrefixService";
// import {EmoteEntry} from "@/plugins/emotes/EmoteEntry";
// import {emojis} from "@/plugins/emotes/emojis";
//
//
// class EmoteService implements SyncPrefixService {
//
//     identifier: string = 'emote';
//     shortcut: string = 'emote';
//     name: string = 'Emotes';
//     description: string = 'emotes';
//     view = 'emote-entry-view';
//     prefixDisplay: string = 'Search Emotes';
//
//     emotes: EmoteEntry[] = Object.entries(emojis).map(entry => new EmoteEntry(entry[0], entry[1].name));
//
//     public query(query: string): Array<BasicEntry> {
//         if (!query) return this.emotes.slice(0, 20);
//         else return this.emotes.filter(e => e.name.includes(query)).slice(0, 20);
//     }
//
// }
//
// const emoteService = new EmoteService();
// export default emoteService;
