<template>
  <div class="clipboard">
    <div class="clipboard-entries-container" ref="container">
      <!--        <pre>loading={{loading}}, typing={{typing}}, error={{error}}</pre>-->
      <ScLoader v-if="typing || loading"></ScLoader>
      <template v-else-if="error !== null">
        <LeoDidYouMeanView
            v-if="error.code === 'notfound'"
            :didYouMean="error.additionalInformation.didYouMean"
            @change-query="debounced = $event"
        ></LeoDidYouMeanView>
        <template v-else>
          An unknown Error occured!
        </template>
      </template>
      <template v-else-if="results === null">
        <template v-if="query === ''">
          Start typing to search Leo
        </template>
        <template v-else>
          No results matching the query were found
        </template>
      </template>
      <template v-else><!-- result is not empty -->
        <LeoResultView :results="results" :query="query"></LeoResultView>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, watch } from 'vue';
import { debounceQueryRef } from '@/utils/vueHelpers/debounceQueryRef';
import { getTranslations } from '@/plugins/leo/LeoService';
import LeoResultView from '@/plugins/leo/LeoResultView.vue';
import LeoDidYouMeanView from '@/plugins/leo/LeoDidYouMeanView.vue';
import { watchOnce } from '@/utils/vueHelpers/watchOnce';
import ScLoader from '@/components/ScLoader.vue';


export default defineComponent({
  name: 'LeoView',
  props: {
    query: String,
    settings: Object
  },
  components: {ScLoader, LeoResultView, LeoDidYouMeanView},
  setup(props, {emit}) {
    const loading = ref(false); // request has been send
    const {debounced, loading: typing} = debounceQueryRef(() => props.query, val => emit('update:query', val), 400);
    const results: Ref = ref(null);
    const error = ref(null);

    watch(debounced, (query : string) => {
      query = query.trim();
      error.value = null;
      if ( query !== '' ) {
        loading.value = true;
        let invalidated = false; // invalidated if the query has changed during fetching and processing the data
        const stop = watchOnce(() => props.query, (newVal, oldVal) => invalidated = true);
        getTranslations(query).then((res) => {
          if ( !invalidated ) { // check if query is still the same since loading
            stop();
            results.value = res;
            loading.value = false;
          }
        }).catch(err => {
          global.logger.error({
            originator: 'Leo Plugin',
            description: 'Error was received by the Promise',
            stacktrace: err
          });
          error.value = err;
          watchOnce(() => props.query, (_) => error.value = null);
          loading.value = false;
        });
      } else {
        results.value = null; // clear results
      }
    });


    return {
      results,
      loading,
      typing,
      debounced,
      error
    };
  }
});
</script>

<style>
.clipboard-entry-container.translation {
  color: darkgrey;
}

.clipboard-entry-container.translation small {
  color: darkgrey;
}

span.highlighted {
  color: white;
}
</style>
