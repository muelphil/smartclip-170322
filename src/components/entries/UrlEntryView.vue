<template>
  <img src="@/extraResources/icons/hyperlink.svg" class="entry-image-icon"/>
  <!--  <i title="link" class="material-icons link entry-icon"></i>-->
  <img class="preview-image" v-if="entry.data.previewImage" :src="entry.data.previewImage"/>
  <div class="preview url" v-if="entry.alternative">
    <div class="stacked">
      <div class="baseurl">
        <img v-if="entry.data.iconUrl" :src="entry.data.iconUrl"/>
        {{ decodeURI(entry.data.baseUrl) }}
      </div>
      <div class="title">{{ entry.alternative }}</div>
      <div class="description">{{ entry.data.description }}</div>
    </div>
  </div>
  <div class="preview" v-else>{{ entry.plainText }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { UrlEntry } from '@/classes/ClipboardEntry';

export default defineComponent({
  name: 'UrlEntryView',
  props: {entry: UrlEntry}
});
</script>

<style scoped>
.test {
  position: absolute;
  /*height: 100%;*/
  /*top: 0;*/
  /*bottom: 0;*/
  max-width: 50%;
  max-height: 100%;
  right: 64px;
  -webkit-mask-image: -webkit-gradient(linear, 50% 50%, 0% 50%, from(rgba(0, 0, 0, 1)), to(rgba(0, 0, 0, 0)))
}
</style>
