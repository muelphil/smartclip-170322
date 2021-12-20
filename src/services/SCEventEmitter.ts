let isFunction = function (obj) { // TODO hat hier nix zu suchen
    return typeof obj == 'function' || false;
};

type ScEvent = 'arrow' | 'submit' | 'esc' | 'alt-start' | 'alt-stop' | 'alt-select' | 'tab'
type PropagateOption = 'all' | 'none' | 'non-covered'

export default class SCEventEmitter {

    // listeners: Map<string, Function[]>;
    listeners: Array<{ propagate: PropagateOption, listeners: { [key: string]: Function } }>;

    constructor() {
        this.listeners = [];
    }

    removeListener(id: number) {
        if ( id !== this.listeners.length - 1 )
            throw 'tried to remove listener that is not at the top of the stack';
        this.listeners.splice(id, 1);
    }

    setListeners(listeners: { [key: string]: Function }, propagate: PropagateOption = 'all'): number {
        const id = this.listeners.length;
        this.listeners.push({propagate, listeners});
        return id;
    }

    // TODO remove
    // once(label: ScEvent, callback) {
    //     this.listeners.has(label) || this.listeners.set(label, []);
    //     const listenersForLabel = this.listeners.get(label);
    //     const removeListener = this.removeListener.bind(this);
    //     listenersForLabel.push(function g(...args) {
    //         removeListener(label, g);
    //         callback(...args);
    //     });
    //     return this;
    // }

    private buildListeners(eventName: string) {
        const listeners = [];
        for (let index = this.listeners.length - 1; index >= 0; index--) {
            const labelListener = this.listeners[index];
            const listener = labelListener.listeners[eventName];
            const propagate = labelListener.propagate;
            if ( listener ) {
                listeners.push(listener);
                if ( propagate === 'non-covered' )
                    break;
            }
            if ( propagate === 'none' ) {
                break;
            }
        }
        return listeners;
    }

    emit(label: ScEvent, event: Event, ...args) {
        if ( !window.services.global.loading ) {
            let listeners = this.buildListeners(label);
            for (let listener of listeners) {
                listener(event, ...args);
            }

            // if ( listeners && listeners.length ) {
            //
            //     let continuee = true;
            //     event.stopPropagation = () => continuee = false;
            //     for (let index = listeners.length - 1; index >= 0; index--) { // info: iterate in reverse
            //         const listener = listeners[index];
            //         if ( !continuee ) break;
            //         listener(event, ...args);
            //     }
            //     return true;
            // }
            // return false;
        } else {
            console.warn(`Did not emit event ${label}, because !window.services.global.loading evaluated to ${!window.services.global.loading}`);
        }
    }


    off = this.removeListener;
    on = this.setListeners;

}
