<template>
  <div class="wrapper trash-wrapper" :disabled="disabled">
    <!--    <div class="trash-icon" ">-->
    <svg class="trash-outline" viewBox="0 0 67 67" xmlns="http://www.w3.org/2000/svg" xml:space="preserve"
         style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"><path d="M22.201 8.791V4.347a4.447 4.447 0 0 1 4.445-4.444h13.333a4.447 4.447 0 0 1 4.445 4.444v4.444h9.836a4.479 4.479 0 0 1 4.345 3.393l.684 2.735a2.224 2.224 0 0 1-2.156 2.761H9.519a2.222 2.222 0 0 1-2.151-2.781l.723-2.781a4.444 4.444 0 0 1 4.302-3.327h9.808zm16.889 0V6.569a2.222 2.222 0 0 0-2.222-2.222h-7.111a2.222 2.222 0 0 0-2.222 2.222v2.222H39.09zM11.09 22.125l3.89 38.897a6.16 6.16 0 0 0 6.13 5.547h24.487a6.07 6.07 0 0 0 6.04-5.466l3.898-38.978H11.09zm6.67 9.036 1.454 26.667a2.711 2.711 0 0 0 2.852 2.557 2.71 2.71 0 0 0 2.557-2.852l-1.455-26.667a2.71 2.71 0 0 0-2.851-2.557 2.71 2.71 0 0 0-2.557 2.852zm29.651 26.667 1.454-26.667a2.71 2.71 0 0 0-2.556-2.852 2.71 2.71 0 0 0-2.852 2.557l-1.455 26.667a2.71 2.71 0 0 0 2.557 2.852 2.71 2.71 0 0 0 2.852-2.557zM30.604 31.014V57.68a2.71 2.71 0 0 0 2.709 2.709 2.71 2.71 0 0 0 2.708-2.709V31.014a2.71 2.71 0 0 0-2.708-2.709 2.71 2.71 0 0 0-2.709 2.709z"/></svg>
    <!-- Trash -->
    <img class="trash" src="@/extraResources/icons/trash.svg"/>
    <!--    </div>-->
  </div>
</template>
<script>
export default {
  name: "ScTrash",
  props: {
    disabled: Boolean
  }
};
</script>

<style scoped>

</style>
