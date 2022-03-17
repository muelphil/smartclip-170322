import {EntryType} from "@/plugins/clip/EntryType";
import {ClipboardEntry} from "@/classes/ClipboardEntry";
import {AbstractSettingProperty} from "@/classes/SettingProperty";

export type Action = {
    validator: EntryType | ((entry: ClipboardEntry) => boolean),
    description: string | ((entry: ClipboardEntry) => string),
    performAction: (entry, done: () => void) => void
}

export type ActionInstance = {
    description: string,
    performAction: (entry, done: () => void) => void
}

export type Plugin = {
    id: string,
    component: any,
    name: string,
    prefixDisplay: string,
    description: string,
    settingsPrototype?: Array<AbstractSettingProperty>,
    service?: {
        new(settings: object, getPluginCachePath: (pluginId: string, expectedSubDirs?: string[]) => string),
        Ready?: Promise<void>
    },
    actions?: Action[]
}