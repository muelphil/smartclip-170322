<template>
  <div class="searchbar-container">
    <span v-if="prefix" class="searchbar-prefix">{{ prefix }}</span>
    <input
        spellcheck="false"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        ref="searchInput"
        id="searchbar"
    />
    <svg @click="activateSettings()" class="settings-icon2"
         viewBox="0 0 67 67" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
         xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"><clipPath id="a"><circle cx="33.333" cy="33.333" r="23.524"/></clipPath>
      <g clip-path="url(#a)"><use xlink:href="#b" x="10.008" y="10.008" width="47.048" height="47.048" transform="matrix(.98016 0 0 .98016 0 0)"/></g>
      <clipPath id="c"><path d="M38.203.358a33.32 33.32 0 0 0-9.739 0L25.53 8.882a25.68 25.68 0 0 0-9.471 5.467L7.21 12.628a33.328 33.328 0 0 0-4.869 8.435l5.915 6.803a25.65 25.65 0 0 0 0 10.935l-5.915 6.803a33.322 33.322 0 0 0 4.869 8.434l8.849-1.721a25.668 25.668 0 0 0 9.471 5.468l2.934 8.524a33.32 33.32 0 0 0 9.739 0l2.934-8.524a25.656 25.656 0 0 0 9.47-5.468l8.849 1.721a33.325 33.325 0 0 0 4.87-8.434l-5.915-6.803a25.682 25.682 0 0 0 0-10.935l5.915-6.803a33.331 33.331 0 0 0-4.87-8.435l-8.849 1.721a25.668 25.668 0 0 0-9.47-5.467L38.203.358zm-4.87 13.309C44.188 13.667 53 22.479 53 33.333 53 44.188 44.188 53 33.333 53c-10.854 0-19.666-8.812-19.666-19.667 0-10.854 8.812-19.666 19.666-19.666z"/></clipPath>
      <g clip-path="url(#c)" class="outer-wheel"><use xlink:href="#d" x="2.341" width="61.985" height="66.667" transform="matrix(.99976 0 0 .99503 0 0)"/></g>
      <clipPath id="e"><path d="M33.333 19.792c7.474 0 13.542 6.067 13.542 13.541s-6.068 13.542-13.542 13.542-13.541-6.068-13.541-13.542 6.067-13.541 13.541-13.541zm0 5.208c4.6 0 8.334 3.734 8.334 8.333 0 4.6-3.734 8.334-8.334 8.334-4.599 0-8.333-3.734-8.333-8.334A8.337 8.337 0 0 1 33.333 25z"/></clipPath>
      <g clip-path="url(#e)"><use xlink:href="#f" x="20.462" y="20.462" width="27.083" height="27.083" transform="scale(.96726)"/></g>
      <defs><image id="b" width="48" height="48" xlink:href="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQIBAQEBAQIBAQECAgICAgICAgIDAwQDAwMDAwICAwQDAwQEBAQEAgMFBQQEBQQEBAT/2wBDAQEBAQEBAQIBAQIEAwIDBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAT/wAARCAAwADADAREAAhEBAxEB/8QAGQABAAMBAQAAAAAAAAAAAAAABgUHCAIJ/8QAKxAAAQMDAwIFBAMAAAAAAAAAAQIDBAARIQUSMQZhEyJxgZFCUbHBQaHR/8QAGwEAAwEBAQEBAAAAAAAAAAAAAgMEBQABBgf/xAAhEQACAgEFAQADAAAAAAAAAAAAAQIRAyExQVHwEjJhgf/aAAwDAQACEQMRAD8A9v5Eci+MV9mnfve/R+fNWHpbGDj90xCpKgjPRtCvxRxdO2LkrQH1Fy17/N804SGrF5zsDjvXC92TEaPe2K4ZVGun4e4HFZyZpOLQbnQSATtpkZAONlf6vHKAq4t7Zpq12J5aFTas4S6W05JNsZqgnfR3BhKUAbH3GTXHRVITMQ7AY/yhckgkmbDXAvfHpbJrMs2Pl7Ec/pBcBsm9+1eqQMsbZXvU3TMoRn3WWFq2IKiEp3HAp2PItmT5MTq0Z+haLKnvrmONLS0tRLO5J8yb4V781Y5JEKg27F7GkKbA8nHa9A5t7DFBckgmAU/T8UAZspGn7vp74rNckbBJx9GDigSkAelC5sNQfIthaLEgsrlraSp1KbslSQSlX8K9uaByb0GKCSsz91L0zEMp91phCN6yohKdvJqvHkdLUgy4lf0ivpGjBsmw4P2p6myZwWzRGrgFJODzgcV6pcA/OlI2OxDH2/qsyzaSQihQxcEj54FC3QcVbO9UWPD8NOEjGMVy7PH0VNrEcOKWSL3p8X0TyVlfzYQuSB6inJk0o8MPPwxnFGmJlGjW8ePxcVAa9WS9gy33Ix2oPyeoeyDs9dye3xRiwNqLd1K/FMhoJkqYPlsZOP1TUKmrVh6RH5xY0afve/oprs//2Q=="/>
        <image id="d" width="62" height="67"
               xlink:href="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQIBAQEBAQIBAQECAgICAgICAgIDAwQDAwMDAwICAwQDAwQEBAQEAgMFBQQEBQQEBAT/2wBDAQEBAQEBAQIBAQIEAwIDBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAT/wAARCABDAD4DAREAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAABgUHBAgJAQP/xAAtEAABAwMDAQcEAwEAAAAAAAABAAQRAgMhBRIxYSJBQlFxgfAGkaHREzKxwf/EABkBAQEBAQEBAAAAAAAAAAAAAAABAgMEB//EACERAQACAQQDAAMAAAAAAAAAAAABESExQVHwAmFxEqHB/9oADAMBAAIRAxEAPwD2/Z5wvpD5NCFcWuZCA66txKkqLvRG70J9Ficd9As8qgnoVmQYdXYlZB9xe5ygh7t6Tz3oOgl5vzIXoZ+IRy3iccZRbGHtiAcIoXqNO3dzlc+ZAZ/cjdPp5yszcYkDnl+CcrINOXGTnCCHuuBKDp9daz4V6GEO5ZmDglF9CuoMiBUYhFtW2tWTbFUg/pY8sZVU2ruRQahuj34XORX756Jq7X2UBu+7NZIpknpwgxhRcryZHog69Vsp8P4gL0OVsK7pxqkASi6ZlBvNFqrpqijnHGELU/8AWekXWbW9fNBFFFJqNQHCz5RhuJtqJr2si44uWrE3TTUR2Mweq4qLFu5vndckA9wVqRlW9P28j3hWs0Mqln3bZ6cq1MbDsKGQPhXVxueX2o00VR2TB6IcxLLp0W1/a7top8yiXsDfXLXRbmh6lppZ2nBfNK2tdy4O1QK6TSTRHFUHFQyDkQQjXjE3bQTV/oVpp965S2sCm2KjsAHGVn8YdRe7ov8AGTFHHRSuJGJVp+3w90qVFaZHzLOPDPoFKHYShrSADVgfOF1cLl7XdtWQdoE+aIPahqNW0xUeIOUaqOVWa+4N4XBPKNfVHa2ypuVVk0zJzjKOkK6e6eAT2Y9uEB2+yAnCn0R1bQTx+FKHVa855ytOFIN05MGSixW3e99l3zgkVZKKCalXuFWfZFmYi8K91K0KjV/nkjegQ9bAzhFGnDYZxhBE3G2eFJjgdF71/lVw1Qjm8TOUaioyNvLszn2Re9/om9Mz7gouv6EHtMz9/VGo9izu1Moo84szOEENdsZ4/EoN7b5MHPH6Rx3hCuSc5+YRdr7uPuSTPzyRdO/Rt33+n/EWNJ+jTzxdJhCNY7yNuQM4+ZRtAXwJOPkoIm7SDVEIP//Z"/>
        <image id="f" width="28" height="28"
               xlink:href="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQIBAQEBAQIBAQECAgICAgICAgIDAwQDAwMDAwICAwQDAwQEBAQEAgMFBQQEBQQEBAT/2wBDAQEBAQEBAQIBAQIEAwIDBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAT/wAARCAAcABwDAREAAhEBAxEB/8QAGAABAAMBAAAAAAAAAAAAAAAABwMGCQj/xAArEAACAQMCBAMJAAAAAAAAAAABAgMABREEIQYSQXETYYEHFCIkMTJRofD/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAwIBBwT/xAAbEQEBAAIDAQAAAAAAAAAAAAAAAQIhEjFBEf/aAAwDAQACEQMRAD8AmuVuPKx5d8fj616Q8mgk4jhMCuSNhmp5x0GXrXqjuA2/epijS3FS5375oNY5uHTOCAh38q+hILe1bga66DhzXXnR6U6j3cL8usiRzS8zBcoCRnHNk46A1nKWzTcynThvV2m66mVn1itFlsmNenlmp8b60iWycowU3Hau/J6NnZ9RptIjeGqkgfc3T0qqG7Q9xvrnuEEsLsWTBHKTkD0o3i5Vvtii8WRlQDJzstFFIktChj8Hbag0WuU0gDDO1E8Zy2Mr2xYPn+2oTqCS7RoxfI64/dFFHmhQSNgUH//Z"/></defs></svg>
    <!--    <img src="@/extraResources/icons/settings.svg" class="settings-icon2" @click="activateSettings()"/>-->
    <!--    <i class="material-icons settings-icon" >settings</i>-->
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {registerApplicationHotkeyListener} from '@/utils/smartclipHelpers';
import {ipcRenderer} from "electron";

export default defineComponent({
  name: 'SearchBar',
  props: {
    modelValue: String,
    prefix: String
  },
  methods: {
    activateSettings() {
      // @deprecated
      // window.services.global.settingsActive = true;
      ipcRenderer.send('open-settings');
    },
    focus(): void {
      // console.dir(this.$refs);
      (this.$refs.searchInput as HTMLElement).focus();
      (this.$refs.searchInput as HTMLElement).click(); // essential!
    }
  },
  created() {
    registerApplicationHotkeyListener((this.focus).bind(this));
    ipcRenderer.on('focus-searchbar', (event) => {
      console.log('[Events] focus-searchbar');
      this.focus();
    });
  },
});
</script>
