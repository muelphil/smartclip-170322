<template>
  <div :style="{'max-height': '100vh'}" class="app">
    <div class="settings">
      <div class="settings-header">
        <div class="settings-header-top">
          <div class="header">Settings</div>
        </div>
        <div class="close-icon">
          <i class="material-icons" @click="closeSettings()">close</i>
        </div>
        <div class="settings-header-tabs">
          <a class="tab" :class="{'active': selectedTab ==='preferences'}" @click="selectedTab = 'preferences'">Preferences</a>
          <a class="tab" :class="{'active': selectedTab ==='keymap'}" @click="selectedTab = 'keymap'">Keymap</a>
          <a class="tab" :class="{'active': selectedTab ==='plugins'}" @click="selectedTab = 'plugins'">Installed
            Plugins</a>
        </div>
      </div>

      <div v-if="!loading" class="settings-scrollable">
        <settings-preferences
            v-if="selectedTab === 'preferences'"
            :base-settings-prototype="args.baseSettingsPrototype"
            :settings="args.settings"
            :plugins="args.plugins"
        ></settings-preferences>
        <!--            <settings-keymap v-else-if="selectedTab === 'keymap'"></settings-keymap>-->
        <!--            <settings-installed-plugins v-else-if="selectedTab === 'plugins'"-->
        <!--                :plugins="args.plugins"-->
        <!--            ></settings-installed-plugins>-->
        <div v-else>Error! Unknown selectedTab property</div>
      </div>
      <error-notification-bar></error-notification-bar>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import SettingsPreferences from '@/settings-window/SettingsPreferences.vue';
import {ipcRenderer} from 'electron';
import '../../node_modules/material-design-icons-iconfont/dist/material-design-icons.css';
import '../extraResources/themes/base.scss';
import ErrorNotificationBar from "@/components/ErrorNotificationBar.vue";

export default defineComponent({
  name: 'SettingsApp',
  components: {
    // SettingsInstalledPlugins,
    // SettingsKeymap,
    SettingsPreferences,
    ErrorNotificationBar
  },
  setup() {
    const loading = ref(true);
    const args = ref(null);
    ipcRenderer.on('init-settings', (event, _args) => {
      args.value = _args;
      // console.log('received settings:')
      // console.dir(args);
      loading.value = false;
    });
    console.log('(window as any).toolWindowId=', (window as any).toolWindowId);
    ipcRenderer.sendTo((window as any).toolWindowId, 'get-settings');

    const selectedTab = ref('preferences');

    function closeSettings() {
      // console.log('not yet implemented', remote) //TODO
      ipcRenderer.send('close-settings');
    }

    return {
      selectedTab,
      closeSettings,
      loading,
      args
    };
  }
});
</script>

<style scoped>

</style>
