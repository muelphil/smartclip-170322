<template>
  <div class="checkbox-container sc-form-field" @click="$emit('update:modelValue', !modelValue)"
       :class="{'checked':modelValue}">
    <span class="label"><slot></slot></span>
    <i class="material-icons checkbox-icon" :class="modelValue ? 'check_box' : 'check_box_outline_blank'"></i>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ScCheckbox',
  props: ['modelValue']
};
</script>
