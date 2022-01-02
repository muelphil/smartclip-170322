<template>
  <div class="clipboard multiline">
    <div class="clipboard-entries-container" ref="container">

      <template v-if="contextMenu">
        <teleport :to="contextMenuTeleportDestination">
          <ContextMenu
              :context-menu="contextMenu"
              @submit="contextMenuSubmit"
              @close="closeContextMenu"
              :top-attached="contextMenuTopAttached"
          >Actions
          </ContextMenu>
        </teleport>
      </template>

      <template v-if="results.length!==0">
        <template v-for="(result, index) in results" :key="result">
          <ClipboardEntryView
              :entry="result"
              :selected="selectedIndex === index"
              :position="index+1"
          ></ClipboardEntryView>
        </template>
      </template>
      <ScEmptyState v-else-if="query===''">
        Keine Einträge vorhanden
      </ScEmptyState>
      <ScEmptyState v-else>
        Keine Einträge entsprechen der Suche
      </ScEmptyState>
    </div>
    <!--        <div class="footer">-->
    <!--            insert as-->
    <!--            <shortcut :shortcut="['Tab']" class="small"></shortcut>-->
    <!--            <span class="tag">{{insertAs}}</span>-->
    <!--        </div>-->
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, getCurrentInstance, inject, onMounted, onUnmounted, ref, Ref, watch} from 'vue';
import ClipboardEntryView from '@/components/entries/ClipboardEntryView.vue';
import {basicAltListener, basicArrowListener, registerBasicScroll} from '@/plugins/helpers';
import {ClipService} from '@/services/ClipService';
import {ClipboardEntry} from '@/classes/ClipboardEntry';
import SCEventEmitter from '@/services/SCEventEmitter';
import {ContextMenu as ContextMenuType} from '@/services/GlobalService';
import {ActionInstance} from '@/plugins/types';
import ContextMenu from '@/components/ContextMenu.vue';
import ScEmptyState from "@/components/ScEmptyState.vue";

const win = require('electron').remote.getCurrentWindow();

export default defineComponent({
  name: 'ClipResults',
  components: {ContextMenu, ClipboardEntryView, ScEmptyState},
  props: {query: String},
  setup(props, {emit}) {
    const emitter = inject<SCEventEmitter>('emitter');
    const clipService = inject<ClipService>('clipService');
    const currentInsertMode = ref(0);
    const contextMenu = ref(null);
    const contextMenuTeleportDestination = ref(null);
    const contextMenuTopAttached = ref(false);

    const selectedIndex: Ref<number> = ref(0);
    watch(() => props.query, () => {
      selectedIndex.value = 0;
    });

    function onWindowHidden() {
      selectedIndex.value = 0;
      container.value.parentNode.scrollTo(0, 0);
      currentInsertMode.value = 0;
    }

    const results: Ref<ClipboardEntry[]> = computed(() => {
      if (!props.query) {
        return clipService.clipboardEntries;
      } else {
        return clipService.search(props.query as string);
      }
    });

    const arrowListener = basicArrowListener(() => clipService.clipboardEntries, selectedIndex);
    // TODO alt will not always work - is this related to the key 'alt-select' or will this fail with others too?
    const altListener = basicAltListener(() => clipService.clipboardEntries, index => submitIndex(index));


    function submitIndex(index: number) {
      clipService.pasteEntry(results.value[index]);
    }

    function shouldAttachTop(el: HTMLElement, container: HTMLElement): boolean {
      const containerBB: DOMRect = container.getBoundingClientRect();
      const elBB: DOMRect = el.getBoundingClientRect();
      const spaceTop = elBB.y - containerBB.y;
      const spaceBottom = containerBB.y + containerBB.height - (elBB.y + elBB.height);
      return spaceTop < spaceBottom * 1.25; // 1.25 to generally prefer bottom open solutions
    }


    function submit({shiftKey}: KeyboardEvent) {
      if (shiftKey) {
        const entry = clipService.clipboardEntries[selectedIndex.value];
        const actionService = window.services.actions;
        const actions = actionService.getActionsForEntry(entry as ClipboardEntry);
        const menu: ContextMenuType<ActionInstance> = {
          options: actions,
          keyMapper: action => action.description
        };
        contextMenuTeleportDestination.value = container.value.children[selectedIndex.value].querySelector('.menu');
        contextMenuTopAttached.value = shouldAttachTop(contextMenuTeleportDestination.value, container.value);
        contextMenu.value = menu;
      } else {
        clipService.pasteEntry(results.value[selectedIndex.value]);
      }
    }

    const container = ref(null);
    registerBasicScroll(selectedIndex, container);
    let listenersId = -1;
    onMounted(() => {
      console.debug('[Service Switch] ClipVieW::onMounted called');
      win.on('hide', onWindowHidden); // TODO move to event listener
      // emitter.on('arrow', arrowListener);
      // emitter.on('alt-select', altListener);
      // emitter.on('submit', submit);

      listenersId = window.emitter.setListeners({
        'arrow': arrowListener,
        'alt-select': altListener,
        'submit': submit
      }, 'non-covered');
    });

    function closeContextMenu() {
      contextMenuTeleportDestination.value = null;
      contextMenu.value = null;
    }

    onUnmounted(() => {
      console.debug('[Service Switch] ClipVieW::onUnmounted called');
      emitter.removeListener(listenersId);
      win.removeListener('hide', onWindowHidden);
    });

    function contextMenuSubmit(action: ActionInstance) {
      const entry = clipService.clipboardEntries[selectedIndex.value];
      contextMenu.value = null;
      action.performAction(entry, () => {
      }); // TODO done function really needed?
    }

    return {
      results,
      selectedIndex,
      container,
      contextMenu,
      contextMenuTeleportDestination,
      contextMenuTopAttached,
      contextMenuSubmit,
      closeContextMenu
    };
  }
});
</script>

<style scoped>

</style>
