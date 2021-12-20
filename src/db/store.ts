import {ClipboardEntry} from '@/classes/ClipboardEntry';
import Datastore from 'nedb-promises';
import SerializedClipboardEntry from '@/classes/SerializedClipboardEntry';
import { join } from 'path';
import { dotSmartclipPath } from '@/initialize/paths';
import { clip } from '@/plugins/clip';

class ClipboardEntryStore {

    public db: Datastore;

    constructor() {
        // TODO https://github.com/louischatriot/nedb/issues/531
        // TODO https://acjay.com/2019/04/19/an-epic-webpack-mystery/
        const dbPath = join(dotSmartclipPath, 'smartclip.db');
        this.db = Datastore.create({
            filename: dbPath,
            timestampData: true,
        });
    }

    create(data: ClipboardEntry) {
        return this.db.insert(SerializedClipboardEntry.fromClipboardEntry(data));
    }

    // read(_id: number) {
    //     return this.db.findOne({_id});
    // }

    remove(_id: string) {
        return this.db.remove({_id}, {});
    }

    // removeAll(){
    //     this.db.remove({},{});
    // }

    readAll(): Promise<Array<SerializedClipboardEntry>> {
        return this.db.find({});
    }

    update(clipboardEntry: ClipboardEntry) {
        return this.db.update(
            {_id: clipboardEntry._id},
            {$set: {
                timesCopied: clipboardEntry.timesCopied,
                timesPasted: clipboardEntry.timesPasted,
                timesSmartPasted: clipboardEntry.timesSmartPasted,
                lastUsed: clipboardEntry.lastUsed
            }},
            {multi: true}
            );
    }
}

export default new ClipboardEntryStore();
