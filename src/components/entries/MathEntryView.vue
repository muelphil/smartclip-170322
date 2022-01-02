<template>
  <img src="@/extraResources/icons/math.svg" class="entry-image-icon"/>
  <div class="preview">
    <div v-if="!loaded || isInvalid">
      <!--      TODO loading spinner ? -->
      <div v-if="isInvalid">invalid! -</div>
      {{ entry.plainText }}
    </div>
    <!--    entry.cache.previewPng.path=[{{entry.cache?.previewPng?.path}}]-->
    <div v-show="loaded" ref="preview" style="display: flex" :style="'font-size:' + previewFontSizeInPx + 'px'"></div>
  </div>
</template>

<script lang="ts">
import {computed, ComputedRef, defineComponent, onMounted, ref} from 'vue';
import {MathEntry} from '@/classes/ClipboardEntry';
import {settings} from '@/plugins/settings';

export default defineComponent({
  name: 'MathEntryView',
  props: {
    entry: Object // MathEntry
  },
  setup(props) {
    console.debug('[MathEntryView]::setup', props.entry)
    const isInvalid = computed({
      get() {
        return props.entry.cache.isInvalid;
      },
      set(val: boolean) {
        props.entry.cache.isInvalid = val;
      }
    });
    const loaded = ref(false);
    const preview = ref(null);
    const previewFontSizeInPx = settings.base.mathPreviewFontSize;
    const method = props.entry.data.preferredPreview || 'mathjax';

    onMounted(async function () {
      console.debug('[MathEntryView]::onMounted, entry=', props.entry)
      if (!isInvalid.value) {
        if (method === 'mathjax') {
          if (props.entry.cache.previewSvg) {
            preview.value.appendChild(props.entry.cache.previewSvg);
          } else {
            console.warn('[MathEntryView] math was not cached, need to build svg');
            try {
              const svgNode = await window.services.math.renderMathJaxToSvg(props.entry.plainText, 'tex');
              props.entry.cache.previewSvg = svgNode;
              preview.value.appendChild(svgNode);
            } catch {
              isInvalid.value = true;
            }
          }
        } else if (method === 'pdflatex') {
          const previewPng = props.entry.cache.previewPng;
          if (previewPng?.path) {
            const pxPerEm = previewPng.pxPerEm;
            const scaleFactor = (pxPerEm / previewFontSizeInPx).toFixed(3) + 'x';
            console.warn('math was taken from cache');
            preview.value.innerHTML = `<img srcset="${props.entry.cache.previewPng.path} ${scaleFactor}"/>`;
          } else {
            try {
              const pathToPng = await window.services.math.texToPngLatex(props.entry.plainText, {
                pixelsPerEm: previewFontSizeInPx * 2,
                color: window.services.global.textcolorPrimary
              });
              props.entry.cache.previewPng = {path: pathToPng, pxPerEm: previewFontSizeInPx * 2};
              const scaleFactor = '2x';
              preview.value.innerHTML = `<img srcset="${props.entry.cache.previewPng.path} ${scaleFactor}"/>`;
            } catch {
              isInvalid.value = true;
            }
          }
        }
      }
      loaded.value = true;
    });

    return {
      method, isInvalid, preview, loaded, previewFontSizeInPx
    };

  }
});
</script>

<style scoped>

</style>
