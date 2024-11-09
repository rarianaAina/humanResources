<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import Title from "@/components/Title.vue";
import Container from "@/layouts/Container.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { useEtatProforma } from "@/stores/etatProforma";

const router = useRouter();
const userStore = useUserStore();
const etatProformat = useEtatProforma();

interface Proformat {
  dateDemande: string;
  EtatProformat: number;
}

const proformas = ref<Proformat[]>([]);

const API_URL = 'http://localhost:8082/myStation/api';

const fetchProformas = async () => {
  try {
    const response = await fetch(`${API_URL}/proformats`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des proformas");
    }
    const data = await response.json();
    proformas.value = data;
  } catch (error) {
    console.error("Erreur:", error.message);
  }
};

// Fonction pour regrouper les proformats par dateDemande
const groupedProformas = computed(() => {
  return proformas.value.reduce((acc, proformat) => {
    const date = proformat.dateDemande;
    if (!acc[date]) {
      acc[date] = proformat.EtatProformat;
    }
    return acc;
  }, {} as Record<string, number>);
});

const navigateToDate = (dateDemande: string, etat: string) => {
  etatProformat.setProformaState(dateDemande, etat)
  router.push(`/proformat/${dateDemande}`);
};

function formatDateToISO(dateStr: string) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function mapToStringEtat(etatNbr: number) {
  return etatNbr === 2 ? "Validée" : "En cours"
}

const showQuestionnaire = async (idProformat, isRefuser, isValider) => {
  let questions;

  if (isRefuser) {
    questions = [
      "Question 1 : Êtes-vous sûr(e) de vouloir annuler ?",
      "Question 2 : Avez-vous évalué plusieurs fournisseurs pour obtenir la meilleure offre ?",
      "Question 3 : Avez-vous informé le demandeur ?",
    ];
  } else if (isValider) {
    questions = [
      "Question 1 : L'achat est-il conforme aux politiques d'achat de l'entreprise ?",
      "Question 2 : Avez-vous évalué plusieurs fournisseurs pour obtenir la meilleure offre ?",
      "Question 3 : Le produit ou service est-il nécessaire pour l'opération actuelle de l'entreprise ?",
    ];
  } else {
    console.log("Aucune action valide spécifiée.");
    return; // Sort de la fonction si aucune action valide
  }

  const responses = [];

  // Utilisez prompt ou une autre méthode pour une interface plus riche
  for (let i = 0; i < questions.length; i++) {
    const response = confirm(questions[i]);
    responses.push(response);
  }

  const allConfirmed = responses.every((response) => response === true);
  if (allConfirmed) {
    await handleAction(idProformat, isRefuser, isValider);
  } else {
    console.log("Action annulée par l'utilisateur.");
  }
};

const handleAction = async (idProformat, isRefuser, isValider) => {
  const dateProformatt = formatDateToISO(idProformat)
  const action = { dateProformatt, isRefuser, isValider, role: userStore.role };
  console.log("Action envoyée:", action);
  try {
    const response = await fetch(
      `${API_URL}/proformats/updateEtatFinance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([action]),
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors du traitement de la demande");
    }

    const result = await response.json();
    console.log(result.message);
    fetchProformas();
  } catch (error) {
    console.error("Erreur:", error.message);
  }
};
onMounted(fetchProformas);
</script>

<template>
  <Title text="Mes proformas" />
  <Container>
    <table class="table-auto w-full">
      <thead class="bg-blue-900 text-white">
        <tr>
          <th scope="col" class="px-4 py-2">Date</th>
          <th scope="col" class="px-4 py-2">Etat proformat</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(EtatProformat, dateProformat) in groupedProformas" :key="dateProformat">
          <td class="border px-4 py-2">
            <!-- Lien seulement sur la date -->
            <a @click.prevent="navigateToDate(formatDateToISO(dateProformat), mapToStringEtat(EtatProformat))" class="text-blue-500 underline cursor-pointer">
              {{ formatDateToISO(dateProformat) }}
            </a>
          </td>
          <td class="border px-4 py-2">
            <div v-if="EtatProformat === 1 && (userStore.role === 'finance')">
              <button @click="showQuestionnaire(dateProformat, false, true)" class="bg-green-500 text-white px-4 py-1 rounded mr-2">Valider</button>
              <button @click="showQuestionnaire(dateProformat, true, false)" class="bg-red-500 text-white px-4 py-1 rounded">Refuser</button>
            </div>
            <div v-else>
              {{ mapToStringEtat(EtatProformat) }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </Container>
</template>
