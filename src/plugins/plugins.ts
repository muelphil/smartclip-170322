import { clip } from '@/plugins/clip';
import { leo } from '@/plugins/leo';
import { echo } from '@/plugins/echo';
import { AbstractSettingProperty } from '@/classes/SettingProperty';
import { test } from '@/plugins/test';
import { tex } from '@/plugins/unicodetex';
import { EntryType } from '@/plugins/clip/EntryType';
import { ClipboardEntry } from '@/classes/ClipboardEntry';
import { math } from '@/plugins/math';
import { funcs } from '@/plugins/funcs';
import { start } from '@/plugins/start';

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
    service?: { new(settings: object) },
    actions?: Action[]
}

const basePlugin = clip;

const prefixPlugins: Plugin[] = [
    echo,
    leo,
    math,
    test,
    tex,
    funcs,
    start
];

// fs.readdirSync(pluginsPath, 'utf-8')
//     .filter(p => p.endsWith('.js'))
//     .map(p => {
//         const pluginPath = join(pluginsPath, p);
//         return __non_webpack_require__(pluginPath);
//     })
//     .forEach(p => prefixPlugins.push(p));

// const myPlugin = __non_webpack_require__('C:\\Users\\Philip\\.smartclipdev\\plugins\\main.js');
// prefixPlugins.push(myPlugin);

const allPlugins: Plugin[] = [
    ...prefixPlugins,
    basePlugin
];


// TODO remove this after reviewing the component registration
// setTimeout(() => {
//     prefixPlugins.forEach(plugin => {
//         console.debug(`registering component ${plugin.id} with name ${plugin.component.name}`)
//         vueApp.component(plugin.component.id, plugin.component);
//     });
// });


export {
    prefixPlugins,
    allPlugins,
    basePlugin
};
