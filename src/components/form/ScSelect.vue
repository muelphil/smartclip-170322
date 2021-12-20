<template>
  <div class="sc-form-field">
    <div class="label">
      <slot></slot>
    </div>
    <div class="select-wrapper">
      <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
        <option v-for="[key, value] in options" :value="key">{{ value }}</option>
      </select>
      <i class="material-icons">expand_more</i>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ScSelect',
  props: {
    modelValue: {},
    options: Map
  }
};
</script>

<style scoped>

</style>
