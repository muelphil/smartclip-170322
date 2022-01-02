import {Plugin} from '@/plugins/types';
import StartView from '@/plugins/start/StartView.vue';
import StartService from "@/plugins/start/StartService";
import {startSettings} from "@/plugins/start/settings";

export const start: Plugin = {
    id: 'start',
    component: StartView,
    prefixDisplay: 'Start', // this will never be displayed
    name: 'Start',
    service: StartService,
    description: 'TODO',
    settingsPrototype: startSettings
};
