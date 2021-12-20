<template>
    <div>
        <BasicEntryView v-if="result">{{result}}</BasicEntryView>
        <ScEmptyState v-else class="no-entries-found">Start typing to get an echo of it!</ScEmptyState>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent } from 'vue';
    import BasicEntryView from '@/components/entries/BasicEntryView.vue';
    import ScEmptyState from '@/components/ScEmptyState.vue';

    export default defineComponent({
        name: 'EchoView',
        props: {
            query: String,
            service: Object
        },
        components: {ScEmptyState, BasicEntryView},
        setup(props) {
            const result = computed(() => {
                return props.query ? props.query : null;
            });

            return {result};
        }
    });
</script>

<style scoped>

</style>
