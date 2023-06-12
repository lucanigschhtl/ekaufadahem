<template>
  <div>
    <!-- <cart-modal /> -->
    <order-modal />
    <b-container>
        <h1>Bestellungen</h1>
      <div >       
              <b-skeleton-table v-if="ordersIsLoading"
                        :rows="10"
                        :columns="3"
                        :table-props="{ }"
                      ></b-skeleton-table>         
              <div v-else>   
                  <customer-orders-table :orders="orders"></customer-orders-table>       
                  <p v-if="orders.length==0">Im Moment sind keine aktiven Bestellungen vorhanden</p>
              </div> 
      </div>
    </b-container>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
// import CartModal from "../components/CustomerCartModal.vue";
import OrderModal from '../components/CustomerOrderModal.vue';
import CustomerOrdersTable from '../components/CustomerOrdersTable.vue';

export default {
  components: { OrderModal,CustomerOrdersTable},
  name: "Orders",
  methods: {
    ...mapActions(["fetchOrders","showCustomerOrder"]),
    ...mapMutations(["_setOrderShowState","_setOrder"])   
  },
  computed: mapGetters(["ordersIsLoading","orders"]),
  
  created(){
    this.fetchOrders()
  }
};
</script>
