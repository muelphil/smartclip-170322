<template>
  <div class="clipboard-entry-container icon-entry" :class="{'selected': selected}">
    <i class="material-icons" :class="icon"></i>
  </div>
</template>

<script lang="ts">

  // TODO rename; is the component for [  v  ] (expand more) in leo result view

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IconEntryView',
  props: ['icon', 'selected']
});
</script>

<style scoped>

</style>
