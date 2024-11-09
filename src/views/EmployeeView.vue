<template>
  <div>
    <h1>Liste des Employés</h1>
    <div v-if="loading">Chargement...</div>

    <ul v-if="!loading && employes.length > 0">
      <li v-for="employe in employes" :key="employe.idEmploye">
        <router-link :to="'/employe/' + employe.idEmploye">
          {{ employe.nom }} {{ employe.idEmploye }} 
        </router-link>
      </li>
      <li v-for="employe in employes" :key="employe.email">
        {{ employe.email }}
      </li>
    </ul>

    <div v-else-if="!loading && employes.length === 0">
      Aucun employé trouvé.
    </div>

    <div v-else-if="error">{{ error }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Employe",
  data() {
    return {
      employes: [],
      loading: true,
      error: null
    };
  },
  created() {
    this.fetchEmployes();
  },
  methods: {
    async fetchEmployes() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/employes`);
        this.employes = response.data;
        this.loading = false;
      } catch (error) {
        this.error = "Une erreur est survenue.";
        this.loading = false;
      }
    }
  }
};
</script>
