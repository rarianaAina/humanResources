<script setup>
//import { reactive } from "vue";
import Button from "@/components/Button.vue";
//import Input from "@/components/Input.vue";
import { useRouter } from "vue-router";
//import { useUserStore } from "@/stores/userStore";
import Title from "@/components/Title.vue";

const router = useRouter();
//const userStore = useUserStore();

const handleSubmit = async () => {
  router.push("/signin");
};

</script>
<template>


  <div class="mt-4">
    <Button text="Login :)" @click="handleSubmit" />
  </div>
</template>
