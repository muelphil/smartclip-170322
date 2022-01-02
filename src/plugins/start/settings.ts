import {AbstractSettingProperty, HiddenSettingProperty} from '@/classes/SettingProperty';


export const startSettings: Array<AbstractSettingProperty> = [
    {
        type: 'files',
        identifier: 'dirsToIndex',
        label: 'Index Directories',
        options: ['openDirectory'],
        defaultValue: []
    },
    {
        type: 'hidden',
        identifier: 'ignore',
        label: 'Directory names to ignore',
        defaultValue: []
    }
];
