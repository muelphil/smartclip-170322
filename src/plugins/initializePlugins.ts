import { ref } from '@vue/reactivity';
import { basePlugin, prefixPlugins } from '@/plugins/plugins'; // TODO try to make the following code independent of these imports
import {Plugin} from '@/plugins/types';

function initializePlugins() {
    const query = ref('');
    const pluginId = ref(basePlugin.id);

    function checkPluginPrefix(event: KeyboardEvent): void {
        const inputElement = event.target as HTMLInputElement;
        if ( inputElement.id !== 'searchbar' ) return; // only react to keyboard events on the searchbar

        if ( pluginId.value === basePlugin.id ) { // plugin prefix while in clipboard mode => plugin mode
            if ( event.code === 'Space' ) {
                // checking for plugin prefix
                const potentialPluginId = inputElement.value.trim();
                console.debug(`checking for plugin with name "${potentialPluginId}"`);
                if ( potentialPluginId.indexOf(' ') === -1 ) {
                    console.log('prefixPlugins=', prefixPlugins.value);
                    const foundPlugin: Plugin | undefined = prefixPlugins.value.find(e => e.id === potentialPluginId);
                    if ( foundPlugin ) {
                        console.debug(`Plugin ${potentialPluginId} will be deployed, basePlugin will be concealed`);
                        event.preventDefault();
                        query.value = '';
                        pluginId.value = potentialPluginId;
                    }
                }
            }
        } else { // backspace while empty and in service mode => clipboard mode
            // checking if mode should be changed back to clipboard
            if ( event.code == 'Backspace' ) {
                if ( inputElement.value === '' || (inputElement.selectionStart === 0 && inputElement.selectionEnd === 0) ) {
                    console.debug(`Plugin ${pluginId.value} will be concealed, basePlugin will be deployed`);
                    pluginId.value = basePlugin.id;
                }
            }
        }
    }

    function reset() {
        query.value = '';
        pluginId.value = basePlugin.id;
    }

    return {
        query,
        pluginId,
        checkPluginPrefix,
        reset
    };
}

export {
    initializePlugins
};
