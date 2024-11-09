<script setup>
import { computed } from "vue";

const model = defineModel();

const props = defineProps({
  label: {
    type: String,
    default: "Label",
  },
  type: {
    type: String,
    default: "text", // Default to text
    validator: (value) => {
      // Ensure the type is either 'text' or 'password'
      return value === "text" || value === "password" || "number";
    },
  },
  placeholder: {
    type: String,
    default: "Enter text",
  },
});
const inputType = computed(() => props.type);
</script>

<template>
  <label class="flex text-black font-bold mb-2">{{ label }}</label>
  <input
    :type="inputType"
    :id="label"
    :name="label"
    class="border rounded w-full py-2 px-3 mb-2"
    :placeholder="placeholder"
    v-model="model"
    required
  />
</template>
