import { customRef, ref, Ref, watch } from 'vue';

function debounceQueryRef<T>(getter: ()=> T, setter: (val: T) => void, delay = 200) {
    let timeout;
    let value = getter();
    let loading = ref(false);
    let instantlyPropagate = false;

    const debounced: Ref<T> = customRef((track, trigger) => {
        watch(getter, (newValue: T) => {
            clearTimeout(timeout);
            // instantly emit if query === '' or instantlyPropagate is turned on, which is used to instantly change
            // the query for purposes like clickable "did you mean..." entries, that instantly need to change the
            // query, as the debounce is only useful when the user is typying the query
            if ( !newValue || instantlyPropagate ) {
                instantlyPropagate = false;
                value = newValue;
                loading.value = false;
                trigger();
                return;
            }
            loading.value = true;
            timeout = setTimeout(() => {
                loading.value = false;
                value = newValue;
                trigger();
            }, delay);
        }, {immediate: false});

        return {
            get() {
                track();
                return value;
            },
            set(val) {/* ignored - read only */
                // instantly change the query, for purposes like "did you mean ..." with a clickable list of related queries
                instantlyPropagate = true;
                setter(val);
                // no trigger needed, as watch on query above will trigger and the debounced value hasn't changed yet
            }
        };
    });

    return {debounced, loading};
}

export {
    debounceQueryRef
};
