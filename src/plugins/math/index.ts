import MathView from "@/plugins/math/MathView.vue";
import { Plugin } from '@/plugins/types';
import { mathSettings } from '@/plugins/math/settings';

export const math: Plugin = {
    id: 'math',
    component: MathView,
    name:'Math',
    prefixDisplay: 'Math',
    description: 'Plugin for pasting Math, both as SVG and PNG. For rendering both MathJax and (as long as installed) PdfLatex can be used.',
    settingsPrototype: mathSettings
};
