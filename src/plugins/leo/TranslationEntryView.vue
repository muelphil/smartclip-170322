<template>
    <div class="clipboard-entry-container translation" v-bind:class="{'selected':selected}">
        <div class="index"><span>{{position}}</span></div>
        <div class="preview" v-html="html"></div>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from "vue";

    export default defineComponent({
        name: "TranslationEntryView",
        props: {
            html: String,
            selected: Boolean,
            position: Number
        }
    });
</script>

<style>

</style>
