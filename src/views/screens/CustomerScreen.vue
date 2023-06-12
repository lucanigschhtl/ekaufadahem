<template>
    <div name="customer">
        <the-customer-nav/>
        <h1 v-if="getAuthorization<1"> Du hast keinen Zugriff auf diese Seite!</h1>
        <router-view  class="mt-4" v-else></router-view>
    </div>    
</template>

<script>
import TheCustomerNav from  '../../components/navigation/TheCustomerNav'
import { mapGetters } from 'vuex';



export default {
  components: { TheCustomerNav },
  name: 'CustomerScreen',
  computed: mapGetters(["isUserLoggedIn","getAuthorization"]),
  data: () => ({
    //
  }),
  created() {
    if(!this.isUserLoggedIn){
        this.$router.push({name:'Login'})
    }    
    
  }
};
</script>
