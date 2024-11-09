<script setup>
import { reactive, ref, onMounted } from "vue";
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";


const router = useRouter();
const userStore = useUserStore();
console.log(userStore.idEmployee);

// Réactive liste des items récupérés via l'API
const items = reactive({
  list: [],
});

// Déclaration de departments comme une variable réactive
const departments = reactive({
  list: [],
});

// Fonction pour récupérer les données depuis l'API
const fetchDemandes = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/demandes`
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

// Fonction pour récupérer les départements depuis l'API
const fetchDepartments = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/departements`
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
  if (!form.questions.q1 || !form.questions.q2 || !form.questions.q3 || !form.questions.q4) {
    alert("Veuillez répondre à toutes les questions."); // Alerte si une question est manquante
    return; // Empêche la soumission
  }
  const newDemand = {
    demandes: [
      {
        idEmployee: userStore.id, // Assurez-vous que vous avez l'ID de l'employé ici
        rubriques: form.rubrique,
        qte: form.quantite,
        raison: form.raison,
        etat: '0', // Ou toute autre valeur par défaut
        departement: form.departement
        
      }
    ]
  };
  console.log('New Demand:', newDemand);
  console.log(userStore.idEmployee);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/demandes/inserer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDemand),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'insertion des demandes');
    }

    const result = await response.json();
    console.log(result.message);
    closeModal(); // Fermer le modal après l'ajout
    Object.assign(form, initialForm); // Réinitialiser le formulaire
    // Vous pouvez également recharger les demandes ici si nécessaire
  } catch (error) {
    console.error('Erreur:', error.message);
  }
};

const isModalOpen = ref(false); // State to control modal visibility

const openModal = () => {
  isModalOpen.value = true; // Open the modal
};

const closeModal = () => {
  isModalOpen.value = false; // Close the modal
};

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
const handleLogout = () => {
  userStore.logout(); // Appeler la méthode de déconnexion dans le store
  router.push("/signin"); // Rediriger vers la page de connexion
};




</script>

<template>
  <div class="container m-auto max-w-4xl overflow-x-auto mt-8">
    <div class="flex flex-wrap justify-between">
      <div class="max-w-sm mb-8 w-1/2">
        <Button text="Faire une demande" @click="openModal" />
      </div>
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
          <!-- <th class="border border-gray-300 px-4 py-2">Valider</th>
          <th class="border border-gray-300 px-4 py-2">Refuser</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items.list" :key="index">
          <td class="border border-gray-300 px-4 py-2">{{ item.nomDepartement }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ item.rubriques }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ item.qte }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ item.raison }}</td>
          <td class="border border-gray-300 px-4 py-2">
            {{ mapEtatToText(item.etat) }}
          </td>
          <!-- <td class="border border-gray-300 px-4 py-2"> <input type="checkbox" id="valider" name="valider" /> </td>
          <td class="border border-gray-300 px-4 py-2"> <input type="checkbox" id="refuser" name="refuser" /> </td> -->
        </tr>
      </tbody>
    </table>

    <div
  v-if="isModalOpen"
  class="absolute inset-0 bg-black bg-opacity-80 flex justify-center items-center z-40"

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
      <select v-model="form.departement" class="border border-gray-300 p-2 w-full mb-4">
        <option value="" disabled>Choisir un département</option>
        <option v-for="department in departments.list" :key="department.id" :value="department.nomDepartement">
          {{ department.nomDepartement }}
        </option>
      </select>
    <!-- Questionnaire avec cases à cocher -->
    <div class="mt-4">
      <h3 class="text-lg font-semibold mb-2">Questionnaire</h3>
      <div class="flex flex-col">
        <label class="flex items-center mb-2">
          <input type="checkbox" v-model="form.questions.q1" class="mr-2" />
          <span>Question 1 : Avez-vous bien vérifié que toutes les informations saisies dans la demande sont correctes ?</span>
        </label>
        <label class="flex items-center mb-2">
          <input type="checkbox" v-model="form.questions.q2" class="mr-2" />
          <span>Question 2 : Êtes-vous sûr(e) que la quantité demandée est correcte et justifiée ?</span>
        </label>
        <label class="flex items-center mb-2">
          <input type="checkbox" v-model="form.questions.q3" class="mr-2" />
          <span>Question 3 : Avez-vous consulté votre supérieur ou le département concerné concernant cette demande ?</span>
        </label>
        <label class="flex items-center mb-2">
          <input type="checkbox" v-model="form.questions.q4" class="mr-2" />
          <span>Question 4 : Comprenez-vous les implications de cette demande sur votre département et l'entreprise ?</span>
        </label>
      </div>
    </div>

    <div class="flex gap-5 mt-4">
      <Button text="Annuler" @click="closeModal" />
      <Button text="Ajouter" @click="handleSubmit" />
    </div>
  </div>
</div>

  </div>
</template>
