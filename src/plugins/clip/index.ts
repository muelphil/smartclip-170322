import { settingsPrototype as clipSettings } from '@/plugins/clip/settings';
import ClipView from '@/plugins/clip/ClipView.vue';
import ClipResults from '@/plugins/clip/ClipResults.vue';
import { Plugin } from '@/plugins/plugins';
import { actions } from '@/plugins/clip/actions';

export const clip: Plugin = {
    id: 'clip',
    component: ClipResults,
    settingsPrototype: clipSettings,
    name: 'Smart Clipboard',
    prefixDisplay: 'Smart Clipboard',
    description: 'Clipboard Manager that formats, preprocesses and saves data from the Clipboard for later use.',
    actions: actions
};
