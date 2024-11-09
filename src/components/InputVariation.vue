<script setup>
import { defineProps } from "vue";

const model = defineModel();

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
});
</script>

<template>
  <div class="coolinput">
    <label class="text" :for="name">{{ label }}</label>
    <input :class="['input', type]" :name="name" :type="type" v-model="model" />
  </div>
</template>

<style scoped>
.coolinput {
  display: flex;
  flex-direction: column;
  width: fit-content;
  position: static;
  max-width: 240px;
}

.coolinput label.text {
  font-size: 0.75rem;
  color: #000000;
  font-weight: 700;
  position: relative;
  top: 0.5rem;
  margin: 0 0 0 7px;
  padding: 0 3px;
  background: #fff;
  width: fit-content;
}

.coolinput input.input {
  padding: 11px 10px;
  font-size: 0.75rem;
  border: 2px #000000 solid;
  border-radius: 5px;
  background: #fff;
}

.coolinput input:focus {
  outline: none;
}
</style>
