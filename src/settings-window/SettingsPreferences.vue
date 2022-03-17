<template>
  <div class="settings-content">
    <div class="setting-section">
      <div class="header">Base Settings</div>
      <div v-for="property in baseSettingsPrototype">
        <setting-property
            :property="property"
            :model-value="settings.base[property.identifier]"
            @update:modelValue="setSetting('base', property.identifier, $event)"
        ></setting-property>
      </div>
    </div>

    <div v-for="plugin in plugins" class="setting-section">
      <template v-if="'settingsPrototype' in plugin">
        <div class="header"> {{ plugin.prefixDisplay }} settings</div>
        <div v-for="property in plugin.settingsPrototype">
          <setting-property
              :property="property"
              :model-value="settings[plugin.id][property.identifier]"
              @update:modelValue="setSetting(plugin.id, property.identifier, $event)"
          ></setting-property>
        </div>
      </template>
    </div>
  </div>

  <div class="vertical-spacer"></div>
  <div class="made-with">
    <div class="header">made with...</div>
    <div class="images">
      <!-- TODO use svgs, at best inline-->
      <div>
        <img @click="open('https://v3.vuejs.org/')" class="logo" src="@/extraResources/vue_logo.png"/>
      </div>
      <div>
        <img @click="open('https://www.electronjs.org/')" class="logo"
             src="@/extraResources/electron_logo.png"/>
      </div>
      <div>
        <img @click="open('https://www.typescriptlang.org/')" class="logo"
             src="@/extraResources/ts_logo.png"/>
      </div>
    </div>
  </div>
  <div class="contact">
    contact me through <a class="link" @click="open('https://github.com/muelphil')">github</a>
    - Application Icon made by <a class="link" @click="open('https://www.flaticon.com/authors/freepik')">Freepik</a>
  </div>
</template>

<script lang=ts>
import {defineComponent} from 'vue';
import SettingProperty from '@/settings-window/SettingProperty.vue';
import {settings} from "@/plugins/settings";
// import { settings } from '@/plugins/settings';
// import { allPlugins } from '@/plugins/plugins';
// import { baseSettingsPrototype } from '@/plugins/basicSettings';

const {remote, shell, ipcRenderer} = require('electron');

export default defineComponent({
  name: "SettingsPreferences",
  components: {SettingProperty},
  props: ['baseSettingsPrototype', 'settings', 'plugins'],
  setup(props) {
    function setSetting(plugin: string, identifier: string, value) {
      console.log('[SettingsPreferences] value pre change=', settings[plugin][identifier])
      console.debug(`[SettingsPreferences] Attempting to set setting - ${plugin}.${identifier} = ${value}`);
      props.settings[plugin][identifier] = value;
      console.log('[SettingsPreferences] value post change=', settings[plugin][identifier])
      ipcRenderer.sendTo((window as any).toolWindowId, 'set-setting', {
        plugin,
        identifier,
        value: JSON.parse(JSON.stringify(value))
      });
    }

    function openDevTools(): void {
      remote.getCurrentWindow().webContents.openDevTools();
    }

    return {
      // settings,
      // allServices: allPlugins,
      // baseSettingsPrototype,
      openDevTools,
      setSetting
    };
  }
});
</script>

<style scoped>

</style>
