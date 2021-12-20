<template>
  <div class="margin-container">
    <h1>Actions...</h1>
    <BasicEntryView
        v-for="(action, index) of actions"
        :position="index+1"
        :selected="index === selectedIndex">
      {{ description(action, entry) }}
    </BasicEntryView>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, onUnmounted, ref } from 'vue';
import { ClipboardEntry } from '@/classes/ClipboardEntry';
import BasicEntryView from '@/components/entries/BasicEntryView.vue';
import { basicAltListener, basicArrowListener } from '@/plugins/helpers';
import SCEventEmitter from '@/services/SCEventEmitter';

export default defineComponent({
  name: 'ClipActions',
  components: {BasicEntryView},
  props: {entry: Object},
  setup(props, {emit}) {
    const emitter = inject<SCEventEmitter>('emitter');
    const selectedIndex = ref(0);
    const actionService = window.services.actions;
    const actions = actionService.getActionsForEntry(props.entry as ClipboardEntry);

    function done() {
      emit('actions:disable');
    }

    function submit(index = selectedIndex.value) {
      const action = actions[index];
      action.performAction(props.entry, done);
    }

    onMounted(() => {
      emitter.on('arrow', basicArrowListener(() => actions, selectedIndex))
          .on('submit', () => submit())
          .on('alt-select', basicAltListener(() => actions, submit));
    });

    onUnmounted(() => {
      emitter.removeAllListeners();
    });

    return {actions, description: actionService.getActionDescription, selectedIndex};
  }
});
</script>

<style scoped>

</style>
