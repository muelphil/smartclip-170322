<template>
  <div class="settings-content">
    <div class="setting-section">
      <div class="header">Base Settings</div>
      <div v-for="property in baseSettingsPrototype">
        <setting-property
            :property="property"
            v-model="settings.base[property.identifier]"
        ></setting-property>
      </div>
    </div>

    <div v-for="service in allServices" class="setting-section">
      <template v-if="'settingsPrototype' in service">
        <div class="header"> {{ service.prefixDisplay }} settings</div>
        <div v-for="property in service.settingsPrototype">
          <setting-property
              :property="property"
              v-model="settings[service.id][property.identifier]"
          ></setting-property>
<!--          v-model=[{{settings[service.id][property.identifier]}}]-->
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

<script lang = ts>
import { defineComponent } from 'vue';
import SettingProperty from '@/components/settings/SettingProperty.vue';
import { settings } from '@/plugins/settings';
import { allPlugins } from '@/plugins/plugins';
import { baseSettingsPrototype } from '@/plugins/basicSettings';

const {remote, shell} = require('electron');

export default defineComponent({
  name: "SettingsPreferences",
  components: {SettingProperty},
  setup() {
    function closeSettings() {
      window.services.global.settingsActive = false;
    }

    function openDevTools(): void {
      remote.getCurrentWindow().webContents.openDevTools();
    }

    return {
      settings,
      allServices: allPlugins,
      closeSettings,
      baseSettingsPrototype,
      openDevTools
    };
  }
});
</script>

<style scoped>

</style>
