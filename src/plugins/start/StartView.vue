<template>
  <div class="clipboard">
    <div class="clipboard-entries-container" ref="container">
      <div style="margin: 8px;">

        <div v-if="applications.length" class="section">
          <h5>Applications</h5>
          <div class="applications">
            <div class="application" v-for="(application, index) in applications"
                 :class="selectedSection === 0 && index === selectedIndex ? 'selected' : ''">
              <img :src="application.icon"/>
              <!--/*          <span style="font-size: 12px; color: gray;">{{application.path}}</span>*/-->
              <span>{{ application.name }}</span>
            </div>
          </div>
        </div>

        <div v-if="files.length" class="section">
          <h5>Files</h5>
          <div class="files">
            <div v-for="(file, index) in files" class="file"
                 :class="selectedSection === 1 && index === selectedIndex ? 'selected' : ''">
              <FileView :base="file.base" :dir="file.dir"></FileView>
            </div>
            <!--          <div v-for="(file, index) in files" class="file"-->
            <!--               :class="selectedSection === 1 && index === selectedIndex ? 'selected' : ''">-->
            <!--            <span style="color: gray">{{ file.dir }}</span> {{file.base}}-->
            <!--          </div>-->
          </div>
        </div>

        <!--    <BasicEntryView v-for="(plugin, index) in plugins" :position="index+1">-->
        <!--      <div style="flex-direction: column">-->
        <!--        {{ plugin.id }}-->
        <!--        <h3>{{ plugin.prefixDisplay }}</h3>-->
        <!--        {{plugin.description}}-->
        <!--      </div>-->
        <!--    </BasicEntryView>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, inject, onMounted, onUnmounted, Ref, ref, watch, watchEffect} from 'vue';
import BasicEntryView from '@/components/entries/BasicEntryView.vue';
import {plugins} from '@/plugins/plugins';
import {basicGridArrowListener, composedArrowListener} from "@/plugins/helpers";
import Document from "flexsearch/src/document.js"
import Index from "flexsearch/src/index.js";
import * as fuzzysort from "fuzzysort";
import FileView from "@/plugins/start/FileView.vue";

const app = require('electron').remote.app;
import {customHighlight} from "@/plugins/start/customHighlight";

export default defineComponent({
  name: 'StartView',
  components: {FileView, BasicEntryView},
  props: ['service', 'query', 'settings'],
  setup(props) {
    let listenersId = -1;
    const selectedIndex = ref(0);
    const selectedSection = ref(0);


    const applications = computed(() => {
      if (props.query === '') {
        return props.service.applications.slice(0, getApplicationColumns());
      }
      // return props.service.applications
      const upperCaseQuery = props.query.toUpperCase();
      return props.service.applications
          // TODO this filters all the 150 apps, although only 14 will be used
          .filter(app => app.name.toUpperCase().indexOf(upperCaseQuery) !== -1)
          .slice(0, getApplicationColumns());
    })

    const colWidth = 100;
    const colGap = 8;
    const margin = 32;

    function getApplicationColumns() {
      return Math.floor((window.services.global.appWidth - colGap - margin) / (colWidth + colGap));
    }

    const filesBase = props.service.index;

    const files = computed(() => {
      const trimmedQuery = props.query.trim().replace(/[\s\\/]/g, '');
      if (trimmedQuery === '')
        return filesBase
            .slice(0, 15)
            .map(e => {
              const dirs = e.fullPath.split(/[/\\]/);
              return {dir: dirs.slice(0, -1), base: dirs[dirs.length - 1], fullPath: e.fullPath};
            });
      return fuzzysort.go<any>(trimmedQuery, filesBase, {
        threshold: -500,
        limit: 15,
        key: 'fullPath',
      }).map(e => ({hl: customHighlight(e, '<mark>', '</mark>'), fullPath: e.obj.fullPath}))
          .map(e => ({dir: e.hl.slice(0, -1), base: e.hl[e.hl.length - 1], fullPath: e.fullPath}));
    });

    async function click() {
      // const results = fuzzysort.go('Downloads\\', filesBase, {
      //   threshold: -500,
      //   limit: 15,
      //   key: 'fullPath',
      // })
      //     .slice(0, 1)
      //     .map(e => customHighlight(e, '<mark>', '</mark>'))
      //     .map(e => ({dir: e.slice(0, -1), base: e[e.length - 1]}));
      // console.log('fuzzysort search result=', results);
      let icon = await app.getFileIcon('C:\\Users\\Philip\\Desktop\\test.exe', {size: 'large'})
      console.log(icon);
    }

    const sections = [
      {listGetter: () => applications.value, colsPerRow: getApplicationColumns()},
      {listGetter: () => files.value}
    ];

    function findFirstNonEmptySection() {
      for (let section = 0; section < sections.length; section++) {
        if (sections[section].listGetter().length !== 0)
          return section;
      }
      return null;
    }

    watch(() => props.query, () => {
      selectedSection.value = findFirstNonEmptySection() || 0;
      selectedIndex.value = 0;
    });

    onMounted(() => {
      const arrowListener = composedArrowListener(selectedIndex, selectedSection, sections);
      basicGridArrowListener(() => applications.value, selectedIndex, getApplicationColumns());
      listenersId = window.emitter.setListeners({
        'submit': () => {
          switch (selectedSection.value) {
            case 0:
              props.service.openApp(applications.value[selectedIndex.value]);
              break;
            case 1:
              console.log('path=', files.value[selectedIndex.value])
              global.openExternal(files.value[selectedIndex.value].fullPath);
              break;
          }
          window.hide();
        },
        'arrow': arrowListener
      });
    })


    onUnmounted(() => {
      if (listenersId != -1) window.emitter.removeListener(listenersId);
    })

    return {plugins: plugins, applications, click, selectedIndex, selectedSection, files};
  }
});
</script>

<style scoped>
.applications {
  display: grid;
  grid-template-columns: repeat( auto-fill, minmax(100px, 1fr) );
  gap: 16px;
}

.application {
  display: flex;
  flex-direction: column;
  padding: 16px 4px 8px 4px;
  border-radius: 4px;
  background-color: var(--background-color-lighter1);
  min-height:76px;
}

.application img {
  /*width: 48px;*/
  /*height: 48px;*/
  width: 32px;
  height: 32px;
  align-self: center;
  margin-bottom: 6px;
}

.application span {
  text-align: center;
  overflow: hidden;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: "";
  white-space: pre-wrap;

}

.files .file {
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: var(--background-color-lighter1);
}

.selected {
  background-color: var(--background-color-lighter2) !important;
}

/*.application.selected {*/
/*  border: 1px solid red;*/
/*}*/

/*.file.selected {*/
/*  border: 1px solid red;*/
/*}*/

h5 {
  margin: 0;
  margin-bottom: 8px;
}

.section:not(:last-child){
  margin-bottom: 16px;
}

</style>
