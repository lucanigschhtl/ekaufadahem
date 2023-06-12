<template>
    <div name="manager">
        <the-manager-nav></the-manager-nav>
          <h1 v-if="getAuthorization<3"> Du hast keinen Zugriff auf diese Seite!</h1>
          <router-view v-else></router-view>
    </div>    
</template>

<script>
import TheManagerNav from  '../../components/navigation/TheManagerNav'
import { mapGetters } from 'vuex';

export default {
  components: { TheManagerNav},
  name: 'ManagerScreen',
  computed: mapGetters(["isUserLoggedIn","getAuthorization"]),
  created(){    
    if(!this.isUserLoggedIn){
            this.$router.push({name:'Login'})
        }        

  }
};  
</script>
