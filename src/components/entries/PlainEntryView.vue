<template>
  <div class="preview">
    {{ entry.plainText }}
  </div>
  <div class="alternative">{{ entry.alternative }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { PlainEntry } from '@/classes/ClipboardEntry';

export default defineComponent({
  name: "PlainEntryView",
  props:{ entry: PlainEntry }
});
</script>

<style scoped>

</style>
