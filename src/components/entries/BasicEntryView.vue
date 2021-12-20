<template>
    <div class="clipboard-entry-container" v-bind:class="{'selected':selected}">
        <div class="index"><span>{{position}}</span></div>
        <div class="preview">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'BasicEntryView',
        props: {
            selected: Boolean,
            position: Number
        },
        setup(){
        }
    });
</script>

<style scoped>


</style>

