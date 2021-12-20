<template>
    <div>
        <template v-for="property in properties">
            <settings-property :property="property"></settings-property>
        </template>
    </div>
</template>

<script>
    import SettingsProperty from '@/components/settings/SettingProperty'

    export default {
        name: "ServiceSettings",
        props: {
            properties: {
                type: Array
            }
        },
        components: {SettingsProperty}
    }
</script>

<style scoped>

</style>
