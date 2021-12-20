<template>
    <template v-for="(key, index) in value">
        <span class="keyboard-button">{{key}}</span>
        <template v-if="index !== value.length-1"> + </template>
    </template>
</template>

<script lang="ts">
    export default {
        name: "ScKeyboardCombination",
        props:['value']
    }
</script>

<style scoped>
</style>
