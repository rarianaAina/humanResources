<script setup>
const variation = {
  normal: "bg-blue-900 hover:bg-blue-800 text-white",
  neutral: "bg-gray-100 hover:bg-gray-300 text-black",
  delete: "bg-red-600 hover:bg-red-500 text-white",
};

defineProps({
  text: {
    type: String,
    default: "Boutton",
  },
  variant: {
    type: String,
    default: "normal",
  },
});
</script>
<template>
  <button
    :class="`${variation[variant]} font-bold py-3 px-4 rounded-md w-full focus:outline-none focus:shadow-outline`"
    type="submit"
  >
    {{ text }}
  </button>
</template>
