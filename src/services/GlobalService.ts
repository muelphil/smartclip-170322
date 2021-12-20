import { reactive } from 'vue';
import getComputedProperty from '@/utils/getComputedProperty';

export type ContextMenu<T> = {
    options: Array<T>,
    onSubmit?: (el: T) => void,
    onClose?,
    keyMapper?: (el: T) => string
}

export class GlobalService {
    public settingsActive: boolean = false;
    public loading: boolean = false;
    public textcolorPrimary: string = '#000000';
    public codeBackgroundColor: string;
    public codeColor: string;
    public contextMenu: ContextMenu<any>;

    private constructor() {
        getComputedProperty('pre', 'hljs', (props) => {
            this.codeBackgroundColor = props.getPropertyValue('background-color');
            this.codeColor = props.getPropertyValue('color');
        });
    }

    openContextMenu(menu: ContextMenu<any>) {
        if ( this.contextMenu )
            this.closeContextMenu();
        this.contextMenu = menu;
    }

    closeContextMenu() {
        this.contextMenu = null;
    }

    static constructReactive() {
        return reactive(new GlobalService());
    }
}
