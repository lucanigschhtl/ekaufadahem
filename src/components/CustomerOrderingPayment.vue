<template>
    <div>
        <h4>Zahlungsmethode</h4>                            
        <b-list-group v-if="error.length==0">
            <b-list-group-item button v-for="method in paymentMethods" :key="method.id" @click="setPaymentMethod(method.id)"  :class="[getPaymentMethod==method.id ? 'active' : '']">
                    <h5 class="mb-1">{{method.title}}</h5>
                    <p class="mb-1">{{method.text}}</p>
            </b-list-group-item>
        </b-list-group> 
        <p v-else>
            {{error}}
        </p>
    </div>    
</template>  


<script>
import BackendConnection from '../services/authorizedapi';
import {mapActions,mapGetters} from 'vuex'
export default {  
  name: "OrderingPayment", 
  data(){
    return{
           isLoading:false,          
           selectedMethod: null,
           paymentMethods:[],
           error:""
    }   
  }, 
  methods: {
      ...mapActions(['setPaymentMethod']),              
  },
  computed:{
      ...mapGetters(["getPaymentMethod"])
  },

  filters: { 
   
  },
  created() {
     
      
  },
};
</script>
