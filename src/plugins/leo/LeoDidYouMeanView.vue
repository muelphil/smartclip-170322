<template>
  <div>
    <template v-if="!didYouMean.length">
      Your query could not be matched to a result. Please change your query.
    </template>
    <template v-else>
      Your query could not be matched to a result. Please select one of the similar queries below or change your
      query.
      <h3>Did you mean ...</h3>
      <BasicEntryView v-for="(option,index) in didYouMean"
                      :position="index+1"
                      :selected="index === selectedIndex"
      >{{ option }}
      </BasicEntryView>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, onUnmounted, ref } from 'vue';
import { basicAltListener, basicArrowListener } from '@/plugins/helpers';
import BasicEntryView from '@/components/entries/BasicEntryView.vue';
import SCEventEmitter from '@/services/SCEventEmitter';

export default defineComponent({
  name: 'LeoDidYouMeanView',
  props: {didYouMean: Array},
  components: {BasicEntryView},
  emits: ['change-query'],
  setup(props, {emit}) {
    const selectedIndex = ref(0);

    //TODO !!!
    const emitter = inject<SCEventEmitter>('emitter');
    const arrowListener = basicArrowListener(() => (props.didYouMean as []), selectedIndex);
    const altListener = basicAltListener(() => (props.didYouMean as []), index => submitListener(index));

    function submitListener(index?) {
      if ( index === undefined ) {
        index = selectedIndex.value;
      }
      if ( index < (props.didYouMean as []).length ) {
        emit('change-query', props.didYouMean[index]);
      }
    }

    let listenersId = -1;
    if ( (props.didYouMean as []).length !== 0 ) {
      onMounted(() => {

        listenersId = emitter.setListeners({
          'arrow': arrowListener,
          // INFO: () => submitListener() prevents that the submitListener receives the event as first argument
          'submit': () => submitListener(),
          'alt-select': altListener
        }, 'non-covered');

        // emitter.on('arrow', arrowListener);
        // emitter.on('alt-select', altListener);
        // emitter.on('submit', (_event) => submitListener());
      });

      onUnmounted(() => {
        emitter.removeListener(listenersId);
      });

    }

    return {selectedIndex};
  }
});
</script>

<style scoped>

</style>
