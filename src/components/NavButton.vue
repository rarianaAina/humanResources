<script setup>
defineProps({
  text: {
    type: String,
    default: "Boutton",
  },
  bgColor: {
    type: String,
    default: "transparent",
  },
  hoverColor: {
    type: String,
    default: "bg-blue-800",
  },
  icon: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <button
    :class="`flex items-center ${bgColor} hover:${hoverColor} hover:text-white py-3 px-5 rounded-md`"
  >
    <i v-if="icon" :class="`${icon} mr-2`"></i>
    {{ text }}
  </button>
</template>
