<template>
  <div>
    <div>counter={{ counter }}</div>
    <button @click="counter++">counter++</button>
    <div>uselessButton=[{{ uselessButton }}]</div>
    <div>bool=[{{ bool }}]</div>
    <button type="button" @click="bool=!bool">toggleBool</button>
<!--    <ScPaddedLoader :mode="bool ? 'loading' : 'keyboard-input'"></ScPaddedLoader>-->
    radioVal=[{{ radioVal }}]
<!--    <sc-radio-group label="twentyseven" v-model="radioVal" :options="radioOptions"></sc-radio-group>-->
    <div>\sum^\infty_3 x^2+\frac12</div>
<!--    <test-child max="20" test="30" other="40"></test-child>-->

    <pre><code class="hljs">let i = 0; i += 27; console.log(i)</code></pre>

    <div class="one"><div class="two">Test</div></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRef } from 'vue';
import ScRadioGroup from '@/components/form/ScRadioGroup.vue';
import ScTrash from '@/components/icons/ScTrash.vue';
import TestChild from '@/plugins/test/TestChild.vue';

export default defineComponent({
  name: 'TestView',
  props: {
    query: String,
    service: Object,
    settings: Object
  },
  components: {TestChild, ScTrash, ScRadioGroup},
  setup(props) {
    console.dir(props);
    const bool = ref(true);
    const uselessButton = toRef(props.settings, 'uselessButton'); // = props.setting.uselessButton will not be reactive!

    const radioVal = ref('');
    const radioOptions = new Map([['blue', 'Blau'], ['black', 'Schwarz'], ['red', 'Rot']]);
    return {counter: props.service.counter, uselessButton, bool, radioVal, radioOptions};
  }
});
</script>

<style scoped lang="scss">

</style>
