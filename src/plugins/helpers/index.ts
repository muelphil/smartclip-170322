import {nextTick, Ref, watch} from 'vue';

function basicAltListener<T>(listGetter: () => Array<T>, handler: (index: number) => void): (scevent: any, event: KeyboardEvent) => void {

    function altListener(event) {// todo funktion ist duplikat zu clipview
        if (event.code?.startsWith('Digit')) {
            const digit: number = +event.key;
            if (digit == 0) return;
            const index = digit - 1;
            if (index < listGetter().length) {
                handler(index);
            }
        }
    }

    return altListener;
}

function basicArrowListener<T>(listGetter: () => Array<T>, selectedIndexRef, onOverflow?: (toBottom: boolean) => void) {

    function arrowListener(event, direction) {
        if (direction === 'down') {
            if (selectedIndexRef.value + 1 < listGetter().length) {
                selectedIndexRef.value++;
            } else if (onOverflow) {
                onOverflow(true);
            }
        } else if (direction === 'up') {
            if (selectedIndexRef.value != 0) {
                selectedIndexRef.value--;
            } else if (onOverflow) {
                onOverflow(false);
            }
        }
    }

    return arrowListener;
}

function basicGridArrowListener<T>(listGetter: () => Array<T>,
                                   selectedIndex: Ref<number>,
                                   colsPerRow: number,
                                   onOverflow?: (toBottom: boolean) => void) {
    function arrowListener(event, direction) {
        if (direction === 'down') {
            const listLength = listGetter().length;
            if (selectedIndex.value + colsPerRow < listLength) {
                selectedIndex.value += colsPerRow;
            } else if (onOverflow) {
                selectedIndex.value = listLength - 1;
                onOverflow(true);
            }
        } else if (direction === 'up') {
            if (selectedIndex.value - colsPerRow >= 0) {
                selectedIndex.value -= colsPerRow;
            } else if (onOverflow) {
                selectedIndex.value = 0;
                onOverflow(false);
            }
        } else if (direction === 'right') {
            if (selectedIndex.value + 1 < listGetter().length) {
                selectedIndex.value++;
            } else if (onOverflow) {
                onOverflow(true);
            }
        } else if (direction === 'left') {
            if (selectedIndex.value != 0) {
                selectedIndex.value--;
            } else if (onOverflow) {
                onOverflow(false);
            }
        }
    }

    return arrowListener;
}

function composedArrowListener<T>(selectedIndex: Ref<number>,
                                  selectedSection: Ref<number>,
                                  arrowListenerBlueprint: { listGetter, colsPerRow? }[]) {
    const sectionCount = arrowListenerBlueprint.length;

    // finds next non-empty section in the given direction
    function findSection(direction: 'up' | 'down'): number {
        const diff = direction === 'up' ? -1 : 1;
        let section = selectedSection.value + diff;
        while (section != -1 && section != sectionCount) {
            if (arrowListenerBlueprint[section].listGetter().length != 0) {
                break;
            } else {
                section += diff;
            }
        }
        return section;
    }

    function onOverflow(toBottom: boolean) {
        if (toBottom) {
            const nextSection = findSection('down');
            if (nextSection < sectionCount) {
                selectedSection.value = nextSection;
                selectedIndex.value = 0;
            }
        } else {
            const prevSection = findSection('up');
            if (prevSection != -1) {
                selectedSection.value = prevSection;
                const lastIndexInSection = arrowListenerBlueprint[selectedSection.value].listGetter().length - 1;
                const colsPerRow = arrowListenerBlueprint[selectedSection.value].colsPerRow;
                selectedIndex.value = colsPerRow ? lastIndexInSection - (lastIndexInSection % colsPerRow) : lastIndexInSection;
            }
        }
    }

    const arrowListeners = arrowListenerBlueprint.map(e => {
        if (e.colsPerRow)
            return basicGridArrowListener(e.listGetter, selectedIndex, e.colsPerRow, onOverflow);
        return basicArrowListener(e.listGetter, selectedIndex, onOverflow);
    })


    function arrowListener(event, direction) {
        arrowListeners[selectedSection.value](event, direction);
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

export {basicAltListener, basicArrowListener, registerBasicScroll, basicGridArrowListener, composedArrowListener};
