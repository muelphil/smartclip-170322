import {watch} from 'vue'

function watchOnce(arg1: any, handler: (newVal, oldVal) => void): () => void {
    const stop = watch(arg1, (...args) => {
        // @ts-ignore // ts cant possibly know of how many arguments ...args consists, but shows an error
        handler(...args);
        stop();
    });
    return stop;
}

export {watchOnce}
