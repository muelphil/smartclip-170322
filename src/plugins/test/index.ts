import { Plugin } from '@/plugins/types';
import TestView from '@/plugins/test/TestView.vue';
import TestService from '@/plugins/test/TestService';
import { settingsPrototype } from '@/plugins/test/settings';

export const test: Plugin = {
    id: 'test',
    component: TestView,
    service: TestService,
    settingsPrototype: settingsPrototype,
    prefixDisplay: 'Test',
    name: 'Test',
    description: 'Purely for test purposes :)'
};
