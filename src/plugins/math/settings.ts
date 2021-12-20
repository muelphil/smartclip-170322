import {AbstractSettingProperty, HiddenSettingProperty} from '@/classes/SettingProperty';


export const mathSettings: Array<AbstractSettingProperty> = [
    {
        type: 'hidden',
        identifier: 'colorOptions',
        label: 'Color options for the output equation.',
        defaultValue: ['#000000', '#FFFFFF', '#1c3077', '#88311d',
            '#1a471d', '#4324a0']

    },
    {
        type: 'hidden',
        identifier: 'mathjaxTexMacros',
        label: 'Macros for usage within MathJax',
        defaultValue: {
            RR: '{\\bf R}',
            bold: ['{\\bf #1}', 1],
            R: '\\mathbf{R}'
        }

    }
];
