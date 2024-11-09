<template>
    <div>
      <h1>Détails de l'Employé</h1>
  
      <!-- Affichage de l'employé -->
      <div v-if="employee && !loading">
        <h2>{{ employee.nom }} {{ employee.prenom }}</h2>
        <p><strong>Email:</strong> {{ employee.email }}</p>
        <p><strong>Département:</strong> {{ employee.departement }}</p>
  
        <!-- Affichage des compétences -->
        <h3>Compétences</h3>
        <ul>
          <li v-for="competence in competences" :key="competence.idCompetence">
            {{ competence.nom }}
          </li>
        </ul>
      </div>
  
      <!-- Message de chargement -->
      <div v-if="loading">Chargement des données...</div>
  
      <!-- Affichage d'une erreur -->
      <div v-if="error">{{ error }}</div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'EmployeeDetailsView',
    props: ['idEmploye'], // Récupérer l'idEmploye via les props (via Vue Router)
    data() {
      return {
        employee: null,     // Détails de l'employé
        competences: [],    // Liste des compétences
        loading: true,      // Indicateur de chargement
        error: null         // Message d'erreur
      };
    },
    created() {
      this.fetchEmployeeDetails();
    },
    methods: {
      async fetchEmployeeDetails() {
        try {
          // Récupérer les détails de l'employé
          const employeeResponse = await axios.get(`${import.meta.env.VITE_API_URL}/employes/${this.idEmploye}`);
          this.employee = employeeResponse.data;
  
          // Récupérer les compétences de l'employé
          const competencesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/employes/${this.idEmploye}/competences`);
          this.competences = competencesResponse.data;
  
          this.loading = false; // Fin du chargement
        } catch (error) {
          this.error = "Une erreur est survenue lors du chargement des données.";
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  h1 {
    font-size: 2rem;
  }
  h2 {
    font-size: 1.5rem;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    padding: 5px 0;
  }
  </style>
  