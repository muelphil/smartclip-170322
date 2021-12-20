<template>
  <div ref="container">
    <div v-for="(section, sectionIndex) in results">
      <h3>{{ section.title }}</h3>
      <div class="clipboard-entries-container">
        <BasicEntryView
            v-for="(translation, index) in section.results"
            :selected="sectionIndex === selectedSectionIndex && index === selectedIndex"
            :position="cumulativeIndices[sectionIndex]+index+1"
            class="translation"
        >
          <div v-html="translation.html"></div>
        </BasicEntryView>
        <template v-if="section.moreAvailable">
          <IconEntryView
              icon="expand_more"
              :selected="sectionIndex === selectedSectionIndex && section.results.length === selectedIndex"
          ></IconEntryView>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import TranslationEntryView from '@/plugins/leo/TranslationEntryView.vue';
import BasicEntryView from '@/components/entries/BasicEntryView.vue';
import IconEntryView from '@/components/entries/IconEntryView.vue';
import SCEventEmitter from '@/services/SCEventEmitter';

export default defineComponent({
  name: 'LeoResultView',
  props: {
    results: Object,
    query: String
  },
  components: {TranslationEntryView, BasicEntryView, IconEntryView},
  setup(props) {
    const emitter = inject<SCEventEmitter>('emitter');
    const container = ref(null);
    const selectedSectionIndex = ref(0);
    const selectedIndex = ref(0);
    const maxIndex = (section) => section.results.length - 1 + (section.moreAvailable ? 1 : 0);
    const cumulativeIndices = computed(() => {
      const results = [];
      results.push(0); // first sections starts at 0
      for (let index = 0; index < props.results.length - 1; index++) {
        const previous = results[results.length - 1];
        results.push(previous + maxIndex(props.results[index]) + 1); // +1 because it describes the index to start from of the *next* section
      }
      return results;
    });

    function arrowListener(event: KeyboardEvent, direction: String) {
      if ( direction === 'down' ) {
        const selectedSection = props.results[selectedSectionIndex.value];
        if ( selectedIndex.value + 1 <= maxIndex(selectedSection) ) {
          selectedIndex.value++;
        } else if ( selectedSectionIndex.value + 1 < props.results.length ) {
          selectedIndex.value = 0;
          selectedSectionIndex.value++;
        }
      } else if ( direction === 'up' ) {
        if ( selectedIndex.value != 0 ) {
          selectedIndex.value--;
        } else if ( selectedSectionIndex.value !== 0 ) {
          selectedSectionIndex.value--;
          const newSelectedSection = props.results[selectedSectionIndex.value];
          selectedIndex.value = maxIndex(newSelectedSection);
        }
      }
    }

    function altListener(event) {
      if ( event.code.startsWith('Digit') ) {
        const digit: number = +event.key;
        if ( digit == 0 ) return;
        const index = digit - 1;
        const sectionIndex = cumulativeIndices.value.findIndex(e => index >= e);
        const sectionOffset = cumulativeIndices.value[sectionIndex];
        submitListener(sectionIndex, index - sectionOffset);
      }
    }

    function submitListener(sectionIndex?, index?) {
      if ( sectionIndex === undefined ) {
        sectionIndex = selectedSectionIndex.value;
        index = selectedIndex.value;
      }
      const selectedSection = props.results[sectionIndex];
      if ( index < selectedSection.results.length ) {
        const selectedEntry = selectedSection.results[index];
        window.services.clipboard.pasteRich(selectedEntry.translation, {alternative: props.query as string});
      } else { // == load more
        selectedSection.loadMore();
      }
    }

    watch(selectedIndex, () => {
      nextTick(() => {
        if ( selectedSectionIndex.value === 0 && selectedIndex.value === 0 ) {
          container.value.parentNode.scrollTo(0, 0);
        } else {
          const el = container.value.querySelector('.selected');
          (el as any).scrollIntoViewIfNeeded(true); // compatibility: chrome only!
        }
      });
    });

    let listenersId = -1;
    onMounted(() => {
      listenersId = emitter.setListeners( {
        'arrow': arrowListener,
        // INFO: () => submitListener() prevents that the submitListener receives the event as first argument
        'submit': () => submitListener(),
        'alt-select': altListener
      }, 'non-covered');
      // emitter.on('arrow', arrowListener);
      // emitter.on('submit', () => submitListener());
      // emitter.on('alt-select', altListener);
    });

    onUnmounted(() => {
      emitter.removeListener(listenersId);
    });

    return {
      selectedSectionIndex,
      selectedIndex,
      cumulativeIndices,
      maxIndex,
      container
    };
  }
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
</style>
