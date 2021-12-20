<template>
  <div class="settings">

    <div class="settings-header">
      <div class="settings-header-top">
        <i class="material-icons close-icon" @click="closeSettings()">close</i>
        <div class="header">Settings</div>
      </div>
      <div class="settings-header-tabs">
        <a class="tab" :class="{'active': selectedTab ==='preferences'}" @click="selectedTab = 'preferences'">Preferences</a>
        <a class="tab" :class="{'active': selectedTab ==='keymap'}" @click="selectedTab = 'keymap'">Keymap</a>
        <a class="tab" :class="{'active': selectedTab ==='plugins'}" @click="selectedTab = 'plugins'">Installed Plugins</a>
      </div>
    </div>

    <div class="settings-scrollable">
      <settings-preferences v-if="selectedTab === 'preferences'"></settings-preferences>
      <settings-keymap v-else-if="selectedTab === 'keymap'"></settings-keymap>
      <settings-installed-plugins v-else-if="selectedTab === 'plugins'"></settings-installed-plugins>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SettingProperty from '@/components/settings/SettingProperty.vue';
import SettingsPreferences from '@/components/settings/SettingsPreferences.vue';
import SettingsKeymap from '@/components/settings/SettingsKeymap.vue';
import SettingsInstalledPlugins from '@/components/settings/SettingsInstalledPlugins.vue';

export default defineComponent({
  name: 'Settings',
  components: {SettingsInstalledPlugins, SettingsKeymap, SettingsPreferences, SettingProperty},
  setup() {
    const selectedTab = ref('preferences');
    function closeSettings() {
      window.services.global.settingsActive = false;
    }

    return {
      selectedTab,closeSettings
    };
  }
});
</script>

<style scoped>

</style>
