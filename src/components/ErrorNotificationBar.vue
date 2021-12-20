<template>
  <div v-if="error" class="error-toast-container" style="animation-duration: 100s;" ref="container" @animationend="onAnimationEnd">
    <div class="error-toast">ERROR #{{ errorCount }}: {{ error }}</div>
    <span class="open-logs clickable" @click="showLogFile">Show Log-File</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { remote, shell } from 'electron';

export default defineComponent({
  name: 'ErrorNotificationBar',
  setup(props) {

    const errorQueue = [];

    const container = ref(null);
    const error = ref(null);
    const errorCount = ref(0);
    const win = remote.getCurrentWindow();

    win.on('focus', () => {
      if(error.value === null && errorQueue.length !== 0){
        error.value = errorQueue.shift();
      }
    });

    function onAnimationEnd() {
      if ( errorQueue.length !== 0 ) {
        if(win.isVisible()){
          error.value = errorQueue.shift();
          container.value.style.animation = 'none';
          container.value.offsetHeight; /* trigger reflow */
          container.value.style.animation = null;
        }
      } else {
        error.value = null;
      }
    }

    global.logger.addErrorListener((err) => {
      console.log('Error happened!');
      errorCount.value++;
      if ( error.value === null && win.isVisible()) {
        error.value = err.description;
      } else {
        errorQueue.push(error);
      }
    });

    function showLogFile() {
      shell.showItemInFolder(global.logger.logFilePath);
    }

    return {
      onAnimationEnd,
      container,
      error,
      errorCount,
      showLogFile
    };
  }
});
</script>

<style scoped>

</style>
