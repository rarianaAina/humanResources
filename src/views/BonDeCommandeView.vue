<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Button from "@/components/Button.vue";
import Title from "@/components/Title.vue";
import Container from "@/layouts/Container.vue";
import { useEtatCommande } from "@/stores/etatCommande";
import { useEtatProforma } from "@/stores/etatProforma";
import numberToLetterMoney from "@/utils/convertion";
import { useRoute } from "vue-router";

const route = useRoute();
const commandes = ref([]); // Pour stocker les données récupérées
const date = computed(() => route.params.date);
const etatStore = useEtatCommande();

// function ref(arg0: undefined[]) {
//   throw new Error("Function not implemented.");
// }

// function computed(arg0: () => string | string[]) {
//   throw new Error("Function not implemented.");
// }
const API_URL = "http://localhost:8082/myStation/api/commandes/date";
const API_URL_2 = "http://localhost:8082/myStation/api";

const fetchCommandeByDate = async () => {
  try {
    const response = await fetch(`${API_URL}/${etatStore.date}`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des proformas");
    }
    const data = await response.json();
    console.log(data);
    commandes.value = data;
  } catch (error) {
    console.error("Erreur:", error.message);
  }
};

function livrer() {
  const confirm = window.confirm("Êtes-vous sûr de faire la commande?");
  if (!confirm) {
    return;
  }

  // Préparer les données à envoyer
  const commandeData = commandes.value.map((proforma) => ({
    dateDemande: etatStore.date, // Utilisez la date du store
    // produit: commandes.produit,
    // qteCommande: proforma.QteDemande,
  }));

  console.log(commandeData);

  // Envoi des données à l'API
  fetch(`${API_URL_2}/commandes/traiter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commandeData), // Envoi du bon format de données
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de la commande");
      }
      return response.json();
    })
    .then((data) => {
      alert("Commande enregistrée");
      // router.push('/stocdd'); // Redirection après la commande
    })
    .catch((error) => {
      console.error("Erreur:", error.message);
      alert("Échec de la commande, veuillez réessayer.");
    });
}

onMounted(fetchCommandeByDate);
</script>

<template>
  <Title text="Proforma" />
  <Container>
    <div class="container">
      <div class="flex justify-end">
        <div>
          <Title text="Fournisseurs COMPTA" />
          <span
            >Date:
            <span class="text-xl font-semibold">{{
              etatStore.date
            }}</span></span
          >
        </div>
      </div>

      <table class="table-auto w-full mt-2">
        <thead class="bg-blue-900 text-white">
          <tr>
            <th scope="col" class="px-4 py-2">Quantité</th>
            <th scope="col" class="px-4 py-2">Désignation</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(commande, index) in commandes"
            :key="index"
            :class="index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'"
          >
            <td class="border px-4 py-2">{{ commande.qte }}</td>
            <td class="border px-4 py-2">{{ commande.produit }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex justify-between px-5 mt-6">
      <div class="max-w-sm mb-8 w-1/2">
        <Button
          text="Retour"
          variant="neutral"
          @click="$router.push('/commandesFournisseur')"
        />
      </div>
      <div class="max-w-sm mb-8 w-1/2">
        <Button
          v-if="etatStore.etat !== 'Livrée'"
          text="Livrer"
          @click="livrer"
        />
      </div>
    </div>
  </Container>
</template>
