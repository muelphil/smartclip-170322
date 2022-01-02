<template>
  <div class="sc-form-field">
    <div class="label">
      <slot></slot>
    </div>
    <div v-if="!inputActive" class="combination-wrapper">
      <div class="combination">
        <sc-keyboard-combination :value="modelValue"></sc-keyboard-combination>
      </div>
      <button @click="showInput" type="button" class="sc-button primary">Change</button>
    </div>

    <template v-else>
      <div class="obscurer" @click="cancelInput"></div>
      <div>
        <div class="combination-wrapper combination-input" tabindex="-1" ref="input" @keydown.prevent="onKeydown">
          <div class="new-hotkey">
            <template v-show="!hotkey">Start typing to enter Hotkey...</template>
<!--            <template v-show="hotkey">-->
              <sc-keyboard-combination :value="hotkey"></sc-keyboard-combination>
<!--            </template>-->
            {{hotkey}}
          </div>
          <div class="button-group">
            <button @click="submitInput" type="button" class="sc-button primary" :disabled="!isHotkeyValid">Submit
            </button>
            <button @click="cancelInput" type="button" class="sc-button">Cancel</button>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script lang="ts">

import {nextTick} from 'vue';
import ScKeyboardCombination from '@/components/ScKeyboardCombination.vue';

export default {
  name: 'ScHotkey',
  components: {ScKeyboardCombination},
  props: {
    modelValue: Array
  },
  data() {
    return {
      inputActive: false,
      hotkey: []
    };
  },
  computed: {
    isHotkeyValid() {
      return this.hotkey.filter(e => !['Ctrl', 'Alt', 'Shift'].includes(e)).length != 0; // TODO
    }
  },
  methods: {
    async showInput() {
      this.hotkey = [];
      this.inputActive = true;
      await nextTick();
      this.$refs.input.focus();
    },
    onKeydown($event) {
      this.hotkey = this.toKeyArray($event);
    },
    cancelInput() {
      this.inputActive = false;
    },
    submitInput() {
      this.$emit('update:modelValue', this.hotkey);
      this.inputActive = false;
    },
    toKeyArray(event: KeyboardEvent) {
      let res = [];
      if (event.ctrlKey || event.key == 'Control') {
        res.push('Ctrl');
      }
      if (event.altKey || event.key == 'Alt') {
        res.push('Alt');
      }
      if (event.shiftKey || event.key == 'Shift') {
        res.push('Shift');
      }
      if (!['Control', 'Alt', 'Shift'].includes(event.key)) {
        res.push(event.key);
      }
      return res; // TODO this will be a problem if + is used as a key of the keycombination
    }
  }
};
</script>

<style scoped>

</style>
