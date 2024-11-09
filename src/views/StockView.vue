<script setup>
import { reactive, computed, onMounted } from "vue";
import Button from "@/components/Button.vue";
import { useUserStore } from "@/stores/userStore";

// Importation du store utilisateur
const userStore = useUserStore();
console.log(userStore.role);

const routeByRole = {
  finance: "demandeFinance",
  Chef_de_dep: "demandeChefDep",
  dir_ge: "demandeDir",
  dep_achat: "demande",
};

// Déclaration de stocks comme une variable réactive
const stock = reactive({
  list: [],
  searchTerm: "", // Ajout d'un champ pour la recherche
});

// Fonction pour récupérer les stocks via l'API
const fetchStocks = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/stocks`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des stocks");
    }
    const data = await response.json();
    stock.list = data; // Assigner les données récupérées à stock.list
  } catch (error) {
    console.error("Erreur:", error.message);
  }
};

// Appel de la fonction fetchStocks lors du montage du composant
onMounted(() => {
  fetchStocks();
});

// Computed property pour filtrer les stocks en fonction du terme de recherche
const filteredStocks = computed(() => {
  return stock.list.filter(
    (item) =>
      item.NOM_PRODUIT.toLowerCase().includes(stock.searchTerm.toLowerCase()) ||
      item.DESCRIPTION.toLowerCase().includes(stock.searchTerm.toLowerCase()),
  );
});
</script>

<template>
  <h1 class="text-4xl mb-3">Liste des stocks</h1>

  <div class="container mt-5">
    <!-- Champ de recherche -->
    <div class="mb-3">
      <input
        type="text"
        v-model="stock.searchTerm"
        placeholder="Rechercher un produit..."
        class="form-control"
      />
    </div>

    <table class="table table-striped bg-gray-300">
      <thead class="thead-dark">
        <tr>
          <th scope="col">Nom du produit</th>
          <th scope="col">Description</th>
          <th scope="col">Quantité</th>
        </tr>
      </thead>
      <tbody>
        <!-- Boucle sur la liste des stocks filtrée -->
        <tr v-for="(item, index) in filteredStocks" :key="index">
          <td>{{ item.NOM_PRODUIT }}</td>
          <td>{{ item.DESCRIPTION }}</td>
          <td>{{ item.QTE }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
