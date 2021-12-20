import {AbstractSettingProperty, HiddenSettingProperty, SelectSettingProperty} from '@/classes/SettingProperty';
import {setZoomFactor} from '@/utils/electronHelpers/setZoomFactor';

export const baseSettingsPrototype: Array<AbstractSettingProperty> = [
    {
        type: 'select',
        identifier: 'zoom',
        label: 'Zoom-Level',
        defaultValue: 1,
        options: new Map([['0.8', '80%'], ['1', '100%'], ['1.25', '125%'], ['1.5', '150%'], ['2.0', '200%']]),
        propertyOptions: {onChange: zoomLevel => setZoomFactor(zoomLevel), init: zoomLevel => setZoomFactor(zoomLevel)}
    },
    {
        type: 'hidden',
        identifier: 'maxScreenHeightPercentage',
        label: 'Maximum height of the application as percentage of screenheight',
        defaultValue: 0.45,
    },
    {
        type: 'hidden',
        identifier: 'mathPreviewFontSize',
        label: 'Height of 1em (approx. height of "gh") of the math entry equation preview in px',
        defaultValue: 20,
    }
];

export type BaseSettings = {
    maxScreenHeightPercentage: number, zoom: number
}
