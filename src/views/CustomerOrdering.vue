<template>
    <b-container class="mt-3">
      <b-container v-if="getOrderingState" >
            <b-card class="pl-3">
             <b-row>
               <h1>Bestellung aufgegeben<b-icon-check2-circle variant="success"></b-icon-check2-circle></h1>
                <p>Deine Bestellung wurde aufgegeben. Du bekommst eine Email, wenn deine Bestellung bereit zur Abholung ist. Den aktuellen Status deiner Bestellung kannst du unter dem Menü-Reiter Meine Bestellungen verfolgen.</p>
              </b-row>
              <b-row>
                <b-button variant="primary" @click="$router.push({name:'CustomerOrders'})">Gehe zu meinen Bestellungen</b-button>
              </b-row>
              <b-row class="mt-3">
                <b-button variant="primary" @click="clearOrderData()">Neue Bestellung aufgeben</b-button>
              </b-row>
            </b-card>
      </b-container>
      <div v-else>
        <ordering-feedback></ordering-feedback>
        <b-row>
            <b-col >
              <ordering-products></ordering-products>
          </b-col>
          <b-col>
              <ordering-time></ordering-time>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <ordering-comment class="mt-3"></ordering-comment>
            </b-col>
          </b-row>
        <b-row>
        </b-row>
        <b-row class="mt-5">
          <b-col><b-button :disabled="!inputIsValid" @click="placeOrder" variant="primary"><h2>Bestellen</h2></b-button></b-col>
        </b-row>
      </div>
    </b-container>

</template>
<script>

// import BackendConnection from '../services/authorizedapi';
import {mapActions, mapGetters, mapMutations} from 'vuex'

import OrderingProducts from "../components/CustomerOrderingProducts.vue";
import OrderingTime from "../components/CustomerOrderingTime.vue";
//import OrderingPayment from "../components/CustomerOrderingPayment.vue";
import OrderingComment from "../components/CustomerOrderingComment.vue";
import OrderingFeedback from "../components/CustomerOrderingFeedback.vue";
export default {
  components: {  OrderingProducts,OrderingTime,OrderingComment,OrderingFeedback},
  name: "Ordering",
  data(){
    return{
      fields: [
            { key: "amount", label: "Menge"},
            { key: "name", label: "Name", sortable: true},
            { key: "category", label: "Kategorie", sortable: true},
            { key: "unit", label: "Einheit"},
            { key: "tags", label: "Tags"}
        ] ,
        showModal:false,
        error:""
    }
  },
  methods: {
    ...mapActions(['placeOrder']),
    ...mapMutations(['_setShowState','clearOrderData']),
  },
   computed:{
    ...mapGetters(["isShown","inputIsValid","getOrderingState"]),
  }
};
</script>
