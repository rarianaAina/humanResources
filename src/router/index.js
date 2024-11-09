import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SigninView from "../views/SigninView.vue";
import DemandeView from "../views/DemandeView.vue";
import ProformatView from "../views/ProformatView.vue";
import BonDeCommandeView from "../views/BonDeCommandeView.vue";
import BonDeReceptionView from "../views/BonDeReceptionView.vue";
import BonDeLivraisonView from "../views/BonDeLivraisonView.vue";
import BonDeSortieView from "../views/BonDeSortieView.vue";
import StockView from "@/views/StockView.vue";
import DemandeViewEmployee from "@/views/DemandeViewEmployee.vue";
import DemandeViewFinance from "@/views/DemandeViewFinance.vue";
import DemandeViewChefDep from "@/views/DemandeViewChefDep.vue";
import DashboardLayout from "@/layouts/Dashboard.vue";
import ProformatFournisseur from "@/views/ProformatFournisseur.vue";
import TsyKoboko from "@/views/DemandeProformaView.vue";
import DemandeProformaView from "@/views/DemandeProformaView.vue";
import CommandesFournisseur from "@/views/CommandesFournisseur.vue";
import EmployeeView from "@/views/EmployeeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/signin",
      name: "signin",
      component: SigninView,
    },
    {
      path: "/",
      component: DashboardLayout,
      children: [
        {
          path: "",
          name: "home",
          component: HomeView,
        },
        {
          path: "demande",
          name: "demande",
          component: DemandeView,
        },
        {
          path: "demandeChefDep",
          name: "demandeChefDep",
          component: DemandeViewChefDep,
        },
        {
          path: "demandeFinance",
          name: "demandeFinance",
          component: DemandeViewFinance,
        },
        {
          path: "demandeEmployee",
          name: "demandeEmployee",
          component: DemandeViewEmployee,
        },
        {
          path: "stock",
          name: "stock",
          component: StockView,
        },
        {
          path: "proformat/:date",
          name: "proformat",
          component: ProformatView,
        },
        {
          path: "bon-de-commande/:date",
          name: "bon-de-commande",
          component: BonDeCommandeView,
        },
        {
          path: "bon-de-reception",
          name: "bon-de-reception",
          component: BonDeReceptionView,
        },
        {
          path: "bon-de-livraison",
          name: "bon-de-livraison",
          component: BonDeLivraisonView,
        },
        {
          path: "bon-de-sortie",
          name: "bon-de-sortie",
          component: BonDeSortieView,
        },
        {
          path: "/proformatFournisseur",
          name: "proformatFournisseur",
          component: ProformatFournisseur,
        },
        {
          path: "demande-proforma",
          name: "Demande ProformaView",
          component: DemandeProformaView,
        },
        {
          path: "commandesFournisseur",
          name: "Commandes Fournisseur",
          component: CommandesFournisseur,
        },
      ],
    },
  ],
});

export default router;
