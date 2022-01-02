<template>
  <div style="background-color: yellow; color: blue;">
    <div>Hello from TestComponent!</div>
    <div ref="myref"></div>
  </div>
</template>

<script lang="ts">
import {createVNode, defineComponent, h, onMounted, ref, render} from "vue";

export default defineComponent({
  name: "TestComponent",
  setup() {
    // https://github.com/pearofducks/mount-vue-component/blob/master/index.js
    const myref = ref(null);
    onMounted(() => {
      // console.log('mounted!');
      import('@/components/TestComponentChild.vue').then(module => {
        let component = createVNode(module.default);
        // console.log('vnode=', component);
        render(component, myref.value);
      })
    })
    return {myref, onMounted};
  }
});
</script>

<style scoped>

</style>