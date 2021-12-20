<template>
  <img src="@/extraResources/icons/code.svg" class="entry-image-icon"/>
  <div class="preview code">
    <code v-html="highlighted" class="hljs"></code>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { CodeEntry } from '@/classes/ClipboardEntry';

const hljs = require('highlight.js');

export default defineComponent({
  name: 'CodeEntryView',
  props: {
    entry: {
      type: Object // CodeEntry
    }
  },
  setup(props) {
    const highlighted = hljs.highlightAuto(props.entry.plainText).value;
    return {highlighted};
  }
});
</script>

<style scoped>
</style>
