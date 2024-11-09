<script setup>
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <h1 class="text-4xl my-3">{{ props.text }}</h1>
</template>
