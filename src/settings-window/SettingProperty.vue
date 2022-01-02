<template>
  <div v-if="property.type !== 'hidden'">
    v-model=[{{modelValue}}]
    <component
        :is="componentType"
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        v-bind="property">
      {{ property.label }}
    </component>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ScCheckbox from '@/components/form/ScCheckbox.vue';
import ScRadioGroup from '@/components/form/ScRadioGroup.vue';
import ScSelect from '@/components/form/ScSelect.vue';
import ScTextInput from '@/components/form/ScTextInput.vue';
import ScHotkey from '@/components/form/ScHotkey.vue';
import ScFilesInput from '@/components/form/ScFilesInput.vue';

const mapping = {
  boolean: 'ScCheckbox',
  select: 'ScSelect',
  string: 'ScTextInput',
  radio: 'ScRadioGroup',
  hotkey: 'ScHotkey',
  files: 'ScFilesInput',
  hidden: null,
}

export default defineComponent({
  name: 'SettingProperty',
  components: {ScCheckbox, ScSelect, ScTextInput, ScHotkey, ScRadioGroup, ScFilesInput},
  props: {
    property: {required: true, type: Object},
    modelValue: {required: true}
  },
  setup(props) {
    return {
      hidden: 'hidden' in (props.property),
      componentType: mapping[props.property.type]
    };
  }
});
</script>

<style scoped>

</style>
