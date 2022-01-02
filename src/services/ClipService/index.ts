import { remote } from 'electron';
import { reactive } from 'vue';
import db from '@/db/store';
import SerializedClipboardEntry from '@/classes/SerializedClipboardEntry';
import { clipboard } from '@/clipboard-extended/clipboard-extended';
import { favImageCache, imageCache } from '@/initialize/paths';
import { onClose } from '@/cleanup';
import { ClipboardEntry, FilesEntry, MathEntry, PlainEntry } from '@/classes/ClipboardEntry';
import { generateEntry } from '@/services/ClipService/generateEntry';
import moveFileTo from '@/utils/moveFileToDir';

const {promises: fs, existsSync} = require('fs');
const path = require('path');
const win = remote.getCurrentWindow();
const robot = require('robotjs');
//
export class ClipService {

    paused = false;

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    clipboardEntries: ClipboardEntry[] = reactive([]);
    fuseOptions = {
        minMatchCharLength: 2,
        keys: ['plainText', 'alternative', 'typeStrings']
    };
    constructor() {
        // in development load the introduction to have some entries for testing purposes
        // if ( isDevelopment ) {
        //     introduction.forEach(e => this.addClipboardEntry(new ClipboardEntry(e)));
        // }

        // load favourized entries
        db.readAll().then((e: SerializedClipboardEntry[]) => {
            e.sort((a, b) => a.lastUsed - b.lastUsed); // oldest first, will also be pushed first => reverses order!
            e.forEach(e => this.clipboardEntries.push(SerializedClipboardEntry.toClipboardEntry(e))); // this reverses the order while pushing!
        });

        clipboard.on('copy', ((format) => this.onClipboardChange(format)).bind(this));
        this.onClipboardChange(clipboard.getFormat());
        onClose(this.save.bind(this));
    }

    private onClipboardChange(format): void {
        if ( this.paused )
            return;
        generateEntry(format).then(e => this.addClipboardEntry(e));
    };

    addClipboardEntry(entry: ClipboardEntry) {
        // TODO filter-chain ?
        // if ( this.fuse ) this.fuse.add(entry); // only after initialization todo this will lead to double add
        this.clipboardEntries.unshift(entry);
    }

    async toggleEntryFavourite(entry: ClipboardEntry) {
        // Cachen von favourisierten Einträgen
        if ( !entry.favourite ) { // fav the entry
            console.info('[User Interaction] ClipService::toggleEntryFavourite - Attempting to favour entry');
            entry.favourite = true;
            try {
                if ( entry instanceof FilesEntry && entry.data.fileType === 'image' && ClipService.isInDir(entry.data.uris[0], imageCache) ) {
                    entry.setSingleFilePath(await moveFileTo(entry.data.uris[0], favImageCache));
                }
                const savedEntry = await db.create(entry);
                entry._id = savedEntry._id;
            } catch (err) {
                global.logger.error({
                    originator: 'ClipService::toggleEntryFavourite',
                    description: 'Error during favouring a clipboard entry',
                    additionalInformation: `entry id=${entry._id}, type=${entry.type}`,
                    stacktrace: err
                });
                entry.favourite = false;
            }
        } else { // de-fav the entry
            console.info('[User Interaction] ClipService::toggleEntryFavourite - Attempting to remove clipboard entry from db with id: ', entry._id);
            try {
                if ( entry instanceof FilesEntry && entry.data.fileType === 'image' && ClipService.isInDir(entry.data.uris[0], favImageCache) ) {
                    entry.setSingleFilePath(await moveFileTo(entry.data.uris[0], imageCache));
                }
                await db.remove(entry._id as string);
                entry.favourite = false; // only do this at the end, because only then an entry can also be deleted
            } catch (err) {
                global.logger.error({
                    originator: 'ClipService::toggleEntryFavourite',
                    description: 'Error during de-favouring a clipboard entry',
                    additionalInformation: `entry id=${entry._id}, type=${entry.type}`,
                    stacktrace: err
                });
            }
        }
    }

    private static isInDir(pathToFile, directory): boolean {
        const currentDir = path.dirname(pathToFile);
        return directory === currentDir;
    }

    deleteEntry(entry: ClipboardEntry) {
        let index = this.clipboardEntries.indexOf(entry);
        this.clipboardEntries.splice(index, 1);
    }

    save(): void {
        this.clipboardEntries.filter(e => e.favourite)
            .forEach(e => db.update(e));
    }

    search(query: string) {
        const upperQuery = query.toUpperCase();
        return this.clipboardEntries.filter(e => {
            return e.plainText.toUpperCase().indexOf(upperQuery) !== -1 || (e.alternative && e.alternative.toUpperCase().indexOf(upperQuery) !== -1);
        });
    }


// function query(query: string): Array<ClipboardEntry> {
//     if (!this.query) {
//         // DONT RETURN ANYTHING HERE (catched before by getQueryResults, return value will be ignored!)
//     } else {
//         if (this.settings.useAdvancedSearch) {
//             return this.clipboardEntries.filter(s => {
//                 s.htmlRepresentation = search(s.plainText, query);
//                 return s.htmlRepresentation != null;
//             });
//         } else {
//             return this.clipboardEntries.filter(s => s.plainText.toUpperCase().includes(query.toUpperCase()))
//         }
//     }
// }

// function cleanupQueryCache(): void {
//     clipboardEntries.forEach(e => e.htmlRepresentation = null);
// }

    sendOsPaste(): void {
        win.minimize(); // Update 24.03.2021: leave this as minimize, hide will not give the last focused window its focus back, therefore the paste will fail!
        // win.hide(); // INFO: THIS DOES NOT WORK
        // win.blur();
        // win.blurWebView();
        robot.keyTap('v', process.platform === 'darwin' ? 'command' : 'control');
        // keyboard.type(Key.LeftControl, Key.V);
    }

    pasteEntry(entry: ClipboardEntry): void { // TODO Type
        console.debug(`ClipService::pasteEntry called`);
        let index = this.clipboardEntries.indexOf(entry);
        const indexFound = index !== -1;
        if ( !indexFound ) {
            console.info('could not find the requested entry');
            this.clipboardEntries.unshift(entry); // this should not go through the filter chain
            index = 0;
        }
        const clipboardEntry = this.clipboardEntries[index];
        if ( index !== 0 ) { // move entry to the front of the list
            this.clipboardEntries.splice(index, 1);
            this.clipboardEntries.unshift(clipboardEntry);
        }
        if ( entry instanceof FilesEntry ) {
            clipboard.writeFiles(entry.data.uris);
        } else if ( entry instanceof MathEntry ) {
            const file = entry.cache.pastePath;
            clipboard.writeFiles([file]);
        } else {
            clipboard.write({
                html: clipboardEntry.html,
                text: clipboardEntry.plainText
            });
        }
        this.sendOsPaste();
        clipboardEntry.timesPasted++;
        clipboardEntry.lastUsed = Date.now();
    }

    pastePlain(plainText: string) {
        clipboard.writeText(plainText);
        this.sendOsPaste();
    }

    pasteRich(plainText: string, options?: { html?: string, alternative?: string }): void { // TODO alternative
        const clipboardEntry = new PlainEntry(plainText);
        if ( options ) {
            clipboardEntry.alternative = options.alternative;
            clipboardEntry.html = options.html;
        }
        this.pasteEntry(clipboardEntry);
    }

}
