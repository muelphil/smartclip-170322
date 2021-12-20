<template>
  <div ref="preview"><img :src="src"/></div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { debounceQueryRef } from '@/utils/vueHelpers/debounceQueryRef';
import { MathEntry } from '@/classes/ClipboardEntry';

export default defineComponent({
  name: 'LatexPngPreview',
  props: {
    query: String,
    options: Object
  },
  emits: ['loading', 'update:query', 'error'],
  setup(props, {emit}) {
    const {
      debounced,
      loading: debounceLoading
    } = debounceQueryRef(() => props.query, val => emit('update:query', val), 400);
    const processing = ref(Boolean(props.query)); // initially loading iff query !== null
    const src = ref('');
    let val = null;
    let promise = null;
    const loading = computed(() => {
      return debounceLoading.value || processing.value;
    });
    watch(loading, (newVal) => {
      console.log('watch called! newVal=', newVal);
      emit('loading', newVal);
    }, {immediate: true});

    const pixelsPerEm = Number(props.options.previewFontSizeInPx);

    // invalidate on user input
    watch(() => props.query, () => promise = null);

    function onChange() {
      const newVal = debounced.value;
      val = newVal;
      if ( !newVal ) return; // do nothing on empty query
      processing.value = true;
      const tex = props.options.inputType === 'tex' ? newVal : window.services.math.asciiToLatex(newVal as string);
      promise = window.services.math.texToPngLatex(tex, {
        pixelsPerEm,
        color: props.options.previewColor,
        displayStyle: props.options.displayStyle
      });
      promise.then(pathToPng => {
        if ( newVal === val ) { // this checks if there was another call to onChange during computation and ignores the result if that is the case
          src.value = pathToPng;
          processing.value = false;
        }
      }).catch((errors: string[]) => {
        if ( newVal === val ) {
          processing.value = false;
          emit('error', 'Error while executing pdfLatex command, first error:' + errors[0]);
        }
      });
    }

    async function getMathEntry(): Promise<MathEntry> {
      if ( promise === null )
        throw 'please wait for preview completion before submitting';
      const pathToPng = await promise;
      processing.value = true;
      const tex = props.options.inputType === 'tex' ? props.query : window.services.math.asciiToLatex(props.query as string);
      const pathToPastePng = await window.services.math.texToPngLatex(tex, {
        pixelsPerEm: props.options.pastePixelHeightPerEm,
        color: props.options.pasteColor,
        displayStyle: props.options.displayStyle
      });
      const mathEntry = new MathEntry(props.query, {
        inputLanguage: props.options.inputType as 'ascii' | 'tex',
        preferredPaste: 'pdflatexpng',
        preferredPreview: 'pdflatex'
      });
      mathEntry.cache.pastePath = pathToPastePng;
      mathEntry.cache.previewPng = {
        pxPerEm: pixelsPerEm,
        path: pathToPng
      };
      processing.value = false;
      return mathEntry;
    }

    // todo also call if certain options change
    watch([
      debounced,
      () => props.options.inputType,
      () => props.options.displayStyle
    ], onChange);
    onChange();

    return {loading, processing, src, getMathEntry};
  }
});
</script>

<style scoped>

</style>
