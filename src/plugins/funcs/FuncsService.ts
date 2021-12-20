import { computed, ref } from 'vue';
import { enumerate } from '@/plugins/funcs/enumerate';
import { bulkCopy } from '@/plugins/funcs/bulkcopy';

export default class FuncsService {

    functions: { name: string, activate(onDeactivate: () => void) }[] = [bulkCopy, enumerate];
    deactivate = null;

    activeFunction = ref(null);
    getter = (() => {
        return this.functions.filter(e => e !== this.activeFunction.value);
    }).bind(this);
    filteredFunctions = computed(this.getter);

    activateFunction(func) {
        if ( this.deactivate )
            this.deactivate();
        this.activeFunction.value = func;
        this.deactivate = func.activate(() => {
            this.activeFunction.value = null;
            this.deactivate = null;
        });
    }

}
