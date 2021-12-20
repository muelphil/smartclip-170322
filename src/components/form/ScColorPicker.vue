<template>
  <div class="color-picker">
    <slot></slot>
    <div v-for="color in colorOptions"
         class="color"
         :class="{'checked' : color === modelValue}"
         :style="{'background-color': color}"
         @click="$emit('update:modelValue', color)"
    ></div>
  </div>
</template>

<script>
export default {
  name: "ScColorPicker",
  props: {
    colorOptions: Array,
    modelValue: String
  }
};
</script>

<style scoped>
.color-picker{
  display:flex;
  flex-direction: row;
}
.color {
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin: 2px;
}

/*.color:not(:last-child){*/
/*  margin-right: 2px;*/
/*}*/

.color.checked {
  width: 14px;
  height: 14px;
  border: 1px solid red;
}

</style>
