<template>
    <div class="bon-reception">
      <h2>Bon de Réception</h2>
      
      <div class="fournisseur-info">
        <p><strong>Fournisseur :</strong> {{ reception.fournisseur.name }}</p>
        <p><strong>Adresse :</strong> {{ reception.fournisseur.address }}</p>
        <p><strong>Date de réception :</strong> {{ reception.dateReception }}</p>
      </div>
  
      <div class="produits">
        <h3>Produits reçus</h3>
        <ul>
          <li v-for="(produit, index) in reception.products" :key="index">
            {{ produit.name }} - Quantité : {{ produit.quantity }}
          </li>
        </ul>
      </div>
  
      <div class="footer">
        <p><strong>Total Produits :</strong> {{ totalProduits }} articles</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      reception: {
        type: Object,
        required: true
      }
    },
    computed: {
      totalProduits() {
        return this.reception.products.reduce((acc, produit) => acc + produit.quantity, 0);
      }
    }
  };
  </script>
  
  <style scoped>
  .bon-reception {
    border: 1px solid #ccc;
    padding: 20px;
    margin: 10px;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  .fournisseur-info {
    margin-bottom: 20px;
  }
  .produits ul {
    list-style: none;
    padding: 0;
  }
  .produits li {
    padding: 5px 0;
  }
  .footer {
    margin-top: 20px;
    font-weight: bold;
  }
  </style>
  