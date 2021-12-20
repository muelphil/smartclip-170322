<template>
  <div class="clipboard-entry-container" :class="cssClasses">
    <div class="index"><span>{{ position }}</span></div>

    <component
        :is="entryToComponentName(entry)"
        :entry="entry"
    ></component>

    <div class="options icon-group">
      <div @click="" class="option clickable menu">
<!--        <svg viewBox="0 0 67 67" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" class="menu-dots"-->
<!--             style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">-->
<!--          <circle cx="33.333" cy="12.5" r="8.333"/>-->
<!--          <circle cx="33.333" cy="33.317" r="8.333"/>-->
<!--          <circle cx="33.333" cy="54.167" r="8.333"/>-->
<!--        </svg>-->
        <ScMenu></ScMenu>
      </div>

      <div @click="toggleFav()" class="option clickable">
          <sc-star :checked="entry.favourite"></sc-star>
      </div>

      <!--      <i class="material-icons option"-->
      <!--         :class="entry.favourite ? 'star':'star_border'"-->
      <!--         @click="toggleFav()"-->
      <!--      ></i>-->
      <div @click="remove()" :disabled="entry.favourite" class="option clickable">
        <sc-trash :disabled="entry.favourite"></sc-trash>
      </div>

      <!--      <i class="material-icons option delete" :disabled="entry.favourite"-->
      <!--         @click="remove()"-->
      <!--      ></i>-->
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, inject, onMounted} from 'vue';
import {ClipboardEntry} from '@/classes/ClipboardEntry';
import {EntryType, entryTypeToClassName} from '@/plugins/clip/EntryType';
import {ClipService} from '@/services/ClipService';
import MathEntryView from '@/components/entries/MathEntryView.vue';
import CodeEntryView from '@/components/entries/CodeEntryView.vue';
import EmailEntryView from '@/components/entries/EmailEntryView.vue';
import PlainEntryView from '@/components/entries/PlainEntryView.vue';
import UrlEntryView from '@/components/entries/UrlEntryView.vue';
import FilesEntryView from '@/components/entries/FilesEntryView.vue';
import ScTrash from '@/components/icons/ScTrash.vue';
import ScStar from '@/components/icons/ScStar.vue';
import ScMenu from "@/components/icons/ScMenu.vue";

export default defineComponent({
  name: 'ClipboardEntryView',
  components: {
    ScMenu,
    ScStar,
    ScTrash,
    MathEntryView,
    CodeEntryView,
    EmailEntryView,
    FilesEntryView,
    PlainEntryView,
    UrlEntryView
  },
  props: {
    entry: {
      required: true,
      type: Object
    },
    selected: Boolean,
    position: Number
  },
  setup(props) {
    const clipService = inject<ClipService>('clipService');

    function entryToComponentName(entry: ClipboardEntry) {
      return entry.constructor.name + 'View';
    }

    onMounted(() => {
      console.log('ClipboardEntryView::onMounted');
    });

    function remove() {
      // if ( this.entry.favourite ) {
      //     toggleEntryFavourite(this.entry as ClipboardEntry);
      // }
      // the behaviour was changed from defavourizing and then deleting to blocking when it is favourized
      if (!this.entry.favourite)
        clipService.deleteEntry(this.entry as ClipboardEntry);
    }

    function toggleFav() {
      clipService.toggleEntryFavourite(this.entry as ClipboardEntry);
    }

    const entryClass: string = entryTypeToClassName(props.entry.type);
    const cssClasses = computed(() => {
      if (props.selected)
        return ['selected', entryClass];
      return [entryClass];
    });

    return {
      EntryType,
      remove,
      toggleFav,
      cssClasses,
      entryToComponentName
    };
  }
});
</script>

