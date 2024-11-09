<script setup>
const variation = {
  delete: "pi pi-trash text-red-600 bg-red-100 hover:bg-red-200 ",
  add: "pi pi-plus text-gray-700 bg-gray-100 hover:bg-gray-200",
};

defineProps({
  variant: {
    type: String,
    default: "normal",
  },
});
</script>
<template>
  <button
    :class="`${variation[variant]} p-3 rounded-full cursor-pointer transition-all duration-200`"
  ></button>
</template>
