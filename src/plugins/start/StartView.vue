<template>
  <div class="clipboard">
    <div class="clipboard-entries-container" ref="container">
      <div style="margin: 8px;">
        TODOS:
        <ol>
          <li>Add Plugins</li>
          <li>Add Actions: shutdown, hibernate, sleep, lock</li>
          <li>Add Search and highlight</li>
          <li>implement actions on click/ submit</li>
          <li>icons for windows applications</li>
        </ol>
        a <span class="hl">highlight</span>b
        <img src="C:\Users\Familie Müller\Desktop\myicon.ico"/>
        <button @click="click">click</button>
        [selectedIndex={{ selectedIndex }}, selectedSection={{ selectedSection }}]

        <h5>Applications</h5>
        <div class="applications" ref="grid">
          <div class="application" v-for="(application, index) in applications"
               :class="selectedSection === 0 && index === selectedIndex ? 'selected' : ''">
            <img :src="application.icon"/>
            <!--/*          <span style="font-size: 12px; color: gray;">{{application.path}}</span>*/-->
            <span>{{ application.name }}</span>
          </div>
        </div>

        <h5>Files</h5>
        <div class="files">
          <div v-for="(file, index) in files" class="file"
               :class="selectedSection === 1 && index === selectedIndex ? 'selected' : ''">
            <FileView :base="file.base" :dir="file.dir"></FileView>
            score={{ file.score || 'notfound' }}
          </div>
          <!--          <div v-for="(file, index) in files" class="file"-->
          <!--               :class="selectedSection === 1 && index === selectedIndex ? 'selected' : ''">-->
          <!--            <span style="color: gray">{{ file.dir }}</span> {{file.base}}-->
          <!--          </div>-->
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
import {customHighlight} from "@/plugins/start/customHighlight";

export default defineComponent({
  name: 'StartView',
  components: {FileView, BasicEntryView},
  props: ['service', 'query', 'settings'],
  setup(props) {
    let listenersId = -1;
    const grid: Ref<HTMLElement> = ref(null)
    const colWidth = 100;
    const colGap = 0;
    const selectedIndex = ref(0);
    const selectedSection = ref(0);

    const applications = computed(() => {
      if (grid.value === null) return [];
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

    function getApplicationColumns() {
      return Math.floor((window.services.global.appWidth - colGap) / (colWidth + colGap));
    }

    const filesBase = props.service.index;

    const files = computed(() => {
      const trimmedQuery = props.query.trim().replace(/[\s\\/]/g, '');
      if (trimmedQuery === '')
        return filesBase.slice(0, 15).map(e => {
          const dirs = e.fullPath.split(/[/\\]/);
          return {dir: dirs.slice(0, -1), base: dirs[dirs.length - 1]};
        });
      return fuzzysort.go(trimmedQuery, filesBase, {
        threshold: -500,
        limit: 15,
        key: 'fullPath',
      }).map(e => ({hl: customHighlight(e, '<mark>', '</mark>'), score: e.score}))
          .map(e => ({dir: e.hl.slice(0, -1), base: e.hl[e.hl.length - 1], score: e.score}));
    });

    function click() {
      const results = fuzzysort.go('Downloads\\', filesBase, {
        threshold: -500,
        limit: 15,
        key: 'fullPath',
      })
          .slice(0, 1)
          .map(e => customHighlight(e, '<mark>', '</mark>'))
          .map(e => ({dir: e.slice(0, -1), base: e[e.length - 1]}));
      console.log('fuzzysort search result=', results);
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
          props.service.openApp(applications.value[selectedIndex.value]);
        },
        'arrow': arrowListener
      });
    })


    onUnmounted(() => {
      if (listenersId != -1) window.emitter.removeListener(listenersId);
    })


    return {plugins: plugins, applications, click, grid, selectedIndex, selectedSection, files};
  }
});
</script>

<style scoped>
.applications {
  display: grid;
  grid-template-columns: repeat( auto-fill, minmax(100px, 1fr) );
}

.application {
  display: flex;
  flex-direction: column;
  margin: 4px;
  padding: 4px;
  border-radius: 4px;
  background-color: var(--background-color-lighter1);
  height: 100px;
}

.application img {
  width: 48px;
  height: 48px;
  align-self: center;
  margin: 8px 0;
}

.application span {
  text-align: center;
  overflow: hidden;
}

.files .file {
  margin: 5px;
  padding: 5px;
  background-color: var(--background-color-lighter1);
}

.application.selected {
  border: 1px solid red;
}

.file.selected {
  border: 1px solid red;
}

</style>
