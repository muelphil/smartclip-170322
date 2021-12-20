import { AbstractSettingProperty, BooleanSettingProperty, RadioGroupSettingProperty } from '@/classes/SettingProperty';

export const settingsPrototype: Array<AbstractSettingProperty> = [
    {
        type: 'boolean',
        identifier: 'uselessButton',
        label: 'completely useless and for testing only',
        defaultValue:  false
    },
    {
        type: 'boolean',
        identifier: 'uselessRadio',
        label: 'Useless Radio Group',
        defaultValue:  'test',
        options: new Map([['test', 'Test'], ['test2', 'Test2'], ['test3', 'Test3']])
    }
];
