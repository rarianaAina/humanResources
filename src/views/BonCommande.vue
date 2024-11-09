<template>
    <div class="bon-commande">
      <h2 class="text-center">Bon de Commande #{{ order.id }}</h2>
      
      <!-- Informations sur le client -->
      <div class="client-info">
        <p><b>Client:</b> {{ order.client.name }}</p>
        <p><b>Adresse:</b> {{ order.client.address }}</p>
      </div>
      
      <!-- Table des produits commandés -->
      <table class="table-auto w-full">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Prix Unitaire</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <ProductLine v-for="(product, index) in order.products" :key="index" :product="product" />
        </tbody>
      </table>
      
      <!-- Total de la commande -->
      <div class="total-commande text-right mt-4">
        <p><b>Total :</b> {{ total }} €</p>
      </div>
    </div>
  </template>
  
  <script>
  import ProductLine from './ProductLine.vue';
  
  export default {
    components: {
      ProductLine
    },
    props: {
      order: {
        type: Object,
        required: true
      }
    },
    computed: {
      total() {
        return this.order.products.reduce((sum, product) => {
          return sum + product.quantity * product.unit_price;
        }, 0);
      }
    }
  };
  </script>
  
  <style scoped>
  /* Styles de base */
  .bon-commande {
    width: 80%;
    margin: 0 auto;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .client-info {
    margin-bottom: 20px;
  }
  .table-auto {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #ddd;
  }
  .total-commande {
    font-size: 18px;
  }
  </style>
  