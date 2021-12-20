<template>
    <div class="lds-ellipsis" ref="container">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, ref, watch } from 'vue';

    /*
    * TODO: This might get smoother if programmatically changing animation iteration count from infinite to once, then
    * switching the animation
    * */

    export default defineComponent({
        name: 'ScLoader',
        props: {
            mode: {
                type: String,
                required: true,
                default: 'loading'
                // validator: function (value) { // TODO
                //     return value === 'loading' || value === 'keyboard-input';
                // }
            }
        },
        setup(props) {
            const container = ref(null);

            onMounted(() => {
                container.value.classList.add(props.mode);
            });

            let listener: (() => void) = null;
            // this does not work for rapidly switching between the animations, which isn't supposed to happen
            watch(() => props.mode, (newVal: string, oldVal: string) => {
                listener = () => {
                    container.value.classList.remove(oldVal);
                    container.value.classList.add(newVal);
                };
                container.value.addEventListener('animationiteration', listener, {once: true});
            });

            return {container};
        }
    });
</script>
