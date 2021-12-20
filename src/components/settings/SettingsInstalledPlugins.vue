<template>
  <div class="setting-section">
    <div class="header"> registered services </div>

    <div v-for="service in prefixPlugins" style="border:1px solid var(--textcolor-secondary); margin-bottom: 8px; padding: 8px;">
      <h3>
        {{service.name}}<span style="font-size: smaller; color:var(--textcolor-secondary)">- {{service.id}}</span>
      </h3>
      <div>{{service.description}}</div>
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
import { defineComponent } from 'vue';
import { prefixPlugins } from '@/plugins/plugins';

export default defineComponent({
  name: 'SettingsInstalledPlugins',
  setup(props) {
    return {
      prefixPlugins
    };
  }
});
</script>

<style scoped>

</style>
