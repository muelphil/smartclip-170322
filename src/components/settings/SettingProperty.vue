<template>
    <div v-if="!property.hidden">
        <component
                :is="componentType"
                :modelValue="modelValue"
                @update:modelValue="$emit('update:modelValue', $event)"
                v-bind="property">
            {{property.label}}
        </component>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import ScCheckbox from '@/components/form/ScCheckbox.vue';
    import ScRadioGroup from '@/components/form/ScRadioGroup.vue';
    import ScSelect from '@/components/form/ScSelect.vue';
    import ScTextInput from '@/components/form/ScTextInput.vue';
    import ScHotkey from '@/components/form/ScHotkey.vue';
    import mapping from '@/components/settings/settingsPropertyMapping';

    export default defineComponent({
        name: 'SettingProperty',
        components: {ScCheckbox, ScSelect, ScTextInput, ScHotkey, ScRadioGroup},
        props: {
            property: {required: true, type: Object},
            modelValue: {required: true}
        },
        setup(props) {
            return {
                hidden: 'hidden' in (props.property),
                componentType: mapping[props.property.constructor.name]
            };
        }
    });
</script>

<style scoped>

</style>
