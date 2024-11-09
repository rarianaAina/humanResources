<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import Title from "@/components/Title.vue";
import Container from "@/layouts/Container.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { useEtatCommande } from "@/stores/etatCommande";

const router = useRouter();
const userStore = useUserStore();
const etatCommande = useEtatCommande();

interface Commande {
  dateCommande: string;
  etatCommande: number;
}

const commandes = ref<Commande[]>([]);

const API_URL = import.meta.env.VITE_API_URL;

const fetchCommandes = async () => {
  try {
    const response = await fetch(`${API_URL}/commandes`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des commandes");
    }
    const data = await response.json();
    commandes.value = data;
  } catch (error) {
    console.error("Erreur:", error.message);
  }
};

// Fonction pour regrouper les commandes par dateCommande
const groupedCommandes = computed(() => {
  return commandes.value.reduce(
    (acc, commande) => {
      const date = commande.dateCommande;
      if (!acc[date]) {
        acc[date] = commande.etatCommande;
      }
      return acc;
    },
    {} as Record<string, number>,
  );
});

const navigateToDate = (dateCommande: string, etat: string) => {
  etatCommande.setCommandeState(dateCommande, etat);
  router.push(`/bon-de-commande/${dateCommande}`);
};

function formatDateToISO(dateStr: string) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function mapToStringEtat(etatNbr: number) {
  return etatNbr === 1 ? "Livrée" : "En cours";
}

const showQuestionnaire = async (idCommande, isRefuser, isValider) => {
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
    await handleAction(idCommande, isRefuser, isValider);
  } else {
    console.log("Action annulée par l'utilisateur.");
  }
};

const handleAction = async (idCommande, isRefuser, isValider) => {
  const dateCommande = formatDateToISO(idCommande);
  const action = { dateCommande, isRefuser, isValider, role: userStore.role };
  console.log("Action envoyée:", action);
  try {
    const response = await fetch(`${API_URL}/commandes/updateEtatFinance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([action]),
    });

    if (!response.ok) {
      throw new Error("Erreur lors du traitement de la demande");
    }

    const result = await response.json();
    console.log(result.message);
    fetchCommandes();
  } catch (error) {
    console.error("Erreur:", error.message);
  }
};
onMounted(fetchCommandes);
</script>

<template>
  <Title text="Mes commandes" />
  <Container>
    <table class="table-auto w-full">
      <thead class="bg-blue-900 text-white">
        <tr>
          <th scope="col" class="px-4 py-2">Date</th>
          <th scope="col" class="px-4 py-2">Etat commande</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(EtatCommande, dateCommande) in groupedCommandes"
          :key="dateCommande"
        >
          <td class="border px-4 py-2">
            <!-- Lien seulement sur la date -->
            <a
              @click.prevent="
                navigateToDate(
                  formatDateToISO(dateCommande),
                  mapToStringEtat(EtatCommande),
                )
              "
              class="text-blue-500 underline cursor-pointer"
            >
              {{ formatDateToISO(dateCommande) }}
            </a>
          </td>
          <td class="border px-4 py-2">
            <div v-if="EtatCommande === 1 && userStore.role === 'finance'">
              <button
                @click="showQuestionnaire(dateCommande, false, true)"
                class="bg-green-500 text-white px-4 py-1 rounded mr-2"
              >
                Valider
              </button>
              <button
                @click="showQuestionnaire(dateCommande, true, false)"
                class="bg-red-500 text-white px-4 py-1 rounded"
              >
                Refuser
              </button>
            </div>
            <div v-else>
              {{ mapToStringEtat(EtatCommande) }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </Container>
</template>
