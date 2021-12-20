<template>
  <div class="options-group">
    <h4 class="title" v-if="label">{{ label }}</h4>
    <div class="options" @change="$emit('update:modelValue', $event.target.value)">
      <template v-for="[key, value] in options">
        <label class="option" :class="{'checked' : key === modelValue}">
          <input type="radio" :value="key" :checked="key === modelValue"/>
          {{ value }}
        </label>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ScRadioGroup',
  props: {
    modelValue: [String, Number],
    options: Map,
    label: String
  }
});
</script>

<style scoped>

</style>
