<template>
  <img src="@/extraResources/icons/mail.svg" class="entry-image-icon"/>
  <div class="preview">
    <!-- TODO Alternatives: mail, contact_mail-->
    {{ entry.plainText }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { EmailEntry, FilesEntry } from '@/classes/ClipboardEntry';

export default defineComponent({
  name: "EmailEntryView",
  props:{ entry: EmailEntry }
});
</script>

<style scoped>

</style>
