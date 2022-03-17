<template>
  <div>
    TODOS StartView
    <ol>
      <li>Add Plugins</li>
      <li>Add Actions: shutdown, hibernate, sleep, lock</li>
      <li>Add Search and highlight</li>
      <li>implement actions on click/ submit</li>
      <li>icons for windows applications</li>
      <li>switch to window</li>
      <li>switch to open tab chrome</li>
    </ol>
    [files={{ files }}]
    <ScFilesInput v-model="files" :options="['openDirectory', 'dontAddToRecent']"></ScFilesInput>
    <!--    <div>counter={{ counter }}</div>-->
    <!--    <button @click="counter++">counter++</button>-->
    <!--    <div>uselessButton=[{{ uselessButton }}]</div>-->
    <!--    <div>bool=[{{ bool }}]</div>-->
    <!--    <button type="button" @click="bool=!bool">toggleBool</button>-->
    <!--&lt;!&ndash;    <ScPaddedLoader :mode="bool ? 'loading' : 'keyboard-input'"></ScPaddedLoader>&ndash;&gt;-->
    <!--    radioVal=[{{ radioVal }}]-->
    <!--&lt;!&ndash;    <sc-radio-group label="twentyseven" v-model="radioVal" :options="radioOptions"></sc-radio-group>&ndash;&gt;-->
    <!--    <div>\sum^\infty_3 x^2+\frac12</div>-->
    <!--&lt;!&ndash;    <test-child max="20" test="30" other="40"></test-child>&ndash;&gt;-->

    <!--    <pre><code class="hljs">let i = 0; i += 27; console.log(i)</code></pre>-->

    <!--    <div class="one"><div class="two">Test</div></div>-->
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, toRef} from 'vue';
import ScRadioGroup from '@/components/form/ScRadioGroup.vue';
import ScTrash from '@/components/icons/ScTrash.vue';
import TestChild from '@/plugins/test/TestChild.vue';
import {remote} from "electron";
import ScFilesInput from "@/components/form/ScFilesInput.vue";

const dialog = remote.dialog

export default defineComponent({
  name: 'TestView',
  props: {
    query: String,
    service: Object,
    settings: Object
  },
  components: {ScFilesInput, TestChild, ScTrash, ScRadioGroup},
  setup(props) {
    const bool = ref(true);
    const uselessButton = toRef(props.settings, 'uselessButton'); // = props.setting.uselessButton will not be reactive!

    const radioVal = ref('');
    const radioOptions = new Map([['blue', 'Blau'], ['black', 'Schwarz'], ['red', 'Rot']]);

    const files = ref([]);

    function click() {

    }

    return {counter: props.service.counter, uselessButton, bool, radioVal, radioOptions, click, files};
  }
});
</script>

<style scoped lang="scss">

</style>
