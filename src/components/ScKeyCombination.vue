<template>
    <span class="shortcut">
        <template v-for="(key, index) in processedShortcut">
            <span class="keyboard-button">{{ key }}</span>
            <template v-if="index !== processedShortcut.length-1">+</template>
        </template>
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
const operatingSystem = require('os').platform;
export default defineComponent({
  name: 'ScKeyCombination',
  props: {
    shortcut: Array
  },
  setup(props) {

    function getSymbolForKey(key: string) {
      if ( key === 'Tab' ) {
        return 'Tab ⭾';
      } else if ( key === 'Meta' ) {
        if ( operatingSystem === 'darwin' ) {
          return 'Com ⌘';
        } else {
          return 'Win ⊞';
        }
      } else if ( key === 'Enter' ) {
        return 'Enter ↩'; // ↵
      } else if ( key === 'Shift' ) {
        return '⇧ Shift';
      } else if ( key.startsWith('Arrow') ) {
        switch (key.slice(6)) {
          case 'Up':
            return '↑';
          case 'Right':
            return '→';
          case 'Down':
            return '↓';
          case 'Left':
            return '←';
        }
      }
      return key;
    }

    const processedShortcut = (props.shortcut as []).map(getSymbolForKey);

    return {
      processedShortcut
    };
  }
});
</script>

<style scoped>

</style>
