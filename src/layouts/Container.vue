<template>
  <div class="container bg-white p-4 rounded-lg shadow w-full">
    <slot />
  </div>
</template>
<style scoped>
.container {
  height: calc(100vh - 25vh);
  overflow-y: auto;
}
</style>
