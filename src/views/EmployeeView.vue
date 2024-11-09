<template>
    <div>
      <h1>Liste des Employés</h1>
      <!-- Afficher un message de chargement pendant la récupération des données -->
      <div v-if="loading">Chargement...</div>
  
      <!-- Afficher la liste des employés une fois les données récupérées -->
      <ul v-if="!loading && employes.length > 0">
        <li v-for="employe in employes" :key="employe.idEmploye">
          {{ employe.nom }} {{ employe.prenom }}
        </li>
      </ul>
  
      <!-- Afficher un message si aucun employé n'est trouvé -->
      <div v-else-if="!loading && employes.length === 0">
        Aucun employé trouvé.
      </div>
  
      <!-- Afficher une erreur si la récupération des données échoue -->
      <div v-else-if="error">{{ error }}</div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "Employe",
    data() {
      return {
        employes: [],  // Liste des employés
        loading: true,  // Indicateur de chargement
        error: null,    // Message d'erreur en cas de problème
      };
    },
    created() {
      // Lors de la création du composant, récupérer la liste des employés
      this.fetchEmployes();
    },
    methods: {
      async fetchEmployes() {
        try {
          // Effectuer la requête API pour récupérer les employés
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/employes`);
          this.employes = response.data; // Remplir la liste des employés
          this.loading = false; // Indiquer que les données sont chargées
        } catch (error) {
          // En cas d'erreur, afficher un message d'erreur
          this.error = "Une erreur est survenue lors de la récupération des employés.";
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Styles de la page Employe.vue */
  h1 {
    font-size: 2rem;
    margin-bottom: 20px;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    padding: 8px 0;
    font-size: 1.2rem;
  }
  </style>
  