import { watch } from 'vue';
import SCEventEmitter from '@/services/SCEventEmitter';

function generateEventEmitter(): SCEventEmitter {

    const eventEmitter = new SCEventEmitter();

    let altStarted = false;

    function onDocumentKeyUp(event: KeyboardEvent){
        if ( altStarted && event.altKey && event.code === 'Alt' ) {
            altStarted = false;
            eventEmitter.emit('alt-stop', event);
        }
    }

    function onDocumentKeydown(event: KeyboardEvent) {
        if ( event.altKey ) {
            console.debug('[Events, Event Emitter] onDocumentKeydown, event=', event);
            if(event.code === 'Alt'){
                // show alt options
                if(!altStarted){
                    altStarted = true;
                    eventEmitter.emit('alt-start', event);
                }
            } else {
                // event.preventDefault();
                eventEmitter.emit('alt-select', event);
            }

        } else if ( event.code?.startsWith('Arrow') ) {
            const direction = event.code.slice(5).toLowerCase();
            eventEmitter.emit('arrow', event, direction);
        } else if ( event.code === 'Tab' ) {
            event.preventDefault();
            eventEmitter.emit('tab', event);
        } else if ( event.code === 'Enter' ) {
            eventEmitter.emit('submit', event);
        } else if ( event.code === 'Escape' ) {
            eventEmitter.emit('esc', event);
        }
    }

    function registerListeners() {
        console.debug('[Initialization] Registered global keydown listeners');
        document.addEventListener('keydown', onDocumentKeydown);

    }

    function removeListeners() {
        console.debug('[Plugin Switch] removed global keydown listeners');
        document.removeEventListener('keydown', onDocumentKeydown);
    }

    watch(
        () => window.services.global.settingsActive,
        (settingsActive) => {
            if ( !settingsActive ) {
                registerListeners();
            } else {
                removeListeners();
            }
        },
        {immediate: true}
    );
    return eventEmitter;
}


export {
    generateEventEmitter
};
