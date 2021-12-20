import { Action } from '@/plugins/plugins';
import { EntryType } from '@/plugins/clip/EntryType';
import { FilesEntry } from '@/classes/ClipboardEntry';

const {exec} = require('child_process');

const actions: Action[] = [
    {
        validator: _entry => true,
        description: 'Insert as Plain-text',
        performAction: (entry, done) => {
            window.clipboard.writeText(entry.plainText);
            window.services.clipboard.sendOsPaste();
            done();
        }
    },
    {
        validator: entry => Boolean(entry.html),
        description: 'Insert the Html stored in the clipboard',
        performAction: (entry, done) => {
            window.clipboard.writeText(entry.html);
            window.services.clipboard.sendOsPaste();
            done();
        }
    },
    {
        validator: EntryType.Url,
        description: 'Open Link in Browser',
        performAction: (entry, done) => {
            const url = entry.plainText;
            global.openUrl(url);
            window.hide();
            done();
        }
    },
    {
        validator: entry => {
            return entry.type === EntryType.Url && Boolean(entry.alternative);
        },
        description: 'Insert as Markdown',
        performAction: (entry, done) => {
            window.clipboard.writeText(`[${entry.alternative}](${entry.plainText})`);
            window.services.clipboard.sendOsPaste();
            done();
        }
    },
    {
        validator: EntryType.Email,
        description: entry => 'Send Mail to ' + entry.plainText,
        performAction: (entry, done) => {
            global.openExternal('mailto: ' + entry.plainText);
            window.hide();
            done();
        }
    },
    {
        validator: (entry) => {
            return (entry instanceof FilesEntry && Boolean(entry.data.fileType === 'file'))
                || entry.type === EntryType.Image;
        },
        description: 'Open with ...',
        performAction: (entry, done) => {
            let path;
            if ( entry.type === EntryType.Files )
                path = entry.data.uris[0];
            else
                path = entry.data.src;
            exec('openwith.exe ' + path);
            window.hide();
            done();
        }
    },
    {
        validator: entry => {
            return (entry instanceof FilesEntry && ['file', 'directory'].includes(entry.data.fileType))
                || entry.type === EntryType.Image;
        },
        description: 'Open with default application',
        performAction: (entry, done) => {
            let path;
            if ( entry.type === EntryType.Files )
                path = entry.data.uris[0];
            else // EntryType.Image
                path = entry.data.src;
            global.openExternal(path);
            window.hide();
            done();
        }
    },
];

export { actions };
