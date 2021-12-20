'use strict';
import '@/utils/electronHelpers/enable-rightclick'; // renderer
import '@/./initialize/globals-initialize';
import {ipcRenderer} from 'electron';
import {createApp} from 'vue';

const href = window.location.href;
console.log('url=', href);

if (href.endsWith('#settings')) {
    import('@/settings-window/SettingsApp.vue').then(SettingsApp => {
        const app = createApp(SettingsApp.default as any);
        app.mount('#app');
    });
} else {
    require('@/initialize');
    require("@/plugins/settings");
    const allPlugins = require('@/plugins/plugins').allPlugins;
    const baseSettingsPrototype = require('@/plugins/basicSettings').baseSettingsPrototype;

    ipcRenderer.on('get-settings', (event) => {
        console.log('settings requested');
        console.dir(baseSettingsPrototype);

        function serializeSettingsPrototype(settingsPrototype) {
            return settingsPrototype.map(({type, identifier, description, label, defaultValue, options}) => ({
                type, identifier, description, label, defaultValue, options
            }));
        }

        const serializedPlugins =
            allPlugins.map(({id, prefixDisplay, description, settingsPrototype, name}) => {
                const result = {id, prefixDisplay, name, description};
                if (settingsPrototype) result['settingsPrototype'] = serializeSettingsPrototype(settingsPrototype);
                return result;
            })
        // ));
        const serializedSettings = JSON.parse(JSON.stringify(window.settings));

        ipcRenderer.sendTo(event.senderId, 'init-settings', {
            settings: serializedSettings,
            plugins: serializedPlugins,
            baseSettingsPrototype: serializeSettingsPrototype(baseSettingsPrototype)
        }); //TODO
    })

    ipcRenderer.on('set-setting', (event, {plugin, identifier, value}) => {
        console.log(`attempted to set setting - window.settings[${plugin}][${identifier}] = ${value}`);
        window.settings[plugin][identifier] = value;
    });

    import('@/App.vue').then(App => {
        // const allPlugins = require('@/plugins/plugins').allPlugins;
        const ScLoader = require('@/components/ScLoader.vue');
        const ScEmptyState = require('@/components/ScEmptyState.vue');
        const ScPaddedLoader = require('@/components/ScPaddedLoader.vue');
        const ScKeyCombination = require('@/components/ScKeyCombination.vue');
        // console.log('App=')
        // console.dir(App)
        const app = createApp(App.default as any);
        allPlugins.forEach(plugin => {
            const name = plugin.component.name;
            const component = plugin.component;
            app.component(name, component);
        });
        app.component('ScEmptyState', ScEmptyState);
        app.component('ScLoader', ScLoader);
        app.component('ScPaddedLoader', ScPaddedLoader); //TODO padded loader?
        app.component('ScKeyCombination', ScKeyCombination);
        app.mount('#app');
    });
}