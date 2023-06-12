<template>  
    <b-modal v-model="isCreateEmptyOrderModalShowState" scrollable size="lg" @hide="setCreateEmptyOrderModalShowState(false)"> 
        <template #modal-header>
          <h5>Neue Leer Bestellung anlegen</h5>
        </template> 
            <b-spinner v-if="this.isLoading" label="Spinning"></b-spinner>          
            <b-alert v-if="this.feedback>0">{{this.feedback}}</b-alert>
            <CustomerOrderingTime class="m-4"></CustomerOrderingTime>
            <CustomerOrderingProducts  class="m-4"></CustomerOrderingProducts>
            <CustomerOrderingComment  class="m-4"></CustomerOrderingComment>
            <b-row>
              <b-col class="mt-2" float="right">
                <b-btn v-if="getTimeslot!=null" @click="this.submit">Erstellen</b-btn>
              </b-col>
            </b-row>
            <p v-if="this.feedback!=''">{{this.feedback}}</p>
              <template #modal-footer>  
                 <b-button
                  class="float-right"
                  variant="default"
                  @click="setCreateEmptyOrderModalShowState(false)"
                >
                  Schließen
                 </b-button>                          
              </template>     
                  
      </b-modal> 
</template>
<script>

import {mapGetters, mapMutations,mapActions} from 'vuex'
import CustomerOrderingTime from '../components/CustomerOrderingTime.vue';
import BackendConnection from '../services/authorizedapi';
import CustomerOrderingProducts from '../components/CustomerOrderingProducts.vue';
import CustomerOrderingComment from '../components/CustomerOrderingComment.vue';

export default {
components: { CustomerOrderingTime,CustomerOrderingProducts,CustomerOrderingComment },
name: 'PickerCreateEmptyOrderModal',
props: ['customerId'],
methods:{
...mapActions(["fetchPickerSearch","showCustomer"]),
...mapMutations(['setCreateEmptyOrderModalShowState']),
async submit(){
        this.isLoading=true
        var response = await BackendConnection.post("/orders/user/"+this.customerId,{"selectedTimeslotId":this.getTimeslot,note:this.getComment,orderItems:this.getOrderItems}) 
        this.isLoading=false

        if(response.status!=201){
          this.feedback=response.data.message
          return
        }

        await this.showCustomer(this.customerId)
        this.setCreateEmptyOrderModalShowState(false)
        
        await this.fetchPickerSearch("")
        
   },
},
computed:{   
...mapGetters(['isCreateEmptyOrderModalShowState','getTimeslot','getComment','getOrderItems']),
},
data(){
    return{
      isLoading:false,
      feedback:""
    }
},
}
</script>

