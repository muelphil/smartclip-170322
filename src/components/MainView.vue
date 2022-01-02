<template>
  <form @submit.prevent class="clipboard-container" @keydown="checkPluginPrefix($event)">
    <button type="button" @click="click">click</button>
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
import {
  computed,
  defineComponent,
  provide,
  ref,
  Ref,
  shallowRef
} from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import {initializePlugins} from '@/plugins/initializePlugins';
import {plugins, basePlugin} from '@/plugins/plugins';
import {settings} from '@/plugins/settings';
import {ClipService} from '@/services/ClipService';
import SCEventEmitter from '@/services/SCEventEmitter';
import {isDevelopment} from "@/utils/regex";
import {basename, extname, join} from "path";
import {Dirent, existsSync} from "fs";

const {remote, ipcRenderer, dialog} = require('electron');
const win = require('electron').remote.getCurrentWindow();
const path = require('path');
const fs = require('fs').promises;
const env = require('electron').remote.getGlobal('process').env;


const test = require('@bitdisaster/exe-icon-extractor');

// const {width: screenWidth, height: screenHeight} = require('electron').remote.screen.getPrimaryDisplay().size;

export default defineComponent({
  name: 'MainView',
  components: {SearchBar},
  setup(_props) {
    const pluginView = ref(null);
    provide<SCEventEmitter>('emitter', window.emitter);
    provide<ClipService>('clipService', window.services.clipboard);

    const {query, pluginId, checkPluginPrefix, reset} = initializePlugins();

    win.on('hide', () => { // TODO this only will update the view after the window is focused again, showing a short flash of the previous view (plugin and query)
      if (!isDevelopment)
        reset();
    });

    function getPluginById(pluginId) {
      return plugins.find(e => e.id === pluginId);
    }

    const pluginComponent: Ref<string> = computed(() => {
      return getPluginById(pluginId.value).component;
    });

    const prefix = computed(() => pluginId.value === basePlugin.id ? null : getPluginById(pluginId.value).prefixDisplay);

    // const currentInstance = getCurrentInstance();

    // watchEffect(() => {
    //   // if (pluginView.value) {
    //   console.log('new plugin=', pluginId.value);
    //   const plugin = global.plugins.find(p => p.id === pluginId.value);
    //   console.log('plugin=', plugin)
    //   let props = {
    //     query: query.value,
    //     settings: settings[pluginId.value],
    //     service: pluginServices[pluginId.value],
    //     // '@update:query': ($event) => {
    //     //   query.value = $event
    //     // }
    //   };
    //   console.log('props', props)
    //   console.log('pluginServices', pluginServices)
    //   console.log('getCurrentInstance()', currentInstance);
    //   mount(plugin.component, {
    //     props, element: pluginView.value, currentInstance
    //   });
    //   // }
    // })

    async function click() {

      // console.log(await getLastAccessedDate());
      //
      // const buffer = test.extractIcon("C:\\WINDOWS\\system32\\mspaint.exe", "large");
      // fs.writeFile('C:\\Users\\Familie Müller\\Desktop\\myicon.ico', buffer);

      // getIconForExe('', 'Paint').then(e => {});
      // console.log(remote.process.env);
      // console.log("build apps=", buildStartMenuApps());
      // console.log(app.getFileIcon("C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"));;
      // console.log('pluginServices', pluginServices)
      // const index = {};
      // await addDirectoryToIndex('C:\\Users\\Familie Müller\\Desktop', index);
      // console.log('index is built, index=', index);
      // ipcRenderer.send('open-settings');
      // let settings = remote.getGlobal ('settings');
      // console.log('settings:', settings);
      // console.log('modifying')
      // settings.test.test2 = 'test4';
      // console.log('settings:', settings);
    }

    return {
      click,
      prefix,
      query,
      pluginId,
      settings,
      pluginComponent,
      checkPluginPrefix,
      services: shallowRef(global.pluginServices),
      pluginView
    };
  }
});
</script>

<style scoped>

</style>
