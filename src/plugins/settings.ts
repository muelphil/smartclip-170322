import {AbstractSettingProperty} from '@/classes/SettingProperty';
import {reactive, watch} from 'vue';
import {remote} from 'electron';
import {onClose} from '@/cleanup';
import {plugins} from '@/plugins/plugins';
import {Plugin} from '@/plugins/types';
import {BaseSettings, baseSettingsPrototype} from '@/plugins/basicSettings';
import {dotSmartclipPath} from '@/initialize/paths';

const app = remote.app;
const path = require('path');

const settingsManager = require('electron-settings');
settingsManager.configure({fileName: 'settings.json', prettify: true, dir: dotSmartclipPath});

let settings: any = {};

function loadSettings(): void {
    settings = settingsManager.getSync('settings') || {};
    settings.base = toSettingsObject(baseSettingsPrototype, settings['base'] || {}) as BaseSettings;
    console.debug('[Initialization] Loading Settings, loaded settings object=', settings);
}

function createPluginSettings(plugin: Plugin) {
    const settingsPrototype: AbstractSettingProperty[] | null = plugin.settingsPrototype;
    if (settingsPrototype) {
        console.debug('[Initialization] Loading settings for plugin ', plugin.id);
        const serviceIdentifier: string = plugin.id;
        const pluginSettings = toSettingsObject(settingsPrototype, settings[serviceIdentifier] || {});
        settings[serviceIdentifier] = pluginSettings;
        return pluginSettings;
    }
    return {};
}

function toSettingsObject(settings: Array<AbstractSettingProperty>, loadedSettings: any): object {
    const result: any = reactive({});
    // generate settings object
    settings.forEach((setting: AbstractSettingProperty) => {
        const identifier = setting.identifier;
        result[identifier] = loadedSettings[identifier] || setting.defaultValue;
    });
    const reactiveResult = reactive(result);
    // register watchers
    settings.forEach((setting: AbstractSettingProperty) => {
        const identifier = setting.identifier;
        if (setting.propertyOptions) {
            if (setting.propertyOptions.init) {
                setting.propertyOptions.init(result[identifier]);
            }
            if (setting.propertyOptions.onChange) {
                console.debug('[Initialization] onChange callback is getting registered for setting property ', identifier);
                watch(() => result[identifier], setting.propertyOptions.onChange);
            }
        }
    });
    return reactiveResult;
}

function save(): void {
    settingsManager.setSync('settings', settings);
}

onClose(save);

function logSettings(): void {
    console.log('settings:', {active: settings, saved: settingsManager.getSync('settings') || {}});
}

function resetSettings(): void {
    settingsManager.unsetSync();
}

loadSettings();

export {
    settings,
    save,
    logSettings,
    resetSettings,
    loadSettings,
    createPluginSettings
};
