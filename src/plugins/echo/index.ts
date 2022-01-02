import EchoView from '@/plugins/echo/EchoView.vue';
import { Plugin } from '@/plugins/types';

export const echo: Plugin = {
    id: 'echo',
    component: EchoView,
    name: 'Echo',
    prefixDisplay: 'Echo',
    description: 'A plugin that simply echos the input and will paste it on submitting, additionally leading to save input in the Clipboard Service'
};
