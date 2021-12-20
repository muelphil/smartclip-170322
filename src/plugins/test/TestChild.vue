<template>
<div>
  Hello from child!
  attrs = [{{$attrs}}]
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "TestChild",
  props:['test']
});
</script>

<style scoped>

</style>
