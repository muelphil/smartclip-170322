import { Plugin } from '@/plugins/types';
import FuncsView from '@/plugins/funcs/FuncsView.vue';
import FuncsService from '@/plugins/funcs/FuncsService';

export const funcs: Plugin = {
    id: 'funcs',
    name: 'Functions',
    prefixDisplay: 'Functions',
    component: FuncsView,
    service: FuncsService,
    description: 'Plugin that allows for the activation of functions. These functions can for example alter the behaviour of the Clipboard.',
};
