<template>
  <div class="sc-form-field">
    <div class="label">
      <slot></slot>
    </div>
    <div class="input-wrapper">
      <input type="text" v-model="modelValue" v-bind="$attrs"/>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ScTextInput',
  props: {
    modelValue: String
  }
};
</script>

<style scoped>

</style>
