import { defineStore } from "pinia";

export const useEtatProforma = defineStore("etatProforma", {
  state: () => ({
    date: localStorage.getItem("date"),
    etat: localStorage.getItem("etat"),
  }),
  actions: {
    setProformaState(date, etat) {
      this.date = date;
      this.etat = etat;


      // Stocker dans le local storage
      localStorage.setItem("date", date);
      localStorage.setItem("etat", etat);
    },
    logout() {
      this.date = "";
      this.etat = "";

      // Supprimer du local storage
      localStorage.removeItem("date");
      localStorage.removeItem("etat");
    },
  },
});
