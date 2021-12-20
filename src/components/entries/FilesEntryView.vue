<template>
  <img v-if="entry.data.fileType === 'directory'" src="@/extraResources/icons/directory.svg" class="entry-image-icon"/>
  <img v-else-if="entry.data.fileType === 'file'" src="@/extraResources/icons/file.svg" class="entry-image-icon"/>
  <img v-else-if="entry.data.fileType === 'image'" src="@/extraResources/icons/picture.svg" class="entry-image-icon"/>
  <i v-else title="file" class="material-icons entry-icon" :class="classNames[entry.data.fileType]"></i>
  <img v-if="entry.data.fileType === 'image'" class="preview-image" :alt="'Error loading '+entry.data.uris[0]" :src="entry.data.uris[0]"/>
  <div class="preview files">
    <div class="paths">
      <template v-for="dir in entry.data.path">
        <span>{{ dir }}</span>
        <svg viewBox="0 0 31 50" class="separator-icon" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"><path d="M5.875 0 0 5.875 19.083 25 0 44.125 5.875 50l25-25-25-25z" style="fill-rule:nonzero"/></svg>
      </template>
    </div>
    <div class="filename">{{ entry.plainText }}</div>
  </div>
  <div class="alternative">{{ entry.alternative }}</div>
</template>

<script>
import { FilesEntry } from '@/classes/ClipboardEntry';

const classNames = {
  'file': 'description',
  'directory': 'folder_open',
  'multiple': 'content_copy',
  'invalid': 'warning'
};

export default {
  name: "FilesEntryView",
  props: {entry: FilesEntry},
  setup(props) {
    return {
      classNames
    };
  }
};
</script>

<style scoped>

</style>
