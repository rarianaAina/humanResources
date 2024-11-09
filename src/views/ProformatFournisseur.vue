<script setup>
import { reactive, ref, onMounted } from "vue";
import Button from "@/components/Button.vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
console.log(userStore.idEmployee);

const items = reactive({
  list: [],
});

const fetchDemandes = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/proformats`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données");
    }
    const data = await response.json();
    items.list = data;
  } catch (error) {
    console.error("Erreur:", error.message);
  }
};

onMounted(() => {
  fetchDemandes();
});

const initialForm = {
  rubrique: "",
  quantite: 0,
  raison: "",
  departement: "",
  questions: {
    q1: false,
    q2: false,
    q3: false,
    q4: false,
  },
};

const form = reactive({
  ...initialForm,
});

const handleSubmit = async () => {
  const demandes = items.list.map((item) => {
    // Vérifier si l'input existe pour cet élément
    const inputElement = document.getElementById(`prix-${item.idProformat}`);
    const prixSaisi = inputElement ? parseFloat(inputElement.value) : item.PrixProduit;

    return {
      role: userStore.role,
      idProformat: item.idProformat,
      prixProduit: prixSaisi,
    };
  });

  const newDemand = demandes;

  console.log("New Demand:", newDemand);
  console.log(userStore.idEmployee);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/proformats/updatePrix`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDemand),
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de l'insertion des demandes");
    }

    const result = await response.json();
    console.log(result.message);
    closeModal();
    Object.assign(form, initialForm);
  } catch (error) {
    console.error("Erreur:", error.message);
  }
};
const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleLogout = () => {
  userStore.logout(); // Appeler la méthode de déconnexion dans le store
  router.push("/signin"); // Rediriger vers la page de connexion
};
const mapEtatToText = (EtatProformat) => {
  switch (EtatProformat) {
    case 0:
      return "En cours";
    case -1:
    case 1:
    case 2:
    case 3:
      return "Repondue";
  }
};
</script>

<template>

  <table class="min-w-full border border-gray-300">
    <thead>
      <tr class="bg-gray-200">
        <th class="border border-gray-300 px-4 py-2">Etat de la demande</th>
        <th class="border border-gray-300 px-4 py-2">Date de la demande</th>
        <th class="border border-gray-300 px-4 py-2">Produit</th>
        <th class="border border-gray-300 px-4 py-2">Quantité</th>
        <th class="border border-gray-300 px-4 py-2">Prix</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in items.list" :key="index">
        <td class="border border-gray-300 px-4 py-2">
          {{ mapEtatToText(item.EtatProformat) }}
        </td>

        <td class="border border-gray-300 px-4 py-2">{{ item.dateDemande }}</td>
        <td class="border border-gray-300 px-4 py-2">{{ item.Produit }}</td>
        <td class="border border-gray-300 px-4 py-2">{{ item.QteDemande }}</td>
        <td class="border border-gray-300 px-4 py-2">
          <template v-if="Number(item.PrixProduit) !== 0">
            {{ item.PrixProduit }}
            <!-- Affiche le prix s'il n'est pas nul -->
          </template>
          <template v-else>
            <input
              type="text"
              :id="'prix-' + item.idProformat"
              placeholder="Prix"
              class="w-full"
            />
            <!-- Champ de saisie pour le prix -->
          </template>
        </td>
      </tr>
    </tbody>
  </table>
  <Button text="Envoyer" @click="handleSubmit" />
</template>
