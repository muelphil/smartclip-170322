<template>
  <div class="wrapper star-wrapper">
    <img v-if="checked" class="star" src="@/extraResources/icons/star.svg"/>
    <svg v-else class="star-outline" viewBox="0 0 67 67" xmlns="http://www.w3.org/2000/svg" xml:space="preserve"
         style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"><path d="M31.53 1.023A2.089 2.089 0 0 1 33.333 0c.744 0 1.432.39 1.804 1.023l10.108 17.201 19.772 4.13a2.07 2.07 0 0 1 1.548 1.37c.23.695.065 1.458-.433 2.001L52.607 40.486l2.112 19.754a2.034 2.034 0 0 1-.848 1.869 2.113 2.113 0 0 1-2.071.214l-18.467-8.077-18.467 8.077a2.114 2.114 0 0 1-2.071-.214 2.03 2.03 0 0 1-.847-1.869l2.112-19.754L.535 25.725a2.018 2.018 0 0 1-.433-2.001 2.07 2.07 0 0 1 1.548-1.37l19.772-4.13L31.53 1.023zm1.803 9.267 6.524 11.1a6.246 6.246 0 0 0 4.11 2.951l12.553 2.623-8.521 9.3a6.254 6.254 0 0 0-1.607 4.887l1.344 12.573-11.898-5.205a6.253 6.253 0 0 0-5.009 0L18.93 53.724l1.344-12.573a6.25 6.25 0 0 0-1.606-4.887l-8.521-9.3L22.7 24.341a6.249 6.249 0 0 0 4.11-2.951l6.523-11.1z"/></svg>
  </div>
  </template>

<script>
export default {
  name: "ScStar",
  props:{checked: Boolean}
};
</script>

<style scoped>

</style>
