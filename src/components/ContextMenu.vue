<template>
  <div class="context-menu" ref="container" :class="topAttached ? 'top-attached' : 'bottom-attached'">
    <header class="context-header">
      <slot>Options</slot>
    </header>
    <ol>
      <template v-for="(option,index) in contextMenu.options">
        <li :class="{'selected':index === selectedIndex}">
          {{ contextMenu.keyMapper && contextMenu.keyMapper(option) || option }}
        </li>
      </template>
    </ol>

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { basicArrowListener } from '@/plugins/helpers';

export default defineComponent({
  name: 'ContextMenu',
  props: {
    contextMenu: {
      type: Object,
      required: true
    }, // TODO
    topAttached: Boolean
  },
  setup(props, {emit}) {
    // const contextMenu = window.services.global.contextMenu;
    const selectedIndex = ref(0);
    const container = ref(null);
    // const onClose = contextMenu.onClose;
    const clazz = ref('');
    let closeSuccessfully = false;

    const bArrowListener = basicArrowListener(() => props.contextMenu.options, selectedIndex);
    const arrowListener = (event, direction) => {
      event.stopPropagation();
      bArrowListener(event, direction);
    };
    const submitListener = (event) => {
      event.stopPropagation();
      emit('submit', props.contextMenu.options[selectedIndex.value]); // TODO
      // props.contextMenu.onSubmit(props.contextMenu.list[selectedIndex.value]);
      closeSuccessfully = true;
      window.services.global.closeContextMenu();
    };
    const escListener = _ => emit('close');

    let listenersId = window.emitter.setListeners({
      'arrow': arrowListener,
      'submit': submitListener,
      'esc': escListener
    }, 'none');

    onMounted(() => {
      container.value.scrollIntoViewIfNeeded(); // TODO open top side instead if no space is available
    });

    onUnmounted(() => {
      if ( !closeSuccessfully && props.contextMenu.onClose ) {
        props.contextMenu.onClose();
      }
      emit('close');
      window.emitter.removeListener(listenersId);
    });

    // console.log('provided contextmenu=', contextMenu);
    return {selectedIndex, contextMenu: props.contextMenu, container};
  }
});
</script>

<style scoped>

</style>
