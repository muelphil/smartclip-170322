<template>
  <div style="margin: 8px;">
    <BasicEntryView v-for="(plugin, index) in plugins" :position="index+1">
      <div style="flex-direction: column">
        {{ plugin.id }}
        <h3>{{ plugin.prefixDisplay }}</h3>
        {{plugin.description}}
      </div>
    </BasicEntryView>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BasicEntryView from '@/components/entries/BasicEntryView.vue';
import { allPlugins } from '@/plugins/plugins';

export default defineComponent({
  name: 'StartView',
  components: {BasicEntryView},
  setup(props) {
    return {plugins: allPlugins};
  }
});
</script>

<style scoped>

</style>
