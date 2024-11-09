<template>
    <div class="bon-livraison">
      <h2>Bon de Livraison N° {{ delivery.id }}</h2>
      
      <div class="client-info">
        <h3>Client :</h3>
        <p><strong>Nom :</strong> {{ delivery.client.name }}</p>
        <p><strong>Adresse :</strong> {{ delivery.client.address }}</p>
      </div>
  
      <div class="delivery-info">
        <h3>Détails de la Livraison :</h3>
        <p><strong>Date de Livraison :</strong> {{ delivery.date }}</p>
        <p><strong>Livré par :</strong> {{ delivery.deliveryPerson }}</p>
      </div>
  
      <div class="products">
        <h3>Produits Livrés :</h3>
        <ul>
          <li v-for="product in delivery.products" :key="product.id">
            <strong>{{ product.name }}</strong> - Quantité : {{ product.quantity }}
          </li>
        </ul>
      </div>
  
      <div class="signature">
        <p><strong>Signature du Client :</strong> _________________________</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      delivery: {
        type: Object,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .bon-livraison {
    border: 1px solid #ccc;
    padding: 20px;
    margin: 20px;
    border-radius: 10px;
    background-color: #f9f9f9;
  }
  .client-info, .delivery-info, .products {
    margin-bottom: 20px;
  }
  .signature {
    margin-top: 30px;
  }
  </style>
  