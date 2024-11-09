import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    isAuthenticated: !!localStorage.getItem("isAuthenticated"),
    role: localStorage.getItem("userRole") || null, // Récupérer le rôle depuis le local storage
    idEmployee: localStorage.getItem("idEmployee") || null, // Récupérer l'idEmployee depuis le local storage
  }),
  actions: {
    login(userRole, employeeId) {
      this.isAuthenticated = true;
      this.role = userRole;
      this.idEmployee = employeeId;

      // Stocker dans le local storage
      localStorage.setItem("isAuthenticated", true);
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("idEmployee", employeeId);
    },
    logout() {
      this.isAuthenticated = false;
      this.role = null;
      this.idEmployee = null;

      // Supprimer du local storage
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("idEmployee");
    },
  },
});
