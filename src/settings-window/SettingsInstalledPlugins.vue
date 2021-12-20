<template>
  <div class="setting-section">
    <div class="header"> registered services</div>

    <div v-for="plugin in plugins"
         style="border:1px solid var(--textcolor-secondary); margin-bottom: 8px; padding: 8px;">
      <h3>
        {{ plugin.name }}<span style="font-size: smaller; color:var(--textcolor-secondary)">- {{ plugin.id }}</span>
      </h3>
      <div>{{ plugin.description }}</div>
    </div>
    <!--    <div class="table-container">-->
    <!--      <table>-->
    <!--        <thead>-->
    <!--        <th>Shortcut</th>-->
    <!--        <th>Service</th>-->
    <!--        </thead>-->
    <!--        <tbody>-->
    <!--        <tr v-for="service in prefixPlugins">-->
    <!--          <td>{{ service.id }}</td>-->
    <!--          <td>{{ service.name }}</td>-->
    <!--        </tr>-->
    <!--        </tbody>-->
    <!--      </table>-->
    <!--    </div>-->
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'SettingsInstalledPlugins',
  props: ['plugins'],
  setup(props) {
    return {};
  }
});
</script>

<style scoped>

</style>
