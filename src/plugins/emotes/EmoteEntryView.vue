<template functional>
    <div class="clipboard-entry-container" v-bind:class="{'selected':selected}">
        <div class="index"><span>{{position}}</span></div>
        <div class="preview emote">{{entry.plainText}}</div>
        <div class="preview emotename ">{{entry.name}}</div>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from "vue";
    // import {EmoteEntry} from "@/plugins/emotes/EmoteEntry";

    export default defineComponent({
        name: "EmoteEntryView",
        props: {
            // entry: EmoteEntry, TODO
            selected: Boolean,
            position: Number
        }
    });

</script>

<style scoped>

    .preview.emote {
        flex: 0 0 auto;
        font-size: 22px;
    }

    .preview.emotename {
        color: var(--textcolor-secondary)
    }

</style>

