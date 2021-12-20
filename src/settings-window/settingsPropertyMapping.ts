import {
    BooleanSettingProperty,
    HiddenSettingProperty,
    HotkeySettingProperty,
    SelectSettingProperty,
    StringSettingProperty,
    RadioGroupSettingProperty
} from '@/classes/SettingProperty';

const mapping = {};

// during build classnames will be compressed and classnames like G, F or D are generated
// because of this BooleanSettingProperty.name is used instead of 'BooleanSettingProperty'
mapping[BooleanSettingProperty.name] = 'ScCheckbox';
mapping[SelectSettingProperty.name] = 'ScSelect';
mapping[StringSettingProperty.name] = 'ScTextInput';
mapping[RadioGroupSettingProperty.name] = 'ScRadioGroup';
mapping[HotkeySettingProperty.name] = 'ScHotkey';
mapping[HiddenSettingProperty.name] = 'ScHotkey';

export default mapping;
