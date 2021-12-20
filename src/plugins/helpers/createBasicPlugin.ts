import { defineComponent, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import BasicEntryView from '@/components/entries/BasicEntryView.vue';
import { basicAltListener, basicArrowListener } from '@/plugins/helpers/index';
import { ClipService } from '@/services/ClipService';
import SCEventEmitter from '@/services/SCEventEmitter';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createBasicPluginView(id: string, loadQueryResults: (string) => string[]) {
    if ( !/[a-zA-Z]/.test(id) )
        throw 'Only letters allowed for id!';
    const componentName = capitalizeFirstLetter(id) + 'View';
    return defineComponent({
        name: componentName,
        template: `
          <div>
          <template v-if="results.length !== 0">
            <!--        TODO BasicEntryView existiert potentiell nicht mehr-->
            <BasicEntryView v-for="(entry, index) of results" :position="index+1" :selected="index === selectedIndex">
              {{ entry }}
            </BasicEntryView>
          </template>
          <template v-else-if="query === ''">
            <!--        TODO - this should be optional, some plugins might want to view results even when query is ''-->
            Start typing to view results
          </template>
          <template v-else>

          </template>
          </div>`,
        components: {BasicEntryView},
        props: {query: String},
        setup(props) {
            const emitter = inject<SCEventEmitter>('emitter');
            const {pastePlain} = inject<ClipService>('clipService');
            const results = ref([]);
            const selectedIndex = ref(0);
            watch(() => props.query, (val) => {
                selectedIndex.value = 0;
                results.value = loadQueryResults(val);
            });

            const arrowListener = basicArrowListener(() => results.value, selectedIndex);
            const altListener = basicAltListener(() => results.value, (index) => {
                pastePlain(results.value[index]);
            });
            const submitListener = () => pastePlain(results.value[selectedIndex.value]);

            let listenersId = -1;
            onMounted(() => {
                listenersId = emitter.setListeners({
                    'arrow': arrowListener,
                    'submit': submitListener,
                    'alt-select': altListener
                }, 'non-covered');
                // emitter.on('arrow', arrowListener);
                // emitter.on('alt-select', altListener);
                // emitter.on('submit', submitListener);
            });

            onUnmounted(() => {
                emitter.removeListener(listenersId);
            });

            return {results, selectedIndex};
        }
    });
}

export {
    createBasicPluginView
};
