<template>
  <div>
    <template v-if="activeFunction">
      <h4>ActiveFunction</h4>
      <BasicEntryView>{{ activeFunction.name }}</BasicEntryView>
    </template>

    <h4>AvailableFunctions</h4>
    <template v-for="(f, index) in filteredFunctions">
      <BasicEntryView
          :position="index+1"
          :selected="index === selectedIndex"
      >
        {{ f.name }}
      </BasicEntryView>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, onUnmounted, ref } from 'vue';
import BasicEntryView from '@/components/entries/BasicEntryView.vue';
import { enumerate } from '@/plugins/funcs/enumerate';
import { bulkCopy } from '@/plugins/funcs/bulkcopy';
import { basicArrowListener } from '@/plugins/helpers';
import SCEventEmitter from '@/services/SCEventEmitter';
import FuncsService from '@/plugins/funcs/FuncsService';

export default defineComponent({
  name: 'FuncsView',
  components: {BasicEntryView},
  props: {
    service: FuncsService
  },
  setup(props) {
    const functions: { name: string, activate(onDeactivate: () => void) }[] = [bulkCopy, enumerate];

    const emitter: SCEventEmitter = inject<SCEventEmitter>('emitter');

    const selectedIndex = ref(0);

    const arrowListener = basicArrowListener(() => [1, 2, 3, 4], selectedIndex);

    function submit() {
      const functionToActivate = (props.service as FuncsService).filteredFunctions.value[selectedIndex.value];
      (props.service as FuncsService).activateFunction(functionToActivate);
      window.hide();
    }

    let listenersId = -1;
    onMounted(() => {
      listenersId = emitter.setListeners({
        'arrow': arrowListener,
        'submit': submit
      }, 'non-covered');
      // emitter.on('arrow', arrowListener);
      // emitter.on('submit', submit);
    });

    onUnmounted(() => {
      emitter.removeListener(listenersId);
    });

    return {
      functions,
      selectedIndex,
      filteredFunctions: (props.service as FuncsService).filteredFunctions,
      activeFunction: (props.service as FuncsService).activeFunction
    };
  }
});
</script>

<style scoped>

</style>
