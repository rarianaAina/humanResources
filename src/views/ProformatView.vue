<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Title from "@/components/Title.vue";
import Container from "@/layouts/Container.vue";
import Button from "@/components/Button.vue";
import { useEtatProforma } from "@/stores/etatProforma";
import { useRouter } from "vue-router";
import numberToLetterMoney from "@/utils/convertion";

const route = useRoute();
const proformas = ref([]); // Pour stocker les données récupérées
const date = computed(() => route.params.date);
const etatStore = useEtatProforma();

const API_URL = "http://localhost:8082/myStation/api/proformats/date"; // URL de l'API pour les proformas par date

// Fonction pour récupérer les proformas en fonction de la date
const fetchProformasByDate = async () => {
  try {
    const response = await fetch(`${API_URL}/${date.value}`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des proformas");
    }
    const data = await response.json();
    proformas.value = data; // Stocker les données dans la référence
  } catch (error) {
    console.error("Erreur:", error.message);
  }
};

function demander() {
  const confirm = window.confirm("Êtes-vous sûr de faire la commande?");
  if (!confirm) {
    return;
  }

  // Préparer les données à envoyer
  const commandeData = {
    commandes: proformas.value.map((proforma) => ({
      dateCommande: etatStore.date, // Utilisez la date du store
      produit: proforma.Produit,
      qteCommande: proforma.QteDemande,
    })),
  };
  console.log(commandeData);
  // Envoi des données à l'API
  fetch(`${import.meta.env.VITE_API_URL}/commandes/inserer`, {
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

// Récupérer les proformas lors du montage du composant
onMounted(fetchProformasByDate);
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
            <th scope="col" class="px-4 py-2">Prix unitaire</th>
            <th scope="col" class="px-4 py-2">Montant</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(proforma, index) in proformas"
            :key="index"
            :class="index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'"
          >
            <td class="border px-4 py-2">{{ proforma.QteDemande }}</td>
            <td class="border px-4 py-2">{{ proforma.Produit }}</td>
            <td class="border px-4 py-2">{{ proforma.PrixProduit }} Ar</td>
            <td class="border px-4 py-2">
              {{ (proforma.QteDemande * proforma.PrixProduit).toFixed(1) }} Ar
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="bg-gray-50 text-black">
            <td colspan="3" class="px-4 py-2 text-right font-bold">Total</td>
            <td class="border px-4 py-2 font-bold">
              {{
                proformas
                  .reduce(
                    (total, item) => total + item.QteDemande * item.PrixProduit,
                    0,
                  )
                  .toFixed(1)
              }}
              Ar
            </td>
          </tr>
        </tfoot>
      </table>

      <div
        class="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm"
      >
        Arrêtée à la somme de:
        <span class="text-xl font-semibold text-gray-800">
          {{
            numberToLetterMoney(
              proformas.reduce(
                (total, item) => total + item.QteDemande * item.PrixProduit,
                0,
              ),
            )
          }}
        </span>
      </div>
    </div>
    <div class="flex justify-between px-5 mt-6">
      <div class="max-w-sm mb-8 w-1/2">
        <Button
          text="Retour"
          variant="neutral"
          @click="$router.push('/demande-proforma')"
        />
      </div>
      <div class="max-w-sm mb-8 w-1/2">
        <Button
          v-if="etatStore.etat === 'Validée'"
          text="Commander"
          @click="demander"
        />
      </div>
    </div>
  </Container>
</template>
