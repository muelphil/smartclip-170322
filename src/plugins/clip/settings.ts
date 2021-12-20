import {AbstractSettingProperty, BooleanSettingProperty, HotkeySettingProperty} from '@/classes/SettingProperty';
import {setApplicationHotkey, setStartup} from '@/utils/smartclipHelpers';

export const settingsPrototype: Array<AbstractSettingProperty> = [
    {
        type: 'boolean',
        identifier: 'useDigitsForSelection',
        label: 'use digits to select entries',
        defaultValue: false
    },
    {
        type: 'boolean',
        identifier: 'multilinePreview',
        label: 'preview multiple lines for each entry (up to 3)',
        defaultValue: false
    },
    {
        type: 'hotkey',
        identifier: 'shortcut',
        label: 'Shortcut',
        defaultValue: ['Ctrl', 'Shift', 'V'],
        propertyOptions: {init: setApplicationHotkey, onChange: setApplicationHotkey}
    },
    {
        type: 'boolean',
        identifier: 'launchOnStartup',
        label: 'launch smartclip on startup',
        defaultValue: false,
        propertyOptions: {onChange: setStartup}
    },
    // new SelectSettingProperty( TODO
    //     'theme',
    //     'theme',
    //     'dracula',
    //     Object.keys(themes)),
    // {onChange: theme => setTheme(theme), init: theme => setTheme(theme)}), TODO
    // new BooleanSettingProperty(
    //     'devToolsOnStartup',
    //     'start with devtools open',
    //     false, {
    //         init: function (devToolsOnStartup) {
    //             if (devToolsOnStartup) win.webContents.openDevTools();
    //         }
    //     })
];
