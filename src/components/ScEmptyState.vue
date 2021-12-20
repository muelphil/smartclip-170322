<template>
  <div class="empty-state">
    <slot>
      Nothing found
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ScEmptyState',
  props: {
    type: String, // TODO : nothing found, nothing there in the first place
    message: String
  }
});
</script>

<style scoped>

</style>
