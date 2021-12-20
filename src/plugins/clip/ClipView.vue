<template>
    <ClipActions v-if="entryForActions" :entry="entryForActions" @actions:disable="entryForActions=null"></ClipActions>
    <ClipResults v-else :query="query" @actions="entryForActions=$event"></ClipResults>
</template>

<script lang="ts">
    import { computed, defineComponent, onMounted, onUnmounted, Ref, ref, watch, inject } from 'vue';
    import {ClipboardEntry} from '@/classes/ClipboardEntry';
    import ClipboardEntryView from '@/components/entries/ClipboardEntryView.vue';
    import { registerBasicScroll } from '@/plugins/helpers';
    import { EventEmitter } from 'events';
    import ClipActions from '@/plugins/clip/ClipActions.vue';
    import ClipResults from '@/plugins/clip/ClipResults.vue';

    const win = require('electron').remote.getCurrentWindow();

    export default defineComponent({
        name: 'ClipView',
        components: {ClipboardEntryView, ClipResults, ClipActions},
        props: {
            query: String,
            settings: Object
        },
        setup(props) {
            const entryForActions = ref(null);

            return {entryForActions};
        }
    });
</script>

<style scoped>

</style>
