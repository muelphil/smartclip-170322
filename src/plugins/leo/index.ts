import LeoView from '@/plugins/leo/LeoView.vue';
import { Plugin } from '@/plugins/plugins';

export const leo: Plugin = {
    id: 'leo',
    component: LeoView,
    name: 'Translator',
    prefixDisplay: 'Translate',
    description: 'A Translation Plugin that allows to search for translation and instantly pasting them.'
};
