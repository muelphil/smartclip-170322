enum SettingType { // todo deprecated
    'String', 'Number', 'Boolean', 'Select'
}

type SettingPropertyOptions = {
    onChange?: (val: any) => void,
    init?: (val: any) => void,
    // TODO validator
    // TODO removed attributes, is this still needed ?
}

abstract class AbstractSettingProperty {
    defaultValue: any;
    type: string;
    options?: any;
    protected constructor(
        public identifier: string,
        public label: string,
        public propertyOptions?: SettingPropertyOptions
    ) {
    }

}

class BooleanSettingProperty extends AbstractSettingProperty {
    defaultValue: boolean;
    static class: string = 'BooleanSettingProperty';

    constructor(identifier: string, label: string, defaultValue: boolean, propertyOptions?: SettingPropertyOptions) {
        super(identifier, label, propertyOptions);
        this.defaultValue = defaultValue;
    }
}

class SelectSettingProperty<T> extends AbstractSettingProperty {
    options: Map<string, string>;
    defaultValue: T;
    static class: string = 'SelectSettingProperty';

    constructor(identifier: string, label: string, defaultValue: T, options: Map<string, string>, propertyOptions?: SettingPropertyOptions) {
        super(identifier, label, propertyOptions); // TODO mal belesen ob man typen spezifizieren (spezieller machen) darf!
        this.options = options;
        this.defaultValue = defaultValue;
    }
}

class StringSettingProperty extends AbstractSettingProperty {
    defaultValue: string;
    static class: string = 'StringSettingProperty';

    constructor(identifier: string, label: string, defaultValue: string, propertyOptions?: SettingPropertyOptions) {
        super(identifier, label, propertyOptions);
        this.defaultValue = defaultValue;
    }
}

class HiddenSettingProperty<T> extends AbstractSettingProperty {
    defaultValue: T;
    static class: string = 'HiddenSettingProperty';
    hidden: boolean = true;

    constructor(identifier: string, label: string, defaultValue: T, propertyOptions?: SettingPropertyOptions) {
        super(identifier, label, propertyOptions);
        this.defaultValue = defaultValue;
    }
}


class HotkeySettingProperty extends AbstractSettingProperty {
    defaultValue: string[]; // todo regex as type here?
    static class: string = 'HotkeySettingProperty';

    constructor(identifier: string, label: string, defaultValue: string[], propertyOptions?: SettingPropertyOptions) {
        super(identifier, label, propertyOptions);
        this.defaultValue = defaultValue;
    }
}

class RadioGroupSettingProperty<T> extends AbstractSettingProperty {
    options: Map<string, string>; // info: cant use object as this will not garuantee to preserve the order
    defaultValue: T;
    static class: string = 'RadioGroupSettingProperty';

    constructor(identifier: string, label: string, defaultValue: T, options: Map<string, string>, propertyOptions?: SettingPropertyOptions) {
        super(identifier, label, propertyOptions); // TODO mal belesen ob man typen spezifizieren (spezieller machen) darf!
        this.options = options;
        this.defaultValue = defaultValue;
    }
}


export {
    AbstractSettingProperty,
    BooleanSettingProperty,
    StringSettingProperty,
    SelectSettingProperty,
    HotkeySettingProperty,
    HiddenSettingProperty,
    RadioGroupSettingProperty
};
