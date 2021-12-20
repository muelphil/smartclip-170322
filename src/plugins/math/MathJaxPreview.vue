<template>
  <div ref="preview"
       class="mathjax-preview"
       :style="{'font-size': options.previewFontSizeInPx + 'px'}"
       v-html="svgNode"
  ></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref, watch } from 'vue';
import { MathEntry } from '@/classes/ClipboardEntry';

export default defineComponent({
  name: 'MathJaxPreview',
  props: {
    query: String,
    options: Object
  },
  emits: ['error'],
  setup(props, {emit}) {
    const preview = ref(null);
    const svgNode: Ref<SVGElement> = ref(null);

    let promise: Promise<SVGElement> = null;

    function onChange() {
      promise = window.services.math.renderMathJaxToSvg(
          props.query as string,
          props.options.inputType as 'ascii' | 'tex',
          props.options.displayStyle
      );
      promise.then(svgNode => {
        preview.value.textContent = '';
        preview.value.appendChild(svgNode);
      }).catch(err => emit('error', err));
    }

    async function getMathEntry(): Promise<MathEntry> {
      let svgNode = await promise;
      const preferredPaste = props.options.outputType === 'png' ? 'mathjaxpng' : 'mathjaxsvg';
      const mathEntry = new MathEntry(props.query, {
        inputLanguage: props.options.inputType as 'tex' | 'ascii',
        preferredPreview: 'mathjax',
        preferredPaste: preferredPaste
      });
      mathEntry.cache.previewSvg = svgNode;
      if ( props.options.outputType === 'png' ) {
        const pngPath = await window.services.math.saveMathjaxSvgToPng(svgNode, {
          color: props.options.pasteColor,
          pixelsPerEm: props.options.pastePixelHeightPerEm
        });
        mathEntry.cache.pastePath = pngPath;
      } else { // svg
        const svgPath = await window.services.math.saveMathJaxSvgToFile(svgNode, props.options.pasteColor);
        mathEntry.cache.pastePath = svgPath;
      }
      return mathEntry;
    }

    onMounted(() => onChange());
    watch([() => props.query, () => props.options.inputType, ()=> props.options.displayStyle], onChange);
    return {preview, svgNode, getMathEntry};
  }
});
</script>

<style scoped>


</style>
