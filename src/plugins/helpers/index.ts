import { nextTick, Ref, watch } from 'vue';

function basicAltListener<T>(listGetter: () => Array<T>, handler: (index: number) => void): (scevent: any, event: KeyboardEvent) => void {

    function altListener(event) {// todo funktion ist duplikat zu clipview
        if ( event.code?.startsWith('Digit') ) {
            const digit: number = +event.key;
            if ( digit == 0 ) return;
            const index = digit - 1;
            if ( index < listGetter().length ) {
                handler(index);
            }
        }
    }

    return altListener;
}

function basicArrowListener<T>(listGetter: () => Array<T>, selectedIndexRef) {

    function arrowListener(event, direction) { // todo funktion ist duplikat zu clipview
        if ( direction === 'down' ) {
            if ( selectedIndexRef.value + 1 < listGetter().length ) {
                selectedIndexRef.value++;
            }
        } else if ( direction === 'up' ) {
            if ( selectedIndexRef.value != 0 ) {
                selectedIndexRef.value--;
            }
        }
    }

    return arrowListener;
}

function registerBasicScroll(ref: Ref | Array<Ref>, containerRef: Ref<HTMLElement>, selectedClass: string = 'selected') {
    watch(ref, () => {
        nextTick(() => {
            const el = containerRef.value.querySelector('.' + selectedClass);
            (el as any).scrollIntoViewIfNeeded(true); // compatibility: chrome only!
        });
    });
}

// function basicScroll(container: HTMLElement, selectedClass : string = 'selected') {
// console.log('basicScroll called!');
// let positionContainer = container.getBoundingClientRect();
// let positionChild = el.getBoundingClientRect();
// console.dir({
//     'child': el,
//     'container': container,
//     "positionChild.top": positionChild.top,
//     "positionContainer.top": positionContainer.top,
//     "positionChild.bottom": positionChild.bottom,
//     "positionContainer.bottom": positionContainer.bottom
// });
// if ( positionChild.top >= positionContainer.top && positionChild.bottom <= positionContainer.bottom ) {
//     // console.info('Element is fully visible in screen', newVal);
// } else {
//     // console.info('Element is NOT fully visible in screen', newVal);
//     let alignToTop: boolean = false;
//     el.scrollIntoView(alignToTop);
// }
// TODO make scrolling smoother
// const middle = (positionChild.top + positionChild.bottom) / 2;
// container.scrollTo(0, middle);
// }

export { basicAltListener, basicArrowListener, registerBasicScroll };
