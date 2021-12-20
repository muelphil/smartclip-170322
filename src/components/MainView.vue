<template>
  <form @submit.prevent class="clipboard-container" @keydown="checkPluginPrefix($event)">
    <button type="button" @click="click">click</button>
    <!--    <div style="background-color: #1c1e23; color:white;">{{ settings2 }}</div>-->
    <SearchBar
        v-model="query"
        :prefix="prefix"
        type="text"
        placeholder="Type to filter results..."
    ></SearchBar>

    <div class="plugin-view">
      <component
          :is="pluginComponent"
          :query="query"
          :settings="settings[pluginId]"
          :service="services[pluginId]"
          @update:query="query=$event"
      ></component>
    </div>
  </form>
</template>

<script lang="ts">
import {computed, defineComponent, provide, reactive, Ref, shallowRef} from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import {initializePlugins} from '@/plugins/initializePlugins';
import {allPlugins, basePlugin} from '@/plugins/plugins';
import {settings} from '@/plugins/settings';
import {pluginServices} from '@/plugins/pluginServices';
import {ClipService} from '@/services/ClipService';
import SCEventEmitter from '@/services/SCEventEmitter';
import isDevelopment from '@/utils/regex/isDevelopment';

const {remote, ipcRenderer, dialog} = require('electron');

const win = require('electron').remote.getCurrentWindow();
const path = require('path');
const fs = require('fs');
const env = require('electron').remote.getGlobal('process').env;
// const {width: screenWidth, height: screenHeight} = require('electron').remote.screen.getPrimaryDisplay().size;

export default defineComponent({
  name: 'MainView',
  components: {SearchBar},
  setup(_props) {
    provide<SCEventEmitter>('emitter', window.emitter);
    provide<ClipService>('clipService', window.services.clipboard);

    const {query, pluginId, checkPluginPrefix, reset} = initializePlugins();

    win.on('hide', () => { // TODO this only will update the view after the window is focused again, showing a short flash of the previous view (plugin and query)
      if (!isDevelopment)
        reset();
    });

    function getPluginById(pluginId) {
      return allPlugins.find(e => e.id === pluginId);
    }

    const pluginComponent: Ref<string> = computed(() => {
      return getPluginById(pluginId.value).component.name;
    });
    const prefix = computed(() => pluginId.value === basePlugin.id ? null : getPluginById(pluginId.value).prefixDisplay);

    function printHello() {
      console.log('Hello');
    }

    async function click() {
      // on("down", 'VK_LWIN', printHello);

      // ipcRenderer.send('open-settings');
      // let settings = remote.getGlobal ('settings');
      // console.log('settings:', settings);
      // console.log('modifying')
      // settings.test.test2 = 'test4';
      // console.log('settings:', settings);
    }

    let settings2 = reactive(remote.getGlobal('settings'));

    return {
      click,
      prefix,
      query,
      pluginId,
      settings,
      settings2,
      pluginComponent,
      checkPluginPrefix,
      services: shallowRef(pluginServices)
    };
  }
});
</script>

<style scoped>

</style>
