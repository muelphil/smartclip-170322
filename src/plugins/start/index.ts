import { Plugin } from '@/plugins/plugins';
import StartView from '@/plugins/start/StartView.vue';

export const start: Plugin = {
    id: 'start',
    component: StartView,
    prefixDisplay: 'Start', // this will never be displayed
    name: 'Start',
    description:'TODO'
};
