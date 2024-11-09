<script setup lang="ts">
import NavButton from "@/components/NavButton.vue";
import Header from "./Header.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";


const router = useRouter();
const userStore = useUserStore();
console.log(userStore.idEmployee);

const handleLogout = () => {
  userStore.logout(); // Appeler la méthode de déconnexion dans le store
  router.push("/signin"); // Rediriger vers la page de connexion
};

const routeByRole = {
  finance: "demande-proforma",
  //Chef_de_dep: "demandeChefDep",
  dir_ge: "demandeDir",
  dep_achat: "demande-proforma",
  fournisseur: "proformatFournisseur",
};

const routeByRoleDemande = {
  finance: "demandeFinance",
  Chef_de_dep: "demandeChefDep",
  dir_ge: "demandeDir",
  dep_achat: "demande",
  //fournisseur: "proformatFournisseur",
};

const routeByRoleCommande = {
  finance: "commandeView",
  dir_ge: "commandeView",
  dep_achat: "commandeView",
  fournisseur: "commandesFournisseur",
}

</script>

<template>
  <div class="dashboard h-screen flex flex-col">
    <Header />

    <!-- Core section -->
    <div class="core flex-grow flex gap-x-3">
      <div class="navigation flex flex-col pl-5">
        <div class="nav my-2 w-full">
          <NavButton text="Proformas" @click="$router.push(`/${routeByRole[userStore.role]}`)" class="w-full" />
        </div>
        <div class="nav my-2 w-full">
          <NavButton text="Commandes" @click="$router.push(`/${routeByRoleCommande[userStore.role]}`)" class="w-full" />
        </div>
        <div class="nav my-2 w-full">
          <NavButton text="Demandes" @click="$router.push(`/${routeByRoleDemande[userStore.role]}`)" class="w-full" />
        </div>
        <div class="nav my-2 mt-auto">
          <NavButton text="Deconnexion" icon="pi pi-sign-out" @click="handleLogout" />
        </div>
        
      </div>

      <div class="view flex-grow bg-gray-100 p-3 overflow-y-auto">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.navigation {
  width: 18%;
}

.view {
  height: calc(100vh - 10vh);
}
</style>
