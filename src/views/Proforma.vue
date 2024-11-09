<template>
    <div class="proforma">
      <h1 class="text-center">Bon de Proforma</h1>
      <div class="invoice-info">
        <p><strong>Numéro Proforma:</strong> {{ proforma.number }}</p>
        <p><strong>Date:</strong> {{ proforma.date }}</p>
        <p><strong>Client:</strong> {{ proforma.client }}</p>
      </div>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Prix Unitaire (€)</th>
            <th>Total (€)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in proforma.items" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.unit_price }}</td>
            <td>{{ item.total }}</td>
          </tr>
        </tbody>
      </table>
      <div class="total-amount">
        <p><strong>Total à payer:</strong> {{ totalAmount }} €</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      proforma: {
        type: Object,
        required: true,
      },
    },
    computed: {
      totalAmount() {
        return this.proforma.items.reduce((acc, item) => acc + item.total, 0);
      },
    },
  };
  </script>
  
  <style scoped>
  .proforma {
    border: 1px solid #ddd;
    padding: 20px;
    margin: 20px;
    border-radius: 5px;
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .table th, .table td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  .total-amount {
    margin-top: 20px;
    font-size: 1.2em;
    font-weight: bold;
    text-align: right;
  }
  </style>
  