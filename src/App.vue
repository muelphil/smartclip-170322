<template>
<!--  <div :style="{'max-height': maxHeight}" class="app" ref="app">-->
  <div class="app" ref="app">
    <div v-if="loading" class="obscurer">Loading!</div>
    <!--    <keep-alive>-->
    <MainView v-if="!settingsActive"></MainView>
    <!--     TODO remove <SettingsPanel v-else></SettingsPanel>-->
    <!--    </keep-alive>-->
    <error-notification-bar></error-notification-bar>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref, toRef} from 'vue';
import MainView from '@/components/MainView.vue';
import ContextMenu from '@/components/ContextMenu.vue';
import '../node_modules/material-design-icons-iconfont/dist/material-design-icons.css';
import './extraResources/themes/base.scss';
import {settings} from '@/plugins/settings';
import ErrorNotificationBar from '@/components/ErrorNotificationBar.vue';
import settingsManager from "electron-settings";
// import './extraResources/themes/dracula.css';

const remote = require('electron').remote;
const win = remote.getCurrentWindow();
const screen = remote.screen.getPrimaryDisplay().size;

export default defineComponent({
  name: 'App',
  components: {ErrorNotificationBar, MainView, ContextMenu},
  setup() {

    let loadedSettings = settingsManager.getSync('settings') || {};
    console.debug('[Initialization] App.vue loadedSettings=', loadedSettings);
    const app = ref(null);

    const maxHeight = computed(() => {
      return (screen.height * settings.base.maxScreenHeightPercentage / settings.base.zoom) + 'px';
    });

    onMounted(() => {
      window.services.global.textcolorPrimary = getComputedStyle(document.documentElement).getPropertyValue('--textcolor-primary').trim();
      window.services.global.appWidth = app.value.offsetWidth;
      console.log('app container = ', app.value);
    });

    // const contextMenu = toRef(window.services.global, 'contextMenu');

    // const vm = new ContextMenu({
    //   propsData: {
    //     text: 'HI :)'
    //   }
    // }).$mount('#mount');

    // onMounted(() => {
    //     appendLineToLog('hello?');
    // });
    // let body;
    //
    // function onResize() {
    //     const newHeight = body.offsetHeight;
    //     const newWidth = body.offsetWidth;
    //     console.log(`Body has been resized, width=${newWidth}, height=${newHeight}`);
    //     win.setBounds({height: newHeight}, newHeight);
    // }
    //
    // const observer = new (window as any).ResizeObserver(onResize);
    // onMounted(() => {
    //     body = document.querySelector('html');
    //     observer.observe(body);
    // });
    //
    // onUnmounted(() => {
    //     observer.disconnect();
    // });

    return {
      settingsActive: toRef(window.services.global, 'settingsActive'),
      loading: toRef(window.services.global, 'loading'),
      maxHeight,
      app
      // contextMenu
    };
  }
});
</script>

<style></style>
