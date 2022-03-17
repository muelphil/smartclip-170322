<template>
  <div class="preview files">
    <div class="paths">
      <template v-for="_dir in dir">
        <span v-html="_dir"></span>
        <svg viewBox="0 0 31 50" class="separator-icon" xmlns="http://www.w3.org/2000/svg" xml:space="preserve"
             style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"><path d="M5.875 0 0 5.875 19.083 25 0 44.125 5.875 50l25-25-25-25z" style="fill-rule:nonzero"/></svg>
      </template>
    </div>
    <div class="filename" v-html="base"></div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";

export default defineComponent({
  name: "FileView",
  props: ['base', 'dir'],
  setup(props) {
  }
});
</script>

<style>
mark {
  background-color: rgba(229, 198, 92, 0.58);
  color: white;
}
</style>