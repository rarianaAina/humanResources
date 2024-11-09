<script setup>
import { reactive, ref, onMounted } from "vue";
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
if (!userStore.isAuthenticated) {
  console.error("Utilisateur non authentifié !");
  router.push("/signin");
}

const items = reactive({
  list: [],
});

const demandes = ref([{ rubrique: "", quantite: 0 }]);

const addDemande = () => {
  demandes.value.push({ rubrique: "", quantite: 0 });
};

const removeDemande = (index) => {
  demandes.value.splice(index, 1);
};

const submitProformatRequests = async () => {
  console.log("Demande de proformat soumise:", demandes.value);
};

const departments = reactive({
  list: [],
});

const fetchDemandes = async () => {
  try {
    const role = userStore.role; // rôle de l'utilisateur
    console.log(role);
    console.log(`${import.meta.env.VITE_API_URL}/demandes?role=${encodeURIComponent(role)}`)

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/demandes?role=${encodeURIComponent(
        role
      )}`
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données");
    }
    const data = await response.json();
    items.list = data;   } catch (error) {
    console.error("Erreur:", error.message);
  }
};
const showQuestionnaire = async (idDemande, isRefuser, isValider) => {
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
    await handleAction(idDemande, isRefuser, isValider);
  } else {
    console.log("Action annulée par l'utilisateur.");
  }
};

const handleAction = async (idDemande, isRefuser, isValider) => {
  const action = { idDemande, isRefuser, isValider, role: userStore.role }; 
  console.log("Action envoyée:", action);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/demandes/traiter`,
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
    fetchDemandes();
  } catch (error) {
    console.error("Erreur:", error.message);
  }
};


const fetchDepartments = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/departements`
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des départements");
    }
    const data = await response.json();
    departments.list = data;   } catch (error) {
    console.error("Erreur:", error.message);
  }
};

onMounted(() => {
  fetchDemandes();
  fetchDepartments();
});

const initialForm = {
  rubrique: "",
  quantite: 0,
  raison: "",
  departement: "",
};

const form = reactive({
  ...initialForm,
});

const handleSubmit = async () => {
  const newDemand = {
    demandes: [
      {
        idEmployee: userStore.idEmployee, 
        rubriques: form.rubrique,
        qte: form.quantite,
        raison: form.raison,
        etat: "0", 
        departement: form.departement,
        role: userStore.role,
                  },
    ],
  };
  console.log("New Demand:", newDemand);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/demandes/inserer`,
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

// Fonction pour mapper l'état
const mapEtatToText = (etat) => {
  switch (etat) {
    case "0":
    case "1":
    case "2":
    case "3":
      return "En cours";
    case "-1":
      return "Refusée";
    case "4":
      return "Validée";
    default:
      return "Inconnu"; 
  }
};

const isModalOpen = ref(false);
const isModalProfOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true; // Open the modal
};

const closeModal = () => {
  isModalOpen.value = false; // Close the modal
};

const openProfModal = () => {
  isModalProfOpen.value = true; 
};

const closeProfModal = () => {
  isModalProfOpen.value = false; 
};
const handleLogout = () => {
  userStore.logout(); 
  router.push("/signin");
};
</script>

<template>
  <div class="container m-auto max-w-4xl overflow-x-auto mt-8">
    <div class="flex flex-wrap justify-between">
      <div class="max-w-sm mb-8 w-1/2">
        <Button text="Se déconnecter" @click="handleLogout" />
      </div>
    </div>

    <table class="min-w-full border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-gray-300 px-4 py-2">Département</th>
          <th class="border border-gray-300 px-4 py-2">Rubrique</th>
          <th class="border border-gray-300 px-4 py-2">Quantité</th>
          <th class="border border-gray-300 px-4 py-2">Raison</th>
          <th class="border border-gray-300 px-4 py-2">État</th>
          <th class="border border-gray-300 px-4 py-2">V</th>
          <th class="border border-gray-300 px-4 py-2">R</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in items.list"
          :key="index"
          :class="{
            'bg-green-100': item.etat === '4',
            'bg-red-500': item.etat === '-1',
            'bg-white': item.etat !== '4' && item.etat !== '-1',
          }"
        >
          <td class="border border-gray-300 px-4 py-2">
            {{ item.nomDepartement }}
          </td>
          <td class="border border-gray-300 px-4 py-2">{{ item.rubriques }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ item.qte }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ item.raison }}</td>
          <td class="border border-gray-300 px-4 py-2">
            {{ mapEtatToText(item.etat) }}
          </td>
          <td
            v-if="
              item.etat !== '4' &&
              item.etat !== '-1' &&
              item.etat !== '3' &&
              item.etat !== '2' &&
              item.etat !== '1'
            "
          >
            <Button
              text="Valider"
              @click="showQuestionnaire(item.idDemande, false, true)"
              class="px-2 py-1 text-sm"
            />
          </td>
          <td
            v-if="
              item.etat !== '4' &&
              item.etat !== '-1' &&
              item.etat !== '3' &&
              item.etat !== '2' &&
              item.etat !== '1'
            "
          >
            <Button
              text="Refuser"
              @click="showQuestionnaire(item.idDemande, true, false)"
              class="px-2 py-1 text-sm"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <h2 class="text-xl font-bold mb-4">Faire une demande</h2>
        <Input
          v-model="form.rubrique"
          label="Rubrique"
          placeholder="Entrer rubrique"
        />
        <Input
          v-model="form.quantite"
          label="Quantité"
          type="number"
          placeholder="Entrer quantité"
        />
        <Input
          v-model="form.raison"
          label="Raison"
          placeholder="Entrer raison"
        />

        <!-- Menu déroulant pour le département -->
        <label class="block mb-2">Choix de Département</label>
        <select
          v-model="form.departement"
          class="border border-gray-300 p-2 w-full mb-4"
        >
          <option value="" disabled>Choisir un département</option>
          <option
            v-for="department in departments.list"
            :key="department.id"
            :value="department.nomDepartement"
          >
            {{ department.nomDepartement }}
          </option>
        </select>

        <div class="flex gap-5 mt-4">
          <Button text="Annuler" @click="closeModal" />
          <Button text="Ajouter" @click="handleSubmit" />
        </div>
      </div>
    </div>
    <div
      v-if="isModalProfOpen"
      class="fixed inset-0 flex justify-center items-center"
    >
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl mb-4">Demande de proformat</h2>
        <form @submit.prevent="submitProformatRequests">
          <div class="space-y-4">
            <div
              v-for="(demande, index) in demandes"
              :key="index"
              class="flex space-x-2"
            >
              <Input v-model="demande.rubrique" label="Rubrique" />
              <Input
                v-model="demande.quantite"
                label="Quantité"
                type="number"
              />

              <Button text="Supprimer" @click="removeDemande(index)" />
            </div>
            <Button text="Ajouter une demande" @click="addDemande" />
          </div>
          <div class="flex justify-end mt-4">
            <Button text="Soumettre" type="submit" />
            <Button text="Fermer" @click="closeProfModal" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
