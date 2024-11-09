<script setup>
import { reactive, ref, onMounted } from "vue";
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
// Vérifier si l'utilisateur est authentifié
if (!userStore.isAuthenticated) {
  // Rediriger ou afficher un message d'erreur
  console.error("Utilisateur non authentifié !");
  // Exemple de redirection vers la page de connexion (si une route est définie)
  router.push("/signin");
}

// Réactive liste des items récupérés via l'API
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
  // Logique pour soumettre les demandes de proformat
  console.log("Demande de proformat soumise:", demandes.value);
  // Effectuer l'appel API pour soumettre les demandes
};
// Déclaration de departments comme une variable réactive
const departments = reactive({
  list: [],
});

// Fonction pour récupérer les données depuis l'API
const fetchDemandes = async () => {
  try {
    const role = userStore.role; // Remplacez cela par la logique pour obtenir le rôle de l'utilisateur
    console.log(role);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/demandes?role=${encodeURIComponent(
        role,
      )}`,
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données");
    }
    const data = await response.json();
    items.list = data; // Assigner les données récupérées à items.list
  } catch (error) {
    console.error("Erreur:", error.message);
  }
};

// const handleValidate = async (idDemande) => {
//   await handleAction(idDemande, false); // false pour valider
// };

// const handleRefuse = async (idDemande) => {
//   await handleAction(idDemande, true); // true pour refuser
// };
const showQuestionnaireRefuser = async (idDemande, isRefuser, isValider) => {
  // Questions du questionnaire
  const questions = [
    "Question 1 : Êtes vous sûr(e) de vouloir annuler ?",
    "Question 2 : Avez-vous évalué plusieurs fournisseurs pour obtenir la meilleure offre ?",
    "Question 3 : Avez vous informé le demandeur ?",
    // "Question 4 : Quels sont les coûts supplémentaires associés à cet achat (ex. : maintenance, formation, transport) ?",
  ];

  // Stockage des réponses
  const responses = [];

  for (let i = 0; i < questions.length; i++) {
    // Demande de confirmation pour chaque question
    const response = confirm(questions[i]); // Utilisez prompt ou une autre méthode pour une interface plus riche
    responses.push(response);
  }
};
const showQuestionnaire = async (idDemande, isRefuser, isValider) => {
  // Questions du questionnaire
  const questions = [
    "Question 1 : L'achat est-il conforme aux politiques d'achat de l'entreprise ?",
    "Question 2 : Avez-vous évalué plusieurs fournisseurs pour obtenir la meilleure offre ?",
    "Question 3 : Le produit ou service est-il nécessaire pour l'opération actuelle de l'entreprise ?",
    "Question 4 : Pouvons nous assurer les coût de cet achat ?",
  ];

  // Stockage des réponses
  const responses = [];

  for (let i = 0; i < questions.length; i++) {
    // Demande de confirmation pour chaque question
    const response = confirm(questions[i]); // Utilisez prompt ou une autre méthode pour une interface plus riche
    responses.push(response);
  }

  // Vérifiez les réponses
  const allConfirmed = responses.every((response) => response === true);
  if (allConfirmed) {
    // Si toutes les questions sont confirmées, appelez handleAction
    await handleAction(idDemande, isRefuser, isValider);
  } else {
    console.log("Action annulée par l'utilisateur.");
  }
};

const handleAction = async (idDemande, isRefuser, isValider) => {
  const action = { idDemande, isRefuser, isValider, role: userStore.role }; // Ajout du role
  console.log("Action envoyée:", action);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/demandes/traiter`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([action]), // Envoyer en tant que tableau d'action
      },
    );

    if (!response.ok) {
      throw new Error("Erreur lors du traitement de la demande");
    }

    const result = await response.json();
    console.log(result.message);
    fetchDemandes(); // Recharger les demandes après traitement
  } catch (error) {
    console.error("Erreur:", error.message);
  }
};

// Fonction pour récupérer les départements depuis l'API
const fetchDepartments = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/departements`,
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des départements");
    }
    const data = await response.json();
    departments.list = data; // Assigner les données récupérées à departments.list
  } catch (error) {
    console.error("Erreur:", error.message);
  }
};

// Récupérer les données lorsque le composant est monté
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
        idEmployee: userStore.idEmployee, // Utilisez idEmployee pour la demande
        rubriques: form.rubrique,
        qte: form.quantite,
        raison: form.raison,
        etat: "0", // Ou toute autre valeur par défaut
        departement: form.departement,
        role: userStore.role,
      },
    ],
  };
  console.log("New Demand:", newDemand);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/demandes/inserer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDemand),
      },
    );

    if (!response.ok) {
      throw new Error("Erreur lors de l'insertion des demandes");
    }

    const result = await response.json();
    console.log(result.message);
    closeModal(); // Fermer le modal après l'ajout
    Object.assign(form, initialForm); // Réinitialiser le formulaire
    // Vous pouvez également recharger les demandes ici si nécessaire
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
      return "Inconnu"; // Pour gérer les états non définis
  }
};

const isModalOpen = ref(false); // State to control modal visibility
const isModalProfOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true; // Open the modal
};

const closeModal = () => {
  isModalOpen.value = false; // Close the modal
};

const openProfModal = () => {
  isModalProfOpen.value = true; // Open the modal
};

const closeProfModal = () => {
  isModalProfOpen.value = false; // Close the modal
};
const handleLogout = () => {
  userStore.logout(); // Appeler la méthode de déconnexion dans le store
  router.push("/signin"); // Rediriger vers la page de connexion
};
</script>

<template>
  <div class="container m-auto max-w-4xl mt-8">
    <div class="flex flex-wrap justify-between">
      <div class="max-w-sm mb-8 w-1/2">
        <Button text="Se déconnecter" @click="handleLogout" />
      </div>
      <div class="max-w-sm mb-8 w-1/2">
        <Button text="Checker stock" @click="$router.push('/stock')" />
      </div>
      <!-- <div class="max-w-sm mb-8 w-1/2">
        <Button text="Demandes validées" @click="openModal" />
      </div> -->
    </div>

    <table class="table table-striped bg-gray-300 max-w-4xl overflow-x-auto">
      <thead class="thead-dark">
        <tr class="bg-gray-200">
          <th class="border border-gray-300 px-4 py-2">Département</th>
          <th class="border border-gray-300 px-4 py-2">Rubrique</th>
          <th class="border border-gray-300 px-4 py-2">Quantité</th>
          <th class="border border-gray-300 px-4 py-2">Raison</th>
          <th class="border border-gray-300 px-4 py-2">État</th>
          <th class="border border-gray-300 px-4 py-2">Valider</th>
          <th class="border border-gray-300 px-4 py-2">Refuser</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items.list" :key="index">
          <td class="border border-gray-300 px-4 py-2">
            {{ item.nomDepartement }}
          </td>
          <td class="border border-gray-300 px-4 py-2">{{ item.rubriques }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ item.qte }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ item.raison }}</td>
          <td class="border border-gray-300 px-4 py-2">
            {{ mapEtatToText(item.etat) }}
          </td>
          <td v-if="item.etat == '2'">
            <Button
              text="Valider"
              @click="showQuestionnaire(item.idDemande, false, true)"
              class="px-2 py-1 text-sm"
            />
          </td>
          <td v-if="item.etat == '2'">
            <Button
              text="Refuser"
              @click="showQuestionnaireRefuser(item.idDemande, true, false)"
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
