<template>
  <div>
    <div class="options-group-container">
      <!--      <button @click="click">click</button>-->
      <sc-radio-group @change="optionsChanged(0)"
                      v-model="userOptions.inputType"
                      label="Input-Type"
                      group-name="input-type"
                      :options="new Map([[InputType.Latex, 'Latex'], [InputType.AsciiMath, 'AsciiMath']])"
      ></sc-radio-group>

      <sc-radio-group @change="optionsChanged(2)"
                      v-model="userOptions.processingMethod"
                      label="Processing-Method"
                      group-name="processing-method"
                      :options="new Map([[ProcessingMethod.Latex, 'Latex'], [ProcessingMethod.MathJax, 'MathJax']])"
      ></sc-radio-group>

      <sc-radio-group @change="optionsChanged(1)"
                      v-model="userOptions.outputType"
                      label="Output-Type"
                      group-name="output-type"
                      :options="new Map([[OutputType.Png, 'Png'], [OutputType.Svg, 'Svg']])"
      ></sc-radio-group>
    </div>
    <!-- TODO options for displaystyle, paste resolution -->

    <sc-color-picker v-model="userOptions.pasteColor" :color-options="colorOptions">paste color:</sc-color-picker>

    <!--    TODO -->
    loading=[{{ loading }}],paste resolution
    <label><input type="radio" value="20" name="paste-resolution" v-model="userOptions.pastePixelHeightPerEm"/>
      very low (20px/em)
    </label>
    <label><input type="radio" value="20" name="paste-resolution" v-model="userOptions.pastePixelHeightPerEm"/>
      low (100px/em)
    </label>
    <label><input type="radio" value="200" name="paste-resolution" v-model="userOptions.pastePixelHeightPerEm"/>medium
      (200px/em)</label>
    <label><input type="radio" value="1000" name="paste-resolution" v-model="userOptions.pastePixelHeightPerEm"/>high
      (1000px/em)</label>

    <label><input type="checkbox" v-model="userOptions.displayStyle"/>displaystyle</label>
    <div class="math-preview" :style="{'min-height':options.previewFontSizeInPx+'px'}">
      <div class="math-loader-wrapper" v-if="loading">
        <ScLoader></ScLoader>
      </div>
      <div class="math-error-wrapper" v-if="errorMessage">{{ errorMessage }}</div>
      <component
          v-show="query !== ''"
          ref="previewComponent"
          :is="previewComponentId"
          :query="query"
          :options="options"
          @loading="REMOVEMEtakeLoading($event)"
          @error="errorMessage = $event"
      ></component>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import LatexPngPreview from '@/plugins/math/LatexPngPreview.vue';
import MathJaxPreview from '@/plugins/math/MathJaxPreview.vue';
import SCEventEmitter from '@/services/SCEventEmitter';
import ScRadioGroup from '@/components/form/ScRadioGroup.vue';
import ScColorPicker from '@/components/form/ScColorPicker.vue';
import ScLoader from '@/components/ScLoader.vue';
import { settings } from '@/plugins/settings';

export default defineComponent({
  name: 'MathView',
  components: {ScLoader, ScColorPicker, ScRadioGroup, LatexPngPreview, MathJaxPreview},
  props: {
    query: String,
    settings: Object
  },
  setup(props) {
    const emitter = inject<SCEventEmitter>('emitter');
    const previewComponent = ref(null);
    const colorOptions = settings.math.colorOptions;

    enum InputType {Latex = 'tex', AsciiMath = 'ascii'}

    enum OutputType { Png = 'png', Svg = 'svg', Unicode = 'unicode', Latex = 'latex'}

    enum ProcessingMethod {Latex = 'tex', MathJax = 'jax', None = 'none'}

    const validOptions = [
      [InputType.Latex, OutputType.Png, ProcessingMethod.Latex],
      [InputType.Latex, OutputType.Png, ProcessingMethod.MathJax],
      [InputType.Latex, OutputType.Svg, ProcessingMethod.MathJax],
      [InputType.AsciiMath, OutputType.Png, ProcessingMethod.Latex],
      [InputType.AsciiMath, OutputType.Png, ProcessingMethod.MathJax],
      [InputType.AsciiMath, OutputType.Svg, ProcessingMethod.MathJax],
      // TODO
      // [InputType.Latex, OutputType.Unicode, ProcessingMethod.None],
      // [InputType.AsciiMath, OutputType.Unicode, ProcessingMethod.None],
      // [InputType.AsciiMath, OutputType.Latex, ProcessingMethod.None]
    ];

    const loading = ref(false);
    const errorMessage = ref(null);

    const userOptions = reactive({
      pasteColor: '#000000',
      pastePixelHeightPerEm: 200,
      inputType: InputType.Latex,
      outputType: OutputType.Svg,
      processingMethod: ProcessingMethod.MathJax,
      displayStyle: false // TODO
    });

    const applicationOptions = reactive({
      previewColor: window.services.global.textcolorPrimary,
      previewFontSizeInPx: 40
    });

    const options = computed(() => ({...userOptions, ...applicationOptions}));

    const saved = JSON.parse(localStorage.getItem('math.options'));
    if ( saved ) {
      try {
        Object.assign(userOptions, saved);
      } catch {
        console.info('could not load previous math options state');
      }
    }
    const previewComponentId = ref(getPreviewComponentId());

    function getPreviewComponentId(): 'latex-png-preview' | 'math-jax-preview' {
      // if ( outputType.value === OutputType.Latex ) return 'ascii2tex';
      // if ( outputType.value === OutputType.Unicode ) return 'unicode';
      if ( userOptions.processingMethod === ProcessingMethod.MathJax ) return 'math-jax-preview';
      if ( userOptions.processingMethod === ProcessingMethod.Latex ) return 'latex-png-preview';
    }

    // function texToUnicode(tex: string) {
    //   return service.texToUnicode(
    //       inputType.value === InputType.Latex
    //           ? props.query
    //           : service.asciiToLatex(props.query, false));
    // }

    function submit() {
      if ( !props.query )
        return;
      previewComponent.value.getMathEntry().then(entry => {
        window.services.clipboard.pasteEntry(entry);
      });
    }

    let listenersId = -1;

    onMounted(() => {
      // emitter.on('submit', () => submit());
      listenersId = emitter.setListeners({'submit': () => submit()}, 'non-covered');
    });

    onUnmounted(() => {
      // emitter.removeAllListeners();
      emitter.removeListener(listenersId);
    });

    // let previewMethod = getPreviewMethod();
    // onMounted(() => previewMethod()); don't call this, the query will be empty at mount, no reason to call it

    watch(() => props.query, () => {
      errorMessage.value = null;
    });

    function calculateDistance(newValues, option, mustMatchIndex?): number {
      let distance: number = 0;
      for (let index in newValues) {
        if ( +index === mustMatchIndex ) { // index is of type string in for..in loops :(
          if ( newValues[index] !== option[index] ) {
            distance = Number.MAX_SAFE_INTEGER;
            break;
          }
        }
        distance += +(newValues[index] !== option[index]); // add 1 if they are not equal
      }
      return distance;
    }

    function optionsChanged(indexOfChanged: number) {
      let newValues = [userOptions.inputType, userOptions.outputType, userOptions.processingMethod];
      if ( validOptions.indexOf(newValues) === -1 ) {
        const distances: number[] = [];
        for (let index in validOptions) {
          const option = validOptions[index];
          distances[index] = calculateDistance(newValues, option, indexOfChanged);
        }
        const min = Math.min(...distances);
        const indexOfMin = distances.findIndex(e => e === min);
        newValues = validOptions[indexOfMin];
        Object.assign(options, {
          inputType: (newValues[0] as InputType),
          outputType: (newValues[1] as OutputType),
          processingMethod: (newValues[2] as ProcessingMethod)
        });
      }
      loading.value = false;
      setTimeout(() => previewComponentId.value = getPreviewComponentId(), 0);
    }

    watch(options, () => {
          localStorage.setItem('math.options', JSON.stringify(options['_value']));
        }
    );

    const inputTypeString = computed(() => {
      return userOptions.inputType === InputType.Latex ? 'tex' : 'ascii';
    });

    function click() {
      console.log(JSON.stringify(options));
      console.log(options);
    }

    function REMOVEMEtakeLoading(val) { // TODO
      console.log('loading event happened, val=', Boolean(val));
      loading.value = Boolean(val);
    }

    return {
      REMOVEMEtakeLoading,
      previewComponent,
      optionsChanged,
      userOptions,
      options,
      loading,
      inputTypeString,
      previewComponentId,
      colorOptions,
      InputType,
      OutputType,
      ProcessingMethod,
      errorMessage,
      click
    };
  }
});
</script>

<style>
g[data-mml-node="merror"] > rect[data-background] {
  fill: transparent !important;
  stroke-width: 40;
  stroke: var(--error);
}

g[data-mml-node="merror"] > g {
  fill: var(--error);
  stroke: var(--error);

}

.mathpreview {
  font-size: 22px;
  padding: 8px;
  border: 1px solid white;
  display: flex;
  justify-content: center;
}

.options-group-container {
  display: flex;
  flex-direction: row;
}

.options-group:not(:last-of-type) {
  margin-right: 16px;
}

</style>
